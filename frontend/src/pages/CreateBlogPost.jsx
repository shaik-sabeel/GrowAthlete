"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Using react-router-dom's useNavigate
import { Link } from "react-router-dom"; // Using react-router-dom's Link
import Navbar from "../components/Navbar"; // Assuming you have a Navbar component in this path

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    coverImage: null, // Stores File object
    content: "",
    summary: "" // Added default visibility
  });



  const [isSubmitting, setIsSubmitting] = useState(false);
  const [premiumRequired, setPremiumRequired] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
    }
  };

  // Simulated function to check if user has premium
  const checkUserPremium = () => {
    // In a real app, this would check the user's subscription status from backend
    // For demo purposes, we'll just return false to show the upgrade prompt
    return false;
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  fetch("http://localhost:5000/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      category: formData.category,
      author: "64f0e7c8b0a1f2a3b4c5d6e7" // replace with real logged-in user _id
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setIsSubmitting(false);
      navigate(`/sports-blog/${data.slug}`); // ✅ use correct route
    })
    .catch(() => {
      setIsSubmitting(false);
      alert("Failed to create blog");
    });
};
  // Optional: Render premium upgrade prompt if setPremiumRequired is true
  if (premiumRequired) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Premium Content Only</h2>
          <p className="text-gray-700 mb-6">
            To create premium blog posts, you need to have an active premium
            subscription.
          </p>
          <Link
            to="/subscribe" // Link to your subscription page
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upgrade to Premium
          </Link>
          <button
            onClick={() => setPremiumRequired(false)}
            className="ml-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Header */}
        <div className="relative bg-indigo-800">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Sports background"
            />
            <div
              className="absolute inset-0 bg-indigo-800 mix-blend-multiply"
              aria-hidden="true"
            />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Create New Blog Post
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              Share your insights, stories, and expertise with the growing
              community of sports enthusiasts and athletes.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start with the essential details of your post.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter a compelling title"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Summary
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="summary"
                          name="summary"
                          rows={3}
                          value={formData.summary}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Write a brief summary (150-200 characters)"
                          required
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        A short summary that will appear in blog listings.
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="Cricket">Cricket</option>
                          <option value="Football">Football</option>
                          <option value="Basketball">Basketball</option>
                          <option value="Athletics">Athletics</option>
                          <option value="Swimming">Swimming</option>
                          <option value="Badminton">Badminton</option>
                          <option value="Kabaddi">Kabaddi</option>
                          <option value="Hockey">Hockey</option>
                          <option value="Nutrition">Nutrition</option>
                          <option value="Psychology">Psychology</option>
                          <option value="Training">Training</option>
                        </select>
                      </div>
                    </div>

                    {/* <div className="sm:col-span-3">
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tags
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="tags"
                          id="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g. training, youth, technique (comma separated)"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Featured Image */}
                {/* <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Featured Image
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a high-quality image that represents your blog post.
                  </p>
                  <div className="mt-6">
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="coverImage"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              accept="image/*" // Restrict to image files
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        {formData.coverImage && (
                          <p className="text-xs text-gray-700 mt-2">
                            Selected: {formData.coverImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Content Editor */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Post Content
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Write your blog post with rich formatting.
                  </p>

                  {/* Rich Text Editor Toolbar (simplified for demo, typically a full editor component would go here) */}
                  <div className="mt-6 border border-gray-300 rounded-t-md">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
                      <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x">
                        {/* Placeholder buttons for text formatting */}
                        {/* <div className="flex items-center space-x-1 sm:pr-4"> */}
                          {/* <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Link"
                          > */}
                            {/* <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                clipRule="evenodd"
                              />
                            </svg> */}
                          {/* </button> */}
                          {/* <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Location"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button> */}
                          {/* <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button> */}
                        {/* </div> */}
                        {/* <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Emoji"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Code"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path
                                fillRule="evenodd"
                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                            title="Add mention"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div> */}
                      </div>
                      {/* <div className="flex space-x-1 pl-0 sm:pl-2">
                        <button
                          type="button"
                          className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                          title="File attach"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 3a5 5 0 00-5 5v1h1a1 1 0 010 2H3a1 1 0 01-1-1V8a7 7 0 1114 0v1h-1a1 1 0 010 2h1a1 1 0 001-1V8a7 7 0 00-7-7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                          title="User icon"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div> */}
                    </div>
                    <div className="bg-white rounded-b-md">
                      <div className="py-2 px-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x">
                            {/* More placeholder buttons for rich text features */}
                            {/* <div className="flex items-center space-x-1 sm:pr-4"> */}
                              {/* <button
                                type="button"
                                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                                title="Bullet list"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button> */}
                              {/* <button
                                type="button"
                                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                                title="Settings"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center space-x-1 sm:pl-4">
                              <button
                                type="button"
                                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                                title="Minus icon"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                                title="Zoom in/out"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button> */}
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                      <textarea
                        id="content"
                        name="content"
                        rows={14}
                        value={formData.content}
                        onChange={handleInputChange}
                        className="block border-0 w-full focus:ring-0 text-sm"
                        placeholder="Write your content here..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Publication Settings */}
                {/* <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Publication Settings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure how and when your post will be published.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="publication-status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="publication-status"
                          name="publicationStatus"
                          value={formData.publicationStatus}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="draft">Draft</option>
                          <option value="publish">Publish immediately</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="visibility"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Visibility
                      </label>
                      <div className="mt-1">
                        <select
                          id="visibility"
                          name="visibility"
                          value={formData.visibility}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="public">Public</option>
                          <option value="members">Members only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isPremiumContent"
                            name="isPremiumContent"
                            type="checkbox"
                            checked={formData.isPremiumContent}
                            onChange={handleCheckboxChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isPremiumContent"
                            className="font-medium text-gray-700"
                          >
                            Premium Content
                          </label>
                          <p className="text-gray-500">
                            Only accessible by premium subscribers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Submit Buttons */}
                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Link
                      to="/blog" // Assuming a general blog list page route for cancellation
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    {/* <button
                      type="submit"
                      disabled={isSubmitting}
                      // This sets the publicationStatus just before submitting
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          publicationStatus: "draft",
                        }))
                      }
                      className="ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSubmitting && formData.publicationStatus === "draft"
                        ? "Saving Draft..."
                        : "Save Draft"}
                    </button> */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      // This sets the publicationStatus just before submitting
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          publicationStatus: "publish",
                        }))
                      }
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-500"
                    >
                      {isSubmitting && formData.publicationStatus === "publish"
                        ? "Publishing..."
                        : "Publish"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
