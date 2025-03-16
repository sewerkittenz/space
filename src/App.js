import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import Posts from "./Posts";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Space</h1>
      {!user ? <Auth setUser={setUser} /> : <Posts user={user} />}
      {user && <button className="mt-4 text-red-500" onClick={() => { supabase.auth.signOut(); setUser(null); }}>Logout</button>}
    </div>
  );
}

export default App;
