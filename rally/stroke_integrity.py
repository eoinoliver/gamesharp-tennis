"""Explicit geometric adaptations applied after the frozen authored clip inputs.

Captured movement supports the slice and two-handed grip. Volleys use authored
split-step, turn, loading and step-through motion with the captured limb
lengths. Lesson contact anchors stay fixed. These are authored teaching illustrations, not new capture
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

def solve_arm(S,E,W,target,pole_direction=None):
    l1,l2=length(sub(E,S)),length(sub(W,E));v=sub(target,S);d=length(v)
    w=add(S,mul(v,min(1,(l1+l2)*.995/max(d,1e-8))));e=norm(sub(w,S));d=length(sub(w,S))
    a=(l1*l1-l2*l2+d*d)/(2*d);h=sqrt(max(0,l1*l1-a*a))
    pole=pole_direction if pole_direction is not None else sub(E,mul(add(S,w),.5));pole=sub(pole,mul(e,dot(pole,e)))
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

def rotate_z(v,a):
    return [v[0]*cos(a)-v[1]*sin(a),v[0]*sin(a)+v[1]*cos(a),v[2]]


def repair_volley(k,c):
    # Coordinate the whole action. The old arm-only correction preserved a
    # nearly upright/receding forehand body and a late backhand step.
    from math import atan2
    J={n:i for i,n in enumerate(c['joints'])};ci=c['contactFrame']-1
    original=c['racquetFrames'][ci]['centre'][:]
    low=k=='lowfv';bh=k=='bv';wing=-1 if bh else 1
    face=norm([0,1,.10 if bh else .15 if low else .04])
    axis=norm([-.35,-.095,.93] if bh else [.78,.09,-.62] if low else [.38,-.04,.92])
    axis=norm(sub(axis,mul(face,dot(axis,face))))
    contact_grip=sub(original,mul(axis,.38))
    centre_x=-.27 if not bh else -.02
    for i,(source,r) in enumerate(zip(c['frames'],c['racquetFrames'])):
        f=i-ci
        # Ready -> small split -> flexed landing -> step through -> balanced reset.
        contact_hip=[centre_x,.24 if low else .28 if bh else .14,.75 if low else .86]
        hip=phases([(-70,[0,-.18,.91]),(-49,[0,-.18,.96]),(-36,[0,-.17,.82]),(-20,add(contact_hip,[wing*.04,-.14,-.015])),(20,add(contact_hip,[-wing*.04,.14,.015])),(38,[centre_x,.33,.82]),(70,[centre_x,.24,.89])],f)
        yaw=phases([(-65,[0]),(-30,[-.48 if not bh else .60]),(18,[-.48 if not bh else .60]),(70,[0])],f)[0]
        shoulder=sub(source[J['shoulderR']],source[J['shoulderL']]);a=yaw-atan2(shoulder[1],shoulder[0])
        P=[add(hip,rotate_z(sub(v,source[J['hips']]),a)) for v in source]
        # Keep ankle plants fixed while knees flex. Opposite foot steps through
        # with the punch; it lands just after contact, rather than long after it.
        for side in ['L','R']:
            x=-.29 if side=='L' else .29
            step=(side=='R') if bh else (side=='L')
            split=.045*sin(3.141592653589793*smooth(-60,-39,f)) if -60<f<-39 else 0
            if step:
                target=phases([(-65,[x,-.18,.105]),(-23,[x,-.18,.105]),(-4,[x-wing*.06,.22,.15]),(7,[x-wing*.07,.40,.105]),(32,[x-wing*.07,.40,.105]),(70,[x,.25,.105])],f)
            else:
                target=phases([(-65,[x,-.18,.105]),(-30,[x+wing*.04,-.20,.105]),(20,[x+wing*.04,-.20,.105]),(70,[x,.18,.105])],f)
            target[2]+=split
            names=['hip'+side,'knee'+side,'ankle'+side]
            S,E,W=[P[J[n]] for n in names]
            E2,W2=solve_arm(S,E,W,target,[0,1,0])
            P[J[names[1]]],P[J[names[2]]]=E2,W2
        # Racket set is to the side, then a short forward punch through the
        # unchanged lesson contact. No arm stays parked in front of the chest.
        ready=add(hip,[.02,.33,.43])
        set_grip=add(contact_grip,[wing*.025,-.24,.065])
        target=phases([(-65,ready),(-30,set_grip),(-18,set_grip),(18,add(contact_grip,[-wing*.025,.24,-.065])),(30,add(contact_grip,[-wing*.025,.24,-.065])),(70,ready)],f)
        a=norm(phases([(-65,[.05,-.05,1]),(-30,axis),(30,axis),(70,[.05,-.05,1])],f))
        racket(P,r,J,target,a,face)
        support=add(r['grip'],mul(a,.18))
        balance=add(P[J['shoulderL']],[-.42,-.22,-.12] if bh else [.12,.28,-.14])
        arm(P,J,'L',mix(support,balance,smooth(-26,5,f)))
        c['frames'][i]=[rounded(v) for v in P]
        if 'footFrames' in c:
            turn=smooth(-45,-25,f)*(1-smooth(35,70,f))
            c['footFrames'][i]=[rounded(norm([wing*.18*turn,1,0]),5),rounded(norm([wing*.30*turn,1,0]),5)]
    assert length(sub(original,c['racquetFrames'][ci]['centre']))<.0003,k+' changed contact'
    c['adaptation']={'kind':'coordinated-volley-split-turn-step-punch','contact':'preserved','body':'authored knee flexion, shoulder turn and opposite-foot step','feet':'authored planted directions','source':'Tennis-MoCap limb lengths and contact anchor'}
    return c


def repair(k,c):
    if k.startswith('serve'):
        J={n:i for i,n in enumerate(c['joints'])}
        c['tossReleaseFrame']=next(i+1 for i,P in enumerate(c['frames'][:c['contactFrame']-25])
            if i and P[J['wristL']][2]>=P[J['head']][2]-.05
            and P[J['wristL']][2]>c['frames'][i-1][J['wristL']][2])
        return c
    if k=='bhSlice':return repair_slice(c)
    if k.startswith('bh'):return connected_backhand(c)
    if k in ['lowfv','bv','fvhi']:return repair_volley(k,c)
    return c
