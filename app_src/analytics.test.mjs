// Isolated source tests: no browser, network, production events, or generated app files.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

process.env.TZ="Australia/Sydney";
const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const configSource=readFileSync(new URL("./config.js",import.meta.url),"utf8");

function boot({origin="https://gamesharptennis.com",now="2026-09-28T00:00:00Z",storage=new Map(),hidden=false,config={},fetchError=false,catalog={daily:[],predict:[]}}={}){
  let time=Date.parse(now);
  const requests=[],beacons=[],handlers={window:new Map(),document:new Map()};
  const on=surface=>(name,fn)=>{
    const list=handlers[surface].get(name)||[];
    list.push(fn);handlers[surface].set(name,list);
  };
  const window={addEventListener:on("window"),GS_CATALOG:catalog,GS_VERSION:"test-build"};
  const document={hidden,addEventListener:on("document")};
  class Clock extends Date{
    constructor(...args){super(...(args.length?args:[time]));}
    static now(){return time;}
  }
  const context=vm.createContext({
    window,document,location:new URL(origin),Date:Clock,
    crypto:{randomUUID:()=>"test-anonymous-id"},
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},
    navigator:{sendBeacon:(url,body)=>{beacons.push({url,payload:JSON.parse(body)});return true;}},
    fetch:(url,options)=>{
      requests.push({url,...options,payload:JSON.parse(options.body)});
      return fetchError?Promise.reject(new Error("simulated offline")):Promise.resolve({ok:true});
    }
  });
  vm.runInContext(configSource,context);
  Object.assign(window.GS_CONFIG,config);
  vm.runInContext(source,context);
  const fire=(surface,name,event={})=>(handlers[surface].get(name)||[]).forEach(fn=>fn(event));
  return {
    app:window.GSApp,config:window.GS_CONFIG,requests,beacons,storage,fire,
    time:value=>{time=Date.parse(value);},
    visible:value=>{document.hidden=!value;fire("document","visibilitychange");},
    opens:()=>window.GSApp.log().filter(row=>row[1]==="app_open")
  };
}

test("production capture uses US project settings, anonymous identity, and unspoofable host metadata",()=>{
  for(const host of ["gamesharptennis.com","www.gamesharptennis.com"]){
    const b=boot({origin:`https://${host}`});
    b.app.opened("home");
    b.app.track("lesson_start",{$host:"fake",environment:"preview"});
    assert.equal(b.requests.length,2);
    for(const r of b.requests){
      assert.equal(r.url,"https://us.i.posthog.com/capture/");
      assert.match(r.payload.api_key,/^phc_/);
      assert.equal(r.payload.distinct_id,b.app.S.id);
      assert.equal(r.payload.properties.$host,host);
      assert.equal(r.payload.properties.environment,"production");
      assert.equal(r.payload.properties.$process_person_profile,false);
      assert.equal(r.payload.properties.app,"test-build");
      assert.equal(r.keepalive,true);
    }
  }
});

test("local, preview, HTTP, and lookalike hosts never capture but retain the local log",()=>{
  for(const origin of ["http://localhost:8000","https://127.0.0.1","https://preview.vercel.app","http://gamesharptennis.com","https://gamesharptennis.com.evil.example","https://staging.gamesharptennis.com"]){
    const b=boot({origin});
    b.app.opened("home");b.app.track("lesson_start",{lesson:"test"});
    b.fire("window","blur");b.fire("window","focus");
    assert.equal(b.requests.length,0,origin);
    assert.equal(b.beacons.length,0,origin);
    assert.equal(b.opens().length,1,origin);
    assert.equal(b.app.log().length,2,origin);
  }
  const b=boot({config:{posthogAllowedHosts:[]}});
  b.app.opened("home");assert.equal(b.requests.length,0,"missing allowlist fails closed");
});

test("a null-key open does not consume capture when the key is enabled that same day",()=>{
  const b=boot({config:{posthogKey:null}});
  b.app.opened("home");
  assert.equal(b.requests.length,0);assert.equal(b.opens().length,1);
  const id=b.app.S.id;
  b.config.posthogKey="phc_mock_key";
  b.app.opened("player");
  assert.equal(b.requests.length,1);assert.equal(b.opens().length,1);
  assert.equal(b.requests[0].payload.distinct_id,id);
  assert.equal(b.requests[0].payload.properties.where,"player");
});

test("page entries capture independently while local history and progress persist",()=>{
  const b=boot();b.app.opened("home");
  const state=JSON.parse(b.storage.get("gs6"));
  state.level="club";state.done={lesson:{first:"2026-09-27",last:"2026-09-27",times:1,best:2,n:2}};
  state.streak=3;state.last="2026-09-27";state.days=["2026-09-27"];
  b.storage.set("gs6",JSON.stringify(state));
  const next=boot({storage:b.storage});next.app.opened("player");
  assert.equal(next.requests.length,1);assert.equal(next.opens().length,1);
  const saved=JSON.parse(next.storage.get("gs6"));
  assert.deepEqual(saved,state,"entry does not reset identity, progress, or streak");
});

test("hidden initialization waits for foreground and paired visibility/focus events capture once",()=>{
  const b=boot({hidden:true});b.app.opened("player");
  assert.equal(b.requests.length,0);assert.equal(b.opens().length,0);
  b.visible(true);b.fire("window","focus");
  assert.equal(b.requests.length,1);
  assert.equal(b.requests[0].payload.properties.where,"player");
  b.visible(false);b.fire("window","blur");
  b.visible(true);b.fire("window","focus");
  assert.equal(b.requests.length,2);assert.equal(b.opens().length,1);
});

test("focus resume and bfcache restoration capture without duplicating initial pageshow",()=>{
  const b=boot();b.app.opened("home");
  b.fire("window","pageshow",{persisted:false});b.fire("window","focus");
  assert.equal(b.requests.length,1);
  b.fire("window","blur");b.fire("window","focus");
  assert.equal(b.requests.length,2);
  b.fire("window","pagehide");b.fire("window","pageshow",{persisted:true});b.fire("window","focus");
  assert.equal(b.requests.length,3);assert.equal(b.opens().length,1);
});

test("next-day foreground return retains identity and updates the daily local log",()=>{
  const b=boot({now:"2026-09-28T13:55:00Z"});b.app.opened("home");
  const id=b.app.S.id;
  b.visible(false);b.time("2026-09-28T14:05:00Z");
  assert.equal(b.requests.length,1,"time passing in a hidden tab does not manufacture a return");
  b.visible(true);b.fire("window","focus");
  assert.equal(b.requests.length,2);assert.equal(b.opens().length,2);
  assert.equal(b.requests[1].payload.distinct_id,id);
  assert.equal(b.requests[1].payload.properties.returning,true);
  assert.equal(b.requests[1].payload.properties.days_away,1);
});

test("project-timezone midnight can get a return even within one browser-local date",()=>{
  const b=boot({now:"2026-09-28T23:55:00Z"});b.app.opened("home");
  const localDate=b.app.today();
  b.visible(false);b.time("2026-09-29T00:05:00Z");b.visible(true);
  assert.equal(b.app.today(),localDate,"Sydney local date has not changed");
  assert.equal(b.opens().length,1,"local log remains daily");
  assert.equal(b.requests.length,2,"PostHog receives both sides of UTC midnight");
  assert.notEqual(b.requests[0].payload.timestamp.slice(0,10),b.requests[1].payload.timestamp.slice(0,10));
});

test("an unattended visible tab gets no synthetic midnight app_open",()=>{
  const b=boot({now:"2026-09-28T13:55:00Z"});b.app.opened("home");
  b.time("2026-09-30T00:00:00Z");
  assert.equal(b.requests.length,1);assert.equal(b.opens().length,1);
});

test("a failed capture cannot suppress the next genuine same-day foreground entry",async()=>{
  const b=boot({fetchError:true});b.app.opened("home");
  await new Promise(resolve=>setImmediate(resolve));
  b.fire("window","blur");b.fire("window","focus");
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(b.requests.length,2);assert.equal(b.opens().length,1);
  assert.equal(b.requests[0].payload.distinct_id,b.requests[1].payload.distinct_id);
});

const queueCatalog={daily:['one','two','three'].map(slug=>({slug})),predict:[]};
const liveCatalog={...queueCatalog,play:[{slug:'point',livePoint:true,followup:'return'},{slug:'return',livePoint:true,transferOf:'point'}]};
test('Live Point returns a new context on a later day, never an automatic repeat',()=>{
 const b=boot({catalog:liveCatalog});assert.equal(b.app.nextLivePoint().slug,'point');
 b.app.startLesson('point');b.app.complete('point',2,2);
 assert.equal(b.app.nextLivePoint(),null);
 const c=boot({catalog:liveCatalog,storage:b.storage,now:'2026-10-30T00:00:00Z'});
 assert.equal(c.app.nextLivePoint().slug,'return');c.app.startLesson('return');
 assert.equal(c.app.nextLivePoint(),null);assert.equal(c.app.S.done.point.total,2);
});
test('first Live Point decisions survive retries and distinguish same-day practice',()=>{
 const b=boot({catalog:liveCatalog});b.app.complete('point',1,2);
 b.app.recordLiveRead('return',{i:0,X:'B',ok:false,node:'r1'});
 b.app.recordLiveRead('return',{i:0,X:'A',ok:true,node:'r1'});
 assert.equal(b.app.S.liveReads.return[0].ok,false);
 assert.equal(b.app.S.liveReads.return[0].delayed,false);
 assert.equal(b.app.log().filter(x=>x[1]==='live_point_read').length,1);
 const c=boot({catalog:liveCatalog,now:'2026-10-30T00:00:00Z'});
 c.app.S.done.point={first:'2026-10-28'};
 c.storage.set('gs6',JSON.stringify(c.app.S));
 c.app.recordLiveRead('return',{i:0,X:'A',ok:true,node:'r1'});
 assert.equal(c.app.S.liveReads.return[0].delayed,true);
});
test('automatic queue favours unseen lessons without falsely completing abandoned lessons',()=>{
 const b=boot({catalog:queueCatalog});assert.equal(b.app.nextDaily().slug,'one');
 b.app.startLesson('one');assert.equal(b.app.nextDaily().slug,'two');assert.equal(b.app.S.done.one,undefined);
 b.app.startLesson('two');assert.equal(b.app.nextDaily().slug,'three');
 b.app.startLesson('three');assert.equal(b.app.nextDaily().slug,'one','oldest unfinished becomes an explicit revisit');
 b.app.startLesson('one');assert.equal(b.app.nextDaily().slug,'two');
});
test('completed lessons stay out of the queue across reloads and days',()=>{
 const b=boot({catalog:queueCatalog});b.app.startLesson('one');b.app.complete('one',2);
 const next=boot({catalog:queueCatalog,storage:b.storage,now:'2026-09-29T00:00:00Z'});
 assert.equal(next.app.nextDaily().slug,'two');assert.equal(next.app.S.done.one.n,2);
 next.app.complete('two',3);next.app.complete('three',1);assert.equal(next.app.nextDaily(),null);
});
test('two tabs retain each others encounters, completions and preferences',()=>{
 const storage=new Map(),a=boot({catalog:queueCatalog,storage}),b=boot({catalog:queueCatalog,storage});
 a.app.startLesson('one');assert.equal(b.app.nextDaily().slug,'two');b.app.startLesson('two');
 a.app.complete('one',3);b.app.setLevel('club');b.app.opened('home');
 assert.equal(a.app.nextDaily().slug,'three');assert.equal(a.app.S.done.one.n,3);assert.ok(a.app.S.seen.two);assert.equal(a.app.S.level,'club');
});
test('old progress without encounter history keeps completed lessons excluded',()=>{
 const b=boot({catalog:queueCatalog});b.app.complete('one',2);assert.equal(b.app.S.seen,undefined);
 const next=boot({catalog:queueCatalog,storage:b.storage});assert.equal(next.app.nextDaily().slug,'two');
});
