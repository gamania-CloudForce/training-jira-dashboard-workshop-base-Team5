# Acceptance Criteria (Advanced) - US-102 / US-103 / US-104

說明：以下 Acceptance Criteria 依據 `docs/tech-overview.md` 與 `docs/table-schema.md` 的技術與資料限制（Google Sheets A:W、只讀、5 分鐘快取、後端 API）撰寫，使用 Gherkin（Given-When-Then）並以商業語言呈現。

---

## US-102：團隊進度與每人貢獻分布卡片
User Story: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡（列出每人 Open / In Progress / Done 數量與 Story Points），以便快速判斷資源分布與瓶頸。

AC-102-1: 顯示每人成果卡（正常流程）
Given 儀表板已載入且成功取得選定 Sprint 的資料
When 使用者切換到「每人成果卡片」檢視
Then 系統應為每個已知成員顯示 Open、In Progress、Done 的數量與總 Story Points
And 每張卡片需顯示資料來源的最後更新時間與所選 Sprint 名稱

AC-102-2: 處理未指派任務（邊界條件）
Given 資料中有任務沒有指派人（assignee 欄位缺值）
When 使用者在「每人成果卡片」檢視套用 Sprint 篩選
Then 系統應產生一張「未指派」卡片並將所有未指派任務聚合於該卡片
And 顯示未指派任務數量與累積 Story Points，並提示資料不完整可能影響人力判斷

AC-102-3: 後端或 API 異常（錯誤處理）
Given 系統在向後端 API 取得匯總資料時發生錯誤或超時
When 使用者嘗試重新載入或切換檢視
Then 前端應顯示友善錯誤訊息（例如「無法取得成員資料，請稍後重試」）
And 若有先前成功的快取資料，應仍顯示該快取視圖並標示為「快取資料」與最後成功時間

---

## US-103：可視化狀態分佈條形圖（Team-level）
User Story: 作為團隊成員，我希望看到一個狀態分佈圖顯示各狀態的 Issue 佔比，以便了解目前團隊工作在哪些階段停留較久。

AC-103-1: 顯示固定狀態的分布（正常流程）
Given 儀表板已載入並取得當前或指定 Sprint 的 rawData
When 使用者檢視狀態分佈圖並選擇 Sprint（或 All）
Then 圖表應顯示預定的 9 個狀態（依 table-schema 定義）的數量與百分比
And 圖例或下方清單需顯示每個狀態的數字明細，並允許使用者點擊某狀態以過濾明細表格

AC-103-2: 狀態數值為 0 或集中於單一狀態（邊界條件）
Given 選定 Sprint 的任務在少數狀態上大量集中，或某些狀態數值為 0
When 使用者檢視狀態分佈圖
Then 圖表仍應顯示所有 9 個狀態（數值為 0 的以淡色或空欄顯示）
And 系統應以視覺提示標示占比最高的狀態並提供解讀建議（例如「可能為瓶頸」）

AC-103-3: 資料包含未知或不一致的狀態（錯誤處理）
Given 後端或 sheet 回傳的狀態欄位含非預期值（拼字錯誤或自訂狀態）
When 使用者載入狀態分佈圖
Then 系統應將這些非預期值聚合到「其他 / Unknown」類別並在圖例標示
And 系統應顯示簡短提示，建議資料擁有者標準化狀態欄位以提升品質

---

## US-104：Sprint 健康儀表（Completion Rate + Health）
User Story: 作為產品經理，我希望在每個 Sprint 的卡片看到 Completion Rate、HealthStatus 與理想/實際燃盡摘要，以便判斷 Sprint 是否需要調整範圍或支援。

AC-104-1: 顯示 Sprint 健康指標（正常流程）
Given 使用者選擇一個 active 或 closed 的 Sprint 並開啟該 Sprint 卡片
When 系統成功取得 Sprint 的 summary 與 burndown 資料
Then 卡片應顯示 Completion Rate（百分比）、HealthStatus（如：良好 / 警示 / 危險）及小型理想/實際燃盡圖
And 卡片應提供一行短建議（例如「完成率偏低，建議檢視未完成項目」）以支持決策

AC-104-2: 無 Story Points 可量化（邊界條件）
Given 選定 Sprint 中所有任務的 Story Points 欄位皆為空或為 0
When 使用者打開該 Sprint 的健康卡片
Then 系統應顯示訊息「無可量化工作（無 Story Points）」，且不顯示燃盡圖以避免誤導
And 提供替代指標（例如：完成任務數 / 總任務數）作為臨時參考

AC-104-3: 燃盡資料不完整或計算錯誤（錯誤處理）
Given 後端回傳的燃盡資料缺少必要欄位或計算失敗
When 使用者檢視 Sprint 卡片
Then 系統應顯示可用指標（例如 Completion Rate 與 HealthStatus），並以顯著方式提示「燃盡圖暫不可用」
And 提供「重新取得資料」按鈕與說明，並記錄錯誤以便工程團隊追蹤

---

註記：以上 AC 已考量技術限制（read-only Google Sheets A:W、5 分鐘快取、API 端點限制），若要落地執行，建議與資料擁有者確認是否需要補上 assignee 欄或統一狀態名稱以提升準確度。
