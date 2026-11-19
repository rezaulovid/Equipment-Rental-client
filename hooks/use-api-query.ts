"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type AsyncState<T> = {
  data: T | null
  error: string | null
  loading: boolean
}

function toMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong while loading this page."
}

/**
 * Fetch-on-mount helper shared by the admin pages. Keeps loading, error and
 * empty states consistent without pulling in a data-fetching library.
 *
 * The fetcher lives in a ref so callers can pass an inline arrow function
 * without triggering a render loop; refresh explicitly with `refetch()`.
 */
export function useApiQuery<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  })

  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let active = true

    fetcherRef
      .current()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false })
      })
      .catch((error) => {
        if (active) setState({ data: null, error: toMessage(error), loading: false })
      })

    return () => {
      active = false
    }
  }, [])

  const refetch = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const data = await fetcherRef.current()
      if (mountedRef.current) setState({ data, error: null, loading: false })
      return data
    } catch (error) {
      if (mountedRef.current) {
        setState({ data: null, error: toMessage(error), loading: false })
      }
      return null
    }
  }, [])

  return {
    ...state,
    refetch,
    setData: (data: T) => setState((current) => ({ ...current, data })),
  }
}
