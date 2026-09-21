# Lifevault V2

Lifevault 是一個「AI 財務生活管家」MVP。

## V2 已包含

- 手機優先 Dashboard
- 固定底部導覽
- 本月剩餘預算
- 每日建議可用金額
- 支出分類與統計
- 儲蓄目標
- AI 財務分析介面
- 收入／預算設定
- JSON 資料匯出
- localStorage 儲存
- Free / Pro 產品入口

## GitHub Pages

1. 把 `index.html`、`style.css`、`app.js`、`README.md` 上傳到 repository 根目錄。
2. GitHub → Settings → Pages
3. Source 選 `Deploy from a branch`
4. Branch 選 `main`
5. Folder 選 `/ (root)`
6. Save
7. 等待 Pages 部署。

## 注意

這個版本是前端 MVP：

- 還沒有真正的會員登入
- 還沒有雲端資料庫
- AI 目前是本地規則示範，不會呼叫真正 AI API
- Pro 按鈕尚未串接付款
- 不要把任何 API Secret 放進前端或 GitHub

## 下一階段

正式商業版建議：

1. Supabase / Firebase 登入與資料庫
2. 後端 API
3. OpenAI API
4. Stripe / 綠界訂閱
5. Webhook 驗證訂閱狀態
6. Pro 權限控制
7. PWA / App 打包
