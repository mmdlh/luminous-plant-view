import { Link } from "@tanstack/react-router";
import {
  Activity, Boxes, CheckCircle2, Cpu, Factory, Gauge, Leaf,
  PackageCheck, Radio, ShieldCheck, Truck, Warehouse, Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import factoryBackground from "../assets/smart-factory-bg.jpg";

export type PageKey = "overview" | "production" | "equipment" | "energy" | "quality" | "warehouse" | "safety";

const pages: Array<{ key: PageKey; path: string; label: string; sub: string; icon: LucideIcon }> = [
  { key: "overview", path: "/", label: "综合态势感知", sub: "全域总览", icon: Gauge },
  { key: "production", path: "/production", label: "智能生产调度", sub: "产线协同", icon: Factory },
  { key: "equipment", path: "/equipment", label: "设备健康监控", sub: "预测运维", icon: Cpu },
  { key: "energy", path: "/energy", label: "能源碳效管理", sub: "绿色低碳", icon: Zap },
  { key: "quality", path: "/quality", label: "质量追溯分析", sub: "精益品质", icon: CheckCircle2 },
  { key: "warehouse", path: "/warehouse", label: "智慧仓储物流", sub: "全程可视", icon: Warehouse },
  { key: "safety", path: "/safety", label: "安全环保管控", sub: "风险预警", icon: ShieldCheck },
];

const chartColors = ["#24d9ff", "#ffb23f", "#52f7a1", "#a88bff", "#ff627f"];

function Chart({ option, className = "h-64" }: { option: Record<string, unknown>; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let chart: { setOption: (o: Record<string, unknown>) => void; resize: () => void; dispose: () => void } | undefined;
    const mount = async () => {
      const echarts = await import("echarts");
      if (!ref.current || disposed) return;
      chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
      chart.setOption({
        backgroundColor: "transparent",
        color: chartColors,
        textStyle: { color: "#c9eaff", fontFamily: "Rajdhani, sans-serif" },
        tooltip: { trigger: "axis", backgroundColor: "rgba(4,18,35,.94)", borderColor: "#24d9ff", textStyle: { color: "#eafaff" } },
        ...option,
      });
    };
    mount();
    const resize = () => chart?.resize();
    window.addEventListener("resize", resize);
    return () => { disposed = true; window.removeEventListener("resize", resize); chart?.dispose(); };
  }, [option]);
  return <div ref={ref} className={`w-full ${className}`} />;
}

const axis = {
  axisLine: { lineStyle: { color: "rgba(129,208,239,.28)" } },
  axisLabel: { color: "#8fb5c8" }, splitLine: { lineStyle: { color: "rgba(129,208,239,.09)" } },
};

function Panel({ title, tag, children, className = "" }: { title: string; tag?: string; children: React.ReactNode; className?: string }) {
  return <section className={`glass-panel group ${className}`}><div className="panel-head"><div><span className="panel-kicker">{tag ?? "REAL-TIME"}</span><h2>{title}</h2></div><Activity className="panel-icon" /></div>{children}</section>;
}

function Kpi({ label, value, unit, delta, tone = "cyan", icon: Icon = Activity }: { label: string; value: string; unit?: string; delta: string; tone?: string; icon?: LucideIcon }) {
  return <div className={`kpi glass-panel tone-${tone}`}><div className="kpi-top"><span>{label}</span><Icon /></div><div className="kpi-value">{value}<small>{unit}</small></div><div className="kpi-delta"><i />{delta}</div></div>;
}

function Status({ status = "ok", children }: { status?: "ok" | "warn" | "danger"; children: React.ReactNode }) {
  return <span className={`status status-${status}`}><i />{children}</span>;
}

const lineOption = (names = ["计划产量", "实际产量"]) => ({
  legend: { top: 6, right: 8, textStyle: { color: "#a8cfdf" } }, grid: { top: 46, left: 44, right: 18, bottom: 28 },
  xAxis: { type: "category", data: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"], ...axis }, yAxis: { type: "value", ...axis },
  series: names.map((name, i) => ({ name, type: "line", smooth: true, symbolSize: 7, data: i ? [80, 102, 126, 118, 146, 158] : [82, 98, 113, 130, 142, 156], areaStyle: { opacity: i ? .08 : .18 }, lineStyle: { width: 3 } })),
});

const barOption = { grid: { top: 24, left: 44, right: 15, bottom: 28 }, xAxis: { type: "category", data: ["一线", "二线", "三线", "四线", "五线"], ...axis }, yAxis: { type: "value", ...axis }, series: [{ type: "bar", data: [92, 87, 95, 78, 89], barWidth: "46%", itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: "linear", x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: "#087ca7" }, { offset: 1, color: "#43f5ff" }] } } }] };

const radarOption = { radar: { radius: "63%", indicator: ["效率", "质量", "交付", "安全", "能效", "柔性"].map(name => ({ name, max: 100 })), axisName: { color: "#bce8f5" }, splitArea: { areaStyle: { color: ["rgba(10,70,100,.08)", "rgba(10,70,100,.2)"] } }, splitLine: { lineStyle: { color: "rgba(62,219,255,.24)" } } }, series: [{ type: "radar", data: [{ value: [92, 96, 88, 98, 81, 86], name: "本月" }], areaStyle: { opacity: .32 }, lineStyle: { width: 3 } }] };

const pieOption = { legend: { bottom: 0, textStyle: { color: "#a8cfdf" } }, series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "44%"], label: { color: "#d8f5ff", formatter: "{d}%" }, data: [{ value: 48, name: "生产" }, { value: 24, name: "暖通" }, { value: 17, name: "照明" }, { value: 11, name: "其他" }] }] };

function Overview() {
  return <><div className="kpi-grid"><Kpi label="今日综合产量" value="18,642" unit="件" delta="较昨日 +8.6%" icon={Boxes}/><Kpi label="设备综合效率 OEE" value="92.8" unit="%" delta="行业标杆 +4.2%" tone="green" icon={Gauge}/><Kpi label="单位综合能耗" value="0.76" unit="kWh" delta="同比下降 12.4%" tone="amber" icon={Zap}/><Kpi label="安全运行时长" value="386" unit="天" delta="当前无重大风险" tone="violet" icon={ShieldCheck}/></div><div className="overview-grid"><Panel title="全厂生产脉搏" tag="FACTORY PULSE" className="span-2"><Chart option={lineOption()} className="h-72" /></Panel><Panel title="产线效能雷达" tag="CAPABILITY"><Chart option={radarOption} className="h-72" /></Panel><Panel title="实时产线状态" tag="LIVE STATUS"><LineStatus /></Panel><Panel title="产能达成率" tag="OUTPUT"><Chart option={barOption} className="h-60" /></Panel><Panel title="今日能源结构" tag="ENERGY"><Chart option={pieOption} className="h-60" /></Panel></div></>;
}

function LineStatus() { return <div className="status-list">{[["冲压一线","运行",92,"ok"],["焊装二线","运行",87,"ok"],["涂装一线","换型",68,"warn"],["总装三线","待料",34,"danger"]].map(([n,s,p,t])=><div className="status-row" key={String(n)}><div><b>{n}</b><Status status={t as "ok"|"warn"|"danger"}>{s}</Status></div><div className="progress"><span style={{width:`${p}%`}} /></div><strong>{p}%</strong></div>)}</div> }

function Production() {
  return <div className="production-layout"><Panel title="今日生产指挥中心" tag="COMMAND CENTER" className="production-hero"><div className="command-number"><span>当前节拍</span><strong>42.6</strong><small>秒 / 件</small></div><div className="command-track">{["冲压","焊装","涂装","总装","检测","入库"].map((x,i)=><div className="track-node" key={x}><i className={i===3?"active":""}/><span>{x}</span><small>{[98,94,86,91,88,96][i]}%</small></div>)}</div></Panel><div className="kpi-grid compact"><Kpi label="排产订单" value="126" unit="单" delta="完成 83 单"/><Kpi label="在制品" value="3,281" unit="件" delta="周转正常" tone="amber"/><Kpi label="平均节拍" value="42.6" unit="秒" delta="提升 3.8%" tone="green"/></div><div className="split-grid"><Panel title="订单执行趋势"><Chart option={lineOption(["排产", "完工"])} className="h-72"/></Panel><Panel title="班组完成率"><Chart option={barOption} className="h-72"/></Panel></div><Panel title="实时生产工单" tag="MES · LIVE"><DataTable columns={["工单号","产品型号","产线","计划/完成","进度","状态"]} rows={[["MO-260923-018","MX-7 驱动总成","总装三线","1,200 / 986","82.2%","生产中"],["MO-260923-017","Q5 控制器","电子二线","800 / 800","100%","已完成"],["MO-260923-021","A9 电驱壳体","机加一线","650 / 412","63.4%","生产中"],["MO-260923-024","P2 高压模块","电子一线","500 / 128","25.6%","待检验"]]}/></Panel></div>;
}

function Equipment() {
  const gauges = [96,91,88,74];
  return <div className="equipment-layout"><aside className="machine-rail glass-panel"><span className="panel-kicker">ASSET NETWORK</span><h2>设备集群</h2>{["工业机器人","数控中心","检测设备","输送系统","环境设施"].map((x,i)=><div className={`machine-item ${i===0?"selected":""}`} key={x}><Cpu/><div><b>{x}</b><small>{[42,28,16,37,12][i]} 台在线</small></div><Status status={i===2?"warn":"ok"}>{i===2?"2告警":"正常"}</Status></div>)}</aside><main className="machine-main"><div className="gauge-grid">{gauges.map((v,i)=><Panel key={v} title={["机械臂负载","主轴健康度","视觉识别率","刀具寿命"][i]} tag={`UNIT 0${i+1}`}><div className="arc-gauge" style={{"--gauge":`${v*3.6}deg`} as React.CSSProperties}><strong>{v}<small>%</small></strong></div></Panel>)}</div><Panel title="关键设备振动频谱" tag="PREDICTIVE MAINTENANCE"><Chart option={lineOption(["X轴振动","Y轴振动","Z轴振动"])} className="h-72"/></Panel><div className="split-grid"><Panel title="健康度画像"><Chart option={radarOption} className="h-64"/></Panel><Panel title="实时告警队列"><AlertList/></Panel></div></main></div>;
}

function AlertList(){return <div className="alert-list">{[["CNC-12 主轴温度偏高","2分钟前","warn"],["ROBOT-07 伺服扭矩波动","8分钟前","danger"],["AOI-03 镜头需清洁","15分钟前","warn"],["AGV-18 电量低于阈值","22分钟前","warn"]].map(([x,t,s])=><div key={x}><Status status={s as "warn"|"danger"}>{s==="danger"?"紧急":"提醒"}</Status><span>{x}</span><small>{t}</small></div>)}</div>}

function Energy() {
  return <><div className="energy-banner"><div><span>实时总功率</span><strong>3,826.4 <small>kW</small></strong></div><div className="carbon-ring"><Leaf/><b>-18.6%</b><span>碳排同比</span></div><div><span>今日绿电占比</span><strong>36.8 <small>%</small></strong></div></div><div className="energy-grid"><Panel title="24小时负荷曲线" className="span-2"><Chart option={lineOption(["实际负荷","预测负荷"])} className="h-72"/></Panel><Panel title="用能构成"><Chart option={pieOption} className="h-72"/></Panel><Panel title="分车间能效排名"><Chart option={barOption} className="h-64"/></Panel><Panel title="碳排放核算" className="span-2"><div className="carbon-stats">{[["电力间接排放","18.4","tCO₂e"],["天然气直接排放","4.8","tCO₂e"],["光伏减排量","-6.2","tCO₂e"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]} <small>{x[2]}</small></strong><div className="spark"/></div>)}</div></Panel></div></>;
}

function Quality() {
 return <><div className="quality-header"><div><span>FIRST PASS YIELD</span><strong>99.37<small>%</small></strong><p>一次交检合格率 · 较上月提升 0.21%</p></div><div className="quality-seal"><CheckCircle2/><b>质量稳定</b><span>SPC 过程受控</span></div></div><div className="quality-grid"><Panel title="质量能力六维分析"><Chart option={radarOption} className="h-80"/></Panel><Panel title="缺陷帕累托分析" className="span-2"><Chart option={{legend:{top:6,textStyle:{color:"#a8cfdf"}},grid:{top:48,left:48,right:48,bottom:30},xAxis:{type:"category",data:["划伤","尺寸","色差","毛刺","装配","其他"],...axis},yAxis:[{type:"value",...axis},{type:"value",max:100,...axis}],series:[{name:"缺陷数",type:"bar",data:[42,31,22,16,10,7]},{name:"累计占比",type:"line",yAxisIndex:1,data:[33,57,74,87,95,100],smooth:true}]} } className="h-80"/></Panel><Panel title="检测批次追溯" className="span-3"><DataTable columns={["批次号","产品","检测工位","样本数","不良数","判定","检测时间"]} rows={[["QC-0923-A18","MX-7 驱动总成","EOL-03","120","0","合格","10:26:41"],["QC-0923-B07","Q5 控制器","AOI-02","240","2","复检","10:22:16"],["QC-0923-C11","A9 电驱壳体","CMM-01","80","0","合格","10:18:03"],["QC-0923-D04","P2 高压模块","ICT-04","160","1","合格","10:09:48"]]}/></Panel></div></>;
}

function WarehousePage() {
 return <><div className="warehouse-map glass-panel"><div className="map-head"><div><span className="panel-kicker">DIGITAL TWIN · WMS</span><h2>立体仓库实时库位</h2></div><div><Status>AGV 18 台在线</Status><Status status="warn">3 个任务等待</Status></div></div><div className="rack-grid">{Array.from({length:48},(_,i)=><div key={i} className={`rack ${i%11===0?"reserved":i%7===0?"empty":"filled"}`} title={`库位 A-${String(i+1).padStart(2,"0")}`}/>)}</div><div className="warehouse-legend"><span><i className="filled"/>已占用 76%</span><span><i className="empty"/>空闲 18%</span><span><i className="reserved"/>锁定 6%</span></div></div><div className="logistics-grid"><div className="kpi-stack"><Kpi label="库存周转率" value="8.6" unit="次" delta="同比 +12%"/><Kpi label="拣选准确率" value="99.8" unit="%" delta="今日 0 错拣" tone="green"/><Kpi label="待执行任务" value="23" unit="项" delta="紧急 3 项" tone="amber"/></div><Panel title="出入库吞吐趋势"><Chart option={lineOption(["入库","出库"])} className="h-72"/></Panel><Panel title="AGV 调度状态"><div className="agv-list">{["AGV-01","AGV-06","AGV-12","AGV-18"].map((x,i)=><div key={x}><Truck/><b>{x}</b><span>{["配送至 L3","返回充电区","等待取货","配送至 C8"][i]}</span><strong>{[86,24,100,63][i]}%</strong></div>)}</div></Panel></div></>;
}

function Safety() {
 return <div className="safety-layout"><div className="risk-hero"><div className="risk-orbit"><ShieldCheck/><strong>低风险</strong><span>综合安全指数 96.4</span></div><div className="weather-strip">{[["温度","24.6°C"],["湿度","48%RH"],["PM2.5","18μg/m³"],["VOC","0.21mg/m³"],["噪声","62dB"]].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</div></div><div className="safety-grid"><Panel title="区域风险热度"><div className="heat-grid">{[28,42,18,67,36,22,81,44,31,17,52,26].map((v,i)=><div key={i} style={{opacity:.3+v/120}}><span>{["A1","A2","A3","B1","B2","B3","C1","C2","C3","D1","D2","D3"][i]}</span><b>{v}</b></div>)}</div></Panel><Panel title="环保指标趋势" className="span-2"><Chart option={lineOption(["废气指数","废水指数"])} className="h-72"/></Panel><Panel title="今日安全事件" className="span-2"><DataTable columns={["时间","区域","事件","等级","处置状态"]} rows={[["09:42","涂装车间","VOC 浓度短时波动","提示","已恢复"],["08:16","物流通道 C","人员进入 AGV 警戒区","一般","已闭环"],["07:35","动力站","空压机压力偏高","一般","处理中"],["06:58","焊装二线","防护门异常开启","提示","已闭环"]]}/></Panel><Panel title="应急资源状态"><div className="resource-list">{[["消防设施",128,"ok"],["应急物资",96,"ok"],["环境传感器",48,"ok"],["待整改隐患",3,"warn"]].map(([n,v,s])=><div key={String(n)}><Radio/><span>{n}</span><strong>{v}</strong><Status status={s as "ok"|"warn"}>在线</Status></div>)}</div></Panel></div></div>;
}

function DataTable({columns,rows}:{columns:string[];rows:string[][]}){return <div className="table-wrap"><table><thead><tr>{columns.map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j}>{j===row.length-1?<Status status={x.includes("复检")||x.includes("处理中")||x.includes("待")?"warn":"ok"}>{x}</Status>:x}</td>)}</tr>)}</tbody></table></div>}

const pageInfo: Record<PageKey,{eyebrow:string;title:string;desc:string}> = {
 overview:{eyebrow:"SMART FACTORY · COMMAND CENTER",title:"综合态势感知中心",desc:"汇聚生产、设备、质量、能源与物流全域数据，实时洞察工厂运行脉搏"},
 production:{eyebrow:"MES · SCHEDULING",title:"智能生产调度",desc:"订单驱动、产线协同与节拍优化，让每一道工序精准衔接"},
 equipment:{eyebrow:"EQUIPMENT · DIGITAL TWIN",title:"设备健康监控",desc:"覆盖关键设备全生命周期的状态感知与预测性维护"},
 energy:{eyebrow:"ENERGY · CARBON",title:"能源碳效管理",desc:"追踪能源流向，平衡生产负荷，持续降低单位产品碳排"},
 quality:{eyebrow:"QUALITY · TRACEABILITY",title:"质量追溯分析",desc:"从原料到成品的全链路质量洞察与过程能力分析"},
 warehouse:{eyebrow:"WMS · LOGISTICS",title:"智慧仓储物流",desc:"库存、库位、AGV 与配送任务全程透明、高效协同"},
 safety:{eyebrow:"HSE · RISK CONTROL",title:"安全环保管控",desc:"风险分级预警与环境指标在线监测，筑牢安全生产防线"},
};

export function FactoryDashboard({page}:{page:PageKey}) {
 const [clock,setClock]=useState("");
 useEffect(()=>{const tick=()=>setClock(new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date()));tick();const id=window.setInterval(tick,1000);return()=>window.clearInterval(id)},[]);
 const current=pageInfo[page];
 return <div className="factory-shell" style={{"--factory-bg":`url(${factoryBackground})`} as React.CSSProperties}><header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Factory/></span><span><b>擎云智造中枢</b><small>NEXUS SMART FACTORY</small></span></Link><nav aria-label="一级菜单">{pages.map(({key,path,label,sub,icon:Icon})=><Link key={key} to={path} className={`nav-item ${page===key?"active":""}`}><Icon/><span><b>{label}</b><small>{sub}</small></span></Link>)}</nav><div className="system-state"><i/><span><b>{clock}</b><small>全系统在线</small></span></div></header><main className="dashboard"><div className="page-title"><div><span>{current.eyebrow}</span><h1>{current.title}</h1><p>{current.desc}</p></div><div className="live-chip"><Radio/> LIVE DATA <b>2.4s</b></div></div>{page==="overview"?<Overview/>:page==="production"?<Production/>:page==="equipment"?<Equipment/>:page==="energy"?<Energy/>:page==="quality"?<Quality/>:page==="warehouse"?<WarehousePage/>:<Safety/>}</main><footer><span>QY INDUSTRIAL INTELLIGENCE PLATFORM</span><span>数据刷新率 2.4s · 接入设备 2,846 · 数据节点 18,392</span></footer></div>
}