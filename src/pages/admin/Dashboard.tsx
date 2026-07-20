import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Code2,
  FolderKanban,
  Info,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Home,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ImageUpload";
import {
  subscribeAbout,
  subscribeTeam,
  subscribeSkills,
  subscribeProjects,
  saveAbout,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  addSkill,
  updateSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  formatFirebaseError,
} from "../../services/dataService";
import type {
  AdminSection,
  AboutInfo,
  TeamMember,
  Skill,
  Project,
} from "../../types";

const navItems: { id: AdminSection; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "about", label: "About", icon: Info },
  { id: "team", label: "Team", icon: Users },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

const emptyMember = (): Omit<TeamMember, "id"> => ({
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  social: { github: "", linkedin: "", twitter: "" },
  order: 0,
});

const emptySkill = (): Omit<Skill, "id"> => ({
  name: "",
  percentage: 50,
  category: "Frontend",
  color: "#8b5cf6",
  order: 0,
});

const emptyProject = (): Omit<Project, "id"> => ({
  title: "",
  description: "",
  imageUrl: "",
  websiteUrl: "",
  tags: [],
  featured: false,
  order: 0,
});

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("overview");
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"ok" | "err">("ok");
  // Open-rules demo: allow admin without Firebase login
  const [guestAdmin, setGuestAdmin] = useState(() => {
    try {
      return localStorage.getItem("clayteam_guest_admin") === "1";
    } catch {
      return false;
    }
  });

  // forms
  const [aboutForm, setAboutForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    mission: "",
    vision: "",
    imageUrl: "",
  });
  const [memberForm, setMemberForm] = useState(emptyMember());
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState(emptySkill());
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProject());
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const canAccess = !!user || guestAdmin;

  useEffect(() => {
    if (!authLoading && !canAccess) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, authLoading, canAccess, navigate]);

  useEffect(() => {
    const u1 = subscribeAbout((data) => {
      setAbout(data);
      if (data) {
        setAboutForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          mission: data.mission || "",
          vision: data.vision || "",
          imageUrl: data.imageUrl || "",
        });
      }
    });
    const u2 = subscribeTeam(setTeam);
    const u3 = subscribeSkills(setSkills);
    const u4 = subscribeProjects(setProjects);
    return () => {
      u1();
      u2();
      u3();
      u4();
    };
  }, []);

  const flash = (msg: string, type: "ok" | "err" = "ok") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("clayteam_guest_admin");
    } catch {
      /* ignore */
    }
    setGuestAdmin(false);
    if (user) await logout();
    navigate("/admin/login");
  };

  const saveAboutForm = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAbout(aboutForm);
      flash("About saved!");
    } catch (err) {
      console.error(err);
      flash(formatFirebaseError(err), "err");
    } finally {
      setSaving(false);
    }
  };

  const saveMember = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMember) {
        await updateTeamMember(editingMember, memberForm);
        flash("Member updated!");
      } else {
        await addTeamMember({ ...memberForm, order: team.length });
        flash("Member added!");
      }
      setMemberForm(emptyMember());
      setEditingMember(null);
      setShowMemberForm(false);
    } catch (err) {
      console.error(err);
      flash(formatFirebaseError(err), "err");
    } finally {
      setSaving(false);
    }
  };

  const editMember = (m: TeamMember) => {
    setMemberForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
      social: {
        github: m.social?.github || "",
        linkedin: m.social?.linkedin || "",
        twitter: m.social?.twitter || "",
      },
      order: m.order ?? 0,
    });
    setEditingMember(m.id);
    setShowMemberForm(true);
  };

  const removeMember = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await deleteTeamMember(id);
      flash("Member deleted.");
    } catch (err) {
      flash(formatFirebaseError(err), "err");
    }
  };

  const saveSkillForm = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...skillForm,
        percentage: Math.min(100, Math.max(0, Number(skillForm.percentage) || 0)),
      };
      if (editingSkill) {
        await updateSkill(editingSkill, payload);
        flash("Skill updated!");
      } else {
        await addSkill({ ...payload, order: skills.length });
        flash("Skill added!");
      }
      setSkillForm(emptySkill());
      setEditingSkill(null);
      setShowSkillForm(false);
    } catch (err) {
      console.error(err);
      flash(formatFirebaseError(err), "err");
    } finally {
      setSaving(false);
    }
  };

  const editSkillItem = (s: Skill) => {
    setSkillForm({
      name: s.name,
      percentage: s.percentage,
      category: s.category,
      color: s.color || "#8b5cf6",
      icon: s.icon,
      order: s.order ?? 0,
    });
    setEditingSkill(s.id);
    setShowSkillForm(true);
  };

  const removeSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      flash("Skill deleted.");
    } catch (err) {
      flash(formatFirebaseError(err), "err");
    }
  };

  const saveProjectForm = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = { ...projectForm, tags };
      if (editingProject) {
        await updateProject(editingProject, payload);
        flash("Project updated!");
      } else {
        await addProject({ ...payload, order: projects.length });
        flash("Project added!");
      }
      setProjectForm(emptyProject());
      setTagsInput("");
      setEditingProject(null);
      setShowProjectForm(false);
    } catch (err) {
      console.error(err);
      flash(formatFirebaseError(err), "err");
    } finally {
      setSaving(false);
    }
  };

  const editProjectItem = (p: Project) => {
    setProjectForm({
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      websiteUrl: p.websiteUrl,
      tags: p.tags || [],
      featured: p.featured || false,
      order: p.order ?? 0,
    });
    setTagsInput((p.tags || []).join(", "));
    setEditingProject(p.id);
    setShowProjectForm(true);
  };

  const removeProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      flash("Project deleted.");
    } catch (err) {
      flash(formatFirebaseError(err), "err");
    }
  };

  if (authLoading || !canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="blob w-64 h-64 bg-violet-300 top-0 left-0" />
      <div className="blob w-72 h-72 bg-pink-200 bottom-0 right-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <header className="clay-nav flex flex-wrap items-center justify-between gap-3 px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-violet-950">Admin Dashboard</h1>
              <p className="text-xs font-medium text-violet-500 truncate max-w-[220px]">
                {user?.email || "Guest admin (open rules)"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="clay-btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="clay-btn-danger px-3 py-2 text-sm flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {message && (
          <div
            className={`clay-sm mb-4 px-4 py-3 text-sm font-bold page-enter ${
              messageType === "err" ? "text-rose-600" : "text-violet-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-[240px_1fr] gap-5">
          {/* Sidebar */}
          <aside className="clay p-3 h-fit lg:sticky lg:top-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  section === item.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-300"
                    : "text-violet-700 hover:bg-violet-100/70"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="space-y-5 page-enter" key={section}>
            {section === "overview" && (
              <>
                <h2 className="section-title text-2xl">Overview</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Team", value: team.length, icon: Users, color: "from-violet-400 to-purple-500", go: "team" as const },
                    { label: "Skills", value: skills.length, icon: Code2, color: "from-fuchsia-400 to-pink-500", go: "skills" as const },
                    { label: "Projects", value: projects.length, icon: FolderKanban, color: "from-sky-400 to-blue-500", go: "projects" as const },
                    { label: "About", value: about ? "Set" : "Empty", icon: Info, color: "from-emerald-400 to-teal-500", go: "about" as const },
                  ].map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setSection(c.go)}
                      className="clay p-5 text-left hover:-translate-y-0.5 transition-transform"
                    >
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                        <c.icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-2xl font-extrabold text-violet-900">{c.value}</p>
                      <p className="text-sm font-bold text-violet-500">{c.label}</p>
                    </button>
                  ))}
                </div>
                <div className="clay p-6 space-y-3">
                  <h3 className="font-extrabold text-violet-900">Quick tips</h3>
                  <ul className="text-sm text-violet-600/80 font-medium space-y-2 list-disc pl-5">
                    <li>Use <strong>About</strong> for title, mission, vision & hero image (upload or URL).</li>
                    <li>Add <strong>Team</strong> members with photo upload or image URL.</li>
                    <li>Set <strong>Skills</strong> with a percentage (0–100%).</li>
                    <li><strong>Projects</strong> need image URL + website URL (upload optional for image).</li>
                    <li>Deploy <code className="text-violet-800">firestore.rules</code> and <code className="text-violet-800">storage.rules</code> in Firebase.</li>
                  </ul>
                </div>
              </>
            )}

            {section === "about" && (
              <>
                <h2 className="section-title text-2xl">Edit About</h2>
                <form onSubmit={saveAboutForm} className="clay p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Title</label>
                      <input
                        className="clay-input"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Subtitle</label>
                      <input
                        className="clay-input"
                        value={aboutForm.subtitle}
                        onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-violet-900">Description</label>
                    <textarea
                      className="clay-input min-h-[120px] resize-y"
                      value={aboutForm.description}
                      onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Mission</label>
                      <textarea
                        className="clay-input min-h-[80px] resize-y"
                        value={aboutForm.mission}
                        onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Vision</label>
                      <textarea
                        className="clay-input min-h-[80px] resize-y"
                        value={aboutForm.vision}
                        onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                      />
                    </div>
                  </div>
                  <ImageUpload
                    label="About Image"
                    folder="about"
                    value={aboutForm.imageUrl}
                    onChange={(url) => setAboutForm({ ...aboutForm, imageUrl: url })}
                  />
                  <button type="submit" disabled={saving} className="clay-btn px-6 py-3 text-sm flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save About"}
                  </button>
                </form>
              </>
            )}

            {section === "team" && (
              <>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="section-title text-2xl">Team Members</h2>
                  <button
                    type="button"
                    className="clay-btn px-4 py-2.5 text-sm flex items-center gap-1.5"
                    onClick={() => {
                      setMemberForm(emptyMember());
                      setEditingMember(null);
                      setShowMemberForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Member
                  </button>
                </div>

                {showMemberForm && (
                  <form onSubmit={saveMember} className="clay p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-violet-900">
                        {editingMember ? "Edit Member" : "New Member"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMemberForm(false);
                          setEditingMember(null);
                        }}
                        className="clay-sm p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Name</label>
                        <input
                          className="clay-input"
                          required
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Role</label>
                        <input
                          className="clay-input"
                          required
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Bio</label>
                      <textarea
                        className="clay-input min-h-[80px]"
                        value={memberForm.bio}
                        onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                      />
                    </div>
                    <ImageUpload
                      label="Photo"
                      folder="team"
                      value={memberForm.imageUrl}
                      onChange={(url) => setMemberForm({ ...memberForm, imageUrl: url })}
                    />
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">GitHub URL</label>
                        <input
                          className="clay-input"
                          value={memberForm.social?.github || ""}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              social: { ...memberForm.social, github: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">LinkedIn URL</label>
                        <input
                          className="clay-input"
                          value={memberForm.social?.linkedin || ""}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              social: { ...memberForm.social, linkedin: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Twitter/X URL</label>
                        <input
                          className="clay-input"
                          value={memberForm.social?.twitter || ""}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              social: { ...memberForm.social, twitter: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={saving} className="clay-btn px-6 py-3 text-sm flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : editingMember ? "Update" : "Add Member"}
                    </button>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <div key={m.id} className="clay-sm p-4 flex gap-4 items-start">
                      <img
                        src={
                          m.imageUrl ||
                          `https://placehold.co/80x80/ddd6fe/6d28d9?text=${encodeURIComponent(m.name?.[0] || "?")}`
                        }
                        alt={m.name}
                        className="h-16 w-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-violet-950 truncate">{m.name}</p>
                        <p className="text-xs font-bold text-fuchsia-600">{m.role}</p>
                        <p className="text-xs text-violet-500 mt-1 line-clamp-2">{m.bio}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => editMember(m)} className="clay-sm p-2 text-violet-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => removeMember(m.id)} className="clay-sm p-2 text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {team.length === 0 && (
                    <p className="text-sm font-bold text-violet-500 col-span-full text-center py-8">
                      No members yet. Add your first teammate!
                    </p>
                  )}
                </div>
              </>
            )}

            {section === "skills" && (
              <>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="section-title text-2xl">Skills</h2>
                  <button
                    type="button"
                    className="clay-btn px-4 py-2.5 text-sm flex items-center gap-1.5"
                    onClick={() => {
                      setSkillForm(emptySkill());
                      setEditingSkill(null);
                      setShowSkillForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Skill
                  </button>
                </div>

                {showSkillForm && (
                  <form onSubmit={saveSkillForm} className="clay p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-violet-900">
                        {editingSkill ? "Edit Skill" : "New Skill"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSkillForm(false);
                          setEditingSkill(null);
                        }}
                        className="clay-sm p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Skill Name</label>
                        <input
                          className="clay-input"
                          required
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          placeholder="React, Figma, Node.js..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Category</label>
                        <input
                          className="clay-input"
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          placeholder="Frontend, Backend, Design..."
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">
                          Percentage: {skillForm.percentage}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          className="w-full accent-violet-600"
                          value={skillForm.percentage}
                          onChange={(e) =>
                            setSkillForm({ ...skillForm, percentage: Number(e.target.value) })
                          }
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="clay-input mt-2"
                          value={skillForm.percentage}
                          onChange={(e) =>
                            setSkillForm({
                              ...skillForm,
                              percentage: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-violet-900">Bar Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            className="h-12 w-14 rounded-xl cursor-pointer border-0 bg-transparent"
                            value={skillForm.color || "#8b5cf6"}
                            onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                          />
                          <input
                            className="clay-input"
                            value={skillForm.color || "#8b5cf6"}
                            onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                          />
                        </div>
                        <div className="skill-bar-track mt-3">
                          <div
                            className="skill-bar-fill"
                            style={{
                              width: `${skillForm.percentage}%`,
                              background: `linear-gradient(90deg, ${skillForm.color}, ${skillForm.color}aa)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={saving} className="clay-btn px-6 py-3 text-sm flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : editingSkill ? "Update Skill" : "Add Skill"}
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {skills.map((s) => (
                    <div key={s.id} className="clay-sm p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-violet-950">{s.name}</span>
                            {s.category && (
                              <span className="ml-2 text-[10px] font-bold uppercase bg-violet-100 text-violet-600 px-2 py-0.5 rounded-md">
                                {s.category}
                              </span>
                            )}
                          </div>
                          <span className="font-extrabold text-violet-600 shrink-0">{s.percentage}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <div
                            className="skill-bar-fill"
                            style={{
                              width: `${s.percentage}%`,
                              background: s.color
                                ? `linear-gradient(90deg, ${s.color}, ${s.color}aa)`
                                : undefined,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button type="button" onClick={() => editSkillItem(s)} className="clay-sm p-2 text-violet-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => removeSkill(s.id)} className="clay-sm p-2 text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm font-bold text-violet-500 text-center py-8">
                      No skills yet. Add skills with % levels.
                    </p>
                  )}
                </div>
              </>
            )}

            {section === "projects" && (
              <>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="section-title text-2xl">Projects</h2>
                  <button
                    type="button"
                    className="clay-btn px-4 py-2.5 text-sm flex items-center gap-1.5"
                    onClick={() => {
                      setProjectForm(emptyProject());
                      setTagsInput("");
                      setEditingProject(null);
                      setShowProjectForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Project
                  </button>
                </div>

                {showProjectForm && (
                  <form onSubmit={saveProjectForm} className="clay p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-violet-900">
                        {editingProject ? "Edit Project" : "New Project"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setEditingProject(null);
                        }}
                        className="clay-sm p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Title</label>
                      <input
                        className="clay-input"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Description / About</label>
                      <textarea
                        className="clay-input min-h-[100px]"
                        required
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">Website URL</label>
                      <input
                        type="url"
                        className="clay-input"
                        placeholder="https://example.com"
                        value={projectForm.websiteUrl}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, websiteUrl: e.target.value })
                        }
                      />
                    </div>
                    <ImageUpload
                      label="Project Image (upload or URL)"
                      folder="projects"
                      value={projectForm.imageUrl}
                      onChange={(url) => setProjectForm({ ...projectForm, imageUrl: url })}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-violet-900">
                        Tags (comma separated)
                      </label>
                      <input
                        className="clay-input"
                        placeholder="React, Firebase, Design"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-violet-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!projectForm.featured}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, featured: e.target.checked })
                        }
                        className="accent-violet-600 h-4 w-4"
                      />
                      <Star className="h-4 w-4 text-amber-500" />
                      Featured project
                    </label>
                    <button type="submit" disabled={saving} className="clay-btn px-6 py-3 text-sm flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
                    </button>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className="clay-sm overflow-hidden">
                      <div className="aspect-video bg-violet-100">
                        <img
                          src={
                            p.imageUrl ||
                            "https://placehold.co/400x220/ddd6fe/6d28d9?text=Project"
                          }
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-extrabold text-violet-950">{p.title}</p>
                            {p.featured && (
                              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-amber-400" /> Featured
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button type="button" onClick={() => editProjectItem(p)} className="clay-sm p-2 text-violet-600">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => removeProject(p.id)} className="clay-sm p-2 text-rose-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-violet-500 line-clamp-2 font-medium">{p.description}</p>
                        {p.websiteUrl && (
                          <a
                            href={p.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-violet-600 hover:underline break-all"
                          >
                            {p.websiteUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm font-bold text-violet-500 col-span-full text-center py-8">
                      No projects yet. Add image URL + website URL + about.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
