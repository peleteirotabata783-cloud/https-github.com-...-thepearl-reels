// Renderiza video.html quadro a quadro (30 fps) e gera o MP4 com a narração.
// Uso: node render.js   (requer playwright + ffmpeg)
const {chromium}=require('playwright'); const {spawn}=require('child_process'); const path=require('path');
const FPS=30;
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
  pg.on('pageerror',e=>console.log('ERR',e.message));
  await pg.goto('file://'+path.resolve(__dirname,'video.html')); await pg.waitForFunction('window.__ready');
  const DUR=await pg.evaluate('DUR'); const N=Math.round(DUR*FPS);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',
    '-itsoffset','0.4','-i',path.resolve(__dirname,'voz.mp3'),
    '-filter_complex','[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,apad[a]','-map','0:v','-map','[a]',
    '-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-profile:v','high','-r',String(FPS),
    '-c:a','aac','-b:a','192k','-ar','48000','-shortest','-movflags','+faststart',path.resolve(__dirname,'antes-da-arte-pronta.mp4')],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<N;i++){ await pg.evaluate(t=>render(t),i/FPS);
    const buf=await pg.screenshot({type:'jpeg',quality:95});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if(i%90===0) console.log(`frame ${i}/${N}`); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('ok');
})();
