# Test Cases: AC-102-1 至 AC-102-3 團隊進度與每人貢獻分布卡片

> **檔案編號**: TC-102-team-contribution-cards  
> **建立日期**: 2025-09-04  
> **最後更新**: 2025-09-04  
> **狀態**: 規劃中  
> **對應 User Story**: [US-102](../ac-copilot-adv.md#us-102團隊進度與每人貢獻分布卡片)  
> **對應 AC**: AC-102-1, AC-102-2, AC-102-3

## 📋 測試範圍

本文件涵蓋以下 Acceptance Criteria 的測試案例：
- **AC-102-1**: 顯示每人成果卡（正常流程）
- **AC-102-2**: 處理未指派任務（邊界條件）
- **AC-102-3**: 後端或 API 異常（錯誤處理）

---

## 🧪 測試案例集合

### TC-102-01: 正常顯示每人成果卡

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-01 |
| **測試目標** | 驗證每位成員的進度卡正常顯示功能，包含 Open、In Progress、Done 數量與 Story Points |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-1: 顯示每人成果卡（正常流程） |
| **測試前置條件** | 1. Sprint "Sprint 3" 已在 Google Sheets 中建立<br>2. 至少有 3 位成員（Alice、Bob、Charlie）分配了任務<br>3. 每位成員都有不同狀態的任務（Open、In Progress、Done）<br>4. 所有任務都有 Story Points 數值<br>5. 使用者已登入系統並有儀表板存取權限 |
| **測試步驟** | 1. 開啟瀏覽器，導向儀表板頁面<br>2. 選擇 Sprint "Sprint 3"<br>3. 切換到「每人成果卡片」檢視<br>4. 等待資料載入完成<br>5. 檢查每位成員的卡片顯示<br>6. 驗證資料來源時間戳記<br>7. 檢查 Sprint 名稱顯示 |
| **預期結果** | 1. 顯示 3 張成員卡片（Alice、Bob、Charlie）<br>2. Alice 卡片顯示：Open: 2 (3 SP), In Progress: 1 (5 SP), Done: 3 (8 SP)<br>3. Bob 卡片顯示：Open: 1 (2 SP), In Progress: 2 (7 SP), Done: 2 (5 SP)<br>4. Charlie 卡片顯示：Open: 3 (6 SP), In Progress: 1 (3 SP), Done: 1 (2 SP)<br>5. 每張卡片顯示最後更新時間<br>6. 每張卡片顯示 "Sprint 3" 標識<br>7. 數量統計與後端 API 回傳資料一致 |
| **測試資料** | Sprint: Sprint 3<br>成員: Alice, Bob, Charlie<br>Alice 總任務: 6 個, 16 SP<br>Bob 總任務: 5 個, 14 SP<br>Charlie 總任務: 5 個, 11 SP |
| **測試類型** | 功能測試（正常流程） |
| **自動化程度** | 全自動（適合 E2E 測試） |

---

### TC-102-02: 顯示每人成果卡的資料驗證

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-02 |
| **測試目標** | 驗證成員卡片數據計算的準確性和一致性 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-1: 顯示每人成果卡（正常流程） |
| **測試前置條件** | 1. Sprint 資料已載入<br>2. 已知成員及其任務分配<br>3. 可以比對後端 API 原始數據 |
| **測試步驟** | 1. 取得後端 API 原始資料作為基準<br>2. 開啟每人成果卡片檢視<br>3. 逐一比對每位成員的數量統計<br>4. 驗證 Story Points 加總<br>5. 檢查狀態分類邏輯<br>6. 驗證總計數字 |
| **預期結果** | 1. 每位成員的 Open 任務數 = 後端 API 中該成員狀態為 "To Do"/"Backlog" 的任務數<br>2. 每位成員的 In Progress 任務數 = 後端 API 中狀態為 "In Progress"/"Waiting" 的任務數<br>3. 每位成員的 Done 任務數 = 後端 API 中狀態為 "Done"/"Resolved" 的任務數<br>4. Story Points 加總與原始資料完全一致<br>5. 所有成員卡片的總和 = Sprint 總統計數字 |
| **測試資料** | 基於實際 Google Sheets rawData<br>狀態映射規則需要明確定義 |
| **測試類型** | 資料完整性測試 |
| **自動化程度** | 全自動（API 比對測試） |

---

### TC-102-03: 處理未指派任務的邊界情況

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-03 |
| **測試目標** | 驗證系統正確處理無 assignee 的任務，生成未指派卡片 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-2: 處理未指派任務（邊界條件） |
| **測試前置條件** | 1. Sprint 資料中包含有 assignee 的任務<br>2. Sprint 資料中包含 assignee 欄位為空或 null 的任務<br>3. 未指派任務有不同的狀態和 Story Points<br>4. 使用者已登入系統 |
| **測試步驟** | 1. 開啟每人成果卡片檢視<br>2. 選擇包含未指派任務的 Sprint<br>3. 等待資料載入完成<br>4. 尋找「未指派」卡片<br>5. 檢查未指派卡片的統計數據<br>6. 驗證警告提示訊息<br>7. 比對未指派任務總數 |
| **預期結果** | 1. 顯示一張標題為「未指派」的特殊卡片<br>2. 未指派卡片顯示：Open: 3 (5 SP), In Progress: 2 (3 SP), Done: 1 (2 SP)<br>3. 卡片總計：6 個任務，10 SP<br>4. 顯示警告圖示和提示文字：「資料不完整可能影響人力判斷」<br>5. 未指派卡片數字 = 後端中所有無 assignee 的任務統計<br>6. 未指派卡片以不同顏色或樣式標示（如橘色邊框） |
| **測試資料** | Sprint: Sprint 2<br>未指派任務: 6 個<br>Open: 3 個 (5 SP)<br>In Progress: 2 個 (3 SP)<br>Done: 1 個 (2 SP) |
| **測試類型** | 邊界條件測試 |
| **自動化程度** | 半自動（需要視覺驗證警告樣式） |

---

### TC-102-04: 全部任務都未指派的極端情況

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-04 |
| **測試目標** | 驗證當 Sprint 中所有任務都沒有指派人時的系統行為 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-2: 處理未指派任務（邊界條件） |
| **測試前置條件** | 1. Sprint 中所有任務的 assignee 欄位都為空<br>2. Sprint 中有不同狀態的任務<br>3. 使用者已登入系統 |
| **測試步驟** | 1. 選擇全部任務都未指派的 Sprint<br>2. 切換到每人成果卡片檢視<br>3. 觀察卡片顯示狀況<br>4. 檢查是否有額外的提示訊息 |
| **預期結果** | 1. 只顯示一張「未指派」卡片<br>2. 卡片包含所有 Sprint 任務的統計<br>3. 顯示明顯的警告提示：「此 Sprint 所有任務均未指派，請檢查資料完整性」<br>4. 提供建議操作：「建議聯繫 Scrum Master 或資料管理員」 |
| **測試資料** | Sprint: Sprint Empty<br>所有任務: assignee = null 或 空字串 |
| **測試類型** | 極端情況測試 |
| **自動化程度** | 半自動 |

---

### TC-102-05: API 異常時的錯誤處理

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-05 |
| **測試目標** | 驗證後端 API 異常時的友善錯誤處理和快取資料回退 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-3: 後端或 API 異常（錯誤處理） |
| **測試前置條件** | 1. 系統先前已成功載入過成員卡片資料<br>2. 瀏覽器中有快取的資料<br>3. 可以模擬 API 錯誤（網路中斷、伺服器錯誤等） |
| **測試步驟** | 1. 正常載入每人成果卡片檢視<br>2. 記錄成功載入的資料狀態<br>3. 模擬 API 異常（如斷網或後端錯誤）<br>4. 嘗試重新載入或切換檢視<br>5. 觀察錯誤處理行為<br>6. 檢查快取資料回退 |
| **預期結果** | 1. 顯示友善的錯誤訊息：「無法取得成員資料，請稍後重試」<br>2. 如果有快取資料，顯示先前成功的卡片檢視<br>3. 快取資料明確標示為「快取資料」<br>4. 顯示最後成功更新時間：「資料更新時間：2025-09-04 14:30」<br>5. 提供「重新載入」按鈕<br>6. 錯誤狀態下卡片以淡化或灰階顯示 |
| **測試資料** | 先前成功載入的任何 Sprint 資料<br>模擬 API 錯誤：500, timeout, network error |
| **測試類型** | 錯誤處理測試 |
| **自動化程度** | 半自動（需要模擬網路異常） |

---

### TC-102-06: API 超時時的快取策略驗證

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-06 |
| **測試目標** | 驗證 API 請求超時時的快取回退機制和用戶體驗 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-3: 後端或 API 異常（錯誤處理） |
| **測試前置條件** | 1. 5分鐘快取機制正常運作<br>2. 先前已成功載入資料<br>3. 可以模擬 API 超時情況 |
| **測試步驟** | 1. 正常載入成員卡片，記錄時間戳記<br>2. 等待 2-3 分鐘（在快取有效期內）<br>3. 模擬 API 超時（延遲回應 >30秒）<br>4. 刷新頁面或重新載入<br>5. 觀察載入行為和顯示內容<br>6. 檢查快取標示和更新時間 |
| **預期結果** | 1. 在快取有效期內，立即顯示快取的成員卡片<br>2. 顯示快取指示器和原始載入時間<br>3. 後台嘗試更新資料，如果超時則顯示超時提示<br>4. 快取資料保持可用，用戶可以繼續工作<br>5. 提供手動重新載入選項<br>6. 超時後自動重試機制（如 30秒後再次嘗試） |
| **測試資料** | 任何有效的 Sprint 資料<br>模擬超時：>30秒回應時間 |
| **測試類型** | 效能與可用性測試 |
| **自動化程度** | 半自動 |

---

### TC-102-07: 大量成員資料的效能測試

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-102-07 |
| **測試目標** | 驗證系統處理大量成員（>20人）時的效能和用戶體驗 |
| **相關 User Story** | US-102: 作為 Scrum Master，我希望在 Dashboard 看到每位成員的進度卡... |
| **相關 AC 場景** | AC-102-1: 顯示每人成果卡（正常流程） |
| **測試前置條件** | 1. Sprint 中有 25 位不同的成員<br>2. 每位成員都有 3-8 個任務<br>3. 總任務數 >100 個<br>4. 使用標準網路環境測試 |
| **測試步驟** | 1. 選擇大量成員的 Sprint<br>2. 切換到每人成果卡片檢視<br>3. 記錄載入時間<br>4. 檢查卡片顯示的完整性<br>5. 測試頁面滾動效能<br>6. 驗證搜尋/篩選功能（如果有） |
| **預期結果** | 1. 卡片載入時間 < 3秒<br>2. 所有 25 張成員卡片正確顯示<br>3. 頁面滾動流暢，無明顯延遲<br>4. 記憶體使用量合理（< 100MB）<br>5. 如果卡片過多，提供分頁或虛擬滾動<br>6. 大量資料不影響其他功能的響應速度 |
| **測試資料** | Sprint: Large Team Sprint<br>成員: 25 人<br>總任務: ~150 個<br>總 Story Points: ~300 SP |
| **測試類型** | 效能測試 |
| **自動化程度** | 半自動（需要效能監控工具） |

---

## 📊 測試資料設定

### 基礎測試環境設定

| 參數 | 值 | 說明 |
|------|-----|------|
| **測試 Sprint** | Sprint 3, Sprint 2, Sprint Empty | 不同情境的測試 Sprint |
| **成員數量** | 3-25 人 | 涵蓋正常到大量成員情況 |
| **瀏覽器** | Chrome 最新版 | 主要測試環境 |
| **網路環境** | 標準寬頻 | 一般使用情境 |

### 各測試案例的具體資料

| 測試案例 | 成員 | 任務分配 | 特殊情況 | 預期檢驗點 |
|----------|------|----------|----------|------------|
| TC-102-01 | Alice, Bob, Charlie | 均勻分配，各有不同狀態 | 無 | 基本功能正常 |
| TC-102-02 | 同 TC-102-01 | 同上 | 需要 API 數據比對 | 資料一致性 |
| TC-102-03 | Alice, Bob + 未指派 | 部分任務無 assignee | 混合情況 | 未指派卡片顯示 |
| TC-102-04 | 無 | 全部任務未指派 | 極端情況 | 特殊警告訊息 |
| TC-102-05 | Alice, Bob, Charlie | 正常分配 | 模擬 API 錯誤 | 錯誤處理機制 |
| TC-102-06 | Alice, Bob, Charlie | 正常分配 | 模擬 API 超時 | 快取回退機制 |
| TC-102-07 | 25 位成員 | 大量任務 | 效能壓力測試 | 載入速度和流暢度 |

---

## 🔧 自動化測試建議

### 適合 E2E 測試的項目

```javascript
// Playwright/Cypress 測試範例
describe('Team Contribution Cards', () => {
  
  test('TC-102-01: 正常顯示每人成果卡', async ({ page }) => {
    // 設定測試資料
    await setupSprintData('Sprint 3', {
      members: ['Alice', 'Bob', 'Charlie'],
      assignments: {
        'Alice': { open: 2, inProgress: 1, done: 3, storyPoints: [3,5,8] },
        'Bob': { open: 1, inProgress: 2, done: 2, storyPoints: [2,7,5] },
        'Charlie': { open: 3, inProgress: 1, done: 1, storyPoints: [6,3,2] }
      }
    });
    
    await page.goto('/dashboard');
    await page.selectOption('[data-testid="sprint-selector"]', 'Sprint 3');
    await page.click('[data-testid="team-contribution-tab"]');
    
    // 驗證成員卡片
    await expect(page.locator('[data-testid="member-card-Alice"]')).toBeVisible();
    await expect(page.locator('[data-testid="member-card-Alice"] [data-testid="open-count"]')).toHaveText('2');
    await expect(page.locator('[data-testid="member-card-Alice"] [data-testid="open-story-points"]')).toHaveText('3 SP');
    
    // 驗證時間戳記和 Sprint 名稱
    await expect(page.locator('[data-testid="last-updated"]')).toBeVisible();
    await expect(page.locator('[data-testid="sprint-name"]')).toHaveText('Sprint 3');
  });
  
  test('TC-102-03: 處理未指派任務', async ({ page }) => {
    await setupSprintData('Sprint 2', {
      unassignedTasks: { open: 3, inProgress: 2, done: 1, storyPoints: [5,3,2] }
    });
    
    await page.goto('/dashboard');
    await page.selectOption('[data-testid="sprint-selector"]', 'Sprint 2');
    await page.click('[data-testid="team-contribution-tab"]');
    
    // 驗證未指派卡片
    await expect(page.locator('[data-testid="unassigned-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="unassigned-warning"]')).toHaveText(/資料不完整可能影響人力判斷/);
    await expect(page.locator('[data-testid="unassigned-total"]')).toHaveText('6 個任務，10 SP');
  });
});
```

### 適合 Unit 測試的項目

```javascript
// Jest 測試範例
describe('Team Contribution Data Processing', () => {
  
  test('should correctly aggregate member tasks by status', () => {
    const rawData = [
      { assignee: 'Alice', status: 'To Do', storyPoints: 3 },
      { assignee: 'Alice', status: 'In Progress', storyPoints: 5 },
      { assignee: 'Alice', status: 'Done', storyPoints: 8 },
      { assignee: 'Bob', status: 'To Do', storyPoints: 2 }
    ];
    
    const result = aggregateMemberContributions(rawData);
    
    expect(result['Alice']).toEqual({
      open: { count: 1, storyPoints: 3 },
      inProgress: { count: 1, storyPoints: 5 },
      done: { count: 1, storyPoints: 8 }
    });
  });
  
  test('should handle unassigned tasks correctly', () => {
    const rawData = [
      { assignee: null, status: 'To Do', storyPoints: 5 },
      { assignee: '', status: 'In Progress', storyPoints: 3 }
    ];
    
    const result = aggregateMemberContributions(rawData);
    
    expect(result['未指派']).toEqual({
      open: { count: 1, storyPoints: 5 },
      inProgress: { count: 1, storyPoints: 3 },
      done: { count: 0, storyPoints: 0 }
    });
  });
});
```

---

## 📝 測試執行記錄

| 測試案例 | 執行日期 | 結果 | 執行者 | 備註 |
|----------|----------|------|--------|------|
| TC-102-01 | 待執行 | - | - | 需要完成 UI 實作後測試 |
| TC-102-02 | 待執行 | - | - | 需要後端 API 支援 |
| TC-102-03 | 待執行 | - | - | - |
| TC-102-04 | 待執行 | - | - | - |
| TC-102-05 | 待執行 | - | - | - |
| TC-102-06 | 待執行 | - | - | - |
| TC-102-07 | 待執行 | - | - | 需要大量測試資料 |

---

## 🔗 相關文件

- **Acceptance Criteria**: [`ac-copilot-adv.md`](./ac-copilot-adv.md)
- **技術架構**: [`docs/tech-overview.md`](../../../tech-overview.md)
- **資料架構**: [`docs/table-schema.md`](../../../table-schema.md)

## 📝 變更記錄

| 日期       | 版本 | 變更內容 | 變更人 |
| ---------- | ---- | -------- | ------ |
| 2025-09-04 | 1.0  | 初版建立，涵蓋 AC-102-1 至 AC-102-3 的測試案例 | QA Team |
