"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

export default function UserSync() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);
  const [hasSynced, setHasSynced] = useState(false); // Track sync status

  useEffect(() => {
    // Only run if we have a user and haven't synced in this session yet
    if (!user || hasSynced) return;

    const syncUser = async () => {
      try {
        await createUser({
          clerkId: user.id,
          name: user.fullName ?? "Anonymous",
          email: user.primaryEmailAddress?.emailAddress ?? "",
          image: user.imageUrl,
        });
        setHasSynced(true); // Stop further sync attempts
      } catch (error) {
        console.error("User sync failed:", error);
      }
    };

    syncUser();
  }, [user, createUser, hasSynced]);

  return null;
}