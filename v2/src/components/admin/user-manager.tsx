"use client";

import { useState, useTransition } from "react";
import type { UserProfile } from "@/lib/types";
import { addUser, deleteUser, updateUserPassword } from "@/app/admin/users/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, KeyRound, Plus } from "lucide-react";

type UserWithUid = UserProfile & { uid: string };

function PasswordDialog({ user }: { user: UserWithUid }) {
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <KeyRound className="mr-1 size-3" />
          Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password — {user.username}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!password.trim()) return;
            startTransition(async () => {
              await updateUserPassword(user.uid, password);
              setPassword("");
              setOpen(false);
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={pending}
            />
          </div>
          <Button type="submit" disabled={pending || !password.trim()}>
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddUserForm() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [superUser, setSuperUser] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 size-3.5" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!username.trim() || !password.trim()) return;
            startTransition(async () => {
              await addUser(username.trim(), password, superUser);
              setUsername("");
              setPassword("");
              setSuperUser(false);
              setOpen(false);
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={pending}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="superUser"
              checked={superUser}
              onChange={(e) => setSuperUser(e.target.checked)}
              disabled={pending}
            />
            <Label htmlFor="superUser">Admin (Super User)</Label>
          </div>
          <Button type="submit" disabled={pending || !username.trim() || !password.trim()}>
            {pending ? "Creating..." : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UserManager({ users }: { users: UserWithUid[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddUserForm />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.superUser ? "default" : "secondary"}>
                      {user.superUser ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <PasswordDialog user={user} />
                      <Button
                        variant="destructive"
                        size="xs"
                        disabled={pending}
                        onClick={() =>
                          startTransition(() => deleteUser(user.uid))
                        }
                      >
                        <Trash2 className="mr-1 size-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
