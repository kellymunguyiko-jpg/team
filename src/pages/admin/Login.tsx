import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/admin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Check credentials.";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("Invalid email or password.");
      } else if (msg.includes("user-not-found")) {
        setError("No admin user found. Create one in Firebase Authentication.");
      } else if (msg.includes("too-many-requests")) {
        setError("Too many attempts. Try again later.");
      } else if (
        msg.includes("operation-not-allowed") ||
        msg.includes("configuration-not-found")
      ) {
        setError(
          "Email/Password not enabled. Enable it in Firebase Console → Authentication."
        );
      } else {
        setError(
          msg.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim() ||
            "Login failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="blob w-72 h-72 bg-violet-300 top-10 -left-20" />
      <div className="blob w-80 h-80 bg-pink-300 bottom-10 -right-20" />

      <div className="clay w-full max-w-md p-8 md:p-10 page-enter relative z-10">
        <div className="text-center mb-8 space-y-3">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-300">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-violet-950">Admin Login</h1>
          <p className="text-sm text-violet-600/70 font-medium">
            Sign in with your Firebase admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="clay-inset px-4 py-3 flex items-start gap-2 text-sm font-semibold text-rose-600">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-violet-900 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              required
              className="clay-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-violet-900 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Password
            </label>
            <input
              type="password"
              required
              className="clay-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="clay-btn w-full py-3.5 text-sm disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm font-medium text-violet-500">
          <Link to="/" className="hover:text-violet-800 transition-colors">
            ← Back to website
          </Link>
        </p>

        <div className="mt-6 clay-inset p-3 text-xs text-violet-500/80 font-medium leading-relaxed space-y-2">
          <p className="font-bold text-violet-700">Firebase setup:</p>
          <p>
            1. Authentication → Sign-in method → enable <strong>Email/Password</strong>
          </p>
          <p>2. Authentication → Users → Add user (email + password)</p>
          <p>3. Publish Firestore & Storage rules from project files</p>
        </div>
      </div>
    </div>
  );
}
