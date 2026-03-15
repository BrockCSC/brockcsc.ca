"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-500 mb-6">Welcome back!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 mb-8 gap-6">
            <Card>
              <div className="flex flex-col items-start w-full">
                <span className="text-xs font-semibold text-neutral-500 mb-2">WEBSITE VISITS</span>
                <span className="text-2xl font-bold mb-1">2.4k</span>
                <span className="text-green-600 text-sm font-medium">↑ +12% this month</span>
              </div>
            </Card>
            <div className="flex flex-col gap-4 mb-10 h-full justify-center">
            <Button asChild variant="primary" className="w-full md:w-auto">
              <Link href="/admin/events">+ Create New Event</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full md:w-auto">
              <Link href="/admin/execs">+ Add New Executive</Link>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-neutral-500 mb-6">Click to edit an event</p>
        {/* Add an easily editable upcoming/recurring events section here. */}
      </div>
    </div>
  );
}
