"""Independent tactical/continuity assertions for the new pilot's evidence."""
import json
from pathlib import Path
R=Path(__file__).resolve().parent.parent
for prefix,source,keys,hit,ends in [('ls','fb',['fb2A','fb2D'],210,['in_play','in_play']),('ll','short',['sb2A','sb2B'],203,['net','in_play']),('sv','serve',['daily2B','daily2C'],407,['in_play','in_play']),('sr','serve',['daily3A','daily3B'],397,['out','in_play'])]:
    authored=json.loads((R/f'rally/{prefix}_data.json').read_text());dataset=json.loads((R/f'rally/{source}_data.json').read_text())
    d=authored['scenes'];original=dataset['scenes']
    for k,v in authored['clips'].items():assert v==dataset['clips'][k],(prefix,k,'licensed clip changed')
    for X in 'AB':
        for j,Y in enumerate('AB'):
            s=d[prefix+'1'+X+Y];old=original[keys[j]]
            assert s['ball'][:hit+1]==old['ball'][:hit+1],(prefix,X,Y,'incoming/contact changed')
            assert s['info']['outcome']==ends[j]
            for a in s['actors']['you']:assert a in old['actors']['you'],(prefix,'strike placement changed')
            if prefix!='ls' or Y!='B':assert s['ball']==old['ball'][:s['frames']],(prefix,'unauthored trajectory change')
            if ends[j] in ['net','out']:assert any(m['kind']==ends[j] for m in s['marks'])
            assert d[prefix+'1'+X]['ball']==s['ball'][:d[prefix+'1'+X]['frames']]
    assert d[prefix+'1AA']['ball']==d[prefix+'1BA']['ball']
    assert d[prefix+'1AB']['ball']==d[prefix+'1BB']['ball']
    assert d[prefix+'1AA']['actors']['opp']==d[prefix+'1BA']['actors']['opp']
    if prefix=='ls':
        # The open right side is occupied differently from the deep-middle reset.
        assert d['ls1AA']['info']['shot']['land'][0]>2
        reset=d['ls1AB'];assert reset['info']['shot']['land']==[0,10]
        assert reset['marks'][-1]['frame']==335
        cross=min(reset['ball'][211:335],key=lambda b:abs(b[1]));assert cross[2]>1.3,'reset needs net clearance'
    if prefix=='ll':
        assert original['sb2A']['info']['youContact'][2]<.914,'low-ball teaching needs low contact'
        assert d['ll1A']['info']['freeze']>=90,'show at least 40 frames of incoming flight before the movement question'
    if prefix=='sv':assert original[keys[0]]['ball'][hit][1]>-10,'pressure follows a shorter return'
    if prefix=='sr':assert original[keys[0]]['ball'][hit][1]<-12,'deep return changes the contact'
print('PASS: 16 authored routes preserve their incoming ball, source strikes, declared outcomes and distinct tactical evidence')
