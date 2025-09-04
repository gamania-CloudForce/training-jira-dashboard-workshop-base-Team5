import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Users } from 'lucide-react'
import { MemberContribution } from '@/hooks/use-team-contribution'

interface MemberContributionCardProps {
  member: MemberContribution
  isUnassigned?: boolean
  sprintName: string
  lastUpdated?: string
}

export function MemberContributionCard({ 
  member, 
  isUnassigned = false, 
  sprintName,
  lastUpdated 
}: MemberContributionCardProps) {
  const formatStoryPoints = (points: number) => `${points} SP`
  
  // 計算進度百分比
  const completionRate = member.total_story_points > 0 
    ? ((member.done_tasks.story_points / member.total_story_points) * 100).toFixed(1)
    : '0.0'

  return (
    <Card 
      className={`w-full ${isUnassigned ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}
      data-testid={isUnassigned ? 'unassigned-card' : `member-card-${member.member_name}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {isUnassigned ? (
              <Users className="h-5 w-5 text-orange-600" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {member.member_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className={isUnassigned ? 'text-orange-800' : 'text-gray-900'}>
              {member.member_name}
            </span>
          </div>
          <Badge 
            variant={isUnassigned ? 'destructive' : 'secondary'}
            data-testid="completion-rate"
          >
            {completionRate}% 完成
          </Badge>
        </CardTitle>
        {isUnassigned && (
          <div 
            className="flex items-center gap-1 text-sm text-orange-700 mt-2"
            data-testid="unassigned-warning"
          >
            <AlertTriangle className="h-4 w-4" />
            資料不完整可能影響人力判斷
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 任務狀態統計 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Open Tasks */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600" data-testid="open-count">
              {member.open_tasks.count}
            </div>
            <div className="text-xs text-gray-500 mb-1">Open</div>
            <div className="text-sm font-medium text-blue-600" data-testid="open-story-points">
              {formatStoryPoints(member.open_tasks.story_points)}
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600" data-testid="in-progress-count">
              {member.in_progress_tasks.count}
            </div>
            <div className="text-xs text-gray-500 mb-1">In Progress</div>
            <div className="text-sm font-medium text-yellow-600" data-testid="in-progress-story-points">
              {formatStoryPoints(member.in_progress_tasks.story_points)}
            </div>
          </div>

          {/* Done Tasks */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600" data-testid="done-count">
              {member.done_tasks.count}
            </div>
            <div className="text-xs text-gray-500 mb-1">Done</div>
            <div className="text-sm font-medium text-green-600" data-testid="done-story-points">
              {formatStoryPoints(member.done_tasks.story_points)}
            </div>
          </div>
        </div>

        {/* 總計資訊 */}
        <div className="border-t pt-3">
          <div 
            className="flex justify-between items-center text-sm"
            data-testid={isUnassigned ? 'unassigned-total' : 'member-total'}
          >
            <span className="text-gray-600">總計:</span>
            <span className="font-medium">
              {member.total_tasks} 個任務，{formatStoryPoints(member.total_story_points)}
            </span>
          </div>
          
          {/* Sprint 和時間資訊 */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <span data-testid="sprint-name">{sprintName}</span>
            {lastUpdated && (
              <span data-testid="last-updated">
                {new Date(lastUpdated).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
