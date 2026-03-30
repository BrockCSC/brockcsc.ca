import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function EventModal({ showModal, setShowModal } : { showModal: boolean; setShowModal: (value: boolean) => void }) {
    return (
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
    );
}