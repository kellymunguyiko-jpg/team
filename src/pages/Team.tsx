import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { subscribeTeam } from "../services/dataService";
import type { TeamMember } from "../types";

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

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTeam((data) => {
      setTeam(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="clay p-12 text-center page-enter">
        <div className="h-10 w-10 mx-auto rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="mt-4 font-bold text-violet-500">Loading team...</p>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8">
      <div className="text-center space-y-3">
        <h1 className="section-title">Our Team</h1>
        <p className="text-violet-600/60 font-medium max-w-xl mx-auto">
          The people behind the clay — designers, developers, and dreamers.
        </p>
      </div>

      {team.length === 0 ? (
        <div className="clay p-12 text-center space-y-3">
          <Users className="h-12 w-12 mx-auto text-violet-300" />
          <p className="font-bold text-violet-700">No team members yet</p>
          <p className="text-sm text-violet-500 font-medium">
            Add members from the Admin Dashboard.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <article
              key={member.id}
              className="clay overflow-hidden group hover:-translate-y-1 transition-transform"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="aspect-square bg-violet-100 overflow-hidden relative">
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
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-extrabold text-violet-950">{member.name}</h3>
                <p className="text-sm font-bold text-fuchsia-600">{member.role}</p>
                <p className="text-sm text-violet-600/70 font-medium line-clamp-3">
                  {member.bio}
                </p>
                {(member.social?.github ||
                  member.social?.linkedin ||
                  member.social?.twitter) && (
                  <div className="flex gap-2 pt-2">
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
    </div>
  );
}
