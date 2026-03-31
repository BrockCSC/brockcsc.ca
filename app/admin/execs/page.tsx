"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ExecRecord, fetchCurrentExecs, fetchPreviousExecs, WithKey } from "@/lib/firebase";
import ExecModal from "./execModel";

type TeamMember = WithKey<ExecRecord>;

const UNKNOWN_ROLE_PRIORITY = Number.MAX_SAFE_INTEGER;

const ROLE_PRIORITY: Record<string, number> = {
  president: 1,
  "vice president": 2,
  "co-president": 3,
  treasurer: 4,
  executive: 5,
};

const getRolePriority = (title?: string): number => {
  const normalizedTitle = title?.trim().toLowerCase() ?? "";
  return ROLE_PRIORITY[normalizedTitle] ?? UNKNOWN_ROLE_PRIORITY;
};

const sortCurrentExecsByRoleThenDatabaseOrder = (members: TeamMember[]): TeamMember[] => {
  const orderByKey = new Map<string, number>();
  members.forEach((member, index) => {
    orderByKey.set(member.$key, index);
  });

  return [...members].sort((a, b) => {
    const byRole = getRolePriority(a.title) - getRolePriority(b.title);
    if (byRole !== 0) {
      return byRole;
    }

    const aOrder = orderByKey.get(a.$key) ?? 0;
    const bOrder = orderByKey.get(b.$key) ?? 0;
    return aOrder - bOrder;
  });
};

export default function ExecutivesManagementPage() {
	  const [currentExecs, setCurrentExecs] = useState<TeamMember[]>([]);
	  const [previousExecs, setPreviousExecs] = useState<TeamMember[]>([]);
	  const [showModal, setShowModal] = useState(false);
	  const [showPast, setShowPast] = useState(false);
	
	  useEffect(() => {
		let active = true;
	
		const loadTeam = async () => {
	
		  try {
			const [current, previous] = await Promise.all([
			  fetchCurrentExecs(),
			  fetchPreviousExecs(),
			]);
	
			if (!active) {
			  return;
			}
	
			setCurrentExecs(sortCurrentExecsByRoleThenDatabaseOrder(current));
			setPreviousExecs(previous);
		  } catch {
			if (!active) {
			  return;
			}
			console.log("Could not load team members right now.");
		  }
		};
	
		void loadTeam();
	
		return () => {
		  active = false;
		};
	  }, []);
	
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
								<TableHead>Edit</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentExecs.map((exec, idx) => (
								<TableRow key={idx}>
									<TableCell>{exec.name}</TableCell>
									<TableCell>{exec.title}</TableCell>
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
										<TableHead>Edit</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{previousExecs.map((exec, idx) => (
										<TableRow key={idx}>
											<TableCell>{exec.name}</TableCell>
											<TableCell>{exec.title}</TableCell>
											<TableCell>
												<Button variant="link" size="sm" onClick={() => setShowModal(true)}>EDIT</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<div className="mt-2 text-right text-xs text-neutral-500 font-semibold">{previousExecs.length} past members</div>
						</div>
					)}
				</div>
			</div>
			{showModal && <ExecModal showModal={showModal} setShowModal={setShowModal} />}
		</>
	);
}