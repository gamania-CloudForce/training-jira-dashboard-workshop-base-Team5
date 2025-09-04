---
title: "US-103 - 可視化狀態分佈條形圖（Team-level） - Implementation & UI details"
team: Team 5
created-by: copilot
---

# US-103：可視化狀態分佈條形圖（Team-level）

User Story: 作為團隊成員，我希望看到一個狀態分佈圖顯示各狀態的 Issue 佔比，以便了解目前團隊工作在哪些階段停留較久。

圖片參考：`docs/mvp-v1/practice/team-5/US-103-wireframe.png`

---

## Acceptance Criteria (Gherkin)

### AC-103-1: 顯示固定狀態的分布（正常流程）
Given 儀表板已載入並取得當前或指定 Sprint 的 rawData
When 使用者檢視狀態分佈圖並選擇 Sprint（或 All）
Then 圖表應顯示預定的 9 個狀態（依 table-schema 定義）的數量與百分比
And 圖例或下方清單需顯示每個狀態的數字明細，並允許使用者點擊某狀態以過濾明細表格

UI / UX 實作細節（滿足 AC-103-1 - 正常流程）:
① 標題與過濾器 (Title & Filter): 元件具備清晰的標題「任務狀態分佈」，並在右上角提供 Sprint 過濾器，讓使用者可以選擇特定 Sprint 或查看全部。

② 狀態分佈條形圖 (Bar Chart):

以水平條形圖呈現，清晰地展示了所有預設狀態（例如：「待辦」、「進行中」、「審核中」等）的任務分佈。

每個長條旁邊都直接標示了任務數量與佔比 (%)，讓使用者可以快速讀取數據。

③ 互動式圖例清單 (Interactive Legend):

圖表下方提供了一個詳細的圖例清單，列出了每個狀態的顏色、名稱、精確數量與百分比。

清單被設計為可點擊的（以藍色文字暗示），點擊後可觸發頁面上其他元件（如下方的明細表格）的資料過濾，完全符合 AC 要求。

建議（方向性 / 驗證方向）：
- 驗證：數量總和應等於總件數；百分比為 count/total 的表示（精度可為小數點 1 位）。
- 狀態清單依 `docs/table-schema.md` 為準；Unknown 或其他值聚合為 "Other"。

---

### AC-103-2: 狀態數值為 0 或集中於單一狀態（邊界條件）
Given 選定 Sprint 的任務在少數狀態上大量集中，或某些狀態數值為 0
When 使用者檢視狀態分佈圖
Then 圖表仍應顯示所有 9 個狀態（數值為 0 的以淡色或空欄顯示）
And 系統應以視覺提示標示占比最高的狀態並提供解讀建議（例如「可能為瓶頸」）

UI / UX 實作細節（滿足 AC-103-2 - 邊界條件）:
④ 瓶頸狀態視覺提示 (Bottleneck Highlight):

「審核中」狀態的任務佔比最高，因此系統自動為其加上了高亮外框與警示圖示 (❗)，明確標示出潛在瓶頸。

當滑鼠懸停在此長條或圖示上時，可顯示如「可能為瓶頸」的解讀建議文字。

⑤ 零數值狀態的呈現 (Zero-Value State):

「已封存」狀態的任務數為 0，其長條以淡灰色或僅顯示輪廓線的方式呈現，既保留了狀態的完整性，又不會在視覺上造成干擾。

建議（方向性 / 驗證方向）：
- 驗證重點為「所有預期狀態均可見」與「最高占比狀態有視覺提示」。

---

### AC-103-3: 資料包含未知或不一致的狀態（錯誤處理）
Given 後端或 sheet 回傳的狀態欄位含非預期值（拼字錯誤或自訂狀態）
When 使用者載入狀態分佈圖
Then 系統應將這些非預期值聚合到「其他 / Unknown」類別並在圖例標示
And 系統應顯示簡短提示，建議資料擁有者標準化狀態欄位以提升品質

UI / UX 實作細節（滿足 AC-103-3 - 錯誤處理）:
⑥ "其他 / Unknown" 類別聚合 (Aggregation of "Other"):

所有無法對應到預設狀態的任務，都被自動聚合到「其他」這個類別中，並以中性的灰色顯示，確保數據不遺漏且圖表結構穩定。

⑦ 資料品質提示 (Data Quality Tip):

在元件標題旁邊放置了一個資訊圖示 (ⓘ)。當使用者遇到「其他」類別的數據或對圖表有疑問時，可以懸停或點擊此圖示，系統會彈出提示訊息，如：
"部分任務狀態無法識別，建議資料擁有者標準化 Jira 狀態欄位以提升數據品質。"

建議（方向性 / 驗證方向）：
- 驗證可確認 Unknown 類別存在且其項目數量等於非預期值的匯總；提示文字可為範例，最終以產品決定。

---


圖片參考：docs/mvp-v1/practice/team-5/US-103-wireframe.png
若圖片與文字描述衝突請以文字描述為主。

## Implementation Notes
- Data source: read-only Google Sheets (A:W), backend provides aggregated endpoints with 5-minute cache. Use backend endpoints where possible (e.g., `/api/dashboard/status-distribution`).
- UI should request data by Sprint (or All) and compute counts / percentages client-side from backend payloads. Keep display precision consistent with other dashboard widgets.
- Accessibility: tooltip texts and interactive legend items must be keyboard-focusable and have ARIA labels.

---

最後更新：自動生成 by copilot
