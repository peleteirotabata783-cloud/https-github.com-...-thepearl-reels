# Encurta pausas longas da narração e remapeia os tempos das palavras.
import json, re, subprocess, numpy as np, wave
SR=48000; KEEP=0.20; SPEED=1.07; OFF=0.15
src='voz-will-orig.mp3'
raw=subprocess.run(['ffmpeg','-v','error','-i',src,'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
x=np.frombuffer(raw,np.int16).astype(np.float32)/32768
log=subprocess.run(['ffmpeg','-hide_banner','-i',src,'-af','silencedetect=noise=-38dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
st=[float(v) for v in re.findall(r'silence_start: ([\d.]+)',log)]; en=[float(v) for v in re.findall(r'silence_end: ([\d.]+)',log)]
cuts=[]  # (início, fim) do trecho removido no tempo original
for a,b in zip(st,en):
    if b>=len(x)/SR-0.05: continue
    d=b-a
    if d>KEEP: m=(a+b)/2; cuts.append((m-(d-KEEP)/2, m+(d-KEEP)/2))
def remap(t):
    s=0
    for a,b in cuts:
        if t>=b: s+=b-a
        elif t>a: s+=t-a
    return t-s
F=int(0.02*SR); out=[]; pos=0
for a,b in cuts:
    seg=x[pos:int(a*SR)].copy(); seg[-F:]*=np.linspace(1,0,F); out.append(seg)
    pos=int(b*SR); x[pos:pos+F]*=np.linspace(0,1,F)
out.append(x[pos:]); y=np.concatenate(out)
w=wave.open('voz-will-apertada.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((y*32767).astype(np.int16).tobytes());w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i','voz-will-apertada.wav','-af',f'atempo={SPEED}','voz.wav'],check=True)
d=json.load(open('words-will.json')); ws=[v for v in (d.get('words',d) if isinstance(d,dict) else d) if v.get('type','word')=='word']
W=[[v['text'],round(remap(v['start'])/SPEED+OFF,3),round(remap(v['end'])/SPEED+OFF,3)] for v in ws]
open('words.js','w').write('window.WORDS='+json.dumps(W,ensure_ascii=False)+';')
print(len(cuts),'pausas encurtadas; fala:',round(len(y)/SR/SPEED,2),'s; última palavra termina em',W[-1][2])
