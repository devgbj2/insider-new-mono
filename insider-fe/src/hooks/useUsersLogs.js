import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/common"
import { toast } from "react-hot-toast"


export function useUsersLogs() {
  const [logs, setLogs] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pagination
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)


  const fetchLogs = useCallback(async () => {
    setLoading(true)

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    try {
      const { data, meta } = await api.get(`log?${query.toString()}`)
      setLogs(data)
      setMeta(meta)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])


  const handleLimit = (value) => {
    setLimit(value)
    setPage(1)
  }

  return {
    // data
    logs,
    meta,
    loading,
    // pagination
    page,
    limit,
    setPage,
    handleLimit,
  }
}