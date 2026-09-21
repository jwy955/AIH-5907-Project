import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {callAI} from './ai.mjs';

const root=fileURLToPath(new URL('./public/',import.meta.url));
const port=Number(process.env.PORT||4317),host='127.0.0.1';
const key=process.env.OPENAI_API_KEY,model=process.env.OPENAI_MODEL||'gpt-5.4-mini';
const files={'/':'index.html','/style.css':'style.css','/app.js':'app.js','/game.js':'game.js'};
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8'};
let active=0;
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
 if(req.headers.host!==`${host}:${port}`&&req.headers.host!==`localhost:${port}`){send(res,403,{error:'无效访问来源'});return;}
 const url=new URL(req.url,`http://${host}:${port}`);
 try{
  if(req.method==='GET'&&url.pathname==='/api/config'){send(res,200,{available:!!key,model});return;}
  if(req.method==='POST'&&url.pathname==='/api/ai'){
   const expected=`http://${req.headers.host}`;
   if(req.headers.origin&&req.headers.origin!==expected){send(res,403,{error:'仅允许本地同源请求'});return;}
   if(!req.headers['content-type']?.startsWith('application/json')){send(res,415,{error:'需要 JSON 请求'});return;}
   if(active>=2){send(res,429,{error:'请等候当前奏对完成。'});return;}
   let text='';for await(const chunk of req){text+=chunk.toString();if(Buffer.byteLength(text)>64000){send(res,413,{error:'请求过长'});return;}}
   let body;try{body=JSON.parse(text);}catch{send(res,400,{error:'请求格式无效'});return;}
   active++;
   try{send(res,200,{data:await callAI(body,{key,model})});}
   catch(err){send(res,502,{error:err.name==='TimeoutError'?'奏对超时，可继续演示。':err.message});}
   finally{active--;}
   return;
  }
  if(req.method==='GET'&&Object.hasOwn(files,url.pathname)){
   const file=files[url.pathname];res.writeHead(200,{'Content-Type':types[file.split('.').at(-1)],'Cache-Control':'no-cache'});res.end(await readFile(root+file));return;
  }
  send(res,404,{error:'未找到页面'});
 }catch{if(!res.headersSent)send(res,500,{error:'请求未完成'});else res.end();}
});
server.listen(port,host,()=>console.log(`大唐贞观治 Demo: http://${host}:${port} | ${key?'AI 已配置':'演示文案模式'}`));
server.on('error',err=>{console.error(`无法启动：${err.code}`);process.exitCode=1;});
