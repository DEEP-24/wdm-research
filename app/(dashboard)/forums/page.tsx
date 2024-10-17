"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";

interface Forum {
  id: number;
  name: string;
  description: string;
}

interface ForumPost {
  id: number;
  forumId: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

// Add this interface for the user
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // ... other user properties
}

const ForumsPage: React.FC = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newForum, setNewForum] = useState({ name: "", description: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedForums = localStorage.getItem("forums");
    const storedPosts = localStorage.getItem("forumPosts");
    const storedUser = localStorage.getItem("currentUser");

    if (storedForums) {
      setForums(JSON.parse(storedForums));
    } else {
      // Preload some forums
      const preloadedForums: Forum[] = [
        { id: 1, name: "General Discussion", description: "Talk about anything and everything" },
        { id: 2, name: "Tech Talk", description: "Discuss the latest in technology" },
        { id: 3, name: "Movie Buffs", description: "For cinema enthusiasts" },
      ];
      setForums(preloadedForums);
      localStorage.setItem("forums", JSON.stringify(preloadedForums));
    }

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Preload some posts
      const preloadedPosts: ForumPost[] = [
        {
          id: 1,
          forumId: 1,
          title: "Welcome to General Discussion",
          content: "Feel free to start any conversation here!",
          author: "Admin",
          date: new Date(2023, 0, 1).toISOString(),
        },
        {
          id: 2,
          forumId: 2,
          title: "Latest AI Developments",
          content: "What are your thoughts on the recent advancements in AI?",
          author: "TechEnthusiast",
          date: new Date(2023, 1, 15).toISOString(),
        },
        {
          id: 3,
          forumId: 3,
          title: "Best Movies of 2022",
          content: "Let's discuss our favorite films from last year!",
          author: "CinemaFan",
          date: new Date(2023, 2, 1).toISOString(),
        },
        {
          id: 4,
          forumId: 1,
          title: "Introducing Myself",
          content: "Hi everyone! I'm new here and excited to join the community.",
          author: "NewUser123",
          date: new Date(2023, 3, 10).toISOString(),
        },
      ];
      setPosts(preloadedPosts);
      localStorage.setItem("forumPosts", JSON.stringify(preloadedPosts));
    }

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      const defaultUser: User = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        // ... other default properties
      };
      setCurrentUser(defaultUser);
      localStorage.setItem("currentUser", JSON.stringify(defaultUser));
    }
  }, []);

  const handleCreateForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (newForum.name && newForum.description) {
      const forum: Forum = {
        id: Date.now(),
        name: newForum.name,
        description: newForum.description,
      };
      const updatedForums = [...forums, forum];
      setForums(updatedForums);
      localStorage.setItem("forums", JSON.stringify(updatedForums));
      setNewForum({ name: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  const handleJoinForum = (forum: Forum) => {
    setSelectedForum(forum);
  };

  const handleLeaveForum = () => {
    setSelectedForum(null);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content && selectedForum && currentUser) {
      const post: ForumPost = {
        id: Date.now(),
        forumId: selectedForum.id,
        title: newPost.title,
        content: newPost.content,
        author: `${currentUser.firstName} ${currentUser.lastName}`,
        date: new Date().toISOString(),
      };
      const updatedPosts = [...posts, post];
      setPosts(updatedPosts);
      localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
      setNewPost({ title: "", content: "" });
      setIsNewPostDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">
      {!selectedForum ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 sm:mb-0">Available Forums</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Create New Forum</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Forum</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateForum} className="space-y-4">
                  <Input
                    type="text"
                    value={newForum.name}
                    onChange={(e) => setNewForum({ ...newForum, name: e.target.value })}
                    placeholder="Forum Name"
                  />
                  <Textarea
                    value={newForum.description}
                    onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                    placeholder="Forum Description"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Forum</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {forums.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-blue-700 mb-4">No forums available</p>
              <p className="text-blue-600">Create a new forum to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.map((forum) => (
                <div key={forum.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">{forum.name}</h3>
                  <p className="text-blue-800 mb-4">{forum.description}</p>
                  <Button onClick={() => handleJoinForum(forum)}>Join Forum</Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center w-full sm:w-2/3 mb-4 sm:mb-0">
              <Button
                onClick={handleLeaveForum}
                variant="ghost"
                className="mr-2 p-2"
                aria-label="Back to forums"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-semibold text-blue-700 break-words">
                {selectedForum.name}
              </h2>
            </div>
            <Button onClick={handleLeaveForum} className="w-full sm:w-auto">
              Leave Forum
            </Button>
          </div>
          <p className="text-blue-800 mb-6">{selectedForum.description}</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 sm:mb-0">Forum Posts</h3>
            <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Create New Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <Input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post Title"
                  />
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Post Content"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsNewPostDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Post</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-[400px] sm:h-[600px] pr-4">
            <div className="space-y-4">
              {posts
                .filter((post) => post.forumId === selectedForum.id)
                .map((post) => (
                  <div key={post.id} className="bg-blue-100 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2 text-blue-700">{post.title}</h4>
                    <p className="mb-2 text-blue-800">{post.content}</p>
                    <p className="text-sm text-blue-600">
                      Posted by {post.author} on {new Date(post.date).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ForumsPage;
