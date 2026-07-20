import { useEffect, useState } from "react";
import { Target, Eye, Heart } from "lucide-react";
import { subscribeAbout } from "../services/dataService";
import type { AboutInfo } from "../types";

export default function About() {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAbout((data) => {
      setAbout(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="clay p-12 text-center page-enter">
        <div className="h-10 w-10 mx-auto rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="mt-4 font-bold text-violet-500">Loading about...</p>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8">
      <div className="text-center space-y-3 mb-4">
        <h1 className="section-title">About Us</h1>
        <p className="text-violet-600/60 font-medium max-w-xl mx-auto">
          {about?.subtitle || "Get to know who we are and what drives us"}
        </p>
      </div>

      <section className="clay p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-violet-950">
              {about?.title || "Our Story"}
            </h2>
            <p className="text-violet-700/75 font-medium leading-relaxed whitespace-pre-line">
              {about?.description ||
                "We are a creative team passionate about design, development, and delightful user experiences. Our work blends soft aesthetics with solid engineering. Content can be managed from the Admin Dashboard."}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="clay w-full max-w-sm aspect-square overflow-hidden">
              {about?.imageUrl ? (
                <img
                  src={about.imageUrl}
                  alt={about.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-200 via-fuchsia-100 to-sky-100 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-violet-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="clay p-7 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-md">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-violet-900">Mission</h3>
          <p className="text-violet-700/70 font-medium leading-relaxed">
            {about?.mission ||
              "To create meaningful digital products that feel soft, human, and powerful — one clay card at a time."}
          </p>
        </div>
        <div className="clay p-7 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shadow-md">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-violet-900">Vision</h3>
          <p className="text-violet-700/70 font-medium leading-relaxed">
            {about?.vision ||
              "A world where beautiful interfaces and solid craft go hand in hand, inspiring teams everywhere."}
          </p>
        </div>
      </div>
    </div>
  );
}
