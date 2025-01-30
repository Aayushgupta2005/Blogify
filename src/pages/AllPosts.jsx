import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    appwriteService.getPosts([]).then((response) => {
      if (response) {
        setPosts(response.documents);
        setIsLoading(false);
      }
    }).catch((err) => {
      setError('Failed to load posts');
      setIsLoading(false);
    });
  }, []);

  const loadingSkeleton = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-gray-200 animate-pulse rounded-lg shadow-lg h-72 w-full">
          <div className="h-40 bg-gray-300 rounded-t-lg mb-4"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-blue-500 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const retryLoading = () => {
    setIsLoading(true);
    setError(null);
    appwriteService.getPosts([]).then((response) => {
      if (response) {
        setPosts(response.documents);
        setIsLoading(false);
      }
    }).catch((err) => {
      setError('Failed to load posts');
      setIsLoading(false);
    });
  };

  return (
    <div className="w-full py-12 bg-gradient-to-r from-gray-100 to-gray-200">
      <Container>
        <h2 className="text-5xl font-bold text-gray-800 text-center mb-16 leading-tight">
          Explore Our Posts
        </h2>

        {isLoading && loadingSkeleton}

        {error && (
          <div className="text-center text-3xl text-red-500 mb-4">
            {error}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={retryLoading}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.$id}
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage}
                content={post.content}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
