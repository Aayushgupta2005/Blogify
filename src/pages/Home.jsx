import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();  
  const isLoggedIn = useSelector(state => state.auth.status);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
        setIsLoading(false);
      }
    });
  }, []);

  const displayPosts = posts.slice(0, 3);

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900">
      {/* Hero Section with Glassmorphism Effect */}
      <section className="relative py-24 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}></div>
        <Container>
          <div className="relative z-10 bg-white/10 backdrop-blur-md px-8 py-12 rounded-xl shadow-lg">
            <h1 className="text-5xl font-extrabold leading-tight mb-4 text-shadow-lg">
              Share Your Experiences, Explore the World of Knowledge
            </h1>
            <motion.p 
              className="text-lg sm:text-xl mb-6 text-gray-200"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Read, Learn, and Explore – Every Day!
            </motion.p>
            <motion.button 
              onClick={() => navigate('/all-posts')} 
              className="px-6 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            >
              Start Exploring
            </motion.button>
          </div>
        </Container>
      </section>

      {/* Purpose Section */}
      <section className="py-24 text-center bg-white">
        <Container>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">What We Offer</h2>
          <p className="text-lg text-gray-600 mb-12">
            Blogify connects writers and readers from across the globe. Share your journey, knowledge, and gain insights from others.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { title: "Share Your Story", desc: "Express yourself on any topic, from travel to tech." },
              { title: "Learn from Others", desc: "Gain new perspectives from diverse voices." },
              { title: "Join the Community", desc: "Engage, comment, and connect with like-minded individuals." }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white shadow-xl rounded-lg transform hover:scale-105 transition duration-300 ease-in-out border border-gray-200">
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-24 text-center bg-gray-100">
        <Container>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">AI-Powered Writing Assistant</h2>
          <p className="text-lg text-gray-600 mb-8">
            Struggling with writer's block? Our AI-powered text suggestions help you write faster and smarter! As you compose your blogs, the AI will provide word completions and ideas to make your writing process smoother and more creative.
          </p>
          <motion.button 
            onClick={() => navigate('/add-post')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          >
            Start Writing Now
          </motion.button>
        </Container>
      </section>
      {/* Latest Posts Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <h2 className="text-4xl font-semibold text-center mb-8 text-gray-900">Explore the Latest Posts</h2>

          {!isLoggedIn && (
            <div className="text-center mb-8 bg-white shadow-lg rounded-md py-6 px-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Login to Access More Content</h3>
              <p className="text-gray-500 mb-6">Sign in to explore more articles, stories, and insights from our global community.</p>
              <button
                onClick={() => navigate('/login')} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Login Now
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <div key={post.$id} className="relative p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <PostCard {...post} />
                {!isLoggedIn && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 text-white font-semibold rounded-lg">
                    Login to Read More
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Home;
