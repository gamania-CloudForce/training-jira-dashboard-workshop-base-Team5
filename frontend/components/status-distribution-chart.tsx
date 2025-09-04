"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { useStatusDistribution } from '@/hooks/use-status-distribution';
import { cn } from '@/lib/utils';

interface StatusDistributionChartProps {
  sprintName?: string;
  onStatusFilter?: (status: string) => void;
}

// 狀態顏色映射（根據 table-schema.md 的實際狀態）
const STATUS_COLORS = {
  'Backlog': '#e5e7eb',        // gray-200 - 待辦
  'Evaluated': '#ddd6fe',      // violet-200 - 已評估
  'To Do': '#bfdbfe',          // blue-200 - 待辦
  'In Progress': '#3b82f6',    // blue-500 - 進行中
  'Waiting': '#f59e0b',        // amber-500 - 等待中
  'Ready to Verify': '#f97316', // orange-500 - 待驗證
  'Done': '#22c55e',           // green-500 - 完成
  'Invalid': '#ef4444',        // red-500 - 無效
  'Routine': '#8b5cf6',        // violet-500 - 例行作業
  '其他': '#6b7280'            // gray-500 - 其他/未知狀態
};

export default function StatusDistributionChart({ 
  sprintName, 
  onStatusFilter 
}: StatusDistributionChartProps) {
  const { data, loading, error, refetch } = useStatusDistribution(sprintName);

  if (loading && !data) {
    return (
      <Card className="w-full" data-testid="status-distribution-loading">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="w-full" data-testid="status-distribution-error">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            任務狀態分佈
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>顯示各狀態的任務分佈情況</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>無法取得狀態分佈資料，請稍後重試</span>
              <Button variant="outline" size="sm" onClick={refetch} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-1" />
                重新載入
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full" data-testid="status-distribution-no-data">
        <CardHeader>
          <CardTitle>任務狀態分佈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            {sprintName && sprintName !== 'All' 
              ? `Sprint "${sprintName}" 沒有找到狀態分佈資料`
              : '沒有可用的狀態分佈資料'
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" data-testid="status-distribution-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            任務狀態分佈
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>顯示各狀態的任務分佈情況</p>
                  {data.has_unknown_statuses && (
                    <p className="mt-1 text-sm text-orange-600">
                      部分任務狀態無法識別，建議資料擁有者標準化 Jira 狀態欄位以提升數據品質
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="text-sm text-gray-500">
            {sprintName ? `Sprint: ${sprintName}` : '所有 Sprint'}
          </div>
        </div>
        
        {/* 總覽資訊 */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>總任務數: {data.total_tasks}</span>
          {data.bottleneck_status && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              瓶頸: {data.bottleneck_status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 水平條形圖 */}
          <div className="space-y-3" data-testid="horizontal-bar-chart">
            {data.status_distributions.map((item, index) => {
              const color = STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || STATUS_COLORS['其他'];
              const isBottleneck = item.is_bottleneck;
              const isEmpty = item.count === 0;
              
              return (
                <div key={item.status} className="space-y-1">
                  {/* 狀態標籤 */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: isEmpty ? '#e5e7eb' : color }}
                        data-testid={`status-color-${item.status}`}
                      />
                      <span className={cn(
                        "font-medium",
                        isEmpty ? "text-gray-400" : "text-gray-700"
                      )}>
                        {item.status}
                      </span>
                      {isBottleneck && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>可能為瓶頸 - 此狀態任務佔比最高</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className={cn(
                      "text-sm",
                      isEmpty ? "text-gray-400" : "text-gray-600"
                    )}>
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                  
                  {/* 水平條形 */}
                  <div 
                    className={cn(
                      "relative h-8 rounded-md overflow-hidden border transition-all duration-200",
                      isEmpty ? "bg-gray-50 border-gray-200" : "bg-gray-100 border-gray-200",
                      isBottleneck ? "ring-2 ring-red-400" : "",
                      "hover:shadow-sm cursor-pointer"
                    )}
                    onClick={() => onStatusFilter?.(item.status)}
                    data-testid={`status-bar-${item.status}`}
                  >
                    {/* 進度條 */}
                    {!isEmpty && (
                      <div
                        className="h-full transition-all duration-300 flex items-center justify-end pr-2"
                        style={{
                          backgroundColor: color,
                          width: `${Math.max(item.percentage, 2)}%`, // 最小寬度確保可見
                          opacity: isEmpty ? 0.3 : 1
                        }}
                      >
                        <span className="text-white text-xs font-semibold">
                          {item.count > 0 && `${item.count}`}
                        </span>
                      </div>
                    )}
                    
                    {/* 零值狀態顯示 */}
                    {isEmpty && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          0 (0.0%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 互動式圖例清單 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              互動式圖例 (點擊過濾)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.status_distributions.map((item) => (
                <button
                  key={item.status}
                  onClick={() => onStatusFilter?.(item.status)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                    "hover:bg-blue-50 hover:text-blue-700 text-left",
                    item.count === 0 ? "text-gray-400" : "text-gray-700"
                  )}
                  data-testid={`legend-item-${item.status}`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.count === 0 ? '#e5e7eb' : STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || STATUS_COLORS['其他'] }}
                  />
                  <span className="flex-1">{item.status}</span>
                  <span className="text-xs">
                    {item.count} ({item.percentage}%)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 數據品質警告 */}
          {data.has_unknown_statuses && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                檢測到未知狀態資料，建議檢查並標準化 Jira 狀態欄位以提升數據品質。
              </AlertDescription>
            </Alert>
          )}
          
          {/* 最後更新時間 */}
          <div className="text-xs text-gray-400 text-right">
            最後更新: {new Date(data.last_updated).toLocaleString('zh-TW')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
