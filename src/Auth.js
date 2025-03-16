import { useState } from "react";
import { supabase } from "./supabase";

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (type) => {
    setLoading(true);
    const { user, error } = type === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setUser(user);
    setLoading(false);
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-4 border rounded-lg">
      <input className="p-2 text-black" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="p-2 text-black" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-500 p-2 rounded-lg" onClick={() => handleAuth("login")} disabled={loading}>Log In</button>
      <button className="bg-gray-500 p-2 rounded-lg" onClick={() => handleAuth("signup")} disabled={loading}>Sign Up</button>
    </div>
  );
};

export default Auth;
