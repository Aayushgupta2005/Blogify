import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

function PostCard({ $id, title, featuredImage, content }) {
  return (
    <Link to={`/post/${$id}`} className="group">
      <div className="w-full p-4 transform transition-transform duration-700 hover:scale-105 hover:rotate-1">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          
          {/* Image */}
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-lg mb-6 h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Title before hover, centered below the image */}
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 absolute bottom-0 left-0 right-0 text-center opacity-100 group-hover:opacity-0 group-hover:translate-y-6 transition-all duration-300 ease-in-out z-10">
            {title}
          </h3>

          {/* Black gradient overlay only on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 rounded-lg transition-opacity duration-500"></div>

          {/* Content and 'Read More' Button on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-0 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              {title}
            </h3>
            <div className="text-white text-sm line-clamp-3 mb-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              {parse(content ? content.substring(0, 150) + '...' : '')}
            </div>
            <span className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300">
              Read More
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
