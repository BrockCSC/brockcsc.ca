"use client";

import { getFirebaseClient } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
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
                await signInWithPopup(auth, provider);
            } catch (error) {
            console.error("Login failed:", error);
            router.push("/"); // if login fails
            }
        } else {
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <p>Authenticating...</p>;
  }

  return <h1>Admin Dashboard</h1>;
}
