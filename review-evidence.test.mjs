import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), {verify,REQUIRED}=require('./tools/verify-review-evidence.cjs');
const record=JSON.parse(fs.readFileSync(new URL('./TRUST_REPAIR_EVIDENCE.json',import.meta.url),'utf8'));
test('review evidence matches the exact runtime dependencies without claiming coaching approval',()=>{
  assert.deepEqual(verify(record),[]);
  assert.equal(record.coachApproval,false);
});
test('every reviewed dependency independently invalidates stale approval',()=>{
  for(const file of REQUIRED){
    const stale=JSON.parse(JSON.stringify(record));stale.dependencies[file]='old';
    assert.ok(verify(stale).some(e=>e.includes(file)),file);
  }
  assert.ok(verify({...record,release:'old'}).length);
  assert.ok(verify({...record,coachApproval:true}).length);
});
