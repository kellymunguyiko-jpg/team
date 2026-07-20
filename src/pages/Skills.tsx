import { useEffect, useMemo, useState } from "react";
import { Code2 } from "lucide-react";
import { subscribeSkills } from "../services/dataService";
import type { Skill } from "../types";

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const unsub = subscribeSkills((data) => {
      setSkills(data);
      setLoading(false);
      setTimeout(() => setAnimated(true), 100);
    });
    return unsub;
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
    return ["All", ...cats];
  }, [skills]);

  const filtered =
    filter === "All" ? skills : skills.filter((s) => s.category === filter);

  if (loading) {
    return (
      <div className="clay p-12 text-center page-enter">
        <div className="h-10 w-10 mx-auto rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="mt-4 font-bold text-violet-500">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8">
      <div className="text-center space-y-3">
        <h1 className="section-title">Our Skills</h1>
        <p className="text-violet-600/60 font-medium max-w-xl mx-auto">
          Expertise measured in passion — and a little percentage magic.
        </p>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setAnimated(false);
                setFilter(c);
                setTimeout(() => setAnimated(true), 50);
              }}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                filter === c
                  ? "clay-btn"
                  : "clay-btn-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="clay p-12 text-center space-y-3">
          <Code2 className="h-12 w-12 mx-auto text-violet-300" />
          <p className="font-bold text-violet-700">No skills yet</p>
          <p className="text-sm text-violet-500 font-medium">
            Add skills with percentages from the Admin Dashboard.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((skill) => (
            <div key={skill.id} className="clay p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-lg text-violet-950">
                    {skill.name}
                  </h3>
                  {skill.category && (
                    <span className="inline-block mt-1 text-xs font-bold text-violet-500 bg-violet-100 px-2.5 py-1 rounded-lg">
                      {skill.category}
                    </span>
                  )}
                </div>
                <div
                  className="clay-sm h-14 w-14 flex items-center justify-center shrink-0"
                  style={{
                    background: skill.color
                      ? `linear-gradient(145deg, ${skill.color}33, ${skill.color}11)`
                      : undefined,
                  }}
                >
                  <span className="text-sm font-extrabold text-violet-700">
                    {skill.percentage}%
                  </span>
                </div>
              </div>

              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{
                    width: animated ? `${Math.min(100, Math.max(0, skill.percentage))}%` : "0%",
                    background: skill.color
                      ? `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`
                      : undefined,
                  }}
                />
              </div>

              {/* Circular mini meter */}
              <div className="flex items-center gap-3 pt-1">
                <div className="relative h-10 w-10">
                  <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#ede9fe"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={skill.color || "#8b5cf6"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${animated ? skill.percentage : 0} 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-violet-500">
                  Proficiency level based on project experience
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
