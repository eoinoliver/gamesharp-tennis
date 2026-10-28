"""Offline BVH forward kinematics used to recover discarded foot directions.
Adapted from the project’s original retargeter. Dataset inputs are obtained
separately under CC BY-SA 3.0 and never included in public builds.
Requires NumPy for this offline audit only; application builds do not.
"""
import numpy as np, re, json

# ---- rig bone lengths, metres (from gs_strokes.py) -------------------------
RIG = {
    'Chest': 0.34, 'Neck': 0.20, 'Head': 0.20, 'Head_end': 0.12,
    'LeftCollar': 0.19, 'LeftShoulder': 0.20, 'LeftElbow': 0.32,
    'LeftWrist': 0.30, 'LeftWrist_end': 0.10,
    'RightCollar': 0.19, 'RightShoulder': 0.20, 'RightElbow': 0.32,
    'RightWrist': 0.30, 'RightWrist_end': 0.10,
    'LeftHip': 0.12, 'LeftKnee': 0.45, 'LeftAnkle': 0.42, 'LeftAnkle_end': 0.17,
    'RightHip': 0.12, 'RightKnee': 0.45, 'RightAnkle': 0.42, 'RightAnkle_end': 0.17,
}
ROOT_SCALE = 1.82 / 1.63          # root translation scales with the figure

def parse(path):
    txt = open(path).read()
    hier, motion = txt.split('MOTION')
    names, parents, offsets, chans, stack = [], [], [], [], []
    toks = hier.replace('{', ' { ').replace('}', ' } ').split()
    i = 0
    while i < len(toks):
        t = toks[i]
        if t in ('ROOT', 'JOINT'):
            names.append(toks[i+1]); parents.append(stack[-1] if stack else -1)
            offsets.append(None); chans.append([]); stack.append(len(names)-1); i += 2
        elif t == 'End':
            names.append(names[stack[-1]] + '_end'); parents.append(stack[-1])
            offsets.append(None); chans.append([]); stack.append(len(names)-1); i += 2
        elif t == 'OFFSET':
            offsets[stack[-1]] = np.array([float(toks[i+1]), float(toks[i+2]), float(toks[i+3])]); i += 4
        elif t == 'CHANNELS':
            n = int(toks[i+1]); chans[stack[-1]] = toks[i+2:i+2+n]; i += 2+n
        elif t == '}':
            stack.pop(); i += 1
        else:
            i += 1
    ml = motion.strip().split('\n')
    nf = int(re.search(r'(\d+)', ml[0]).group(1))
    dt = float(re.search(r'([\d.]+)', ml[1]).group(1))
    data = np.array([[float(x) for x in l.split()] for l in ml[2:2+nf]])
    return dict(names=names, parents=parents, offsets=offsets, chans=chans,
                dt=dt, data=data, nframes=nf)

def rig_offsets(b):
    """Same directions, rig lengths, in metres."""
    out = []
    for nm, off in zip(b['names'], b['offsets']):
        o = off / 100.0
        L = np.linalg.norm(o)
        if nm in RIG and L > 1e-9:
            o = o / L * RIG[nm]
        out.append(o)
    return out

def R(axis, deg):
    a = np.deg2rad(deg); c, s = np.cos(a), np.sin(a)
    if axis == 'X': return np.array([[1,0,0],[0,c,-s],[0,s,c]])
    if axis == 'Y': return np.array([[c,0,s],[0,1,0],[-s,0,c]])
    return np.array([[c,-s,0],[s,c,0],[0,0,1]])

def fk(b, offs):
    """Returns positions (F,N,3) and world rotation matrices (F,N,3,3)."""
    N, F = len(b['names']), b['nframes']
    pos = np.zeros((F, N, 3)); rot = np.zeros((F, N, 3, 3))
    for f in range(F):
        col = 0
        for j in range(N):
            off = offs[j].copy(); Rj = np.eye(3)
            for ch in b['chans'][j]:
                v = b['data'][f, col]; col += 1
                if ch.endswith('position'):
                    off[{'X':0,'Y':1,'Z':2}[ch[0]]] += v / 100.0 * ROOT_SCALE
                else:
                    Rj = Rj @ R(ch[0], v)
            p = b['parents'][j]
            if p < 0: pos[f,j] = off;                       rot[f,j] = Rj
            else:     pos[f,j] = pos[f,p] + rot[f,p] @ off; rot[f,j] = rot[f,p] @ Rj
    return pos, rot

# BVH is Y-up with LEFT at +X. The rig is Z-up with RIGHT at +X.
# rig = (-x, z, y): determinant +1, so it rotates rather than mirrors --
# getting this wrong turns a right-hander into a left-hander.
A2R = np.array([[-1.0, 0, 0], [0, 0, 1.0], [0, 1.0, 0]])

def to_rig(v):            # positions or vectors, (...,3)
    return v @ A2R.T

def to_rig_R(M):          # rotation matrices
    return A2R @ M @ A2R.T

def load(path):
    b = parse(path)
    pos, rot = fk(b, rig_offsets(b))
    P = to_rig(pos)
    Rw = np.einsum('ij,fnjk,lk->fnil', A2R, rot, A2R)
    return dict(names=b['names'], parents=b['parents'], dt=b['dt'],
                nframes=b['nframes'], pos=P, rot=Rw)
