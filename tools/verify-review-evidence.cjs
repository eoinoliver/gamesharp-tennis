// Change detector, not coaching approval. Never auto-refresh these fingerprints.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const REQUIRED = [
  'index.html', 'LAUNCH_MANIFEST.json', 'gamesharp-release-policy.js',
  'livepoint-content.js', 'livepoint-integrity.js', 'livepoint-engine.js',
  'livepoint-scene.js', 'livepoint-prototype.html', 'predict-live-integration.js',
  'gold-daily-prototypes.js', 'gold-daily-lesson-spines.js',
  'gold-daily-patterns.js', 'gold-daily-serve-quality.js', 'gold-daily-construction.js',
  'gold-daily-tradeoffs.js', 'gold-daily-main.js', 'gold-daily-high-ball.js',
  'gold-daily-return-time.js', 'gold-daily-loop.js', 'gamesharp-sharpen-state.js',
  'gamesharp-court-checks.js', 'gamesharp-court-check-state.js',
  'gamesharp-forehand-check.js', 'gamesharp-forehand-check-state.js',
  'gamesharp-pain-coach.js', 'gamesharp-sharpen-paths.js',
  'share-data.json', 'api/share.js', 'vercel.json', '.vercelignore'
];
function verify(record) {
  const errors=[];
  for(const file of REQUIRED){
    if(!fs.existsSync(path.join(ROOT,file))){errors.push('Missing reviewed dependency: '+file);continue;}
    const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,file))).digest('hex');
    if(record.dependencies?.[file]!==actual)errors.push('Review invalidated by changed dependency: '+file);
  }
  if(record.coachApproval!==false)errors.push('This implementation review cannot confer coaching approval');
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'LAUNCH_MANIFEST.json'),'utf8'));
  if(record.release!==manifest.version)errors.push('Review release does not match manifest');
  return errors;
}
module.exports={verify,REQUIRED};
if(require.main===module){
  let errors;
  try{errors=verify(JSON.parse(fs.readFileSync(path.join(ROOT,'TRUST_REPAIR_EVIDENCE.json'),'utf8')));}
  catch(e){errors=['Review evidence unavailable: '+e.message];}
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log('PASS — reviewed runtime fingerprints match; independent coaching approval still pending');
}
