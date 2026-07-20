import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="blob w-72 h-72 bg-violet-300 top-0 -left-20" />
      <div className="blob w-96 h-96 bg-pink-300 top-40 -right-32" />
      <div className="blob w-64 h-64 bg-sky-300 bottom-20 left-1/3" />
      <div className="blob w-80 h-80 bg-emerald-200 bottom-0 right-10" />

      <div className="relative z-10">
        <Navbar />
        <main className="px-4 pb-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
