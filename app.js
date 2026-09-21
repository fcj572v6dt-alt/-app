const KEY="lifevault_v2";
const defaultState={income:0,budget:0,expenses:[],goals:[{id:"g1",name:"我的第一個目標",target:30000,saved:0}]};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;
let selectedCategory="飲食";

const $=id=>document.getElementById(id);
const money=n=>"NT$ "+Math.round(Number(n||0)).toLocaleString("zh-TW");
const categories=["飲食","交通","購物","娛樂","生活","其他"];
const icons={飲食:"🍜",交通:"🚗",購物:"🛍️",娛樂:"🎮",生活:"🏠",其他:"📦"};

function persist(){localStorage.setItem(KEY,JSON.stringify(state));render();}

function monthData(){
  const total=state.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const days=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const today=new Date().getDate();
  const left=Math.max(1,days-today+1);
  const remaining=Number(state.budget)-total;
  return {total,days,left,remaining,daily:Math.max(0,remaining/left)};
}

function render(){
  const d=monthData();
  const pct=state.budget?Math.min(100,d.total/state.budget*100):0;
  $("todayText").textContent=new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric"});
  $("remainingBig").textContent=money(Math.max(0,d.remaining));
  $("daysLeftText").textContent=state.budget?`距離月底還有 ${d.left} 天`:"設定本月預算後開始追蹤";
  $("budgetProgress").style.width=pct+"%";
  $("spentText").textContent="已支出 "+money(d.total);
  $("budgetText").textContent="預算 "+money(state.budget);
  $("dailyBudget").textContent=money(d.daily);
  $("expensePageTotal").textContent=money(d.total);
  $("expenseCount").textContent=state.expenses.length;
  renderChart();
  renderGoals();
  renderExpenses();
  renderAdvice();
}

function renderChart(){
  const totals=Object.fromEntries(categories.map(c=>[c,0]));
  state.expenses.forEach(e=>totals[e.category]=(totals[e.category]||0)+Number(e.amount));
  const max=Math.max(1,...Object.values(totals));
  $("categoryChart").innerHTML=categories.map(c=>`<div class="bar" title="${c} ${money(totals[c])}" style="height:${Math.max(5,totals[c]/max*100)}%"></div>`).join("");
  $("categoryLegend").innerHTML=categories.filter(c=>totals[c]>0).map(c=>`<span>${icons[c]} ${c} <b>${money(totals[c])}</b></span>`).join("")||'<span>還沒有支出資料</span>';
}

function goalHTML(g){
  const pct=Math.min(100,g.target?g.saved/g.target*100:0);
  return `<div class="goal-card">
    <div class="goal-top"><div><div class="goal-name">${escapeHTML(g.name)}</div><div class="goal-money">${money(g.saved)} / ${money(g.target)}</div></div><div class="goal-percent">${Math.round(pct)}%</div></div>
    <div class="goal-progress"><div style="width:${pct}%"></div></div>
  </div>`;
}
function renderGoals(){
  $("goalList").innerHTML=state.goals.map(goalHTML).join("")+`<button class="primary-btn full" id="addGoalBtn">＋ 新增目標</button>`;
  $("homeGoals").innerHTML=state.goals.slice(0,2).map(goalHTML).join("");
  $("addGoalBtn").onclick=addGoal;
}
function addGoal(){
  const name=prompt("目標名稱，例如：日本旅行");
  if(!name)return;
  const target=Number(prompt("目標金額？","30000"));
  if(!target)return;
  state.goals.push({id:Date.now().toString(),name,target,saved:0});persist();toast("目標已建立");
}
function renderExpenses(){
  if(!state.expenses.length){$("expenseList").innerHTML='<div class="empty">還沒有支出。點下方 ＋ 開始記第一筆。</div>';return}
  $("expenseList").innerHTML=state.expenses.slice().reverse().map(e=>`<div class="expense">
    <div class="expense-left"><div class="expense-icon">${icons[e.category]||"📦"}</div><div><div class="expense-note">${escapeHTML(e.note||e.category)}</div><div class="expense-meta">${escapeHTML(e.category)} · ${e.date}</div></div></div>
    <div class="expense-right"><div class="expense-amount">-${money(e.amount)}</div><button class="delete" onclick="removeExpense('${e.id}')">刪除</button></div>
  </div>`).join("");
}
function removeExpense(id){state.expenses=state.expenses.filter(e=>e.id!==id);persist();toast("已刪除");}

function adviceText(){
  const d=monthData();
  if(!state.budget)return "先設定你的月預算。Lifevault 才能幫你計算每天可以花多少。";
  if(d.remaining<0)return `你目前已超出本月預算 ${money(Math.abs(d.remaining))}。接下來可以先減少非必要支出。`;
  const food=state.expenses.filter(e=>e.category==="飲食").reduce((s,e)=>s+Number(e.amount),0);
  if(food>d.total*.45 && d.total>0)return `目前飲食約占支出的 ${Math.round(food/d.total*100)}%。如果這是你主要的超支來源，可以先從外食頻率開始調整。`;
  return `目前還有 ${money(d.remaining)} 可用，平均每天約 ${money(d.daily)}。維持目前節奏，先把每日花費控制在這個數字附近。`;
}
function renderAdvice(){
  const text=adviceText();
  $("homeAdvice").textContent=text;
  $("adviceList").innerHTML=`<div class="advice"><strong>今日總覽</strong>${text}</div>
  <div class="advice"><strong>消費速度</strong>${state.budget?`目前已使用本月預算的 ${Math.round(monthData().total/state.budget*100)}%。`:"尚未設定預算。"}</div>`;
}

function showPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+name));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

function openModal(id){$(id).classList.remove("hidden")}
function closeModal(id){$(id).classList.add("hidden")}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$("addBtn").onclick=()=>{openModal("expenseModal");setTimeout(()=>$("amountInput").focus(),100)};
document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{
  selectedCategory=b.dataset.cat;
  document.querySelectorAll(".cat").forEach(x=>x.classList.toggle("active",x===b));
});
$("saveExpense").onclick=()=>{
  const amount=Number($("amountInput").value);
  if(!amount||amount<=0){toast("請輸入金額");return}
  state.expenses.push({id:Date.now().toString(),amount,category:selectedCategory,note:$("noteInput").value.trim(),date:new Date().toLocaleDateString("zh-TW")});
  $("amountInput").value="";$("noteInput").value="";closeModal("expenseModal");persist();toast("支出已新增");
};
$("openPlan").onclick=()=>{
  $("incomeInput").value=state.income||"";$("budgetInput").value=state.budget||"";openModal("planModal");
};
$("savePlan").onclick=()=>{
  state.income=Number($("incomeInput").value)||0;state.budget=Number($("budgetInput").value)||0;closeModal("planModal");persist();toast("預算已更新");
};
$("upgradeBtn").onclick=()=>toast("Pro 付款功能將在正式版串接");
$("notificationBtn").onclick=()=>toast("目前沒有新的提醒");
$("askAI").onclick=()=>{
  const q=$("questionInput").value.trim();
  if(!q){$("aiAnswer").textContent=adviceText();return}
  const d=monthData();
  $("aiAnswer").textContent=q.includes("花太多")?adviceText():
    `根據目前資料：本月支出 ${money(d.total)}，剩餘 ${money(Math.max(0,d.remaining))}，每日建議約 ${money(d.daily)}。正式版會讓 AI 直接分析你的完整歷史資料。`;
};
$("exportData").onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="lifevault-data.json";a.click();URL.revokeObjectURL(a.href);
};
$("resetData").onclick=()=>{
  if(confirm("確定要刪除所有 Lifevault 資料嗎？")){state=JSON.parse(JSON.stringify(defaultState));persist();toast("資料已重設")}
};

function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

render();
