import { adminDb } from "@/lib/firebase-admin";
import type { UserProfile } from "@/lib/types";
import { UserManager } from "@/components/admin/user-manager";

async function getUsers() {
  const snapshot = await adminDb.collection("users").get();
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...(doc.data() as UserProfile),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </div>
      <UserManager users={users} />
    </div>
  );
}
