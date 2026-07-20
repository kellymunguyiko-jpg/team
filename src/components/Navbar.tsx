import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Sparkles, Shield } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Our Team" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-300"
        : "text-violet-800/70 hover:text-violet-900 hover:bg-violet-100/60"
    }`;

  return (
    <header className="sticky top-4 z-50 px-4 mb-6">
      <nav className="clay-nav mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-300/50 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-violet-900 tracking-tight">
            Clay<span className="text-fuchsia-500">Team</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="ml-2 clay-btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden clay-sm p-2.5 text-violet-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-auto max-w-6xl mt-2 clay p-4 flex flex-col gap-2 page-enter">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="clay-btn-secondary flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm mt-1"
          >
            <Shield className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
