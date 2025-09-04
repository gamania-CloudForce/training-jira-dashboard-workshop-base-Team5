"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartDataPoint, SprintBurndownData } from "@/hooks/use-sprint-burndown"

interface BurndownChartProps {
  chartData: ChartDataPoint[]
  sprintData: SprintBurndownData
  className?: string
}

const getStatusColor = (status: SprintBurndownData['status']) => {
  switch (status) {
    case 'normal':
      return '#10b981' // green-500
    case 'warning':
      return '#f59e0b' // yellow-500
    case 'danger':
      return '#ef4444' // red-500
    default:
      return '#6b7280' // gray-500
  }
}

const chartConfig = {
  ideal: {
    label: "理想燃盡線",
    color: "#9ca3af", // gray-400
  },
  actual: {
    label: "實際燃盡線",
    color: "#10b981", // Will be overridden by status color
  },
}

export function BurndownChart({ chartData, sprintData, className }: BurndownChartProps) {
  const actualLineColor = getStatusColor(sprintData.status)
  
  // Update chart config with dynamic color
  const dynamicChartConfig = {
    ...chartConfig,
    actual: {
      ...chartConfig.actual,
      color: actualLineColor
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]?.payload
    if (!data) return null

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">Day {label} ({data.date})</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-sm">理想剩餘: {data.ideal.toFixed(1)} SP</span>
          </div>
          {data.actual !== null && data.actual !== undefined ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: actualLineColor }}
              ></div>
              <span className="text-sm">實際剩餘: {data.actual.toFixed(1)} SP</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full bg-gray-300" 
              ></div>
              <span className="text-sm text-muted-foreground">實際剩餘: 未來日期</span>
            </div>
          )}
          {data.actual !== null && data.actual !== undefined && data.ideal !== data.actual && (
            <div className="text-xs text-muted-foreground pt-1 border-t">
              差異: {(data.actual - data.ideal).toFixed(1)} SP
              {data.actual > data.ideal ? ' (落後)' : ' (超前)'}
            </div>
          )}
        </div>
      </div>
    )
  }

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.ideal, d.actual)),
    sprintData.total_story_points
  )
  const yAxisMax = Math.ceil(maxValue * 1.1)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sprint 燃盡圖</span>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-muted-foreground">理想線</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: actualLineColor }}
              ></div>
              <span className="text-muted-foreground">實際線</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div data-testid="burndown-chart">
          <ChartContainer config={dynamicChartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, yAxisMax]}
                tickFormatter={(value) => `${value} SP`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* 理想燃盡線 - 虛線灰色 */}
              <Line
                type="linear"
                dataKey="ideal"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: "#9ca3af" }}
                name="理想燃盡線"
              />
              
              {/* 實際燃盡線 - 實線，依健康度變色 */}
              <Line
                type="linear"
                dataKey="actual"
                stroke={actualLineColor}
                strokeWidth={3}
                dot={{ fill: actualLineColor, r: 3 }}
                activeDot={{ r: 5, fill: actualLineColor }}
                name="實際燃盡線"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        </div>
        
        {/* 圖表說明 */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• 理想線代表平均分配的完成進度</p>
          <p>• 實際線顏色反映當前進度健康度</p>
          <p>• 線條越接近代表進度越理想</p>
        </div>
      </CardContent>
    </Card>
  )
}
