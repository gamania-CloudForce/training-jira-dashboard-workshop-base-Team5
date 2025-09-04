import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Types
export interface TaskSummary {
  count: number
  story_points: number
}

export interface MemberContribution {
  member_name: string
  open_tasks: TaskSummary
  in_progress_tasks: TaskSummary
  done_tasks: TaskSummary
  total_tasks: number
  total_story_points: number
}

export interface TeamContributionData {
  sprint_name: string
  member_contributions: MemberContribution[]
  unassigned_contribution?: MemberContribution
  total_members: number
  last_updated: string
}

interface CacheEntry {
  data: TeamContributionData
  timestamp: number
}

export interface UseTeamContributionParams {
  sprintName?: string
}

// 5分鐘快取機制
const CACHE_DURATION = 5 * 60 * 1000 // 5分鐘

// 快取儲存
const cache = new Map<string, CacheEntry>()

function shouldUseCache(cacheEntry: CacheEntry): boolean {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION
}

export function useTeamContribution(params: UseTeamContributionParams = {}) {
  const [teamData, setTeamData] = useState<TeamContributionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingCache, setIsUsingCache] = useState(false)

  const { sprintName } = params

  // 獲取團隊貢獻資料
  const fetchTeamContribution = useCallback(async (sprint: string) => {
    if (!sprint || sprint === 'All') {
      setTeamData(null)
      return
    }

    const cacheKey = `team-contribution-${sprint}`
    const cachedData = cache.get(cacheKey)

    // 檢查快取
    if (cachedData && shouldUseCache(cachedData)) {
      setTeamData(cachedData.data)
      setIsUsingCache(true)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setIsUsingCache(false)

    try {
      const encodedSprintName = encodeURIComponent(sprint)
      const response = await fetch(`${API_BASE_URL}/api/team/contribution/${encodedSprintName}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Sprint "${sprint}" not found`)
        }
        throw new Error('Failed to fetch team contribution data')
      }

      const data = await response.json() as TeamContributionData
      
      // 儲存到快取
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })

      setTeamData(data)
      setIsUsingCache(false)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      // 如果有快取資料，嘗試使用快取資料作為 fallback
      if (cachedData) {
        setTeamData(cachedData.data)
        setIsUsingCache(true)
        setError(`${errorMessage} (showing cached data)`)
      } else {
        setTeamData(null)
        setIsUsingCache(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // 手動重新載入
  const refetch = useCallback(() => {
    if (sprintName) {
      // 清除快取並重新載入
      const cacheKey = `team-contribution-${sprintName}`
      cache.delete(cacheKey)
      fetchTeamContribution(sprintName)
    }
  }, [sprintName, fetchTeamContribution])

  // 當 sprintName 變更時自動載入資料
  useEffect(() => {
    if (sprintName) {
      fetchTeamContribution(sprintName)
    } else {
      setTeamData(null)
      setError(null)
      setIsUsingCache(false)
    }
  }, [sprintName, fetchTeamContribution])

  return {
    teamData,
    loading,
    error,
    isUsingCache,
    refetch,
    fetchTeamContribution
  }
}
