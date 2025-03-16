import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔹 Replace with your Supabase credentials
const supabase = createClient(
  "https://pfkuqlkniiuiclkgfrri.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBma3VxbGtuaWl1aWNsa2dmcnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQ4MzgsImV4cCI6MjA1NzY4MDgzOH0.zAdDKs5lywB2GBOMWu961rwVvj1NKh3fjvIjahoXMT4"
);

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    // 🔹 Check if user is already logged in
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        window.location.href = "/";
      }
    };
    fetchUser();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage("Password reset email sent!");
        return;
      }

      let response;
      if (isLogin) {
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) throw response.error;

        const user = response.data.user;
        if (!user) throw new Error("User not found. Try again.");

        if (!user.confirmed_at) {
          throw new Error("Check your email to confirm your account before logging in.");
        }

        setMessage("Logged in successfully!");
        window.location.href = "/";
      } else {
        response = await supabase.auth.signUp({ email, password });
        if (response.error) throw response.error;
        setMessage("Check your email to confirm your account!");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {forgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!forgotPassword && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 p-3 rounded-lg font-bold"
          >
            {forgotPassword ? "Send Reset Email" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {!forgotPassword && (
          <p className="text-center mt-2">
            <button
              onClick={() => setForgotPassword(true)}
              className="text-blue-400 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        )}

        <p className="text-center mt-4">
          {forgotPassword
            ? "Remembered your password?"
            : isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setForgotPassword(false);
            }}
            className="text-blue-400 hover:underline"
          >
            {forgotPassword ? "Login" : isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
