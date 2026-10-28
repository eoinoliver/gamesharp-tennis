"""Explicit geometric adaptations applied after the frozen authored clip inputs.

Source joint poses are retained except for three reconstructed volley arms.
The volley grips formerly presented the edge of the strings down court. Align
those faces, bring the stance within arm reach, and solve the elbow without
stretching bones. This is a tactical illustration, not certified technique or
new motion capture. Face elevations are authored examples, not coaching rules.
"""
from math import sqrt, sin, cos, radians


def add(a,b): return [x+y for x,y in zip(a,b)]
def sub(a,b): return [x-y for x,y in zip(a,b)]
def mul(a,s): return [x*s for x in a]
def dot(a,b): return sum(x*y for x,y in zip(a,b))
def norm(a): return mul(a,1/sqrt(dot(a,a)))
def cross(a,b): return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def length(a): return sqrt(dot(a,a))
def rounded(a,n=4): return [round(x,n) for x in a]
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

def repair_slice(c):
    # The old adaptation rotated only the hitting arm: the other hand stayed
    # at the torso. Support the throat in preparation, then separate for balance.
    J={n:i for i,n in enumerate(c['joints'])};ci=c['contactFrame']-1
    for i,(P,r) in enumerate(zip(c['frames'],c['racquetFrames'])):
        S,E,W=[P[J[n]] for n in ['shoulderL','elbowL','wristL']]
        support=add(r['grip'],mul(r['axis'],.20));hit=sub(P[J['wristR']],P[J['shoulderR']]);hit=norm([hit[0],hit[1],0])
        balance=add(S,[-hit[0]*.52,-hit[1]*.52,-.12])
        release=smooth(ci-27,ci+12,i);target=add(mul(support,1-release),mul(balance,release))
        weight=smooth(ci-75,ci-42,i)*(1-smooth(ci+45,ci+78,i));target=add(mul(W,1-weight),mul(target,weight))
        P[J['elbowL']],P[J['wristL']]=[rounded(v) for v in solve_arm(S,E,W,target)]
    c['adaptation']={'kind':'slice-support-and-counterbalance','hittingPath':'preserved prior adapted one-handed capture'}
    return c

VOLLEYS={'lowfv':(12,.20),'bv':(6,.10),'fvhi':(0,.20)}

def repair(k,c):
    if k=='bhSlice':return repair_slice(c)
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
    c['adaptation']={'kind':'volley-face-and-reach','bodyAdvanceM':advance,'faceElevationDeg':elevation}
    return c
