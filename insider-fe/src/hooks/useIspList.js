import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "./useDebounce"
import { api } from "@/lib/common"
import { toast } from "react-hot-toast"

const INITIAL_FILTERS = {
  isJartup: [],
  isJartaplok: [],
  isCustomer: [],
  scale: [],

  quality: [],
  risk: [],
  area: [],
  size: [],
}

export function useIspList() {
  const [isps, setIsps] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pagination
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Search
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search) // 500ms default

  // Filter
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  // ✅ Stringify filter array biar deps array stabil
  const filtersKey = JSON.stringify(filters)

  const fetchIsps = useCallback(async () => {
    setLoading(true)

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    if (debouncedSearch) query.set("name", debouncedSearch)

    const parsed = JSON.parse(filtersKey)
    parsed.isJartup?.forEach((s) => query.append("isJartup", s))
    parsed.isJartaplok?.forEach((s) => query.append("isJartaplok", s))
    parsed.isCustomer?.forEach((s) => query.append("isCustomer", s))
    parsed.scale?.forEach((s) => query.append("scale", s))
    parsed.quality?.forEach((s) => query.append("quality", s))
    parsed.risk?.forEach((s) => query.append("risk", s))
    parsed.area?.forEach((s) => query.append("area", s))
    parsed.size?.forEach((s) => query.append("size", s))
    
    try {
      const { data, meta } = await api.get(`isp?${query.toString()}`)
      setIsps(data)
      setMeta(meta)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, filtersKey])

  useEffect(() => {
    fetchIsps()
  }, [fetchIsps])

  // Reset page ke 1 kalau search/filter berubah
  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilters = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleLimit = (value) => {
    setLimit(value)
    setPage(1)
  }

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSearch("")
    setPage(1)
  }

  return {
    // data
    isps,
    meta,
    loading,
    // pagination
    page,
    limit,
    setPage,
    handleLimit,
    // search & filter
    search,
    filters,
    handleSearch,
    handleFilters,
    resetFilters,
  }
}