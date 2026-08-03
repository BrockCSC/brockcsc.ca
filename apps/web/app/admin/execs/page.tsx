"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  deleteExec,
  ExecRecord,
  fetchCurrentExecs,
  fetchPreviousExecs,
  WithKey,
} from "@/lib/api";
import ExecModal from "./execModel";
import { ConfirmationModal } from "@/components/ui/modal";
import { AdminTable, ColumnDef } from "@/components/ui/admin-table";

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

const sortCurrentExecsByRoleThenDatabaseOrder = (
  members: TeamMember[],
): TeamMember[] => {
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
  const [selectedExec, setSelectedExec] = useState<TeamMember | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [openConfirmationModel, setOpenConfirmationModel] = useState(false);

  // Define shared Actions column
  const actionsColumn: ColumnDef<(typeof currentExecs)[0]> = {
    header: "Actions",
    headerClassName: "text-center",
    cellClassName: "flex justify-around gap-[15px]",
    cell: (event) => (
      <>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setSelectedExec(event);
            setShowModal(true);
          }}
        >
          EDIT
        </Button>
        <Button
          variant="link"
          className="text-red-600"
          size="sm"
          onClick={() => {
            setSelectedExec(event);
            setOpenConfirmationModel(true);
          }}
        >
          Delete
        </Button>
      </>
    ),
  };

  const standardColumns: ColumnDef<(typeof currentExecs)[0]>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cellClassName: "max-w-[12rem] truncate",
    },
    { header: "Role", accessorKey: "title" },
    actionsColumn,
  ];

  const loadTeam = async (active = true) => {
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

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [current, previous] = await Promise.all([
          fetchCurrentExecs(),
          fetchPreviousExecs(),
        ]);
        if (!active) return;
        setCurrentExecs(sortCurrentExecsByRoleThenDatabaseOrder(current));
        setPreviousExecs(previous);
      } catch {
        if (active) console.log("Could not load team members right now.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-2">Executive Management</h1>
        <p className="text-neutral-500 mb-6">
          Central dashboard to oversee the executive team, update roles, and add
          new executive members for the Brock Computer Science Club.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedExec(null);
              setShowModal(true);
            }}
          >
            Add Executive
          </Button>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Current Executive</h2>
          <AdminTable
            columns={standardColumns}
            data={currentExecs}
            keyExtractor={(e) => e.$key}
          />
          <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">
            {currentExecs.length} active members
          </div>
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
              <AdminTable
                columns={standardColumns}
                data={previousExecs}
                keyExtractor={(e) => e.$key}
              />
              <div className="mt-2 text-right text-xs text-neutral-500 font-semibold">
                {previousExecs.length} past members
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation modal for deleting an executive member */}
      {openConfirmationModel && (
        <ConfirmationModal
          open={openConfirmationModel}
          title="Confirm Deletion"
          message="Are you sure you want to delete this executive? This action cannot be undone."
          onConfirm={async () => {
            if (!selectedExec?.$key) return;
            await deleteExec(selectedExec.$key);
            loadTeam();
          }}
          onClose={() => setOpenConfirmationModel(false)}
        />
      )}

      {/* Modal for adding/editing executives */}
      {showModal && (
        <ExecModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedExec={selectedExec}
          onSave={() => void loadTeam()}
        />
      )}
    </>
  );
}
