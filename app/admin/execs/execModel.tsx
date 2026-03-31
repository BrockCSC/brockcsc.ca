import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function ExecModal({ showModal, setShowModal } : { showModal: boolean; setShowModal: (value: boolean) => void }) {
    return (
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Edit Executive">
				<form>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Full Name</label>
						<input type="text" className="w-full rounded border px-3 py-2" placeholder="John Doe" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Description</label>
						<textarea className="w-full rounded border px-3 py-2" placeholder="Describe the event goals and requirements..." />
					</div>
					<div className="flex w-full mb-4">
						<div className="flex flex-col w-full">
							<label className="block text-sm font-semibold mb-1 flex gap-4">
								Role / Title
								<div className="flex items-center mb-4 w-1/2 justify-start">
									<input type="checkbox" id="simple-checkbox" className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 accent-blue-600" />
									<label className="ml-2 text-sm font-medium text-gray-900">
										Past Executive
									</label>
								</div>
							</label>
							<select className="rounded border px-3 py-2">
								<option>Select Role</option>
								<option>President</option>
								<option>Vice President</option>
								<option>Co-President</option>
								<option>Treasurer</option>
								<option>Executive</option>
							</select>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Github URL</label>
						<input type="text" className="w-full rounded border px-3 py-2" placeholder="https://github.com/username" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">LinkedIn</label>
						<input type="email" className="w-full rounded border px-3 py-2" placeholder="https://www.linkedin.com/in/username" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Instagram</label>
						<input type="email" className="w-full rounded border px-3 py-2" placeholder="https://www.instagram.com/username" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">X URL</label>
						<input type="text" className="w-full rounded border px-3 py-2" placeholder="https://twitter.com/username" />
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Profile Photo URL</label>
						<input type="url" className="w-full rounded border px-3 py-2" placeholder="https://example.com/photo.png" />
					</div>
					<div className="flex gap-4">
						<Button variant="primary" type="submit">Save Executive Member</Button>
						<Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
							Cancel
						</Button>
					</div>
				</form>
			</Modal>
    )
}