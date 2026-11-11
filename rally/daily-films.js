/* Camera edits into the existing first-question footage. Frame numbers are local
   to the named clip. A focus cut replays the same action the wide shot just showed. */
const DailyFilms = (() => {
  const edits = {
    'serve-plus-one': {key:'daily1', intro:'Your serve sends them wide.', turn:'Follow the return back.', hold:'Where does their reply bounce?', mark:'Return bounce', lens:'bounce', from:302, to:367},
    'the-line': {key:'ln1A', intro:'The line looks open.', turn:'Come back to your corner.', hold:'Where are you hitting from?', mark:'Singles sideline', lens:'sideline', from:130, to:177},
    'recovery': {key:'rc1A', intro:'Your crosscourt sends them wide.', turn:'Follow them to contact.', hold:'Where can their next ball come from?', mark:'Their feet', lens:'opponentTrack', from:214, to:326},
    'open-court': {key:'fs1A', intro:'There’s space on the far side.', turn:'Watch the runner, then look at the gap.', hold:'Which way are their feet carrying them?', mark:'Defender’s path', lens:'opponentTrack', from:117, to:202},
    'forehand-bill': {key:'fb1A', intro:'You could run around this backhand.', turn:'Look across your own baseline.', hold:'How much court would you leave?', mark:'Centre mark', lens:'homeCentre', from:130, to:197},
    'the-lead': {key:'pp1B', intro:'Five–two. Another rally ball lands in.', turn:'Look past the bounce.', hold:'How far short of their baseline?', mark:'Rally bounce', lens:'depth', from:250, to:291},
    'split-step': {key:'ss1', intro:'You land. They hit. You push off.', turn:'Watch your feet through their hit.', hold:'When did your feet settle?', mark:'First move', lens:'feet', from:110, to:177},
    'approach-volley': {key:'av1A', intro:'A short forehand brings you in.', turn:'Pick up the defender’s recovery.', hold:'Which lane is still open?', mark:'Centre mark', lens:'awayCentre', from:132, to:199},
    'middle-return': {key:'mr1A', intro:'The first serve takes you wide.', turn:'Follow the serve out to your racquet.', hold:'Where will you meet it?', mark:'Return contact', lens:'receiver', from:221, to:269},
    'high-ball': {key:'hb1A', intro:'It lands short. Then it climbs.', turn:'Stay beside the bounce.', hold:'How fast does the contact window rise?', mark:'After the bounce', lens:'rise', from:196, to:243},
    'second-serve': {key:'sq1', intro:'Two second serves land in.', turn:'Watch from the receiver’s side.', hold:'Same wing. What changed?', mark:'Second contact', lens:'awayHeight', from:662, to:712},
    'contact-clue': {key:'cp1A', intro:'Your forehand finds the net.', turn:'Come back to the swing.', hold:'How much room is there beside your hip?', mark:'Hip to ball', lens:'hip', from:485, to:533},
    'running-around': {key:'ra1A', intro:'Your slice stays low.', turn:'Track where they take it.', hold:'How much time does that buy you?', mark:'Their feet', lens:'opponentTrack', from:352, to:406},
    'net-rusher': {key:'nr1A', intro:'They follow the approach in.', turn:'Find their feet before you swing.', hold:'How close are they to the service line?', mark:'Service line', lens:'serviceLine', from:110, to:176},
    'pass-where-they-arent': {key:'pa1A', intro:'They close on the net.', turn:'Look along the passing lane.', hold:'Which side are they guarding?', mark:'Centre of net', lens:'netGap', from:106, to:168},
    'late-is-the-culprit': {key:'lc1A', intro:'You aimed crosscourt. It flew wide.', turn:'Look along the contact plane.', hold:'Where is the ball relative to your hip?', mark:'At contact', lens:'sideHip', from:532, to:583},
    'the-moonballer': {key:'mb1A', intro:'Another looping forehand comes back.', turn:'Follow it up off the court.', hold:'What happens if you wait here?', mark:'Rising ball', lens:'rise', from:198, to:260},
    'the-pusher': {key:'pu1A', intro:'They send another slow ball back.', turn:'Go behind their baseline.', hold:'How much court is in front of them?', mark:'Baseline', lens:'awayBaseline', from:122, to:188},
    'pulled-wide': {key:'pw1A', intro:'Their angle pulls you out.', turn:'Follow your run to the sideline.', hold:'Where would recovery start?', mark:'Your path', lens:'homeTrack', from:106, to:164},
    'serve-away-from-the-lean': {key:'le1A', intro:'The returner shifts before the serve.', turn:'Look down the middle from their end.', hold:'Where have they set up?', mark:'Centre mark', lens:'awayCentre', from:94, to:165},
    'the-big-hitter': {key:'bg1B', intro:'The forehand comes through fast.', turn:'Follow the last stretch of flight.', hold:'How much space have you got?', mark:'Incoming ball', lens:'receiver', from:103, to:145},
    'the-lefty': {key:'lf1A', intro:'Your usual inside-out forehand.', turn:'Stay with the other end of that shot.', hold:'Which wing meets it?', mark:'Receiving wing', lens:'awayRacquet', from:273, to:313},
    'find-your-return-spot': {key:'rs1A', intro:'A first serve comes down the T.', turn:'Watch from just outside your baseline.', hold:'How much time from bounce to racquet?', mark:'Baseline', lens:'homeBaseline', from:201, to:252},
    'answer-the-drop': {key:'ad1A', intro:'You reach their drop shot.', turn:'Look up from the short ball.', hold:'Where did the drop-shotter stop?', mark:'Service line', lens:'serviceLine', from:110, to:175},
    'attack-the-backhand': {key:'ab1A', intro:'They know you like their backhand.', turn:'Watch them shade across.', hold:'Where did that leave space?', mark:'Centre mark', lens:'awayCentre', from:111, to:180},
    'down-the-line': {key:'dl1A', intro:'Their crosscourt lands short.', turn:'Stay with their recovery run.', hold:'Are they back in the middle yet?', mark:'Recovery path', lens:'opponentTrack', from:101, to:159},
    'rushed-out-wide': {key:'dm1A', intro:'You only just reach the forehand.', turn:'Come down to the singles line.', hold:'Where are your feet as the ball arrives?', mark:'Singles sideline', lens:'sideline', from:102, to:158},
    'earned-attack': {key:'ea1', intro:'The far side is open.', turn:'Watch your arrival before the bounce.', hold:'When are you ready to swing?', mark:'Your arrival', lens:'homeTrack', from:107, to:199},
    'earned-defence': {key:'ed1', intro:'Their ball takes you towards the line.', turn:'Follow your last steps out.', hold:'Are you set or still moving?', mark:'Your last steps', lens:'homeTrack', from:112, to:192},
    'earned-net': {key:'en1', intro:'A short reply. They stay deep.', turn:'Come in with the arriving player.', hold:'Where have your feet settled?', mark:'Service line', lens:'homeService', from:102, to:199}
  };

  function sequence(slug) {
    const edit=edits[slug];
    if(!edit)return null;
    const {key,intro,turn,hold,from,to}=edit;
    const wide={kind:'sweep',key,from:0,to,play:true,eye:'Watch the point',title:intro};
    const rewind={kind:'rewind',key,from:to,to:from,ms:700,eye:'Rewind',title:turn};
    const close={kind:'dailyReplay',key,from,to,play:true,silent:true,edit,eye:'Look again',title:turn};
    const clue={kind:'dailyHold',key,from:to,ms:1900,edit,eye:'The deciding detail',title:hold};
    if(slug==='second-serve'){
      // The two actual receive contacts are 1.24 m and 1.60 m. Use the same
      // angle for each; rewinding the second serve alone would hide the contrast.
      return [{...wide,to:339},{...clue,from:339,ms:1150,eye:'First serve of the pair',title:'Chest height.'},
        {...wide,from:415,eye:'Second serve of the pair'},rewind,close,clue];
    }
    return [wide,rewind,close,clue];
  }

  const away=new Set(['opponentTrack','awayCentre','serviceLine','netGap','awayBaseline','awayHeight','awayRacquet']);
  const ballLenses=new Set(['rise','receiver','awayHeight','awayRacquet','hip','sideHip','depth','bounce']);
  const paths=new WeakMap();
  function composition(shot,sc,f){
    const {lens,from}=shot.edit,who=away.has(lens)?'opp':'you';
    const player=actorAt(sc,who,f),hip=player.pose[I.hips],foot=[hip[0],hip[1],.03];
    const ball=ballAt(sc,f),useBall=ballLenses.has(lens)&&ball;
    let a=foot,b=foot,az=-94,el=30,context=[...player.pose,player.rq.centre],trail=[];
    if(useBall){
      b=ball;a=[b[0],b[1],.03];az=-18;el=13;
      if(lens==='hip'||lens==='sideHip'){a=player.pose[I.hipR];az=lens==='hip'?-76:-8;}
      if(lens==='depth'||lens==='bounce'||lens==='rise'){
        context=[];az=-40;el=lens==='rise'?12:40;
        if(lens==='depth')a=[b[0],11.89,.03];
        for(let j=Math.max(from,f-45);j<f;j+=4)if(sc.ball[Math.floor(j)])trail.push(sc.ball[Math.floor(j)]);
      }
      if(lens==='awayRacquet')a=player.pose[I.shoulderL];
    }else{
      if(lens==='feet'){a=player.pose[I.ankleL];b=player.pose[I.ankleR];az=-36;el=12;context=[a,b,hip];}
      if(lens==='sideline')b=[Math.sign(foot[0]||1)*4.115,foot[1],.03];
      if(lens==='awayCentre'||lens==='homeCentre')b=[0,who==='you'?-11.89:11.89,.03];
      if(lens==='awayBaseline'||lens==='homeBaseline'){b=[foot[0],who==='you'?-11.89:11.89,.03];az=-22;}
      if(lens==='netGap')b=[0,0,.03];
      if(lens==='serviceLine'||lens==='homeService')b=[foot[0],who==='you'?-6.4:6.4,.03];
      if(lens==='opponentTrack'||lens==='homeTrack'){
        if(!paths.has(shot.edit)){
          const path=[];
          for(let j=from;j<=shot.edit.to;j+=6){
            const h=actorAt(sc,who,j).pose[I.hips];path.push([h[0],h[1],.03]);
          }
          paths.set(shot.edit,path);
        }
        trail=paths.get(shot.edit).slice(0,Math.ceil((f-from)/6));
        b=foot;a=trail[0]||foot;
      }
    }
    const target=lerp3(a,b,.5),margin=1.2;
    const points=[...context,...trail,a,b,add(target,[-margin,-margin,0]),add(target,[margin,margin,1.5])];
    return {a,b,trail,points,camera:{az,el,d:21,fov:38,tgt:target}};
  }

  function draw(frag,view){
    const {a,b,trail}=view,colour='#f4d478';
    for(let i=1;i<trail.length;i++)seg(frag,trail[i-1],trail[i],colour,3,.75);
    seg(frag,a,b,colour,3,.85);
    for(const point of [a,b]){
      const q=P(point);if(q)frag.appendChild(el_('circle',{cx:q.s[0],cy:q.s[1],r:7,fill:'#152217',stroke:colour,'stroke-width':3}));
    }
  }
  return {sequence,composition,draw};
})();
