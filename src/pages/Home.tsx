import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Code2,
  FolderKanban,
  Sparkles,
  Target,
  Eye,
  ExternalLink,
  Star,
  Info,
} from "lucide-react";
import {
  subscribeAbout,
  subscribeTeam,
  subscribeSkills,
  subscribeProjects,
} from "../services/dataService";
import type { AboutInfo, TeamMember, Skill, Project } from "../types";

function IconGithub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function Home() {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillsAnimated, setSkillsAnimated] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const mark = () => {
      loaded += 1;
      if (loaded >= 4) {
        setLoading(false);
        setTimeout(() => setSkillsAnimated(true), 150);
      }
    };

    const u1 = subscribeAbout((data) => {
      setAbout(data);
      mark();
    });
    const u2 = subscribeTeam((data) => {
      setTeam(data);
      mark();
    });
    const u3 = subscribeSkills((data) => {
      setSkills(data);
      mark();
    });
    const u4 = subscribeProjects((data) => {
      setProjects(data);
      mark();
    });

    return () => {
      u1();
      u2();
      u3();
      u4();
    };
  }, []);

  const sortedSkills = [...skills].sort((a, b) => b.percentage - a.percentage);

  if (loading) {
    return (
      <div className="clay p-16 text-center page-enter">
        <div className="h-12 w-12 mx-auto rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="mt-4 font-bold text-violet-500">Loading all content...</p>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-16">
      {/* Hero */}
      <section className="clay p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 clay-sm px-3 py-1.5 text-xs font-bold text-violet-700">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
              Welcome to our studio
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-violet-950 leading-tight tracking-tight">
              {about?.title || "We craft delightful digital experiences"}
            </h1>
            <p className="text-lg text-violet-700/70 font-medium leading-relaxed">
              {about?.subtitle ||
                "A passionate team building beautiful products with modern tech and soft clay aesthetics."}
            </p>
            {about?.description && (
              <p className="text-violet-600/70 font-medium leading-relaxed line-clamp-4">
                {about.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="clay-btn px-6 py-3 flex items-center gap-2 text-sm">
                View Projects <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#team" className="clay-btn-secondary px-6 py-3 text-sm">
                Meet the Team
              </a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="float clay w-64 h-64 md:w-72 md:h-72 flex items-center justify-center overflow-hidden">
              {about?.imageUrl ? (
                <img
                  src={about.imageUrl}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="h-20 w-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <p className="font-extrabold text-violet-800 text-xl">ClayTeam</p>
                  <p className="text-sm text-violet-500 font-medium mt-1">Creative Collective</p>
                </div>
              )}
            </div>
            <div className="float-delay absolute -bottom-4 -left-4 clay-sm px-4 py-3 hidden sm:block">
              <p className="text-2xl font-extrabold text-violet-700">{team.length || "0"}</p>
              <p className="text-xs font-bold text-violet-500">Team Members</p>
            </div>
            <div className="float absolute -top-2 -right-2 clay-sm px-4 py-3 hidden sm:block">
              <p className="text-2xl font-extrabold text-fuchsia-600">{projects.length || "0"}</p>
              <p className="text-xs font-bold text-violet-500">Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — all counts */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Info, label: "About", value: about ? "Ready" : "Empty", href: "#about", color: "from-emerald-400 to-teal-500" },
          { icon: Users, label: "Team Members", value: team.length, href: "#team", color: "from-violet-400 to-purple-500" },
          { icon: Code2, label: "Skills", value: skills.length, href: "#skills", color: "from-fuchsia-400 to-pink-500" },
          { icon: FolderKanban, label: "Projects", value: projects.length, href: "#projects", color: "from-sky-400 to-blue-500" },
        ].map((s) => (
          <a key={s.label} href={s.href} className="clay p-5 group hover:-translate-y-1 transition-transform">
            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-violet-900">{s.value}</p>
            <p className="text-sm font-bold text-violet-500 flex items-center gap-1 mt-1">
              {s.label}
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </a>
        ))}
      </section>

      {/* About — full data */}
      <section id="about" className="space-y-6 scroll-mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">About Us</h2>
            <p className="text-violet-600/60 font-medium mt-1">Who we are</p>
          </div>
          <Link to="/about" className="clay-btn-secondary px-4 py-2 text-sm shrink-0">
            Full page
          </Link>
        </div>

        <div className="clay p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-extrabold text-violet-950">
                {about?.title || "Our Story"}
              </h3>
              {about?.subtitle && (
                <p className="text-fuchsia-600 font-bold">{about.subtitle}</p>
              )}
              <p className="text-violet-700/75 font-medium leading-relaxed whitespace-pre-line">
                {about?.description ||
                  "Add about content from the Admin Dashboard — title, description, mission, vision, and image."}
              </p>
            </div>
            <div className="clay overflow-hidden aspect-[4/3] max-w-md md:ml-auto w-full">
              {about?.imageUrl ? (
                <img
                  src={about.imageUrl}
                  alt={about.title || "About"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-200 via-fuchsia-100 to-sky-100 flex items-center justify-center">
                  <Info className="h-14 w-14 text-violet-400" />
                </div>
              )}
            </div>
          </div>

          {(about?.mission || about?.vision) && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {about.mission && (
                <div className="clay-sm p-5 space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-extrabold text-violet-900">Mission</h4>
                  <p className="text-sm text-violet-600/80 font-medium leading-relaxed">
                    {about.mission}
                  </p>
                </div>
              )}
              {about.vision && (
                <div className="clay-sm p-5 space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-extrabold text-violet-900">Vision</h4>
                  <p className="text-sm text-violet-600/80 font-medium leading-relaxed">
                    {about.vision}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Team — ALL members */}
      <section id="team" className="space-y-6 scroll-mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Our Team</h2>
            <p className="text-violet-600/60 font-medium mt-1">
              {team.length} member{team.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link to="/team" className="clay-btn-secondary px-4 py-2 text-sm shrink-0">
            Team page
          </Link>
        </div>

        {team.length === 0 ? (
          <div className="clay p-10 text-center space-y-2">
            <Users className="h-10 w-10 mx-auto text-violet-300" />
            <p className="font-bold text-violet-700">No team members yet</p>
            <p className="text-sm text-violet-500 font-medium">Add them from Admin Dashboard</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member) => (
              <article
                key={member.id}
                className="clay overflow-hidden group hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-square bg-violet-100 overflow-hidden">
                  <img
                    src={
                      member.imageUrl ||
                      `https://placehold.co/400x400/ddd6fe/6d28d9?text=${encodeURIComponent(
                        member.name?.charAt(0) || "?"
                      )}`
                    }
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-extrabold text-violet-950">{member.name}</h3>
                  <p className="text-sm font-bold text-fuchsia-600">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-violet-600/70 font-medium line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                  {(member.social?.github ||
                    member.social?.linkedin ||
                    member.social?.twitter) && (
                    <div className="flex gap-2 pt-1">
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clay-sm p-2 text-violet-600 hover:text-violet-900"
                        >
                          <IconGithub className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clay-sm p-2 text-violet-600 hover:text-violet-900"
                        >
                          <IconLinkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clay-sm p-2 text-violet-600 hover:text-violet-900"
                        >
                          <IconTwitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Skills — ALL skills with % */}
      <section id="skills" className="space-y-6 scroll-mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Our Skills</h2>
            <p className="text-violet-600/60 font-medium mt-1">
              {skills.length} skill{skills.length === 1 ? "" : "s"} with proficiency %
            </p>
          </div>
          <Link to="/skills" className="clay-btn-secondary px-4 py-2 text-sm shrink-0">
            Skills page
          </Link>
        </div>

        {sortedSkills.length === 0 ? (
          <div className="clay p-10 text-center space-y-2">
            <Code2 className="h-10 w-10 mx-auto text-violet-300" />
            <p className="font-bold text-violet-700">No skills yet</p>
            <p className="text-sm text-violet-500 font-medium">Add skills with % from Admin</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sortedSkills.map((skill) => (
              <div key={skill.id} className="clay-sm p-5 space-y-3">
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-violet-900">{skill.name}</span>
                    {skill.category && (
                      <span className="ml-2 inline-block text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2 py-0.5 rounded-md">
                        {skill.category}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-extrabold text-violet-600 shrink-0">
                    {skill.percentage}%
                  </span>
                </div>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: skillsAnimated
                        ? `${Math.min(100, Math.max(0, skill.percentage))}%`
                        : "0%",
                      background: skill.color
                        ? `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`
                        : undefined,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Projects — ALL projects */}
      <section id="projects" className="space-y-6 scroll-mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Our Projects</h2>
            <p className="text-violet-600/60 font-medium mt-1">
              {projects.length} project{projects.length === 1 ? "" : "s"} — image, website & about
            </p>
          </div>
          <Link to="/projects" className="clay-btn-secondary px-4 py-2 text-sm shrink-0">
            Projects page
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="clay p-10 text-center space-y-2">
            <FolderKanban className="h-10 w-10 mx-auto text-violet-300" />
            <p className="font-bold text-violet-700">No projects yet</p>
            <p className="text-sm text-violet-500 font-medium">
              Add projects with image URL + website URL from Admin
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <article
                key={p.id}
                className="clay overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-video bg-violet-100 relative overflow-hidden">
                  <img
                    src={
                      p.imageUrl ||
                      "https://placehold.co/600x340/ddd6fe/6d28d9?text=Project"
                    }
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.featured && (
                    <span className="absolute top-3 left-3 clay-sm px-2.5 py-1 text-xs font-extrabold text-amber-600 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <h3 className="font-extrabold text-violet-900 text-lg">{p.title}</h3>
                  <p className="text-sm text-violet-600/70 line-clamp-3 font-medium flex-1">
                    {p.description}
                  </p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.websiteUrl && (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-auto"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="clay p-8 md:p-10 text-center space-y-4 bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <h2 className="text-2xl md:text-3xl font-extrabold text-violet-900">
          Manage all this content
        </h2>
        <p className="text-violet-600/70 font-medium max-w-lg mx-auto">
          Everything on this page comes from Firebase — update About, Team, Skills & Projects in Admin.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/admin" className="clay-btn px-6 py-3 text-sm">
            Admin Dashboard
          </Link>
          <Link to="/about" className="clay-btn-secondary px-6 py-3 text-sm">
            Explore pages
          </Link>
        </div>
      </section>
    </div>
  );
}
