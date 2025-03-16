import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const Posts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data);
  };

  const addPost = async () => {
    if (!content) return;
    await supabase.from("posts").insert([{ user_id: user.id, content }]);
    setContent("");
    fetchPosts();
  };

  const deletePost = async (id) => {
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <input className="w-full p-2 text-black" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="bg-blue-500 w-full p-2 rounded-lg mt-2" onClick={addPost}>Post</button>

      <div className="mt-6">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg mb-2">
            <p>{post.content}</p>
            {post.user_id === user.id && <button className="text-red-500 mt-2" onClick={() => deletePost(post.id)}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
