import { useState, useMemo, use, useEffect } from "react"
import { Download, Funnel } from "lucide-react"

import React from "react"

import FilterPanel from "./components/FilterPanel"

import IspPagination from "./components/IspPagination"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { date, exportIspPdf, exportIspsExcel } from "./lib/common"

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

import { ISP_FILTER_OPTIONS, PAGE_SIZES } from "./constants/isp"
import { useIspList } from "./hooks/useIspList"


export default function ListIsp() {
  const {
    isps, meta, loading,
    page, limit, setPage, handleLimit,
    search, filters,
    handleSearch, handleFilters, resetFilters,
  } = useIspList()

  const [expandedRow, setExpandedRow] = useState(null)
  const [showFilter, setShowFilter] = useState(false)

  const whiteListColumns = ['name', 'legalName', 'headquarters', 'scale', 'coverageListProvince', 'isJartup', 'isJartaplok', 'isCustomer', 'size', 'quality', 'risk', 'address'] // ← columns to skip

  const toggleRow = (id) => {
    setExpandedRow(prev => (prev === id ? null : id))
  }

  useEffect(() => {
    setExpandedRow(null);
    console.log(isps)
  }, [isps]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>List ISP Nasional</CardTitle>

        <div className="sm:flex grid gap-2">
          <Input
            placeholder="Cari nama ISP..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Select value={`${limit}`} onValueChange={(v) => handleLimit(Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => exportIspsExcel(whiteListColumns, isps)}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button variant="outline" onClick={() => setShowFilter(true)}>
            <Funnel className="mr-2 h-4 w-4" />
            Filter
            {Object.values(filters).flat().length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5">
                {Object.values(filters).flat().length}
              </span>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* table */}
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Legal Name</TableHead>
              <TableHead>Headquarters</TableHead>
              <TableHead>Scale</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : isps.length > 0 ? (
              isps.map((isp, index) => {
                return <React.Fragment key={isp.id}>

                  {/* MAIN ROW */}
                  <TableRow
                    onClick={() => toggleRow(isp.id)}
                  >
                    <TableCell>{(page * limit) - limit + index + 1}</TableCell>
                    <TableCell>{isp.name}</TableCell>
                    <TableCell>{isp.legalName}</TableCell>
                    <TableCell>{isp.headquarter}</TableCell>
                    <TableCell>{isp.scale}</TableCell>
                  </TableRow>

                  {/* EXPANDED ROW */}
                  {expandedRow === isp.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/30 px-2 py-4">
                        <Card className="animate-in fade-in zoom-in-95 border-muted shadow-sm">

                          <CardHeader className='flex justify-between'>
                            <div>
                              <CardTitle className="text-base">
                                {isp.name}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant={isp.isCustomer ? "default" : "secondary"}>Customer</Badge>
                                <Badge variant={isp.isKominfo ? "default" : "secondary"}>Kominfo</Badge>
                                <Badge variant={isp.isAsn ? "default" : "secondary"}>ASN</Badge>
                                <Badge variant={isp.isJartup ? "default" : "secondary"}>Jartup</Badge>
                                <Badge variant={isp.isJartaplok ? "default" : "secondary"}>Jartaplok</Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => exportIspPdf(isp)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              PDF
                            </Button>
                          </CardHeader>

                          <CardContent>
                            <div className="grid md:grid-cols-3 gap-6 text-sm">

                              {/* ================= LEGALITAS ================= */}
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                  Legalitas
                                </p>

                                <div>
                                  <p className="text-muted-foreground text-xs">Legal Name</p>
                                  <p className="font-medium">{isp.legalName || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">TIF BP Number</p>
                                  <p className="font-medium">{isp.tifBpNumber || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">BP Number</p>
                                  <p className="font-medium">{isp.bpNumber || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">ASN Number</p>
                                  <p className="font-medium">{isp.asnNumber || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">CA Number</p>
                                  <p className="font-medium">{isp.caNumber || "-"}</p>
                                </div>

                              </div>

                              {/* ================= PROFILE ================= */}
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                  Profile
                                </p>

                                <div>
                                  <p className="text-muted-foreground text-xs">Internal Risk</p>
                                  <p className="font-medium">{isp.internalRiskProfile || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Risk</p>
                                  <p className="font-medium">{isp.risk || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Size</p>
                                  <p className="font-medium">{isp.size || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Scale</p>
                                  <p className="font-medium">{isp.scale || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Quality</p>
                                  <p className="font-medium">{isp.quality || "-"}</p>
                                </div>


                              </div>

                              {/* ================= CONTACT ================= */}
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                  Contact
                                </p>

                                <div>
                                  <p className="text-muted-foreground text-xs">Phone</p>
                                  <p className="font-medium">{isp.phone || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Address</p>
                                  <p className="font-medium wrap-break-word whitespace-pre-line">{isp.address || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Headquarter</p>
                                  <p className="font-medium">{isp.headquarter || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Province</p>
                                  <p className="font-medium">{isp.province || "-"}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground text-xs">Coverage</p>
                                  <p className="font-medium">
                                    {isp.coverageListProvince || "-"}
                                  </p>
                                </div>
                              </div>

                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}

                </React.Fragment>;
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>

        {meta && (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {meta.page * meta.limit - meta.limit} - {meta.page * meta.limit} dari {meta.total} data
              </p>
            </div>

            <IspPagination
              page={page}
              lastPage={meta.lastPage}
              setPage={setPage}
            />
          </div>


        )}

      </CardContent>

      {/* filter panel */}
      <Sheet open={showFilter} onOpenChange={setShowFilter}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
          <Separator />
          <FilterPanel
            filters={filters}
            setFilters={handleFilters}
            resetFilters={resetFilters}
            filterOptions={ISP_FILTER_OPTIONS}
            close={() => setShowFilter(false)}
          />
        </SheetContent>
      </Sheet>
    </Card>
  )
}