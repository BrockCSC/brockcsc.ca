"use client";

import { getFirebaseClient } from "@/lib/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const adminTabs = [
  { name: "Dashboard", href: "/admin" },
  { name: "Events Management", href: "/admin/events" },
  { name: "Executives Management", href: "/admin/execs" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { auth } = getFirebaseClient();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Authentication logic: Redirect to login if not authenticated, otherwise show admin layout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error("Login failed:", error);
          router.push("/");
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <div className="py-32 text-center text-lg font-bold">Authenticating...</div>;
  }

  // Admin layout with navigation tabs and content area
  return (
    <div className="pt-8">
      <div className="mx-auto w-full max-w-[1060px] px-5">
        <div className="flex items-center justify-between mb-8">
          <nav className="flex gap-2">
            {adminTabs.map((tab) => {
              const isActive =
                tab.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-2 rounded-[12px] font-semibold border-2 border-transparent transition-colors ${
                    isActive ? "border-[#9A4440] text-[#9A4440] bg-[#fff1f0]" : "text-black hover:bg-neutral-100"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {/* TODO: Add signout button */}
            {/* Optionally add sign out button here */}
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}