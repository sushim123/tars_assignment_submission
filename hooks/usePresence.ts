"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function usePresence() {
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    updatePresence(); 

  
    const interval = setInterval(() => {
      updatePresence();
    }, 5000); 

    return () => clearInterval(interval);
  }, [updatePresence]);
}