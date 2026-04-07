import { useState, useEffect } from "react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { useUsersLogs } from "./hooks/useUsersLogs"
import IspPagination from "./components/IspPagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { PAGE_SIZES } from "./constants/logs"

export default function UsersLogs() {

  const {
    logs, meta, loading,
    page, limit, setPage, handleLimit,
  } = useUsersLogs()


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users Logs</CardTitle>
        <div className="sm:flex grid gap-2 justify-end">
          <div className="w-24">
            <Select value={`${limit}`} onValueChange={(v) => handleLimit(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Username/NIK</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-32 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <TableRow key={log.id}>
                  <TableCell>{(page * limit) - limit + index + 1}</TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell className="text-right">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada log aktivitas ditemukan
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
    </Card>
  )
}