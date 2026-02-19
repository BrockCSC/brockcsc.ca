"use client";

import { getFirebaseClient } from "@/lib/firebase";
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { auth } = getFirebaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithRedirect(auth, provider);
            } catch (error) {
            console.error("Login failed:", error);
            router.push("/"); // if login fails
            }
        } else {
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <p>Authenticating...</p>;
  }

  return <h1>Admin Dashboard</h1>;
}
