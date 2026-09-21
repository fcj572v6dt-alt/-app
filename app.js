const state = JSON.parse(localStorage.getItem("lifevault") || "null") || {
  income: 0, budget: 0, goal: 0, saved: 0, expenses: []
};

const $ = id => document.getElementById(id);
const money = n => "NT$ " + Math.round(Number(n || 0)).toLocaleString("zh-TW");

function save(){ localStorage.setItem("lifevault", JSON.stringify(state)); render(); }

function render(){
  const total = state.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const remaining = Math.max(0, Number(state.budget)-total);
  const days = new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const today = new Date().getDate();
  const leftDays = Math.max(1,days-today+1);
  const daily = remaining/leftDays;

  $("remaining").textContent = money(remaining);
  $("expenseTotal").textContent = money(total);
  $("dailyBudget").textContent = money(daily);
  $("incomeInput").value = state.income || "";
  $("budgetInput").value = state.budget || "";
  $("goalInput").value = state.goal || "";

  const list = $("expenseList");
  if(!state.expenses.length){
    list.innerHTML = '<p style="color:#9ca3af">目前還沒有支出紀錄。</p>';
  }else{
    list.innerHTML = state.expenses.slice().reverse().map(e => `
      <div class="expense">
        <div class="expense-main">
          <div class="expense-icon">💳</div>
          <div><div class="expense-note">${escapeHtml(e.note || e.category)}</div>
          <div class="expense-meta">${escapeHtml(e.category)} · ${e.date}</div></div>
        </div>
        <div><span class="expense-amount">-${money(e.amount)}</span>
        <button class="delete" onclick="removeExpense('${e.id}')">刪除</button></div>
      </div>`).join("");
  }

  const goal = Number(state.goal || 0);
  const saved = Number(state.saved || 0);
  const pct = goal ? Math.min(100, saved/goal*100) : 0;
  $("goalProgress").style.width = pct + "%";
  $("goalProgressText").textContent = Math.round(pct) + "%";
  $("goalText").textContent = goal
    ? `目前已存 ${money(saved)}，目標 ${money(goal)}，還差 ${money(Math.max(0,goal-saved))}。`
    : "設定目標後，Lifevault 會幫你追蹤進度。";

  $("remainingHint").textContent = state.budget
    ? `月預算 ${money(state.budget)}`
    : "設定月預算後開始使用";
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function removeExpense(id){
  state.expenses = state.expenses.filter(e=>e.id!==id);
  save(); toast("已刪除支出");
}

$("savePlan").onclick = () => {
  state.income = Number($("incomeInput").value)||0;
  state.budget = Number($("budgetInput").value)||0;
  state.goal = Number($("goalInput").value)||0;
  save(); toast("計畫已儲存");
};

$("addExpense").onclick = () => {
  const amount = Number($("expenseAmount").value);
  if(!amount || amount<=0){ toast("請輸入有效金額"); return; }
  state.expenses.push({
    id: Date.now().toString(),
    amount,
    category: $("expenseCategory").value,
    note: $("expenseNote").value.trim(),
    date: new Date().toLocaleDateString("zh-TW")
  });
  $("expenseAmount").value="";
  $("expenseNote").value="";
  save(); toast("支出已新增");
};

$("aiButton").onclick = () => {
  const total = state.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const remaining = Number(state.budget)-total;
  let advice = "";
  if(!state.budget) advice = "先設定本月預算，我才能估算你每天可以使用多少錢。";
  else if(remaining < 0) advice = `目前已超出預算 ${money(Math.abs(remaining))}。接下來可以先暫停非必要支出。`;
  else if(remaining < state.budget*0.2) advice = `目前剩餘 ${money(remaining)}，已接近本月預算下限，接下來可以優先控制飲食、娛樂與購物支出。`;
  else advice = `目前還有 ${money(remaining)} 預算。若維持目前支出速度，可以繼續觀察每日平均花費。`;
  $("aiAdvice").textContent = advice;
};

function toast(msg){
  const t=$("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1800);
}

function upgrade(){
  toast("Pro 付款功能尚未串接。下一步可接 Stripe / 綠界。");
}
$("upgradeButton").onclick=upgrade;
$("annualButton").onclick=upgrade;
$("upgradeTop").onclick=upgrade;

render();
