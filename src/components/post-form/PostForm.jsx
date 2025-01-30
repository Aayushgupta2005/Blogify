import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineUpload } from "react-icons/ai";
import authService from "../../appwrite/auth";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const [userData,setUserData] = useState(null);
    const getData = async () =>{
        const account = await authService.getCurrentUser();
        setUserData(account);
    }
    const navigate = useNavigate();
    // const userData = useSelector((state) => state.auth.userData);
    useEffect(()=>{
        getData();
    },[])
    const [isUploading, setIsUploading] = useState(false);

    const submit = async (data) => {
        setIsUploading(true);
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
        setIsUploading(false);
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-wrap p-10 bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-400 rounded-3xl shadow-2xl w-full max-w-5xl mx-auto space-y-8 transition-transform duration-300 transform hover:scale-105"
        >
            <div className="w-full md:w-2/3 p-8 bg-white rounded-2xl shadow-xl space-y-6">
                <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">Create or Edit a Post</h3>

                {/* Title Input */}
                <Input
                    label="Post Title"
                    placeholder="Enter a catchy title for your post"
                    className="mb-4 p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-400 shadow-sm transition-all duration-300"
                    {...register("title", { required: "Title is required" })}
                />
                {/* Slug Input */}
                <Input
                    label="Post Slug"
                    placeholder="Slug for URL"
                    className="mb-4 p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-400 shadow-sm transition-all duration-300"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {/* Content Editor */}
                <RTE label="Post Content" name="content" control={control} defaultValue={getValues("content")} />
            </div>

            <div className="w-full md:w-1/3 p-8 bg-white rounded-2xl shadow-xl space-y-6">
                {/* Featured Image */}
                <div className="relative flex flex-col justify-center items-center">
                    <Input
                        label="Upload Featured Image"
                        type="file"
                        className="mb-4 p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-400 shadow-sm cursor-pointer"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && post.featuredImage && (
                        <div className=" text-gray-500">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg w-32 h-32 object-cover shadow-lg"
                            />
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center rounded-xl">
                            <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 h-12 w-12"></div>
                        </div>
                    )}
                    <p className="mt-2 text-sm text-gray-600">Choose an image for your post</p>
                </div>

                {/* Status Select */}
                <Select
                    options={["active", "inactive"]}
                    label="Post Status"
                    className="mb-4 p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-400 shadow-sm transition-all duration-300"
                    {...register("status", { required: "Status is required" })}
                />
                {/* Submit Button */}
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-600" : "bg-blue-600"}
                    className="w-full p-4 text-white rounded-xl shadow-xl hover:bg-opacity-90 transition-all duration-300 flex justify-center items-center"
                >
                    {isUploading ? (
                        <span>Uploading...</span>
                    ) : (
                        <>
                            <AiOutlineUpload className="mr-2" />
                            {post ? "Update Post" : "Submit Post"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
