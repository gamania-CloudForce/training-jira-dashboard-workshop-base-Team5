# Acceptance Criteria - Jira 看板資料視覺化儀表板

## 基於痛點分析的 AC 設計

**核心痛點**：團隊成員缺乏對專案進度的整體認知，導致無法掌握自己工作對專案的影響。

**技術限制**：
- 資料來源：Google Sheets rawData 表（23 欄位嚴格限制）
- 後端：.NET Core API，5 分鐘資料快取
- 前端：Next.js，使用 shadcn/ui 和 Recharts

---

## US-001: 專案團隊成員查看任務關聯

**User Story**: 作為專案團隊成員，我希望能在儀表板上清楚看到自己任務與整體專案進度的關聯，以便提升責任感與主動回報進度，減少延遲。

### AC01-1: 個人任務狀態檢視
```gherkin
場景：團隊成員查看個人任務在整體專案中的位置
Given 使用者進入 Jira Dashboard 頁面（/）
And 系統已從 Google Sheets rawData 表載入最新資料
When 使用者查看儀表板的狀態分布圖表
Then 系統應顯示 9 個預定義狀態的分布（Backlog, Evaluated, To Do, In Progress, Waiting, Ready to Verify, Done, Invalid, Routine）
And 每個狀態應顯示對應的 Issue 數量
And 圖表應使用 Recharts 呈現視覺化效果
And 資料應來自 rawData 表欄位 6（Status）的統計
```

### AC01-2: Sprint 篩選功能
```gherkin
場景：團隊成員透過 Sprint 篩選查看特定 Sprint 的進度
Given 使用者位於儀表板頁面
And 系統已載入 GetJiraSprintValues 表的 Sprint 資料
When 使用者點擊 Sprint 篩選下拉選單
Then 系統應顯示所有可用的 Sprint 選項（來自 GetJiraSprintValues 表欄位 C）
And 包含預設的 "All" 選項
When 使用者選擇特定 Sprint
Then 儀表板統計資料應更新為該 Sprint 的資料
And 狀態分布圖表應僅顯示該 Sprint 的 Issue 分布
And 篩選條件應對應 rawData 表欄位 7（Sprint）
```

### AC01-3: 資料即時性顯示
```gherkin
場景：團隊成員確認資料的更新時間
Given 使用者查看儀表板
When 系統載入 Google Sheets 資料
Then 儀表板應顯示 "最後更新時間"
And 更新時間格式應為易讀的相對時間（如：5 分鐘前）
And 如果資料載入失敗，應顯示錯誤提示訊息
And 系統應遵循 5 分鐘快取機制
```

---

## US-002: 專案經理即時監控

**User Story**: 作為專案經理，我希望能即時掌握所有成員的任務狀態與專案進度，以便及早發現問題並協調資源，提升專案準時完成率。

### AC02-1: 專案統計總覽
```gherkin
場景：專案經理查看專案整體統計
Given 專案經理進入儀表板頁面
When 系統載入 Dashboard Stats API（/api/dashboard/stats）
Then 系統應顯示 4 個關鍵指標卡片
And 包含總 Issue 數量（來自 rawData 表統計）
And 包含完成率統計（Done 狀態 vs 總數）
And 包含進行中任務數量（In Progress 狀態統計）
And 包含待處理任務數量（To Do + Backlog 狀態統計）
And 所有統計應基於 rawData 表欄位 6（Status）計算
```

### AC02-2: 專案健康度視覺化
```gherkin
場景：專案經理透過圖表評估專案健康度
Given 專案經理查看狀態分布圖表
When 系統顯示狀態分布資料
Then 圖表應按照工作流程順序排列狀態
And 狀態順序應為：Backlog → Evaluated → To Do → In Progress → Waiting → Ready to Verify → Done
And 每個狀態柱狀圖應顯示數量和百分比
And Done 狀態應使用綠色表示完成
And In Progress 和 Waiting 應使用黃色表示進行中
And Backlog 和 To Do 應使用藍色表示待開始
```

### AC02-3: Google Sheets 原始資料檢視
```gherkin
場景：專案經理需要查看詳細的原始資料
Given 專案經理位於儀表板頁面
When 專案經理點擊導航至 Google Sheets Table 頁面（/google-sheets）
Then 系統應顯示完整的 rawData 表格
And 表格應嚴格按照 23 欄位架構顯示（A-W 欄位）
And 包含分頁功能（預設 100 筆資料）
And 支援按欄位排序功能
And 支援 Sprint 篩選功能
And 響應式設計適配不同螢幕尺寸
```

---

## US-003: 部門主管高層檢視

**User Story**: 作為部門主管，我希望能一目了然專案進度與里程碑達成狀況，以便在需要時提供支援或資源，促進團隊合作與士氣。

### AC03-1: 專案進度概覽
```gherkin
場景：部門主管快速掌握專案整體狀況
Given 部門主管進入儀表板頁面
When 系統載入統計資料
Then 儀表板應在頁面上方顯示關鍵指標卡片
And 總 Issue 數量應清楚顯示專案規模
And 完成率應以百分比和進度條形式呈現
And 如果完成率低於預期，應有視覺提示（如紅色警示）
And 資料應支援按 Sprint 篩選以查看特定迭代進度
```

### AC03-2: 里程碑達成評估
```gherkin
場景：部門主管評估專案里程碑達成狀況
Given 部門主管查看狀態分布圖表
When 系統顯示各狀態的任務分布
Then Done 狀態的比例應清楚突出顯示
And 如果 Done 狀態比例高於 80%，圖表應呈現綠色健康狀態
And 如果 Waiting 狀態任務過多（>20%），應有警示提示
And 部門主管可透過 Sprint 篩選查看各迭代的達成狀況
And 圖表應支援滑鼠懸停顯示詳細數據
```

### AC03-3: 資源配置決策支援
```gherkin
場景：部門主管根據資料做出資源配置決策
Given 部門主管查看完整專案資料
When 系統顯示儀表板和資料表格
Then 部門主管可在儀表板和 Google Sheets Table 間快速切換
And Google Sheets Table 應顯示 Priority 欄位（欄位 9）幫助判斷重要性
And 應顯示 Due date 欄位（欄位 8）識別時程壓力
And 應顯示 Story Points 欄位（欄位 16）評估工作量
And 支援按多個維度排序和篩選
And 資料載入錯誤時應提供明確的錯誤訊息和重試選項
```

---

## 技術實作考量

### 資料存取限制
- 所有統計計算必須基於 rawData 表的 23 欄位架構
- Sprint 篩選必須使用 GetJiraSprintValues 表的 Sprint Name（欄位 C）
- 遵循 5 分鐘快取機制，避免頻繁 API 調用

### 前端技術要求
- 使用 shadcn/ui 元件確保一致的 UI 設計
- 使用 Recharts 實現圖表視覺化
- 響應式設計支援行動裝置存取
- 適當的載入狀態和錯誤處理

### API 整合要求
- 整合 .NET Core API 端點：
  - `/api/dashboard/stats` - 統計資料
  - `/api/dashboard/status-distribution` - 狀態分布
  - `/api/table/sprints` - Sprint 選項
  - `/api/table/data` - 原始資料

---

## 驗收準則優先級

| 優先級 | AC 編號 | 說明 | 對應痛點 |
|-------|---------|------|----------|
| **High** | AC01-1, AC02-1 | 核心儀表板功能 | 缺乏整體認知 |
| **High** | AC01-2, AC02-2 | 視覺化進度呈現 | 無法掌握工作影響 |
| **Medium** | AC02-3, AC03-1 | 原始資料檢視 | 提升積極性 |
| **Medium** | AC01-3, AC03-2 | 資料即時性和警示 | 缺乏緊迫感 |
| **Low** | AC03-3 | 進階篩選和排序 | 資源配置優化 |

這些 AC 確保解決核心痛點，同時符合現有技術架構限制，可直接用於開發和測試驗收。
