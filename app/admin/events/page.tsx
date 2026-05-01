"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EventModal from "./eventsModel";
import { useEffect, useMemo, useState } from "react";
import { EventRecord, fetchAllEvents, WithKey } from "@/lib/firebase";
import { classifyEventsByTiming } from "@/lib/events/classify";
import { getRecurringScheduleText, getEventTiming, formatEventDateLabel, formatEventTimeLabel, formatNextOccurrenceDate } from "@/lib/events/schedule";
import { deleteEvent } from "@/lib/firebase/realtime";

export default function EventsManagementPage() {
	type EventItem = WithKey<EventRecord>;
	
	const [showModal, setShowModal] = useState(false);
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

	const [events, setEvents] = useState<EventItem[]>([]);
	const nowTimestamp = Date.now();

	const load = async (active = true) => {
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

	useEffect(() => {
		let active = true;
		void load(active);
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
		id: event.$key,
		title: event.title,
		date: event.schedule?.startDate,
		time: event.schedule?.startTime,
		location: event.location?.split(",")[0],  
		description: event.description,
		image: event.image,
		rawEvent: event,
	});

	const upcomingEvents = upcoming.map((event) => adaptEventForDisplay(event));
	const recurringEvents = recurring.map((event) => adaptEventForDisplay(event));
	const pastEvents = past.map((event) => adaptEventForDisplay(event));
	
	return (
		<div>
			<h1 className="text-2xl font-bold mb-2">Events Management</h1>
			<p className="text-neutral-500 mb-6">Plan, coordinate, and review club events</p>

			<div className="flex items-center justify-between mb-6">
				<Button variant="primary" onClick={() => { setSelectedEvent(null); setShowModal(true); }}>+ New Event</Button>
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
							<TableHead className="text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{upcomingEvents.map((event) => (
							<TableRow key={event.id}>
								<TableCell className="max-w-[12rem] truncate">{event.title}</TableCell>
								<TableCell>{event.date}</TableCell>
								<TableCell>{event.time}</TableCell>
								<TableCell className="max-w-[10rem] truncate">{event.location}</TableCell>
								<TableCell className="flex justify-around gap-[15px]]">
									<Button variant="link" size="sm" onClick={() => { setSelectedEvent(event.rawEvent); setShowModal(true); }}>EDIT</Button>
									<Button variant="link" className="text-red-600" size="sm" onClick={async () => { await deleteEvent(event.id); load(); }}>Delete</Button>
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
							<TableHead>Recurrence</TableHead>
							<TableHead>Next Occurrence</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Location</TableHead>
							<TableHead className="text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recurringEvents.map((event) => {
							const nextStartTimestamp = getEventTiming(event.rawEvent, nowTimestamp).nextStartTimestamp;
							return (
							<TableRow key={event.id}>
								<TableCell className="max-w-[12rem] truncate">{event.title}</TableCell>
								<TableCell>{event.rawEvent.schedule?.recurrence?.unit}</TableCell>
								<TableCell>{formatNextOccurrenceDate(nextStartTimestamp)}</TableCell>
								<TableCell>{formatEventTimeLabel(event.rawEvent, nextStartTimestamp)}</TableCell>
								<TableCell className="max-w-[10rem] truncate">{event.location}</TableCell>
								<TableCell className="flex justify-around gap-[15px]]">
									<Button variant="link" size="sm" onClick={() => { setSelectedEvent(event.rawEvent); setShowModal(true); }}>EDIT</Button>
									<Button variant="link" className="text-red-600" size="sm" onClick={async () => { await deleteEvent(event.id); load(); }}>Delete</Button>
								</TableCell>
							</TableRow>
						)})}
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
								<TableHead className="text-center">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pastEvents.map((event) => (
								<TableRow key={event.id}>
									<TableCell className="max-w-[12rem] truncate">{event.title}</TableCell>
									<TableCell>{event.date}</TableCell>
									<TableCell>{event.time}</TableCell>
									<TableCell className="max-w-[10rem] truncate">{event.location}</TableCell>
									<TableCell className="flex justify-around gap-[15px]]">
										<Button variant="link" size="sm" onClick={() => { setSelectedEvent(event.rawEvent); setShowModal(true); }}>EDIT</Button>
										<Button variant="link" className="text-red-600" size="sm" onClick={async () => { await deleteEvent(event.id); load(); }}>Delete</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{showModal && <EventModal showModal={showModal} setShowModal={setShowModal} variant={selectedEvent ? "edit" : "create"} selectedEvent={selectedEvent} onSave={() => void load()} />}
		</div>
	);
}