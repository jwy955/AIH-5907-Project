# 大唐贞观治：12 个月轻量 Demo

一个本地浏览器小游戏。只做皇帝的主要操作：阅奏、听取意见、准奏／修改／留中、退朝。三省六部自动衔接，不逐层审批。纯 Node.js 与原生 HTML/CSS/JavaScript，无需安装 npm 依赖。

## 启动

需要 Node.js 22 或更高版本。

```sh
cd '/Users/Admin1/Desktop/AIH dig/大唐贞观治/demo'
npm start
```

浏览器打开 [本地 Demo](http://127.0.0.1:4317)。服务只监听本机。当前默认不配置密钥，内置文案可以完整玩完十二个月。

## 已做的功能

- 12个月，每月1件主政务、0至2件短常务、前政回报。
- 三省六部完整入口，官职卡、制度说明与来源链接；手机端通过“中枢”打开。
- 三种御批、一次性概率结算、四项整数属性。
- 六月山东夏旱历史锚点，其余主政务为教学拟写。
- 九月概率秋收，十二月简化岁考与结局。
- 浏览器本地存档、刷新续局、确认后重开。
- 官员奏对、文书拟写、年度年记的 OpenAI 接口。

## 简化规则

| 内容 | Demo 规则 |
|---|---|
| 初始属性 | 民心55、国运50、吏治55、粮库900 |
| 准奏 | 按事件固定成本与收益执行 |
| 修改施行 | 成本减半向上取整，收益按60%四舍五入；直接视为重拟通过 |
| 留中 | 不花粮，应用该事件问题未解的固定影响，不追踪复杂积案 |
| 成功率 | 60%＋吏治×0.3%，在有效属性范围内为60%至90% |
| 执行受阻 | 正向收益减半，成本照付，不生成复杂事故链 |
| 月末 | 固定耗粮20；粮库为0时民心−8 |
| 秋收 | 九月一次抽签：20%加300，60%加600，20%加850 |
| 岁考 | 按六部主办次数与顺利落实次数显示标签，不做升迁系统 |
| 结局 | 民心、国运、吏治各30%，粮库归一化分10%；粮库分=min(100,粮库÷6)，空仓总分最高59 |

所有系数是演示参数，不是史实或已平衡的完整游戏。决策结果立即可见，下月保留为前政回报。随机种子随存档保存，刷新不重新抽取已决事件。

## OpenAI：Responses API + Structured Outputs

1. 将 `.env.example` 复制为 `.env`。
2. 在本机编辑 `.env`，填写 `OPENAI_API_KEY`。不要将密钥放到 `public/`，不要提交到仓库。
3. `OPENAI_MODEL` 默认设为 `gpt-5.4-mini`，可以改为账号可用且支持 Structured Outputs 的模型。
4. 重启 `npm start`，刷新页面。页面会显示“AI 奏对可用”。

“可用”仅表示服务端存在密钥配置，不表示已经验证密钥、余额或模型权限。真实连通性以实际调用结果为准。

前端只请求自己的 `POST /api/ai`；Node 后端向 `POST https://api.openai.com/v1/responses` 请求，密钥不发送给浏览器。

`ai.mjs` 中实际请求使用：

```json
{
  "text": {
    "format": {
      "type": "json_schema",
      "name": "zhenguan_chat",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {"speech": {"type": "string"}},
        "required": ["speech"],
        "additionalProperties": false
      }
    }
  }
}
```

这是请求中的输出格式片段；完整请求同时包含服务端模型配置、instructions 与 input。

三个任务：

- `narrate`：返回 `petition`、`draft`、`review`。
- `chat`：返回 `speech`。
- `annual`：返回 `summary`。

月度事件规则由程序提供，AI 动态拟写文书，不自由创造成本、成功率、史事或官员。模型输入只有当前事件、相关角色、国家属性与必要资料；年记附本局日志。原文和来源链接由固定史料条目展示，不让模型编造。

生成是按需点击，默认不自动消耗额度。AI 回复被拒绝、超时、格式错误或限流时保留演示文案，游戏仍可继续。结构符合 Schema 不代表史料正确，AI 文本仍标注拟写。

官方依据，核对日期2026-09-17：

- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [文本生成与 Responses](https://developers.openai.com/api/docs/guides/text)
- [GPT-5.4 mini 模型页](https://developers.openai.com/api/docs/models/gpt-5.4-mini)

## 史料边界

贞观元年夏旱依据[《旧唐书》卷二](https://zh.wikisource.org/zh-hant/舊唐書/卷2)。原文记夏季，六月为演示排期。奏对、方案与数值是现代教学拟写。三省职能参见[《新唐书》卷四十七](https://ancient-china-books.github.io/xintangshu/OEBPS/Text/4168.html)；六部、民部异名与考功说明参见[卷四十六](https://ancient-china-books.github.io/xintangshu/OEBPS/Text/4167.html)。

仅“恪勤匪懈”标签借鉴四善，其余评价为游戏表达；没有实现二十七最、九等考第。官员采用官职角色，不声称复原了贞观元年完整在任名单。

## 文件与验证

- `public/game.js`：事件模板、概率与十二月规则。
- `public/app.js`、`style.css`：界面、存档及交互。
- `ai.mjs`：严格 JSON Schema 请求、响应校验。
- `server.mjs`：本地静态服务及服务端 AI 转发。
- `test.mjs`：十二月流程、随机状态、资源边界与 API 模拟测试。

```sh
npm test
```

已通过8项自动检查（含损坏存档回归测试），并用浏览器完整试玩至十二月，核对历史锚点、常务、刷新续局、年末结局及手机宽度显示。迁移目录后再次验证留中、月末耗粮、常务与刷新续局。**尚未配置真实密钥，未进行付费 API 联调。** 详细记录见上级目录的 `docs/测试记录.md`，项目总览见 `项目说明.md`。

这是本地演示原型：存档在浏览器，数值规则在客户端，不是生产级防作弊架构；没有账号、云存档、微信小程序原生工程、复杂派系或多人系统。
