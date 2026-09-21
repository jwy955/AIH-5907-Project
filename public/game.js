export const MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
export const LABELS = {people:'民心',fortune:'国运',integrity:'吏治',grain:'粮库'};
export const SOURCES = {
  offices: {title:'《新唐书》卷四十六·百官一', url:'https://ancient-china-books.github.io/xintangshu/OEBPS/Text/4167.html', text:'尚书省、六部与考功相关条目。贞观时期采用“民部”称谓；岁考标签借鉴考功记载，分数与奖惩为游戏简化。'},
  review: {title:'《新唐书》卷四十七·百官二',url:'https://ancient-china-books.github.io/xintangshu/OEBPS/Text/4168.html',text:'中书舍人参与草拟诏敕，门下相关官员审核并纠正违失。本作的按钮和固定流转顺序是教学简化。'},
  drought: {title:'《旧唐书》卷二·太宗上',url:'https://zh.wikisource.org/zh-hant/舊唐書/卷2',text:'“是夏，山東諸州大旱，令所在賑恤，無出今年租賦。”史料记载贞观元年夏季；Demo 安排在六月。文书、选项与数值为拟写。'}
};
export const INSTITUTIONS = [
  {id:'zhongshu',name:'中书省',short:'拟令',role:'中书舍人',desc:'将政务整理成可供御览的草案，说明缘由和方案。',source:'review'},
  {id:'menxia',name:'门下省',short:'审议',role:'给事中',desc:'审阅草案，提出异议或修改意见；为皇帝保留完整的审议记录。',source:'review'},
  {id:'shangshu',name:'尚书省',short:'分派',role:'尚书省官员',desc:'承接获准政令，组织六部执行并汇总回报。',source:'offices'},
  {id:'吏部',name:'吏部',short:'选官考课',role:'吏部官员',desc:'呈报人员与考课事务。Demo 只做年度评价标签，不做复杂升迁树。',source:'offices'},
  {id:'民部',name:'民部',short:'户籍钱粮',role:'民部官员',desc:'呈报户口、赋役与钱粮事务。民部为贞观称谓，后称户部。',source:'offices'},
  {id:'礼部',name:'礼部',short:'礼仪典制',role:'礼部官员',desc:'呈报礼仪事务。本作不将后来的礼部贡举配置套用于贞观。',source:'offices'},
  {id:'兵部',name:'兵部',short:'军政事务',role:'兵部官员',desc:'呈报军政相关需求，展示边防资源取舍；不模拟完整军事机构。',source:'offices'},
  {id:'刑部',name:'刑部',short:'刑法覆核',role:'刑部官员',desc:'呈报法律与复核事项。大理寺、御史台另有职责，六部并非全部国家机关。',source:'offices'},
  {id:'工部',name:'工部',short:'工程事务',role:'工部官员',desc:'呈报工程与营建需求。Demo 用单次资源支出和概率反馈简化执行。',source:'offices'}
];
const event = (title,dept,petition,review,cost,gain,hold,extra={}) => ({title,dept,petition,review,cost,gain,hold,source:'offices',historical:false,...extra});
export const EVENTS = [
  event('清点仓粮，以备不虞','民部','新岁伊始，诸仓账册尚有缺漏。臣请拨粮供给查验人员，核实储备，免临事无备。','可行。查验须有期限，不宜以清查之名久扰州县。',45,{integrity:6,grain:15},{integrity:-2}),
  event('春耕在即，先修沟渠','工部','春耕将近，一处灌渠淤塞。请组织疏浚，并给役者口粮，使田亩得水。','请限于险要河段，勿广兴工程而夺农时。',100,{people:7,fortune:3},{people:-3}),
  event('边地守备，补给为先','兵部','边地守备报告储粮不足。臣请调粮补充，以安军心；此为日常军政合成情境。','军备有需，亦须兼顾内地储粮，请陛下量入而出。',100,{fortune:9},{fortune:-4}),
  event('核查簿籍，厘清差役','吏部','地方差役记录有重复之处。臣请核查相关承办人员，纠正错漏，减轻百姓往返。','宜核实过失，勿因簿书之误一概重罚。',45,{integrity:6,people:3},{integrity:-3}),
  event('简省仪用，守礼节费','礼部','礼仪所需物资有重复申领，臣请核定旧例、裁省浮费，以整典制。','礼有定分，省费亦不宜骤改全部仪节。',30,{integrity:3,grain:40},{fortune:-2}),
  event('山东夏旱，赈恤待裁','民部','山东诸州遭遇夏旱，田作受损。请调拨仓粮赈济，并讨论减轻本年租赋之负。','救急不可缓；请明确发粮范围，以防侵冒，兼顾后续储备。',160,{people:12,fortune:3},{people:-12,fortune:-3},{historical:true,source:'drought'}),
  event('复核疑案，勿使淹滞','刑部','有司报送疑案久未覆核。臣请组织复核，厘清证据，避免无辜者久系。','宜依法核查，不可为求速结而轻断。',40,{people:5,integrity:5},{people:-4}),
  event('仓廪防损，修补待秋','工部','秋收将至，仓舍有漏损。请先修缮，再纳新粮，以免雨湿虫耗。','建议先修损坏最重之仓，其余缓办。',85,{grain:35,fortune:3},{grain:-35}),
  event('秋粮入仓，核对出纳','民部','新粮将入库，臣请核对出纳账目，安排人员验收，防止错记与损耗。','查验宜清楚简便，不得借机增添百姓负担。',40,{integrity:4,grain:45},{integrity:-2}),
  event('寒月将近，补充戍粮','兵部','寒月将至，戍守军粮须早作准备。请调拨粮食，减少冬季转运之困。','调粮有益，但应为民用留足余量。',100,{fortune:8},{fortune:-4}),
  event('审录积案，备呈岁终','刑部','岁终将近，臣请整理覆核积案与办理记录，查明拖延之处。','考其事实，不以结案多寡一项定优劣。',35,{integrity:5,people:3},{integrity:-3}),
  event('汇集考状，以备岁考','吏部','诸司呈报全年办理记录。臣请核实功过，依办事表现列示评价，进呈御览。','当察实际，不可只取漂亮文辞。升黜须另有依据。',30,{integrity:5,fortune:3},{integrity:-3})
];
const ROUTINES = [
  {title:'核对当月出纳',dept:'民部',text:'补齐账目缺项，不额外征发。',cost:0,gain:{integrity:1}},
  {title:'检视官署器用',dept:'工部',text:'修补损坏器具，避免重复置办。',cost:10,gain:{fortune:1}},
  {title:'简办接待礼仪',dept:'礼部',text:'按既定规格办理，节省耗用。',cost:0,gain:{grain:10}}
];
export function routines(month) { return Array.from({length:(month-1)%3},(_,i)=>({...ROUTINES[(month+i)%3],id:`${month}-${i}`})); }
export function createGame(seed=Date.now()>>>0) {
 return {version:1,month:1,stats:{people:55,fortune:50,integrity:55,grain:900},seed:seed>>>0,done:false,decision:null,routineDone:[],history:[],monthly:[],reports:[],departmentResults:{},narrations:{},annual:null};
}
function random(s) {s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0; return s.seed/4294967296;}
export function chance(stats) {return Math.min(.95,Math.max(.5,.6+stats.integrity*.003));}
export function effects(s,delta) {let actual={};for(const [k,v] of Object.entries(delta)){const old=s.stats[k];s.stats[k]=Math.round(Math.max(0,k==='grain'?old+v:Math.min(100,old+v)));actual[k]=s.stats[k]-old;}return actual;}
export function option(e,kind) {
 if(kind==='hold')return {cost:0,gain:e.hold,label:'留中待议'};
 if(kind==='revise')return {cost:Math.ceil(e.cost*.5),gain:Object.fromEntries(Object.entries(e.gain).map(([k,v])=>[k,Math.round(v*.6)])),label:'修改后准奏'};
 return {cost:e.cost,gain:e.gain,label:'朱批准奏'};
}
export function decide(state,kind) {
 if(!['approve','revise','hold'].includes(kind)||state.done||state.decision)throw Error('本月御批已完成，或操作无效。');
 const s=structuredClone(state),e=EVENTS[s.month-1],o=option(e,kind);
 if(s.stats.grain<o.cost)throw Error('粮库不足，请修改方案或留中。');
 const success=kind==='hold'?true:random(s)<chance(s.stats);
 const gain=Object.fromEntries(Object.entries(o.gain).map(([k,v])=>[k,success||v<0?v:Math.round(v*.5)]));
 const delta=effects(s,{...gain,grain:(gain.grain||0)-o.cost});
 const record={month:s.month,title:e.title,dept:e.dept,kind,label:o.label,success,delta};
 s.decision=record;s.monthly.push(record);s.history.push(record);
 if(kind!=='hold'){s.departmentResults[e.dept]??={handled:0,success:0};s.departmentResults[e.dept].handled++;if(success)s.departmentResults[e.dept].success++;}
 return s;
}
export function handleRoutine(state,id) {
 const s=structuredClone(state),r=routines(s.month).find(x=>x.id===id);
 if(s.done||!r||s.routineDone.includes(id))throw Error('这件常务已处理。');
 if(s.stats.grain<r.cost)throw Error('粮库不足。');
 const delta=effects(s,{...r.gain,grain:(r.gain.grain||0)-r.cost});
 const rec={month:s.month,title:r.title,dept:r.dept,kind:'routine',label:'依例办理',success:true,delta};
 s.routineDone.push(id);s.monthly.push(rec);s.history.push(rec);return s;
}
export function advance(state) {
 if(state.done||!state.decision)throw Error('请先御批本月主政务。');
 const s=structuredClone(state),rec={month:s.month,title:'本月常备支出',label:'例行供给',delta:effects(s,{grain:-20})};
 s.monthly.push(rec);s.history.push(rec);
 if(s.month===9){const roll=random(s),amount=roll<.2?300:roll<.8?600:850;const h={month:9,title:amount===300?'秋收偏歉':amount===600?'秋收平稳':'秋收丰足',label:'一次入库',delta:effects(s,{grain:amount})};s.monthly.push(h);s.history.push(h);}
 if(s.stats.grain===0){const h={month:s.month,title:'仓粮告急',label:'救济不足',delta:effects(s,{people:-8})};s.monthly.push(h);s.history.push(h);}
 s.reports=s.monthly;
 if(s.month===12){s.done=true;s.annual=annual(s);return s;}
 s.month++;s.decision=null;s.routineDone=[];s.monthly=[];return s;
}
export function annual(s) {
 const grainScore=Math.min(100,s.stats.grain/6);
 let score=Math.round(s.stats.people*.3+s.stats.fortune*.3+s.stats.integrity*.3+grainScore*.1);
 if(s.stats.grain===0)score=Math.min(score,59);
 return {score,title:score>=80?'小治初成':score>=60?'守成有序':score>=40?'隐忧待解':'国事维艰',
  offices:['吏部','民部','礼部','兵部','刑部','工部'].map(name=>{const d=s.departmentResults[name];return {name,label:!d?'尚无考绩':d.success===d.handled?'恪勤匪懈':d.success>0?'尚需勉励':'执行待整',detail:d?`主办 ${d.handled} 件，顺利落实 ${d.success} 件`:'本年度无主办记录'};})};
}
export function validateSave(s) {
 const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 const month=v=>integer(v,1,12);
 const str=v=>typeof v==='string'&&v.length<=2500;
 const departments=INSTITUTIONS.slice(3).map(x=>x.name);
 const delta=v=>obj(v)&&Object.entries(v).every(([k,n])=>k in LABELS&&Number.isSafeInteger(n));
 const record=v=>obj(v)&&month(v.month)&&str(v.title)&&str(v.label)&&delta(v.delta);
 const records=v=>Array.isArray(v)&&v.length<200&&v.every(record);
 if(!obj(s)||s.version!==1||!month(s.month)||typeof s.done!=='boolean'||(s.done&&s.month!==12)
   ||!integer(s.seed,0,4294967295)||!obj(s.stats)
   ||!Object.keys(LABELS).every(k=>integer(s.stats[k],0,k==='grain'?Number.MAX_SAFE_INTEGER:100))
   ||![s.history,s.monthly,s.reports].every(records))return false;
 if(s.decision!==null&&!(record(s.decision)&&s.decision.month===s.month
   &&['approve','revise','hold'].includes(s.decision.kind)&&typeof s.decision.success==='boolean'
   &&departments.includes(s.decision.dept)))return false;
 if(!Array.isArray(s.routineDone)||new Set(s.routineDone).size!==s.routineDone.length
   ||!s.routineDone.every(id=>routines(s.month).some(r=>r.id===id)))return false;
 if(!obj(s.narrations)||!Object.entries(s.narrations).every(([k,v])=>month(Number(k))&&obj(v)
   &&['petition','draft','review'].every(field=>str(v[field]))))return false;
 if(!obj(s.departmentResults)||!Object.entries(s.departmentResults).every(([k,v])=>departments.includes(k)
   &&obj(v)&&integer(v.handled,0,12)&&integer(v.success,0,v.handled)))return false;
 if(s.annualText!==undefined&&!str(s.annualText))return false;
 if(s.done){const a=s.annual;
   if(!s.decision||!obj(a)||!integer(a.score,0,100)||!str(a.title)||!Array.isArray(a.offices)
     ||a.offices.length!==6||!a.offices.every((v,i)=>obj(v)&&v.name===departments[i]&&str(v.label)&&str(v.detail)))return false;
 }else if(s.annual!==null)return false;
 return true;
}
