import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,decide,advance,handleRoutine,routines,validateSave,annual,EVENTS} from './public/game.js';
import {SCHEMAS,buildRequest,parseResponse,callAI} from './ai.mjs';

test('十二个月完整结算，秋收一次，岁考六部，不能重复御批或推进',()=>{
 let s=createGame(123);
 for(let month=1;month<=12;month++){
  assert.equal(s.month,month);assert.throws(()=>advance(s));
  const next=decide(s,'revise');assert.equal(s.decision,null);s=next;
  assert.throws(()=>decide(s,'approve'));
  for(const r of routines(month)){s=handleRoutine(s,r.id);assert.throws(()=>handleRoutine(s,r.id));}
  s=advance(s);assert.equal(validateSave(JSON.parse(JSON.stringify(s))),true);
 }
 assert.equal(s.done,true);assert.equal(s.month,12);
 assert.equal(s.history.filter(x=>x.title.startsWith('秋收')).length,1);
 assert.equal(s.history.filter(x=>x.kind==='revise').length,12);
 assert.equal(s.annual.offices.length,6);assert.throws(()=>advance(s));
});
test('存档保留随机状态，资源不足不能准奏，结果可重现',()=>{
 const a=createGame(2),b=JSON.parse(JSON.stringify(a));assert.deepEqual(decide(a,'approve'),decide(b,'approve'));
 a.stats.grain=0;assert.throws(()=>decide(a,'approve'));assert.throws(()=>decide(a,'revise'));
 const held=advance(decide(a,'hold'));assert.equal(held.stats.grain,0);assert.ok(held.stats.people<55);
});
test('各类选择的十二个月运行均有限、整数且受范围约束',()=>{
 for(let seed=1;seed<=50;seed++){
  let s=createGame(seed);
  for(let i=0;i<12;i++){let k=['approve','revise','hold'][(seed+i)%3];if(s.stats.grain<EVENTS[i].cost)k='hold';s=advance(decide(s,k));assert.ok(validateSave(s));}
  assert.ok(s.annual.score>=0&&s.annual.score<=100);
 }
});
test('空仓不能靠其他三项满分进入高结局',()=>{const s=createGame();s.stats={people:100,fortune:100,integrity:100,grain:0};assert.ok(annual(s).score<60);});
test('损坏存档被拒绝，正常 AI 文案及年度存档可恢复',()=>{
 for(const patch of [{narrations:{1:42}},{history:[null]},{month:12,done:true,annual:{}},
  {decision:{}},{departmentResults:{民部:{handled:1,success:2}}},{routineDone:['1-99']},
  {stats:{people:55,fortune:50,integrity:55,grain:Infinity}},{seed:-1}]){
  assert.equal(validateSave({...createGame(1),...patch}),false);
 }
 for(const value of [null,[],{},'bad'])assert.equal(validateSave(value),false);
 let s=createGame(1);s.narrations[1]={petition:'奏报',draft:'草案',review:'审核'};
 assert.equal(validateSave(s),true);
 for(let i=0;i<12;i++)s=advance(decide(s,'hold'));
 s.annualText='本年政务总结';assert.equal(validateSave(JSON.parse(JSON.stringify(s))),true);
});
test('请求使用 Responses Structured Outputs；不携带密钥；角色只能选已知官职',()=>{
 const r=buildRequest({kind:'chat',month:6,stats:createGame().stats,role:'menxia',question:'减半如何？'},'test-model');
 assert.equal(r.text.format.strict,true);assert.equal(r.text.format.type,'json_schema');assert.equal(r.store,false);
 for(const s of Object.values(SCHEMAS)){assert.equal(s.additionalProperties,false);assert.deepEqual(s.required,Object.keys(s.properties));}
 assert.equal(JSON.parse(r.input).role.department,'门下省');assert.equal(JSON.parse(r.input).event.historical,true);
 assert.throws(()=>buildRequest({kind:'chat',month:99},'test'));assert.throws(()=>buildRequest({kind:'unknown',month:1},'test'));
});
test('正常结构化回复可解析；拒绝、截断及坏 JSON 均被阻止',()=>{
 const payload={status:'completed',output:[{type:'message',content:[{type:'output_text',text:'{"speech":"臣请量入为出。"}'}]}]};
 assert.equal(parseResponse(payload,'chat').speech,'臣请量入为出。');
 assert.throws(()=>parseResponse({...payload,status:'incomplete'},'chat'));
 assert.throws(()=>parseResponse({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'no'}]}]},'chat'));
 assert.throws(()=>parseResponse({status:'completed',output:[]},'chat'));
});
test('模拟 API 适配器：端点、请求体与错误降级',async()=>{
 const body={kind:'chat',month:1,stats:createGame().stats};
 const result=await callAI(body,{key:'test-only',model:'test-model',fetchImpl:async(url,req)=>{
  assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(req.headers.Authorization,'Bearer test-only');assert.equal(JSON.parse(req.body).text.format.strict,true);
  return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'{"speech":"谨遵圣裁。"}'}]}]})};
 }});assert.equal(result.speech,'谨遵圣裁。');
 await assert.rejects(()=>callAI(body,{key:'',model:'test'}));
 await assert.rejects(()=>callAI(body,{key:'test',model:'test',fetchImpl:async()=>({ok:false,status:429})}),/429/);
});
