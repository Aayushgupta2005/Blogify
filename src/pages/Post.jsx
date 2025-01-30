import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaTwitter, FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa"; // FontAwesome Icons

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-12 bg-gradient-to-r from-gray-100 to-gray-200">
            <Container>
                {/* Post Card */}
                <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                    {/* Featured Image */}
                    <div className="relative">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-xl w-full h-80 object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>

                    {/* Author buttons */}
                    {isAuthor && (
                        <div className="absolute top-6 right-6 flex space-x-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-600" className="hover:bg-green-700 transition-all duration-300">
                                    Edit
                                </Button>
                            </Link>
                            <Button 
                                bgColor="bg-red-600" 
                                onClick={deletePost}
                                className="hover:bg-red-700 transition-all duration-300"
                            >
                                Delete
                            </Button>
                        </div>
                    )}

                    {/* Title */}
                    <div className="w-full mb-6 mt-6 text-center">
                        <h1 className="text-4xl font-semibold text-gray-800">{post.title}</h1>
                    </div>

                    {/* Content with smooth scrolling */}
                    <div className="browser-css text-lg text-gray-700 leading-relaxed space-y-4 overflow-y-auto max-h-96">
                        {parse(post.content)}
                    </div>

                    {/* Social Share Buttons */}
                    <div className="mt-8 text-center">
                        <span className="text-xl text-gray-600">Share this post: </span>
                        <div className="flex justify-center space-x-6 mt-4 flex-wrap gap-4">
                            <a href={`https://twitter.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <Button bgColor="bg-blue-500 hover:bg-blue-600 flex items-center space-x-2 transition-all duration-300">
                                    <FaTwitter size={20} color="white" />
                                    <span>Twitter</span>
                                </Button>
                            </a>
                            <a href={`https://facebook.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <Button bgColor="bg-blue-700 hover:bg-blue-800 flex items-center space-x-2 transition-all duration-300">
                                    <FaFacebook size={20} color="white" />
                                    <span>Facebook</span>
                                </Button>
                            </a>
                            <a href={`https://wa.me/?text=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <Button bgColor="bg-green-500 hover:bg-green-600 flex items-center space-x-2 transition-all duration-300">
                                    <FaWhatsapp size={20} color="white" />
                                    <span>WhatsApp</span>
                                </Button>
                            </a>
                            <a href={`https://www.instagram.com/share?url=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                                <Button bgColor="bg-gradient-to-r from-pink-500 to-yellow-500 hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600 flex items-center space-x-2 transition-all duration-300">
                                    <FaInstagram size={20} color="white" />
                                    <span>Instagram</span>
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <Button bgColor="bg-gray-500 hover:bg-gray-600" onClick={() => navigate("/")}>
                            Back to Posts
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    ) : (
        <div className="text-center text-xl text-gray-500">Loading post...</div>
    );
}
