"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const ForumsPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const storedPosts = localStorage.getItem("forumPosts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post: ForumPost = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: "Current User", // In a real app, this would be the current user's name
        date: new Date().toISOString(),
      };
      const updatedPosts = [...posts, post];
      setPosts(updatedPosts);
      localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
      setNewPost({ title: "", content: "" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Discussion Forums</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Post Title"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Post Content"
          className="w-full mb-2 p-2 border rounded"
          rows={4}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Post
        </button>
      </form>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              Posted by {post.author} on {new Date(post.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumsPage;
