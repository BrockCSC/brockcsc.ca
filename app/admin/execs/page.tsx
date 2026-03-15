"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const currentExecs = [
	{ name: "Alex Rivera", role: "President", contact: "alex@brock.ca" },
	{ name: "Jordan Smith", role: "Vice President", contact: "jordan@brock.ca" },
	{ name: "Casey Chen", role: "Treasurer", contact: "casey@brock.ca" },
	{ name: "Taylor Morgan", role: "Secretary", contact: "taylor@brock.ca" },
];

const pastExecs = [
	{ name: "Morgan Lee", role: "President", contact: "morgan@brock.ca" },
	{ name: "Sam Patel", role: "Vice President", contact: "sam@brock.ca" },
	{ name: "Jamie Fox", role: "Treasurer", contact: "jamie@brock.ca" },
];

export default function ExecutivesManagementPage() {
		       const [showModal, setShowModal] = useState(false);
		       const [showPast, setShowPast] = useState(false);
		       return (
			       <>
				       <div>
					       <h1 className="text-2xl font-bold mb-2">Executive Management</h1>
					       <p className="text-neutral-500 mb-6">Central dashboard to oversee the executive team, update roles, and add new executive members for the Brock Computer Science Club.</p>

					       <div className="flex items-center gap-4 mb-6">
						       <Button variant="primary" onClick={() => setShowModal(true)}>
							       Add Executive
						       </Button>
					       </div>

					       <div className="mb-10">
						       <h2 className="text-lg font-bold mb-4">Current Executive</h2>
						       <Table>
							       <TableHeader>
								       <TableRow>
									       <TableHead>Name</TableHead>
									       <TableHead>Role</TableHead>
									       <TableHead>Contact</TableHead>
									       <TableHead>Edit</TableHead>
								       </TableRow>
							       </TableHeader>
							       <TableBody>
								       {currentExecs.map((exec, idx) => (
									       <TableRow key={idx}>
										       <TableCell>{exec.name}</TableCell>
										       <TableCell>{exec.role}</TableCell>
										       <TableCell>{exec.contact}</TableCell>
										       <TableCell>
											       <Button variant="link" size="sm" onClick={() => setShowModal(true)}>EDIT</Button>
										       </TableCell>
									       </TableRow>
								       ))}
							       </TableBody>
						       </Table>
						       <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">{currentExecs.length} active members</div>
					       </div>

					       <div className="mb-10 border-t-2 border-black pt-6">
							   <button 
									className="flex items-center gap-2 text-xl font-bold mb-4 hover:opacity-80 transition-opacity"
									onClick={() => setShowPast(!showPast)}
								>
									{showPast ? "Hide" : "Show"} Past Executives {showPast ? "▲" : "▼"}
								</button>
						       {showPast && (
							       <div className="mt-4">
								       <h2 className="text-lg font-bold mb-4">Past Executives</h2>
								       <Table>
									       <TableHeader>
										       <TableRow>
											       <TableHead>Name</TableHead>
											       <TableHead>Role</TableHead>
											       <TableHead>Contact</TableHead>
											       <TableHead>Edit</TableHead>
										       </TableRow>
									       </TableHeader>
									       <TableBody>
										       {pastExecs.map((exec, idx) => (
											       <TableRow key={idx}>
												       <TableCell>{exec.name}</TableCell>
												       <TableCell>{exec.role}</TableCell>
												       <TableCell>{exec.contact}</TableCell>
												       <TableCell>
														   <Button variant="link" size="sm" onClick={() => setShowModal(true)}>EDIT</Button>
												       </TableCell>
											       </TableRow>
										       ))}
									       </TableBody>
								       </Table>
								       <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">{pastExecs.length} past members</div>
							       </div>
						       )}
					       </div>
				       </div>
				       <Modal open={showModal} onClose={() => setShowModal(false)} title="Edit Executive">
					       {/* Modal form for editing/adding executive details */}
					       <form>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Full Name</label>
							       <input type="text" className="w-full rounded border px-3 py-2" placeholder="John Doe" />
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Role / Title</label>
							       <select className="w-full rounded border px-3 py-2">
								       <option>Select Role</option>
								       <option>President</option>
								       <option>Vice President</option>
								       <option>Treasurer</option>
								       <option>Secretary</option>
							       </select>
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Email</label>
							       <input type="email" className="w-full rounded border px-3 py-2" placeholder="edu@brock.ca" />
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Social URL</label>
							       <input type="text" className="w-full rounded border px-3 py-2" placeholder="Linkedin or Portfolio" />
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
			       </>
		       );
		       return (
			       <>
				       <div>
					       <h1 className="text-2xl font-bold mb-2">Executive Management</h1>
					       <p className="text-neutral-500 mb-6">Central dashboard to oversee the executive team, update roles, and add new executive members for the Brock Computer Science Club.</p>

					       <div className="flex items-center gap-4 mb-6">
						       <Button variant="primary" onClick={() => setShowModal(true)}>
							       Add Executive
						       </Button>
					       </div>

					       <div className="mb-10">
						       <h2 className="text-lg font-bold mb-4">Current Executive</h2>
						       <Table>
							       <TableHeader>
								       <TableRow>
									       <TableHead>Name</TableHead>
									       <TableHead>Role</TableHead>
									       <TableHead>Contact</TableHead>
									       <TableHead>Edit</TableHead>
								       </TableRow>
							       </TableHeader>
							       <TableBody>
								       {currentExecs.map((exec, idx) => (
									       <TableRow key={idx}>
										       <TableCell>{exec.name}</TableCell>
										       <TableCell>{exec.role}</TableCell>
										       <TableCell>{exec.contact}</TableCell>
										       <TableCell>
											       <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>Edit</Button>
										       </TableCell>
									       </TableRow>
								       ))}
							       </TableBody>
						       </Table>
						       <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">{currentExecs.length} active members</div>
					       </div>

					       <div className="mb-10">
						       <Button variant="secondary" onClick={() => setShowPast(!showPast)}>
							       {showPast ? "Hide" : "Show"} Past Executives
						       </Button>
						       {showPast && (
							       <div className="mt-4">
								       <h2 className="text-lg font-bold mb-4">Past Executives</h2>
								       <Table>
									       <TableHeader>
										       <TableRow>
											       <TableHead>Name</TableHead>
											       <TableHead>Role</TableHead>
											       <TableHead>Contact</TableHead>
											       <TableHead>Edit</TableHead>
										       </TableRow>
									       </TableHeader>
									       <TableBody>
										       {pastExecs.map((exec, idx) => (
											       <TableRow key={idx}>
												       <TableCell>{exec.name}</TableCell>
												       <TableCell>{exec.role}</TableCell>
												       <TableCell>{exec.contact}</TableCell>
												       <TableCell>
													       <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>Edit</Button>
												       </TableCell>
											       </TableRow>
										       ))}
									       </TableBody>
								       </Table>
								       <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">{pastExecs.length} past members</div>
							       </div>
						       )}
					       </div>
				       </div>
				       <Modal open={showModal} onClose={() => setShowModal(false)} title="Edit Executive">
					       {/* Modal form for editing/adding executive details */}
					       <form>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Full Name</label>
							       <input type="text" className="w-full rounded border px-3 py-2" placeholder="John Doe" />
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Role / Title</label>
							       <select className="w-full rounded border px-3 py-2">
								       <option>Select Role</option>
								       <option>President</option>
								       <option>Vice President</option>
								       <option>Treasurer</option>
								       <option>Secretary</option>
							       </select>
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Email</label>
							       <input type="email" className="w-full rounded border px-3 py-2" placeholder="edu@brock.ca" />
						       </div>
						       <div className="mb-4">
							       <label className="block text-sm font-semibold mb-1">Social URL</label>
							       <input type="text" className="w-full rounded border px-3 py-2" placeholder="Linkedin or Portfolio" />
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
			       </>
		       );
			}
											       