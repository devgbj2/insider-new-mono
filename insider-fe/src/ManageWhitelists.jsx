import React, { useState, useEffect } from "react"
import { UserPlus, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import CreatableSelect from "react-select/creatable"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog"

import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/common"

export default function ManageWhitelists() {
    const [whitelists, setWhitelists] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)

    const [selectedOptions, setSelectedOptions] = useState([])
    const [inputValue, setInputValue] = useState("")

    const fetchWhitelists = async () => {
        try {
            const { data } = await api.get("user/whitelist")
            setWhitelists(data)
        } catch (err) {
            console.error(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWhitelists()
    }, [])

    const isValidNik = (nik) => /^[0-9]{6,8}$/.test(nik)

    const handleSave = async () => {
        setIsSubmitting(true)

        try {
            const niks = selectedOptions.map(opt => opt.value)

            const invalid = niks.filter(nik => !isValidNik(nik))
            if (invalid.length > 0) {
                return toast.error(`NIK tidak valid: ${invalid.join(", ")}`)
            }

            await api.post("user/whitelist", {
                niks
            })

            toast.success(niks.length + " Whitelist berhasil ditambahkan")

            // reset state
            setSelectedOptions([])
            setInputValue("")
            setDialogOpen(false)

            fetchWhitelists()
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (nik) => {
        try {
            await api.delete(`user/whitelist/${nik}`)
            toast.success("Whitelist deleted")
            fetchWhitelists()
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    const handleToggleStatus = async (whitelist) => {
        const originalStatus = whitelist.rowstatus
        const newStatus = !originalStatus

        // optimistic update
        setWhitelists(prev =>
            prev.map(item =>
                item.nik === whitelist.nik
                    ? { ...item, rowstatus: newStatus }
                    : item
            )
        )

        try {
            await api.patch(`user/whitelist/${whitelist.nik}`, {
                rowstatus: newStatus
            })
        } catch (error) {
            // rollback
            setWhitelists(prev =>
                prev.map(item =>
                    item.nik === whitelist.nik
                        ? { ...item, rowstatus: originalStatus }
                        : item
                )
            )
            console.error(error)
            toast.error(error.message)
        }
    }

    const handleInputChange = (newValue) => {
        setInputValue(newValue)
    }

    const handleSelectChange = (newValue) => {
        setSelectedOptions(newValue || [])
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Whitelist</CardTitle>

                <Button onClick={() => setDialogOpen(true)}>
                    <UserPlus />
                    Add Whitelist
                </Button>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>NIK</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : whitelists.length > 0 ? (
                            whitelists.map((whitelist, index) => (
                                <TableRow key={whitelist.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{whitelist.nik}</TableCell>

                                    <TableCell>
                                        <Switch
                                            checked={!!whitelist.rowstatus}
                                            onCheckedChange={() =>
                                                handleToggleStatus(whitelist)
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {new Date(whitelist.createdAt).toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete this whitelist?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(whitelist.nik)
                                                        }
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Belum ada NIK di whitelist
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah NIK Whitelist</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <CreatableSelect
                            isMulti
                            placeholder="Ketik NIK lalu Enter..."
                            value={selectedOptions}
                            inputValue={inputValue}
                            onChange={handleSelectChange}
                            onInputChange={handleInputChange}
                            noOptionsMessage={() => ""}
                            formatCreateLabel={(v) => `Tambah: ${v}`}
                        />

                        <p className="text-xs text-muted-foreground">
                            * NIK harus berjumlah 6 sampai 8 angka
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={isSubmitting || selectedOptions.length === 0}
                        >
                            Simpan
                            {isSubmitting && (
                                <span className="ml-2">
                                    <Spinner />
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}