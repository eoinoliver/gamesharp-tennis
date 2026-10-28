"""Recover per-foot directions from the pinned Tennis-MoCap BVH source.
Usage: python3 tools/recover_foot_directions.py --raw-dir /private/bvh-directory
Requires NumPy. Reads the authored rally clips; never downloads or publishes BVH.
The fit must reproduce every lower-body source pose within 0.5 mm. Only then
are discarded ankle end-site directions transferred into the existing clip.
"""
import argparse,sys,json,pathlib,math,hashlib
import numpy as np
import mocap_kinematics as retarget
root=pathlib.Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--raw-dir',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,default=root/'rally/foot_directions.json');args=ap.parse_args()
existing=json.loads((root/'rally/foot_directions.json').read_text());clips={}
for p in (root/'rally').glob('*_data.json'):
 for k,c in json.loads(p.read_text()).get('clips',{}).items():clips.setdefault(k,c)
cache={};out={};meta={}
names=['hips','hipL','kneeL','ankleL','hipR','kneeR','ankleR']
bvh=['Hips','LeftHip','LeftKnee','LeftAnkle','RightHip','RightKnee','RightAnkle']
for k,src in existing['provenance'].items():
 if 'file' not in src:continue
 c=clips[k];fn=src['file'];raw=args.raw_dir/fn
 assert hashlib.sha256(raw.read_bytes()).hexdigest()==src['sha256'],fn+' source mismatch'
 if fn not in cache:cache[fn]=retarget.load(str(raw))
 d=cache[fn];P=d['pos'][:,[d['names'].index(n)for n in bvh]];C=np.array(c['frames'])[:,[c['joints'].index(n)for n in names]];ci=c['contactFrame']-1
 # Find rigid yaw+translation at contact without assuming hidden trim/padding metadata.
 a=P-P[:,:1];b=C[ci]-C[ci,:1];cross=(a[:,:,0]*b[:,1]-a[:,:,1]*b[:,0]).sum(1);dot=(a[:,:,:2]*b[:,:2]).sum((1,2));ang=np.arctan2(cross,dot)
 rot=np.zeros((len(P),3,3));rot[:,0,0]=rot[:,1,1]=np.cos(ang);rot[:,1,0]=np.sin(ang);rot[:,0,1]=-np.sin(ang);rot[:,2,2]=1
 fit=np.einsum('fij,fkj->fki',rot,a);errs=np.max(np.abs(fit-b),axis=(1,2));ri=int(errs.argmin());R=rot[ri];T=C[ci,0]-R@P[ri,0]
 start=ri-ci;ids=np.clip(np.arange(len(C))+start,0,len(P)-1)
 fit=np.einsum('ij,fkj->fki',R,P[ids])+T;err=np.max(np.abs(fit-C),axis=(1,2))
 # Serve padding is explicit held poses; match those against source on their own.
 for i in np.where(err>.0003)[0]:
  f=np.einsum('ij,fkj->fki',R,P)+T;e=np.max(np.abs(f-C[i]),axis=(1,2));ids[i]=e.argmin();err[i]=e[ids[i]]
 assert err.max()<=.0005,(k,ri,float(err.max()))
 feet=[]
 for side in ['Left','Right']:
  v=d['pos'][ids,d['names'].index(side+'Ankle_end')]-d['pos'][ids,d['names'].index(side+'Ankle')];v=v@R.T;v/=np.linalg.norm(v,axis=1)[:,None];feet.append(v)
 out[k]=np.stack(feet,axis=1).round(5).tolist();meta[k]={'file':fn,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'contactSourceIndex':ri,'sourceIndices':[int(ids[0]),int(ids[-1])],'maxPositionErrorM':float(err.max()),'yawRadians':float(ang[ri])}
 print(k,ri,'err',round(float(err.max()),6),'feet at contact',out[k][ci])
for k,v in out.items():
 existing['clips'][k]=v
 meta[k]['sourceClipSha256']=hashlib.sha256(json.dumps(clips[k],sort_keys=True,separators=(',',':')).encode()).hexdigest()
 existing['provenance'][k]=meta[k]
args.output.write_text(json.dumps(existing,separators=(',',':'))+'\n')
