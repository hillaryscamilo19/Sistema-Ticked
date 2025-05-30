import { useState, useCallback } from "react"

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useApi<T, P = unknown>(
  apiFunction: (params?: P) => Promise<T>, 
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (params?: P) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await apiFunction(params)
        setData(result)
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        options.onError?.(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction, options.onSuccess, options.onError]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    reset
  }
}