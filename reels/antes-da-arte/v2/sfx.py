# Gera a trilha de efeitos sonoros (sfx.wav) a partir de window.SFX do video.html
import json, sys, numpy as np, wave
SR=48000; DUR=float(sys.argv[2]); ev=json.load(open(sys.argv[1]))
rng=np.random.default_rng(7); out=np.zeros(int(SR*(DUR+1)))
def env(n,a,d): t=np.arange(n)/SR; return np.minimum(1,t/max(a,1e-4))*np.exp(-t/d)
def lp(x,k):  # passa-baixa simples (média móvel)
    return np.convolve(x,np.ones(k)/k,'same')
def whoosh():
    n=int(.45*SR); t=np.arange(n)/SR; x=rng.standard_normal(n)
    x=lp(x,6)-lp(x,60); e=np.sin(np.pi*np.clip(t/.45,0,1))**2; return .55*x*e
def click():
    n=int(.05*SR); t=np.arange(n)/SR; return .6*np.sin(2*np.pi*2400*t)*np.exp(-t/.006)+.3*rng.standard_normal(n)*np.exp(-t/.003)
def stamp():
    n=int(.6*SR); t=np.arange(n)/SR; f=110*np.exp(-t*6)+45
    b=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.18); nz=lp(rng.standard_normal(n),3)*np.exp(-t/.04)
    return 1.0*b+.5*nz
def pop(f0=900):
    n=int(.12*SR); t=np.arange(n)/SR; f=f0*np.exp(-t*18)+f0*.45
    return .45*np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.04)
def ding():
    n=int(1.0*SR); t=np.arange(n)/SR
    return .28*(np.sin(2*np.pi*1318*t)+.5*np.sin(2*np.pi*1975*t)+.25*np.sin(2*np.pi*2637*t))*env(n,.003,.28)
def boing():
    n=int(.35*SR); t=np.arange(n)/SR; f=220+180*np.sin(2*np.pi*9*t)*np.exp(-t*6)
    return .35*np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*env(n,.005,.12)*.6
def glitch():
    n=int(.45*SR); t=np.arange(n)/SR; x=np.sign(np.sin(2*np.pi*(180+rng.integers(0,6,n)//1*40)*t))
    gate=(np.floor(t*40)%2==0); return .22*x*gate*np.exp(-t/.3)
def swipe():
    n=int(.3*SR); t=np.arange(n)/SR; x=rng.standard_normal(n); x=x-lp(x,8)
    return .4*x*np.sin(np.pi*t/.3)
def tick():
    n=int(.025*SR); t=np.arange(n)/SR; return .22*rng.standard_normal(n)*np.exp(-t/.004)
def add(sig,at):
    i=int(at*SR); j=min(len(out),i+len(sig)); out[i:j]+=sig[:j-i]
for e in ev:
    k,a=e[0],e[1]
    if k=='type':
        tt=a
        while tt<e[2]: add(tick()*(0.7+0.6*rng.random()),tt); tt+=0.055+0.04*rng.random()
    else: add({'whoosh':whoosh,'click':click,'stamp':stamp,'pop':pop,'ding':ding,'boing':boing,'glitch':glitch,'swipe':swipe}[k](),max(0,a-(0.25 if k=='whoosh' else 0)))
out=out/np.max(np.abs(out))*0.9
w=wave.open(sys.argv[3],'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
