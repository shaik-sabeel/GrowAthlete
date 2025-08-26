"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "", // Renamed from coverImage to image for consistency with schema, storing URL directly or base64 (not File)
    content: "",
    summary: "",
    
    isPremium: false, // New field for premium content
    publicationStatus: 'publish', // Default status for direct publish
    visibility: 'public', // Default visibility
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

  // Simplified image handling for direct URL input in this example,
  // For actual file upload, you'd use a different approach (e.g., S3, Cloudinary)
  const handleImageURLChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, image: value }));
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

    // If premium content and user doesn't have premium, prevent submission
    if (formData.isPremium && !checkUserPremium()) {
        setPremiumRequired(true);
        setIsSubmitting(false);
        return;
    }

    // IMPORTANT: The author ID must come from an authenticated user.
    // For this example, I'm hardcoding a placeholder author ID.
    // In a real application, you would typically get this from `localStorage`,
    // `context`, or a state management solution after a user logs in.
    const hardcodedAuthorId = "6544955b23d90f230f305c74"; // Replace with an actual User _id from your database

    fetch("http://localhost:5000/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category: formData.category,
        image: formData.image, // Include the image URL
         // Include tags
        isPremium: formData.isPremium, // Include premium status
        author: hardcodedAuthorId, // Pass the author ID
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setIsSubmitting(false);
        alert('Blog post created successfully!');
        navigate(`/sports-blog/${data.slug}`);
      })
      .catch((err) => {
        console.error("Failed to create blog post:", err);
        setIsSubmitting(false);
        alert(`Failed to create blog post: ${err.message || 'Server error'}`);
      });
  };

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
            to="/subscribe"
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
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
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

                {/* Featured Image URL Input */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Featured Image</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a URL for your blog post's cover image.
                  </p>
                  <div className="mt-6">
                    <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 sr-only">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      id="image-url"
                      value={formData.image}
                      onChange={handleImageURLChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      required
                    />
                     {formData.image && (
                        <div className="mt-4 border rounded-md p-2">
                            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                            <img src={formData.image} alt="Preview" className="max-w-full h-auto rounded-md object-cover max-h-48" />
                        </div>
                    )}
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Post Content
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Write your blog post with rich formatting.
                  </p>

                  <div className="mt-6 border border-gray-300 rounded-md"> {/* Combined top/bottom borders */}
                    <textarea
                      id="content"
                      name="content"
                      rows={14}
                      value={formData.content}
                      onChange={handleInputChange}
                      className="block w-full focus:ring-0 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md p-3" // Apply full border, not just focus ring. Remove border-0.
                      placeholder="Write your content here..."
                      required
                    />
                  </div>
                </div>

                {/* Premium Content Checkbox */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Access Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Control who can read your content.
                  </p>
                  <div className="mt-6">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isPremium"
                          name="isPremium"
                          type="checkbox"
                          checked={formData.isPremium}
                          onChange={handleCheckboxChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isPremium" className="font-medium text-gray-700">
                          Premium Content
                        </label>
                        <p className="text-gray-500">Only accessible by premium subscribers.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Link
                      to="/sports-blog"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSubmitting ? "Publishing..." : "Publish"}
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