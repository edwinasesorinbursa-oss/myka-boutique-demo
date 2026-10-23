const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require('C:/Users/edwin/Documents/production-quiroz/ESPACIO_DE_TRABAJO/PQ_TRAINER_RELEASE_ANDROID_20261022/node_modules/playwright');
const dir=path.resolve(__dirname,'..'),types={'.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{let u=decodeURI(new URL(req.url,'http://localhost').pathname);if(u.endsWith('/'))u+='index.html';const f=path.resolve(dir,'.'+u);if(!f.startsWith(dir+path.sep)){res.writeHead(403).end();return;}fs.createReadStream(f).on('error',()=>{if(!res.headersSent)res.writeHead(404);res.end()}).pipe(res);res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream')});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],results=[];
try{browser=await chromium.launch({headless:true});let base='http://127.0.0.1:'+server.address().port;
for(const [width,height,mobile] of [[1440,1080,false],[390,844,true],[360,780,true],[820,1000,true]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
 page.on('pageerror',e=>errors.push(width+': '+e.message));
 const resp=await page.goto(base+'/',{waitUntil:'domcontentloaded'});assert.equal(resp.status(),200);
 await page.locator('.reel-headline').waitFor();
 await page.waitForTimeout(1850);
 const dim=await page.evaluate(()=>{const hero=document.querySelector('.reel-frame').getBoundingClientRect();const canvas=document.querySelector('canvas').getBoundingClientRect();const h=document.querySelector('h1').getBoundingClientRect();return{scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth,heroWidth:hero.width,heroHeight:hero.height,canvasWidth:canvas.width,canvasHeight:canvas.height,hLeft:h.left,hRight:h.right,hasCanvas:document.getElementById('mykaMotionCanvas').width>0,videoState:document.getElementById('mykaMotionVideo').readyState}});
 assert(dim.hasCanvas && dim.canvasWidth>100,'canvas invisible at '+width);
 assert(dim.scrollWidth<=width+3,'horizontal overflow '+width+' '+dim.scrollWidth);
 assert(dim.hLeft>=-1 && dim.hRight<=width+1,'headline outside');
 assert(await page.locator('#boutique .item-card').count()===5,'catalog changed');
 assert(await page.locator('#beauty .item-card').count()===5,'lash cards changed');
 assert(await page.locator('.brand img').count()===1,'logo missing');
 const shot=path.join(dir,'tools','myka-motion-'+width+'.png');await page.screenshot({path:shot,fullPage:false});
 const x=mobile?170:450, y=mobile?500:720;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-160,y,{steps:9});await page.mouse.up();
 await page.waitForTimeout(180);
 results.push({width,dim,screenshot:shot});
 await page.close();
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await reduced.goto(base+'/',{waitUntil:'domcontentloaded'});await reduced.waitForTimeout(250);
assert.equal(await reduced.locator('#mykaMotionVideo').evaluate(v=>v.paused),true,'video should be off for reduced motion');
results.push({reducedMotion:'video paused'});await reduced.close();
assert.equal(errors.length,0,'page errors: '+JSON.stringify(errors));
console.log(JSON.stringify({status:'PASS',results,errors},null,2));
}catch(e){console.log('TEST_FAIL',e.stack);process.exitCode=1}
finally{if(browser)await browser.close();server.close()}})();