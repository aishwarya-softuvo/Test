import { useEffect, useState } from 'react'

import axiosClient from '../api/axiosClient'

const useFetch = (url, options) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const serializedOptions = options ? JSON.stringify(options) : null

  useEffect(() => {
    if (!url) {
      return
    }

    let ignore = false
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axiosClient({
          url,
          signal: controller.signal,
          ...(serializedOptions ? JSON.parse(serializedOptions) : {}),
        })

        if (!ignore) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        if (!ignore && err.name !== 'CanceledError') {
          setError(err)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [serializedOptions, url])

  return { data, error, loading }
}

export default useFetch
