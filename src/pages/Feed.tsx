
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import CreatePost from "@/components/feed/CreatePost";
import FilterControls from "@/components/feed/FilterControls";
import PostCard from "@/components/feed/PostCard";
import { posts as allPosts, Post } from "@/data/feedData";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState({
    sort: "latest",
    type: "all",
    search: "",
    category: "all",
  });

  useEffect(() => {
    let filteredPosts = [...allPosts];

    // Filter by type (role)
    if (filters.type !== "all") {
      filteredPosts = filteredPosts.filter((post) => post.type === filters.type);
    }

    // Filter by category
    if (filters.category !== "all") {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === filters.category
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.author.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort posts
    switch (filters.sort) {
      case "latest":
        // Posts are already sorted by date (newest first)
        break;
      case "popular":
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case "trending":
        filteredPosts.sort(
          (a, b) => b.likes + b.comments * 2 - (a.likes + a.comments * 2)
        );
        break;
      default:
        break;
    }

    setPosts(filteredPosts);
  }, [filters]);

  const handleFilterChange = (newFilters: {
    sort: string;
    type: string;
    search: string;
    category: string;
  }) => {
    setFilters(newFilters);
  };

  const handlePostCreated = () => {
    // In a real app, we would fetch the latest posts
    // For demo, we'll just maintain current filters
    // Ideally would refresh from API
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Research Feed</h1>
            {!isAuthenticated && (
              <Button onClick={() => navigate("/")} className="bg-medicare-blue hover:bg-medicare-dark">
                Sign In to Contribute
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CreatePost onPostCreated={handlePostCreated} />
              <FilterControls onFilterChange={handleFilterChange} />

              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No posts found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-20">
                <h3 className="font-semibold text-lg mb-4">About Medicare Feed</h3>
                <p className="text-gray-600 mb-4">
                  The Medicare Feed is where healthcare professionals, researchers, blood banks,
                  and pharmaceutical companies share their latest findings and research.
                </p>
                <p className="text-gray-600 mb-4">
                  Students and patients can access this valuable information to stay
                  updated with the latest medical advancements.
                </p>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Who can post?</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Doctors</li>
                    <li>• Researchers</li>
                    <li>• Blood Banks</li>
                    <li>• Pharmaceutical Companies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
