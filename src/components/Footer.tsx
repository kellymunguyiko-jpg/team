import { Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-12">
      <div className="clay mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-violet-900">
              Clay<span className="text-fuchsia-500">Team</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-violet-700/70">
            <Link to="/about" className="hover:text-violet-900 transition-colors">
              About
            </Link>
            <Link to="/team" className="hover:text-violet-900 transition-colors">
              Team
            </Link>
            <Link to="/skills" className="hover:text-violet-900 transition-colors">
              Skills
            </Link>
            <Link to="/projects" className="hover:text-violet-900 transition-colors">
              Projects
            </Link>
          </div>

          <p className="text-sm text-violet-600/60 flex items-center gap-1.5 font-medium">
            Made with <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" /> & clay
          </p>
        </div>
      </div>
    </footer>
  );
}
