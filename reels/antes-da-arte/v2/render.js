// Renderiza o v2: quadros (30 fps) + voz + trilha + efeitos sonoros -> MP4
// Uso: node render.js
const {chromium}=require('playwright'),{spawn,execFileSync}=require('child_process'),path=require('path'),fs=require('fs');
const FPS=30, R=f=>path.resolve(__dirname,f);
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
  pg.on('pageerror',e=>console.log('ERR',e.message));
  await pg.goto('file://'+R('video.html')); await pg.waitForFunction('window.__ready');
  const DUR=await pg.evaluate('DUR'); const N=Math.round(DUR*FPS);
  fs.writeFileSync(R('sfx.json'),JSON.stringify(await pg.evaluate('SFX')));
  execFileSync('python3',[R('sfx.py'),R('sfx.json'),String(DUR),R('sfx.wav')]);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',
    '-i',R('voz.wav'),'-i',R('musica.mp3'),'-i',R('sfx.wav'),
    '-filter_complex',
     '[1:a]adelay=150|150,aresample=48000,loudnorm=I=-15:TP=-2:LRA=9,aresample=48000,asplit=2[v][vk];'+
     `[2:a]aresample=48000,volume=0.28,afade=t=out:st=${DUR-1.2}:d=1.2[m];`+
     '[m][vk]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=300[md];'+
     '[3:a]aresample=48000,volume=0.45[s];'+
     `[v][md][s]amix=inputs=3:normalize=0,alimiter=limit=0.95,atrim=0:${DUR}[a]`,
    '-map','0:v','-map','[a]','-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-r',String(FPS),
    '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',R('antes-da-arte-pronta-v2.mp4')],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<N;i++){ await pg.evaluate(t=>render(t),i/FPS);
    const buf=await pg.screenshot({type:'jpeg',quality:95});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('ok');
})();
