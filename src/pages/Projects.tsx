import { useEffect, useState } from "react";
import { ExternalLink, FolderKanban, Star } from "lucide-react";
import { subscribeProjects } from "../services/dataService";
import type { Project } from "../types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="clay p-12 text-center page-enter">
        <div className="h-10 w-10 mx-auto rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="mt-4 font-bold text-violet-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8">
      <div className="text-center space-y-3">
        <h1 className="section-title">Our Projects</h1>
        <p className="text-violet-600/60 font-medium max-w-xl mx-auto">
          Real work, real links — each card has an image URL and website URL.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="clay p-12 text-center space-y-3">
          <FolderKanban className="h-12 w-12 mx-auto text-violet-300" />
          <p className="font-bold text-violet-700">No projects yet</p>
          <p className="text-sm text-violet-500 font-medium">
            Add projects with image & website URLs from Admin.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="clay overflow-hidden flex flex-col hover:-translate-y-1 transition-transform group"
            >
              <div className="aspect-video bg-violet-100 relative overflow-hidden">
                <img
                  src={
                    project.imageUrl ||
                    "https://placehold.co/600x340/ddd6fe/6d28d9?text=Project"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {project.featured && (
                  <span className="absolute top-3 left-3 clay-sm px-2.5 py-1 text-xs font-extrabold text-amber-600 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <h3 className="text-lg font-extrabold text-violet-950">
                  {project.title}
                </h3>
                <p className="text-sm text-violet-600/70 font-medium line-clamp-3 flex-1">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
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
    </div>
  );
}
