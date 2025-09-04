import { useState, useEffect } from 'react';

// 狀態分佈資料類型
export interface StatusDistributionData {
  status: string;
  count: number;
  percentage: number;
  is_bottleneck: boolean;
}

export interface StatusDistributionResponse {
  sprint_name: string;
  status_distributions: StatusDistributionData[];
  total_tasks: number;
  bottleneck_status: string | null;
  has_unknown_statuses: boolean;
  last_updated: string;
}

interface CacheEntry {
  data: StatusDistributionResponse;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘
const cache = new Map<string, CacheEntry>();

export function useStatusDistribution(sprintName?: string) {
  const [data, setData] = useState<StatusDistributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = sprintName || 'All';

  const shouldUseCache = (key: string): boolean => {
    const entry = cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    return (now - entry.timestamp) < CACHE_DURATION;
  };

  const fetchData = async (sprint?: string, forceRefresh = false) => {
    // 檢查快取
    if (!forceRefresh && shouldUseCache(cacheKey)) {
      const cachedEntry = cache.get(cacheKey);
      if (cachedEntry) {
        setData(cachedEntry.data);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = sprint && sprint !== 'All' 
        ? `/api/dashboard/status-distribution/${encodeURIComponent(sprint)}`
        : '/api/dashboard/status-distribution/All';

      const response = await fetch(`http://localhost:8001${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: StatusDistributionResponse = await response.json();
      
      // 存入快取
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // 嘗試使用快取資料作為後備
      const cachedEntry = cache.get(cacheKey);
      if (cachedEntry) {
        setData(cachedEntry.data);
        console.warn('Using cached data due to fetch error:', errorMessage);
      } else {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData(sprintName, true);
  };

  useEffect(() => {
    fetchData(sprintName);
  }, [sprintName]);

  return {
    data,
    loading,
    error,
    refetch
  };
}
