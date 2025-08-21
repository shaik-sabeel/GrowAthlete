// src/pages/SportsBlogPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for internal navigation
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component

// Sample blog data (in a real app, this would come from a database or API)
const blogPosts = [
  {
    id: '1',
    title: 'The Rise of Kabaddi as India\'s New Elite Sport',
    summary: 'How Kabaddi has transformed from a rural game to a professional sport with international appeal.',
    author: 'Rajiv Sharma',
    date: 'June 15, 2024',
    category: 'Kabaddi',
    image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Training Techniques for Young Cricket Bowlers',
    summary: 'Essential training methods to develop bowling skills in young cricket players while preventing injury.',
    author: 'Priya Patel',
    date: 'June 10, 2024',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '8 min read'
  },
  {
    id: '3',
    title: 'How Neeraj Chopra Changed Indian Athletics Forever',
    summary: 'The impact of Neeraj Chopra\'s Olympic gold medal on the future of athletics in India.',
    author: 'Aman Verma',
    date: 'June 7, 2024',
    category: 'Athletics',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '7 min read'
  },
  {
    id: '4',
    title: 'Nutrition Guide for Young Athletes',
    summary: 'Essential dietary guidelines for optimal performance and development in adolescent athletes.',
    author: 'Dr. Meera Singh',
    date: 'June 5, 2024',
    category: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '10 min read'
  },
  {
    id: '5',
    title: 'The Mental Game: Psychology in Sports',
    summary: 'Understanding the psychological aspects of athletic performance and mental resilience in sports.',
    author: 'Dr. Vikram Joshi',
    date: 'June 1, 2024',
    category: 'Psychology',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '9 min read'
  },
  {
    id: '6',
    title: 'Football Academies Transforming Lives in Rural India',
    summary: 'How grassroots football initiatives are creating opportunities for rural youth across India.',
    author: 'Nikhil Das',
    date: 'May 28, 2024',
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read'
  }
];

export default function SportsBlogPage() {
  // You might want to filter posts based on URL query params if categories were dynamic
  // For this static version, we just show all.
  const featuredPost = blogPosts[0]; // First post as featured
  const regularPosts = blogPosts.slice(1); // Rest are regular posts

  return (
    <div className="bg-white">
      <Navbar /> {/* Assuming Navbar is used here */}
      {/* Hero section with background */}
      <div className="relative py-24 bg-gradient-to-br from-indigo-900 to-blue-800">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Sports background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Sports Blog
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-indigo-100 sm:mt-5">
            Insights, stories, and analyses from the world of sports
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories navigation - Using react-router-dom Link for navigation to simulated categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Note: For actual category filtering, you'd likely manage this with React state and update `regularPosts` based on selection */}
          <Link to="/blog" className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
            All Posts
          </Link>
          <Link to="/blog?category=Cricket" className="px-4 py-2 rounded-full bg-gray-100 text-white text-sm font-medium hover:bg-gray-200">
            Cricket
          </Link>
          <Link to="/blog?category=Football" className="px-4 py-2 rounded-full bg-gray-100 text-white text-sm font-medium hover:bg-gray-200">
            Football
          </Link>
          <Link to="/blog?category=Athletics" className="px-4 py-2 rounded-full bg-gray-100 text-white text-sm font-medium hover:bg-gray-200">
            Athletics
          </Link>
          <Link to="/blog?category=Basketball" className="px-4 py-2 rounded-full bg-gray-100 text-white text-sm font-medium hover:bg-gray-200">
            Basketball
          </Link>
          <Link to="/blog?category=Nutrition" className="px-4 py-2 rounded-full bg-gray-100 text-white text-sm font-medium hover:bg-gray-200">
            Nutrition
          </Link>
        </div>

        {/* Featured post */}
        <div className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
            </div>
            <div className="relative px-8 py-16 sm:px-12 sm:py-24 lg:py-32">
              <div className="max-w-2xl mx-auto text-center">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {featuredPost.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  {featuredPost.title}
                </h1>
                <p className="mt-6 text-xl text-white">
                  {featuredPost.summary}
                </p>
                <div className="mt-6 flex items-center justify-center text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {/* Placeholder SVG for author image/avatar */}
                      <svg className="h-10 w-10 rounded-full bg-gray-200 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14.25c4.14 0 7.5 1.68 7.5 3.75v2.25h-15v-2.25c0-2.07 3.36-3.75 7.5-3.75z" />
                        <path d="M12 13.5c2.48 0 4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{featuredPost.author}</p>
                      <div className="flex space-x-1 text-sm">
                        <time dateTime="2020-03-16">{featuredPost.date}</time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <Link
                    to={`/blog/${featuredPost.id}`} 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Read article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regular posts grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {post.category}
                    </span>
                  </p>
                  <Link to={`/blog/${post.id}`} className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.summary}</p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    {/* Placeholder SVG for author image/avatar */}
                    <svg className="h-10 w-10 rounded-full bg-gray-200 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14.25c4.14 0 7.5 1.68 7.5 3.75v2.25h-15v-2.25c0-2.07 3.36-3.75 7.5-3.75z" />
                      <path d="M12 13.5c2.48 0 4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime="2020-03-16">{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (Static links for now, requires state for true pagination) */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    8
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </nav>
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 bg-indigo-50 rounded-2xl py-12 px-6 sm:py-16 sm:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Get the latest sports updates</h2>
            <p className="mt-4 text-lg text-gray-500">
              Subscribe to our newsletter to receive the latest news, training tips, and inspiring stories from the sports world.
            </p>
            <div className="mt-8 sm:w-full sm:max-w-md mx-auto">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs rounded-md"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-gray-500">
                We care about your data. Read our{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}