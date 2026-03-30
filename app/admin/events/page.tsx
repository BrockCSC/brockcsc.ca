"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EventModal from "./eventsModel";
import { useEffect, useMemo, useState } from "react";
import { EventRecord, fetchAllEvents, WithKey } from "@/lib/firebase";
import { classifyEventsByTiming } from "@/lib/events/classify";

export default function EventsManagementPage() {
	type EventItem = WithKey<EventRecord>;
	
	const [showModal, setShowModal] = useState(false);
	const [showPastEvents, setShowPastEvents] = useState(false);

	const [events, setEvents] = useState<EventItem[]>([]);
	const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

	useEffect(() => {
	let active = true;

	const load = async () => {
			try {
			const allEvents = await fetchAllEvents();
			if (!active) {
				return;
			}
			setEvents(allEvents);
			} catch {
			if (!active) {
				return;
			}
			console.error("Error loading events:");
			}
		};
		
		void load();
			return () => {
			active = false;
		};
	}, []);

	const { upcoming, recurring, past } = useMemo(
		() => {
				let ongoing, upcoming, past;
				({ ongoing, upcoming, past } = classifyEventsByTiming(events, nowTimestamp));

				upcoming = upcoming.concat(ongoing);
				let recurring = upcoming.filter(event => event.schedule?.recurrence);
				upcoming = upcoming.filter(event => !event.schedule?.recurrence);
			

			return { upcoming, recurring, past };
		},
		[events, nowTimestamp]
	);

	const adaptEventForDisplay = (event: EventItem) => ({
		title: event.title,
		date: event.schedule?.startDate,
		time: event.schedule?.startTime,
		location: event.location?.split(",")[0],
	});

	const upcomingEvents = upcoming.map((event) => adaptEventForDisplay(event));
	const recurringEvents = recurring.map((event) => adaptEventForDisplay(event));
	const pastEvents = past.map((event) => adaptEventForDisplay(event));
	
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
										<Button variant="link" size="sm">EDIT</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{showModal && <EventModal showModal={showModal} setShowModal={setShowModal} />}
		</div>
	);
}