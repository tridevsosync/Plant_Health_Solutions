"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Shield,
  Briefcase,
  Layers,
  ArrowUpDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { teamMembers as seedTeamMembers, type TeamMember } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";
import { MediaUploader } from "@/components/site/MediaUploader";

const DEPARTMENTS = [
  "Founder",
  "Executive",
  "R&D",
  "Operations",
  "Agronomy",
  "Biotechnology",
  "Extension",
  "Quality Control",
  "General",
];

const blankMember: TeamMember = {
  id: "",
  name: "",
  role: "",
  department: "Agronomy",
  bio: "",
  image: "",
  email: "",
  phone: "",
  order: 0,
  status: "Active",
};

export default function AdminTeamPage() {
  const { state, saveTeamMember, deleteTeamMember, saveSettings } = useApp();
  const [editing, setEditing] = React.useState<TeamMember | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [togglingVisibility, setTogglingVisibility] = React.useState(false);

  // Filters & Search
  const [search, setSearch] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const rawTeam = state.team && state.team.length > 0 ? state.team : seedTeamMembers;

  const isSectionVisible = state.settings.showTeamSection !== false;

  const filteredMembers = rawTeam.filter((m) => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      (m.bio && m.bio.toLowerCase().includes(search.toLowerCase())) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = deptFilter === "All" || m.department === deptFilter;
    const matchesStatus =
      statusFilter === "all" || (m.status || "Active").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = rawTeam.filter((m) => (m.status || "Active") === "Active").length;
  const hiddenCount = rawTeam.filter((m) => m.status === "Hidden").length;

  const handleOpenEdit = (member: TeamMember) => {
    setIsNew(false);
    setEditing({ ...member });
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setEditing({
      ...blankMember,
      id: `team_${Date.now()}`,
      order: rawTeam.length + 1,
    });
  };

  const handleToggleSectionVisibility = async () => {
    try {
      setTogglingVisibility(true);
      const nextState = !isSectionVisible;
      const ok = await saveSettings({
        ...state.settings,
        showTeamSection: nextState,
      });
      if (ok) {
        toast.success(
          nextState
            ? "Meet Our Team section is now VISIBLE on the About page!"
            : "Meet Our Team section is now HIDDEN on the About page!"
        );
      } else {
        toast.error("Failed to update section visibility");
      }
    } catch {
      toast.error("Error updating settings");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Team member name is required");
      return;
    }
    if (!editing.role.trim()) {
      toast.error("Designation / Role is required");
      return;
    }

    setSaving(true);
    const ok = await saveTeamMember(editing, isNew);
    setSaving(false);
    if (ok) {
      toast.success(isNew ? "Team member added successfully!" : "Team member updated successfully!");
      setEditing(null);
    } else {
      toast.error("Failed to save team member");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const ok = await deleteTeamMember(confirmId);
    setDeleting(false);
    if (ok) {
      toast.success("Team member removed successfully");
      setConfirmId(null);
    } else {
      toast.error("Failed to remove team member");
    }
  };

  const handleToggleMemberStatus = async (member: TeamMember) => {
    const nextStatus = member.status === "Hidden" ? "Active" : "Hidden";
    const ok = await saveTeamMember({ ...member, status: nextStatus }, false);
    if (ok) {
      toast.success(`${member.name} is now ${nextStatus === "Active" ? "Active" : "Hidden"}`);
    }
  };

  return (
    <AdminPage
      title="Team Members Management"
      subtitle="Manage your scientists, agronomists, leadership, and operational specialists displayed on the About Us page."
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" /> View /about
          </Link>
          <Btn onClick={handleOpenNew}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Team Member
            </span>
          </Btn>
        </div>
      }
    >
      {/* Visibility Toggle Control Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-5 transition-all ${
          isSectionVisible
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
            : "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isSectionVisible
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-amber-600 text-white shadow-xs"
            }`}
          >
            {isSectionVisible ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-foreground">
                About Page: &quot;Meet Our Team&quot; Section
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isSectionVisible
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                {isSectionVisible ? "Section Active & Visible" : "Section Hidden"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isSectionVisible
                ? "The 'Meet Our Team' section is currently shown on the About page below Founder and Co-Founder."
                : "The 'Meet Our Team' section is currently hidden from website visitors."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleSectionVisibility}
          disabled={togglingVisibility}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-[0.98] ${
            isSectionVisible
              ? "bg-emerald-700 text-white hover:bg-emerald-800"
              : "bg-amber-700 text-white hover:bg-amber-800"
          }`}
        >
          {isSectionVisible ? (
            <>
              <ToggleRight className="h-5 w-5" />
              <span>Hide Team Section</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5" />
              <span>Show Team Section</span>
            </>
          )}
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Members
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{rawTeam.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active on Site
            </span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hidden
            </span>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-muted-foreground">{hiddenCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Page Status
            </span>
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <p
            className={`mt-2 font-display text-lg font-bold ${
              isSectionVisible ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {isSectionVisible ? "Live on /about" : "Hidden"}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member name, designation, department or bio..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9.5 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Team Members Table */}
      <TableWrap>
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className={th}>Member</th>
            <th className={th}>Designation / Role</th>
            <th className={th}>Department / Badge</th>
            <th className={th}>Order</th>
            <th className={th}>Status</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                No team members found. Click &quot;Add Team Member&quot; to add your first member.
              </td>
            </tr>
          ) : (
            filteredMembers.map((member) => {
              const isActive = (member.status || "Active") === "Active";

              return (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className={`${td} font-semibold`}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted/30">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground line-clamp-1">{member.name}</p>
                        {member.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs sm:max-w-md">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className={td}>
                    <span className="font-medium text-foreground text-xs">{member.role}</span>
                  </td>

                  <td className={td}>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {member.department || "Agronomy"}
                    </span>
                  </td>

                  <td className={td}>
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{member.order ?? 0}
                    </span>
                  </td>

                  <td className={td}>
                    <button
                      onClick={() => handleToggleMemberStatus(member)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {isActive ? "Active" : "Hidden"}
                    </button>
                  </td>

                  <td className={td}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Edit Member"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmId(member.id)}
                        className="rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </TableWrap>

      {/* Add / Edit Team Member Modal */}
      {editing && (
        <Modal
          open={Boolean(editing)}
          onClose={() => setEditing(null)}
          title={isNew ? "Add Team Member" : `Edit Team Member: ${editing.name}`}
          wide
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Member Name */}
              <Field label="Full Name *">
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Dr. R. M. Kulkarni"
                  className={inputCls}
                />
              </Field>

              {/* Designation / Role */}
              <Field label="Designation / Role *">
                <input
                  type="text"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  placeholder="e.g. Chief Agronomist or Head of Plant Research"
                  className={inputCls}
                />
              </Field>

              {/* Department / Badge */}
              <Field label="Department / Badge Tag">
                <select
                  value={editing.department || "Agronomy"}
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                  className={inputCls}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Display Order */}
              <Field label="Display Order (Sort Index)">
                <input
                  type="number"
                  value={editing.order ?? 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })}
                  placeholder="1, 2, 3..."
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Photo Upload / URL */}
            <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Profile Photo
              </h4>
              <MediaUploader
                value={editing.image || ""}
                onChange={(url) => setEditing({ ...editing, image: url })}
                accept="image"
                label="Upload Member Photo"
                placeholder="Click or drag to upload photo (PNG, JPG, WebP)"
              />
              <Field label="Or Direct Image URL">
                <input
                  type="url"
                  value={editing.image || ""}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /team/member.jpg"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Bio / Description */}
            <Field label="Short Bio & Qualifications">
              <textarea
                value={editing.bio || ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                rows={3}
                placeholder="e.g. Ph.D. in Soil Microbiology with over 25 years of field research in crop nutrition."
                className={inputCls}
              />
            </Field>

            {/* Optional Contact fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email Address (Optional)">
                <input
                  type="email"
                  value={editing.email || ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  placeholder="name@planthealthsolutions.com"
                  className={inputCls}
                />
              </Field>

              <Field label="Phone / Mobile (Optional)">
                <input
                  type="tel"
                  value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  placeholder="+91 91759 55009"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Status Selector */}
            <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
              <div>
                <p className="text-xs font-bold text-foreground">Display Status</p>
                <p className="text-[11px] text-muted-foreground">
                  Control whether this member appears on the public About page
                </p>
              </div>
              <select
                value={editing.status || "Active"}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as "Active" | "Hidden" })
                }
                className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-bold text-foreground outline-none"
              >
                <option value="Active">Active (Visible)</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <Btn onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : isNew ? "Add Member" : "Save Changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <Modal
          open={Boolean(confirmId)}
          onClose={() => setConfirmId(null)}
          title="Remove Team Member"
        >
          <div className="space-y-4 p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove this team member? This action will remove them from the
              About page.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90 transition-colors"
              >
                {deleting ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
