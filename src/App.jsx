import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Messages from "./Messages";
import PublicChat from "./PublicChat";
import Settings from "./Settings";
import Auth from "./Auth";

const supabase = createClient("https://pfkuqlkniiuiclkgfrri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBma3VxbGtuaWl1aWNsa2dmcnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQ4MzgsImV4cCI6MjA1NzY4MDgzOH0.zAdDKs5lywB2GBOMWu961rwVvj1NKh3fjvIjahoXMT4");

export default function App() {
  const [user, setUser] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messagesOpen, setMessagesOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      {!user ? (
        <Auth />
      ) : (
        <div className="flex min-h-screen bg-black text-white flex-col items-center justify-center relative">
          {/* Sidebar */}
          <aside className="w-64 p-6 bg-black text-[#7ED957] fixed left-10 top-20 rounded-lg shadow-lg">
            <h1 className="text-4xl font-brasika text-[#FF66C4] text-center">Space</h1>
            <div className="flex flex-col items-center mt-4">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-700 text-xl">
                  {user?.user_metadata?.first_name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <nav className="mt-6 space-y-3 text-center">
              <a href="/" className="block text-lg italic">Home</a>
              <a href="/search" className="block text-lg italic">Search</a>
              <a href="/profile" className="block text-lg italic">Profile</a>
              <a href="/notifications" className="block text-lg italic">Notifications</a>
              <a href="/messages" className="block text-lg italic">Messages</a>
              <a href="/public-chat" className="block text-lg italic">Public Chat</a>
              <a href="/settings" className="block text-lg italic">Settings</a>
              <button onClick={handleLogout} className="block w-full text-lg italic text-red-500">Log out</button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-3/5 p-8 text-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/public-chat" element={<PublicChat />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* What's Happening (Trending Posts) */}
          <section className="w-64 p-6 fixed right-10 top-20 bg-black text-[#7ED957] rounded-lg shadow-lg">
            <h2 className="text-xl italic text-center">What’s Happening</h2>
            <ul className="mt-4">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, index) => (
                  <li key={index}>
                    <a href={`/post/${post.id}`} className="block text-sm hover:underline">{post.title}</a>
                  </li>
                ))
              ) : (
                <p className="text-sm text-center">No trending posts yet.</p>
              )}
            </ul>
          </section>

          {/* Messages */}
          <section className="fixed bottom-10 right-10 w-64 bg-black text-[#7ED957] p-4 rounded-lg shadow-lg">
            <button onClick={() => setMessagesOpen(!messagesOpen)} className="text-lg italic w-full text-center">
              Messages
            </button>
            {messagesOpen && (
              <div className="bg-gray-900 p-4 rounded-lg mt-2">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className="p-2 border-b border-gray-700">
                      <a href={`/messages/${msg.id}`} className="block text-sm hover:underline">{msg.sender}</a>
                      <p className="text-xs">{msg.preview}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center">No messages yet.</p>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </Router>
  );
}
