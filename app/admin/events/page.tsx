"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";

export default function EventsManagementPage() {
	const [showModal, setShowModal] = useState(false);
	const [showPastEvents, setShowPastEvents] = useState(false);
	// Dummy event data
	const upcomingEvents = [
		{ title: "Algorithm Workshop", date: "Oct 24, 2023", time: "5:00 PM", location: "ST 102", status: "Upcoming", type: "Upcoming" },
		{ title: "Gaming Night", date: "Oct 28, 2023", time: "7:00 PM", location: "Union Hall", status: "Draft", type: "Upcoming" },
		{ title: "Career Fair prep", date: "Nov 05, 2023", time: "10:00 AM", location: "Computer Lab 3", status: "Confirmed", type: "Upcoming" },
	];
	const recurringEvents = [
		{ title: "Weekly Coding Session", date: "Every Friday", time: "4:00 PM", location: "ST 105", status: "Active", type: "Recurring" },
		{ title: "Monthly Meetup", date: "First Monday", time: "6:00 PM", location: "Room 200", status: "Active", type: "Recurring" },
	];
	const pastEvents = [
		{ title: "Welcome Day 2022", date: "Sep 05, 2022", time: "1:00 PM", location: "Field", status: "Completed", type: "Past" },
		{ title: "Spring Hackathon", date: "Mar 12, 2023", time: "9:00 AM", location: "Gym", status: "Completed", type: "Past" },
	];

	return (
		<div>
			<h1 className="text-2xl font-bold mb-2">Events Management</h1>
			<p className="text-neutral-500 mb-6">Plan, coordinate, and review club events</p>

			<div className="flex items-center justify-between mb-6">
				<Button variant="primary" onClick={() => setShowModal(true)}>+ New Event</Button>
			</div>

			<div className="mb-10">
				<h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Event Title</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{upcomingEvents.map((event, idx) => (
							<TableRow key={idx}>
								<TableCell>{event.title}</TableCell>
								<TableCell>{event.date}</TableCell>
								<TableCell>{event.time}</TableCell>
								<TableCell>{event.location}</TableCell>
								<TableCell>
									<span className={`px-2 py-1 rounded text-xs font-semibold ${
										event.status === "Upcoming" ? "bg-blue-100 text-blue-700" :
										event.status === "Draft" ? "bg-neutral-200 text-neutral-700" :
										"bg-green-100 text-green-700"
									}`}>
										{event.status}
									</span>
								</TableCell>
								<TableCell>
									<Button variant="link" size="sm">EDIT</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mb-10">
				<h2 className="text-xl font-bold mb-4">Recurring Events</h2>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Event Title</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recurringEvents.map((event, idx) => (
							<TableRow key={idx}>
								<TableCell>{event.title}</TableCell>
								<TableCell>{event.date}</TableCell>
								<TableCell>{event.time}</TableCell>
								<TableCell>{event.location}</TableCell>
								<TableCell>
									<span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
										{event.status}
									</span>
								</TableCell>
								<TableCell>
									<Button variant="link" size="sm">EDIT</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mb-10 border-t-2 border-black pt-6">
				<button 
					className="flex items-center gap-2 text-xl font-bold mb-4 hover:opacity-80 transition-opacity"
					onClick={() => setShowPastEvents(!showPastEvents)}
				>
					Past Events {showPastEvents ? "▲" : "▼"}
				</button>
				
				{showPastEvents && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Event Title</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pastEvents.map((event, idx) => (
								<TableRow key={idx}>
									<TableCell>{event.title}</TableCell>
									<TableCell>{event.date}</TableCell>
									<TableCell>{event.time}</TableCell>
									<TableCell>{event.location}</TableCell>
									<TableCell>
										<span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-200 text-neutral-700">
											{event.status}
										</span>
									</TableCell>
									<TableCell>
										<Button variant="link" size="sm">EDIT</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			<Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Event">
				<form>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Event Title</label>
						<input type="text" className="w-full rounded border px-3 py-2" placeholder="e.g. Intro to Python Workshop" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Description</label>
						<textarea className="w-full rounded border px-3 py-2" placeholder="Describe the event goals and requirements..." />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Poster Photo URL</label>
						<input type="url" className="w-full rounded border px-3 py-2" placeholder="https://example.com/poster.png" />
					</div>
					<div className="flex gap-4 mb-4">
						<div className="flex-1">
							<label className="block text-sm font-semibold mb-1">Date & Time</label>
							<input type="text" className="w-full rounded border px-3 py-2" placeholder="mm/dd/yyyy, --:-- --" />
						</div>
						<div className="flex-1">
							<label className="block text-sm font-semibold mb-1">Location</label>
							<input type="text" className="w-full rounded border px-3 py-2" placeholder="e.g. MC 402 or Zoom Link" />
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Recurring</label>
						<select className="w-full rounded border px-3 py-2">
							<option>None</option>
							<option>Weekly</option>
							<option>Monthly</option>
						</select>
					</div>
					<div className="flex gap-4">
						<Button variant="primary" type="submit">Create Event</Button>
						<Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
