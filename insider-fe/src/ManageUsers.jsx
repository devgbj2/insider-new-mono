import React, { useState, useEffect } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "./components/ui/skeleton";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { api, cn } from "@/lib/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

export default function ManagerUsers() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const [whitelists, setWhitelists] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/user");
            setUsers(data);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWhitelists = async () => {
        try {
            const { data } = await api.get("/user/whitelist");
            setWhitelists(data);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchWhitelists();
    }, []);

    const openCreateModal = () => {
        setSelectedUser(null);
        setFormData({ username: "", role: "user" });
        setDialogOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            password: "",
            role: user.role,
        });
        setDialogOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (selectedUser) {                
                await api.patch("/user", {oldUsername: selectedUser.username, ...formData});
                toast.success("User updated");
            } else {
                await api.post("/user", formData);
                toast.success("User created");
            }
            setDialogOpen(false);
            fetchUsers()
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (username) => {
        try {
            await api.delete(`/user/${username}`);
            toast.success("User deleted");
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Users</CardTitle>

                <Button onClick={openCreateModal}>
                    <UserPlus />
                    Add user
                </Button>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Username/NIK</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : users.length > 0 ? (
                            <>
                                {users.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Button size="icon" onClick={() => openEditModal(user)}>
                                                <Pencil />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="icon" variant="destructive">
                                                        <Trash2 />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete this user?
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteUser(user.username)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {whitelists.map((whitelist, index) => (
                                    <TableRow key={whitelist.id}>
                                        <TableCell>
                                            {users.length + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full w-fit flex gap-1 border",
                                                whitelist.rowstatus ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
                                            )}>
                                                <div className={cn("w-2 h-2 rounded-full my-auto",
                                                    whitelist.rowstatus ? 'bg-green-500' : 'bg-red-500'
                                                )} />{whitelist.nik}
                                            </div>
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            {new Date(whitelist.createdAt).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="text-right space-x-2"></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Dialog Create / Edit */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? "Edit User" : "Create User"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {!selectedUser && (
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!selectedUser}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">user</SelectItem>
                                    <SelectItem value="admin">admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                Save {isSubmitting ? <Spinner /> : ""}
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </Card>
    );
}
