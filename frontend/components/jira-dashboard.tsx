"use client"

import React, { useState } from "react"
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
  Target,
  Loader2,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import { useDashboard } from "@/hooks/use-dashboard"
import { SprintBurndownContainer } from "@/components/sprint-burndown-container"
import { MemberContributionCard } from "./member-contribution-card"
import StatusDistributionChart from "./status-distribution-chart"
import { useTeamContribution } from "@/hooks/use-team-contribution"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function JiraDashboard() {
  const [selectedSprint, setSelectedSprint] = useState<string>('All')

  const {
    stats,
    statusDistribution,
    sprintOptions,
    loading,
    error,
    refetch
  } = useDashboard({
    sprint: selectedSprint === 'All' ? undefined : selectedSprint,
  })

  // 獲取團隊貢獻資料
  const { 
    teamData, 
    loading: teamLoading, 
    error: teamError, 
    refetch: refetchTeam 
  } = useTeamContribution({
    sprintName: selectedSprint === 'All' ? undefined : selectedSprint
  })

  // 定義 Status 的正確順序
  const statusOrder = [
    'Backlog',
    'Evaluated', 
    'To Do',
    'In Progress',
    'Waiting',
    'PR Review',
    'Dev Completed',
    'Ready to Test',
    'Ready to Verify',
    'Testing',
    'Ready to Release',
    'Done',
    'Invalid',
    'Routine'
  ]

  // 將狀態分布資料轉換為圖表格式，並按指定順序排序
  const chartData = statusDistribution?.distribution
    .map(item => ({
      name: item.status,
      value: item.count,
      percentage: item.percentage
    }))
    .sort((a, b) => {
      const indexA = statusOrder.indexOf(a.name)
      const indexB = statusOrder.indexOf(b.name)
      
      // 如果狀態不在預定義順序中，放到最後
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      
      return indexA - indexB
    }) || []

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Jira Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sprint:</label>
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-[200px]" data-testid="sprint-selector">
                <SelectValue placeholder="Select Sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprintOptions.map((sprint) => (
                  <SelectItem key={sprint} value={sprint}>
                    {sprint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar> */}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-red-600">Error: {error}</p>
                <Button onClick={refetch} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* Total Issue Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issue Count</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-2xl font-bold">--</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.total_issues || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">Total issues tracked</p>
            </CardContent>
          </Card>

          {/* Total Story Points */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Story Points</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-2xl font-bold">--</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.total_story_points?.toFixed(1) || '0.0'}</div>
              )}
              <p className="text-xs text-muted-foreground">Total story points</p>
            </CardContent>
          </Card>

          {/* Total Done Item Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Done Item Count</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-2xl font-bold">--</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.done_issues || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">Completed issues</p>
            </CardContent>
          </Card>

          {/* Total Done Item Story Points */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Done Story Points</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-2xl font-bold">--</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">{stats?.done_story_points?.toFixed(1) || '0.0'}</div>
              )}
              <p className="text-xs text-muted-foreground">Completed story points</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Issue Status Distribution</CardTitle>
              <CardDescription>
                A breakdown of issues by their current status.
                {statusDistribution && (
                  <span className="ml-2 text-sm">
                    (Total: {statusDistribution.total_count} issues)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading chart data...</span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No status data available
                </div>
              ) : (
                <ChartContainer
                  className="h-[300px] w-full"
                  config={{
                    value: {
                      label: "Issues",
                      color: "hsl(221.2 83.2% 53.3%)",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-blue-600">
                                  Issues: {data.value}
                                </p>
                                <p className="text-gray-600">
                                  Percentage: {data.percentage.toFixed(1)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(221.2 83.2% 53.3%)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sprint Burndown Section */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <SprintBurndownContainer selectedSprint={selectedSprint} />
        </div>

        {/* Team Contribution Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">團隊成員貢獻卡片</h2>
            {teamData && (
              <span className="text-sm text-gray-500">
                共 {teamData.total_members} 位成員
              </span>
            )}
          </div>

          {/* 載入狀態 */}
          {teamLoading && !teamData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))}
            </div>
          )}

          {/* 錯誤狀態 */}
          {teamError && !teamData && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>無法取得成員資料，請稍後重試</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetchTeam}
                  className="ml-4"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重新載入
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* 沒有資料 */}
          {!teamLoading && !teamError && !teamData && selectedSprint !== 'All' && (
            <div className="text-center text-gray-500 py-8">
              Sprint "{selectedSprint}" 沒有找到團隊資料
            </div>
          )}

          {/* 成員卡片網格 */}
          {teamData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 已指派成員卡片 */}
              {teamData.member_contributions.map((member) => (
                <MemberContributionCard
                  key={member.member_name}
                  member={member}
                  sprintName={teamData.sprint_name}
                  lastUpdated={teamData.last_updated}
                />
              ))}

              {/* 未指派任務卡片 */}
              {teamData.unassigned_contribution && (
                <MemberContributionCard
                  member={teamData.unassigned_contribution}
                  isUnassigned={true}
                  sprintName={teamData.sprint_name}
                  lastUpdated={teamData.last_updated}
                />
              )}
            </div>
          )}

          {/* 提示選擇 Sprint */}
          {selectedSprint === 'All' && (
            <div className="text-center text-gray-500 py-8">
              請選擇一個具體的 Sprint 查看團隊成員貢獻
            </div>
          )}
        </div>

        {/* Status Distribution Section - US-103 */}
        <div className="space-y-4">
          <StatusDistributionChart 
            sprintName={selectedSprint === 'All' ? undefined : selectedSprint}
            onStatusFilter={(status) => {
              // 這裡可以實作狀態過濾邏輯，比如跳轉到明細表格並過濾特定狀態
              console.log(`過濾狀態: ${status}`);
            }}
          />
        </div>

      </main>
    </div>
  )
}
