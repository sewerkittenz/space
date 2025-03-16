import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

const supabase = createClient("https://YOUR_PROJECT_URL.supabase.co", "YOUR_ANON_KEY");

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error fetching user:", error);
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!username) return;
    
    const fetchProfile = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single();
      if (error) console.error("Error fetching profile:", error);
      setProfile(data);
    };
    
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (user && profile) {
      setIsOwner(profile.id === user.id);
    }
  }, [user, profile]);

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    setOverlay({ type, file });
  };

  return (
    <div className="flex flex-col items-center text-white">
      {/* Banner */}
      <div className="relative w-full h-40 bg-gray-800">
        {profile?.banner_url && <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />}
        {isOwner && (
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, "banner")} />
        )}
      </div>

      {/* Profile Picture */}
      <div className="relative mt-[-50px]">
        <img src={profile?.avatar_url} alt="Profile" className="w-20 h-20 rounded-full border-4 border-black" />
        {isOwner && (
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, "profilePic")} />
        )}
      </div>

      {/* Name and Username */}
      <div className="text-center mt-2">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => isOwner && setOverlay({ type: "name" })}>
          {profile?.name}
        </h1>
        <p className="text-gray-400">@{profile?.username}</p>
      </div>

      {/* Followers and Following */}
      <div className="flex space-x-4 mt-2">
        <p className="cursor-pointer" onClick={() => setOverlay({ type: "followers" })}>Followers: {profile?.followers || 0}</p>
        <p className="cursor-pointer" onClick={() => setOverlay({ type: "following" })}>Following: {profile?.following || 0}</p>
      </div>

      {/* Bio */}
      <p className="mt-2 cursor-pointer" onClick={() => isOwner && setOverlay({ type: "bio" })}>
        {profile?.bio ? profile.bio : "Bio:"}
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mt-4">
        <button className="text-green-400">Posts</button>
        <button className="text-green-400">Reposts</button>
        <button className="text-green-400">Replies</button>
        <button className="text-green-400">Liked Posts</button>
      </div>

      {/* Overlay */}
      {overlay && <Overlay overlay={overlay} setOverlay={setOverlay} profile={profile} setProfile={setProfile} />}
    </div>
  );
}

function Overlay({ overlay, setOverlay, profile, setProfile }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (overlay.type === "name") setInputValue(profile?.name || "");
    if (overlay.type === "bio") setInputValue(profile?.bio || "");
  }, [overlay]);

  const handleSave = async () => {
    let updates = {};
    if (overlay.type === "name") updates = { name: inputValue };
    if (overlay.type === "bio") updates = { bio: inputValue };

    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    if (error) console.error("Error updating profile:", error);
    else setProfile({ ...profile, ...updates });

    setOverlay(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-900 p-4 rounded-lg text-white">
        <h2 className="text-xl">Edit {overlay.type}</h2>
        {["name", "bio"].includes(overlay.type) && (
          <input
            type="text"
            className="w-full p-2 bg-gray-800 rounded mt-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={overlay.type === "bio" ? 50 : undefined}
          />
        )}
        <button onClick={handleSave} className="mt-4 bg-green-500 px-4 py-2 rounded">Save</button>
        <button onClick={() => setOverlay(null)} className="mt-2 text-red-400 block">Cancel</button>
      </div>
    </div>
  );
}
