"""Explicit geometric adaptations applied after the frozen authored clip inputs.

Captured body and foot movement stays in use. Reconstructed arms clarify the
slice extension, compact volley and two-handed grip, while lesson contact
anchors stay fixed. These are authored teaching illustrations, not new capture
or a biomechanics simulation. See docs/features/sharpen-stroke-clarity.md.
"""
from math import sqrt, sin, cos, radians


def add(a,b): return [x+y for x,y in zip(a,b)]
def sub(a,b): return [x-y for x,y in zip(a,b)]
def mul(a,s): return [x*s for x in a]
def dot(a,b): return sum(x*y for x,y in zip(a,b))
def norm(a): return mul(a,1/sqrt(dot(a,a)))
def cross(a,b): return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def length(a): return sqrt(dot(a,a))
# Python 3.12's compensated sum can change the sign of an exact zero. Keep
# generated JSON byte-identical across Python versions, including that sign.
def rounded(a,n=4): return [round(x,n) or 0.0 for x in a]
def basis(r):
    a=norm(r['axis']);l=norm(sub(r['lateral'],mul(a,dot(r['lateral'],a))))
    return a,l,cross(l,a)
def express(v,B): return [dot(v,b) for b in B]
def expand(v,B): return [sum(v[j]*B[j][i] for j in range(3)) for i in range(3)]

def smooth(a,b,x):
    u=max(0,min(1,(x-a)/(b-a)));return u*u*(3-2*u)

def solve_arm(S,E,W,target):
    l1,l2=length(sub(E,S)),length(sub(W,E));v=sub(target,S);d=length(v)
    w=add(S,mul(v,min(1,(l1+l2)*.995/max(d,1e-8))));e=norm(sub(w,S));d=length(sub(w,S))
    a=(l1*l1-l2*l2+d*d)/(2*d);h=sqrt(max(0,l1*l1-a*a))
    pole=sub(E,mul(add(S,w),.5));pole=sub(pole,mul(e,dot(pole,e)))
    if length(pole)<1e-6:pole=cross(e,[0,0,1])
    return add(add(S,mul(e,a)),mul(norm(pole),h)),w

def mix(a,b,u): return add(mul(a,1-u),mul(b,u))

def phases(keys,f):
    """Small authored pose transitions, in capture frames relative to contact."""
    if f<=keys[0][0]:return keys[0][1]
    for (a,A),(b,B) in zip(keys,keys[1:]):
        if f<=b:return mix(A,B,smooth(a,b,f))
    return keys[-1][1]

def arm(P,J,side,target):
    names=['shoulder'+side,'elbow'+side,'wrist'+side]
    E,W=solve_arm(*(P[J[n]] for n in names),target)
    P[J[names[1]]],P[J[names[2]]]=rounded(E),rounded(W)
    return W

def racket(P,r,J,target,axis,face):
    axis=norm(axis);face=norm(sub(face,mul(axis,dot(face,axis))))
    w=arm(P,J,'R',target)
    P[J['racquetTip']]=rounded(add(w,mul(axis,.57)))
    r.update(grip=rounded(w),axis=rounded(axis,5),lateral=rounded(cross(axis,face),5),centre=rounded(add(w,mul(axis,.38))))

def connected_backhand(c):
    # The capture gives wrists, not hands. Put the supporting wrist on the same
    # handle rather than leaving it visibly floating alongside the hitting hand.
    J={n:i for i,n in enumerate(c['joints'])}
    for P,r in zip(c['frames'],c['racquetFrames']):
        arm(P,J,'L',add(r['grip'],mul(r['axis'],.105)))
    c['adaptation']={'kind':'two-hand-handle-support','sourceHittingPath':'preserved'}
    return c

def repair_slice(c):
    # The old adaptation rotated only the hitting arm: the other hand stayed
    # at the torso. Support the throat in preparation, then separate for balance.
    J={n:i for i,n in enumerate(c['joints'])};ci=c['contactFrame']-1
    contact=c['racquetFrames'][ci].copy();S0=c['frames'][ci][J['shoulderR']]
    offset=sub(contact['grip'],S0);a0=contact['axis'];face=basis(contact)[2]
    for i,(P,r) in enumerate(zip(c['frames'],c['racquetFrames'])):
        # Preserve the captured high preparation and exact contact. Replace the
        # old topspin-like wrap with forward extension, then a ready recovery.
        if i>ci:
            f=i-ci
            target=add(P[J['shoulderR']],phases([(0,offset),(25,add(offset,[.18,.18,-.12])),(45,add(offset,[.22,.17,-.09])),(85,[-.10,.34,-.30])],f))
            axis=norm(phases([(0,a0),(25,[-.78,.40,-.48]),(45,[-.72,.48,-.40]),(85,[0,.05,1])],f))
            racket(P,r,J,target,axis,face)
        S,E,W=[P[J[n]] for n in ['shoulderL','elbowL','wristL']]
        support=add(r['grip'],mul(r['axis'],.20));hit=sub(P[J['wristR']],P[J['shoulderR']]);hit=norm([hit[0],hit[1],0])
        balance=add(S,[-hit[0]*.52,-hit[1]*.52,-.12])
        release=smooth(ci-27,ci+12,i);target=add(mul(support,1-release),mul(balance,release))
        weight=smooth(ci-75,ci-42,i)*(1-smooth(ci+45,ci+78,i));target=add(mul(W,1-weight),mul(target,weight))
        P[J['elbowL']],P[J['wristL']]=[rounded(v) for v in solve_arm(S,E,W,target)]
    c['adaptation']={'kind':'slice-extension-and-counterbalance','contact':'preserved','followThrough':'authored forward extension and ready recovery'}
    return c

VOLLEYS={'lowfv':(12,.20),'bv':(6,.10),'fvhi':(0,.20)}

def repair(k,c):
    if k=='bhSlice':return repair_slice(c)
    if k.startswith('bh'):return connected_backhand(c)
    if k not in VOLLEYS:return c
    elevation,advance=VOLLEYS[k];ci=c['contactFrame']-1;J={n:i for i,n in enumerate(c['joints'])}
    B=basis(c['racquetFrames'][ci]);face=[0,cos(radians(elevation)),sin(radians(elevation))]
    axis=norm(sub(B[0],mul(face,dot(B[0],face))));lateral=cross(axis,face)
    ca,cl=express(axis,B),express(lateral,B)
    original=c['racquetFrames'][ci]['centre'][:]
    for i,(pose,r) in enumerate(zip(c['frames'],c['racquetFrames'])):
        B=basis(r);axis=norm(expand(ca,B));lateral=norm(expand(cl,B))
        w=sub(r['centre'],mul(axis,.38));pose=[add(p,[0,advance,0]) for p in pose]
        S,E,W=[pose[J[n]] for n in ['shoulderR','elbowR','wristR']]
        l1,l2=length(sub(E,S)),length(sub(W,E));v=sub(w,S);d=length(v)
        w=add(S,mul(v,min(1,(l1+l2)*.995/d)));e=norm(sub(w,S));d=length(sub(w,S))
        a=(l1*l1-l2*l2+d*d)/(2*d);h=sqrt(max(0,l1*l1-a*a))
        pole=sub(E,mul(add(S,w),.5));pole=norm(sub(pole,mul(e,dot(pole,e))))
        pose[J['elbowR']]=add(add(S,mul(e,a)),mul(pole,h));pose[J['wristR']]=w
        pose[J['racquetTip']]=add(w,mul(axis,.57));c['frames'][i]=[rounded(p) for p in pose]
        r.update(axis=rounded(axis,5),lateral=rounded(lateral,5),centre=rounded(add(w,mul(axis,.38))),grip=rounded(w))
    assert length(sub(original,c['racquetFrames'][ci]['centre']))<.0003, k+' changed contact'
    # Contact is immutable because lesson ball tracks depend on it. Author a
    # compact set/punch/recovery around that anchor; keep captured body/feet.
    R0=c['racquetFrames'][ci].copy();P0=c['frames'][ci];axis=R0['axis']
    if k=='lowfv':axis=norm([.68,.153,-.718])
    contact_w=sub(original,mul(axis,.38));offset=sub(contact_w,P0[J['shoulderR']])
    ready=[-.10,.30,-.30];ready_axis=norm([.1,-.1,1])
    for i,(P,r) in enumerate(zip(c['frames'],c['racquetFrames'])):
        f=i-ci
        target=add(P[J['shoulderR']],phases([(-55,ready),(-25,add(offset,[0,-.12,.08])),(0,offset),(18,add(offset,[0,.10,-.045])),(32,add(offset,[0,.10,-.045])),(65,ready)],f))
        a=norm(phases([(-55,ready_axis),(-20,axis),(32,axis),(65,ready_axis)],f))
        racket(P,r,J,target,a,face)
        support=add(r['grip'],mul(a,.18))
        balance=add(P[J['shoulderL']],[-.20,-.18 if k=='bv' else .22,-.18])
        arm(P,J,'L',mix(support,balance,smooth(-22,8,f)))
    assert length(sub(original,c['racquetFrames'][ci]['centre']))<.0003,k+' changed contact'
    c['adaptation']={'kind':'compact-volley-set-punch-recover','bodyAdvanceM':advance,'faceElevationDeg':elevation,'contact':'preserved'}
    return c
