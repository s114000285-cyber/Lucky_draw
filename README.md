# 抽籤分組小幫手 (ZenHR Lucky Draw)

這是一個基於 React + Vite 開發的現代化活動助手工具，具備 AI 智能命名與座右銘生成功能。

## 🌟 主要功能

- **名單登錄**：支援手動輸入或 CSV 批量匯入人員名單。
- **幸運抽籤**：具備動態滾動效果的抽籤功能，支援重複抽取與紀錄追蹤。
- **智能分組**：整合 Google Gemini API，為分組自動生成富有創意的隊名與座右銘。
- **數據導出**：支援將名單或分組結果導出為 CSV 檔案。

## 🚀 快速開始

### 前置作業
- 確保電腦已安裝 [Node.js](https://nodejs.org/) (建議版本 18+)。

### 安裝步步
1. **複製專案**
   ```bash
   git clone <repository-url>
   cd Lucky_draw
   ```

2. **安裝套件**
   ```bash
   npm install
   ```

3. **設定環境變數**
   在根目錄下建立 `.env` 檔案，並填入你的 API Key：
   ```env
   GEMINI_API_KEY=你的_GOOGLE_AI_STUDIO_API_KEY
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   開啟瀏覽器訪問 `http://localhost:3000`。

## 🛠️ 常用指令

- `npm run dev`：啟動開發模式
- `npm run build`：建立生產版本
- `npm run lint`：檢查代碼規範與編譯
- `npm run preview`：預覽生產版本

## 📦 部署說明

專案已內建 **GitHub Actions** 自動化部署流程：
1. 將程式碼推送到 GitHub 的 `main` 分支。
2. 前往 GitHub Repo 的 **Settings > Secrets and variables > Actions**。
3. 新增一個 Repository Secret，名稱為 `GEMINI_API_KEY`，值為你的 API Key。
4. 部署完成後，可於 GitHub Pages 查看成果。

---
© 2026 ZenHR Solutions. All Rights Reserved.
