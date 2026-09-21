# Lifevault

AI 人生財務管家 MVP。

## 目前功能

- 月收入 / 月預算 / 儲蓄目標
- 支出紀錄
- 本月剩餘預算
- 每日可用預算估算
- 儲蓄目標進度
- 基礎 AI 財務建議
- Free / Pro / Annual 訂閱頁面
- 使用 localStorage 保存資料

## 部署到 GitHub Pages

1. 建立 GitHub repository，例如 `Lifevault`
2. 把 `index.html`、`style.css`、`app.js`、`README.md` 上傳到 repository 根目錄
3. Repository → Settings → Pages
4. Source 選 `Deploy from a branch`
5. Branch 選 `main`，資料夾選 `/ (root)`
6. Save
7. 等待 GitHub Pages 建立網站

## 重要

目前 Pro 按鈕只是 UI，尚未真的收費。

真正上線收訂閱，需要：

- 使用者登入
- 後端
- 資料庫
- 付款服務（例如 Stripe、綠界等）
- Webhook
- 訂閱狀態驗證

不要把付款 API Secret、資料庫密碼或任何私密金鑰放進 GitHub 前端程式。

## 下一階段

建議依序加入：

1. Google / Email 登入
2. 雲端資料同步
3. 真正的 AI API
4. Stripe / 綠界訂閱
5. Pro 權限驗證
6. PWA / 手機 App
