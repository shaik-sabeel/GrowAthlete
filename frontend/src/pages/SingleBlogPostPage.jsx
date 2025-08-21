// src/pages/SingleBlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Using Link and useParams for dynamic routing
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component

// Sample blog data (in a real app, this would come from a database or API)
// Ensure content has HTML tags like <p>, <h2> etc., as it will be rendered with dangerouslySetInnerHTML
const blogPostsData = {
  '1': {
    id: '1',
    title: 'The Rise of Kabaddi as India\'s New Elite Sport',
    summary: 'How Kabaddi has transformed from a rural game to a professional sport with international appeal.',
    content: `
      <p>From rural villages to international arenas, kabaddi has undergone a remarkable transformation in India over the past decade. Once considered a simple pastime played in the dusty fields of rural India, kabaddi has risen to become one of the country's most exciting spectator sports, complete with professional leagues, celebrity owners, and international appeal.</p>
      
      <h2>The Pro Kabaddi League Revolution</h2>
      <p>The launch of the Pro Kabaddi League (PKL) in 2014 marked a pivotal moment in the sport's history. Backed by Star Sports and with the support of celebrity owners like Abhishek Bachchan, the PKL introduced a level of professionalism, marketing, and spectacle previously unseen in the sport. With high-quality broadcasts, player auctions, and a tournament format that borrowed from the success of cricket's IPL, the PKL immediately captured the imagination of urban India.</p>
      
      <p>Viewership numbers tell the story: in its very first season, PKL attracted 435 million viewers, second only to the IPL in sports league viewership in India. By its fifth season, that number had grown to over 580 million. The League's success challenged the notion that only cricket could dominate India's sporting landscape.</p>
      
      <h2>Creating Kabaddi Stars</h2>
      <p>Perhaps the most significant impact of kabaddi's rise has been the creation of sporting heroes from small towns and villages across India. Players like Pardeep Narwal, Rahul Chaudhari, and Ajay Thakur have become household names, earning salaries that would have been unimaginable for kabaddi players just a decade ago.</p>
      
      <p>Take Pardeep Narwal, for example, nicknamed the "Dubki King" for his signature move. Hailing from a small village in Haryana, Narwal was sold for ₹1.65 crore ($220,000) in the 2021 PKL auction, making him one of the highest-paid players in the league. His journey from rural obscurity to sporting stardom embodies the transformative potential of the sport.</p>
      
      <h2>International Growth</h2>
      <p>While kabaddi has deep roots in South Asia, the sport is expanding globally. The inclusion of kabaddi in the Asian Games since 1990 has provided an international platform, with India dominating the men's competition for many years before being upset by Iran in 2018.</p>
      
      <p>The World Kabaddi Federation now recognizes over 30 national kabaddi federations, and the sport is gaining followings in unexpected places like South Korea, Kenya, and Poland. This international expansion provides new competitive challenges and opportunities for the sport.</p>
      
      <h2>The Future: Nurturing Young Talent</h2>
      <p>With kabaddi's new professional pathways, there's been a surge in interest among young athletes. Schools and colleges are establishing formal kabaddi programs, and state-level tournaments have become more competitive as they serve as scouting grounds for PKL teams.</p>
      
      <p>Organizations like the Kabaddi Juniors League and regional academies are focused on developing the next generation of players, providing structured training and competitive opportunities for young athletes. The sport that once struggled to compete with cricket for talent now offers a viable career path for athletic youth.</p>
      
      <h2>Challenges Ahead</h2>
      <p>Despite its remarkable rise, kabaddi faces challenges. Maintaining viewership growth, expanding international competition, and ensuring the sustainability of player development pipelines are ongoing concerns. Additionally, the sport must continue to innovate its format and presentation to appeal to younger audiences.</p>
      
      <p>However, with strong domestic foundations and growing international interest, kabaddi's journey from rural pastime to elite sport represents one of the most successful sporting transformations in recent history. For young athletes across India, especially those from rural areas, kabaddi now offers not just a connection to cultural tradition, but a path to professional success and national recognition.</p>
    `,
    author: 'Rajiv Sharma',
    date: 'June 15, 2024',
    category: 'Kabaddi',
    image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    readTime: '5 min read'
  },
  '2': {
    id: '2',
    title: 'Training Techniques for Young Cricket Bowlers',
    summary: 'Essential training methods to develop bowling skills in young cricket players while preventing injury.',
    content: `
      <p>Developing young cricket bowlers requires a balanced approach that builds skills while protecting growing bodies from injury. This comprehensive guide covers the essential training techniques for youth cricket coaches and parents to help nurture the next generation of bowling talent.</p>

      <h2>Establishing Proper Mechanics</h2>
      <p>The foundation of effective bowling is proper technique. For young bowlers, this begins with a simplified approach that emphasizes key elements:</p>
      <ul>
        <li><strong>Grip:</strong> Teach a basic seam-up grip with the index and middle fingers positioned along the seam. Avoid complex variations until the fundamentals are mastered.</li>
        <li><strong>Run-up:</strong> Begin with a short, rhythmic approach of 5-7 steps. Focus on consistency rather than speed.</li>
        <li><strong>Load and gather:</strong> Emphasize a balanced position at the crease with weight properly transferred.</li>
        <li><strong>Release point:</strong> Train bowlers to release the ball at the highest point possible relative to their physical capabilities.</li>
      </ul>

      <p>Video analysis can be particularly valuable, allowing young players to see their own actions and compare them to simplified models of proper technique.</p>

      <h2>Age-Appropriate Workloads</h2>
      <p>Overuse injuries are a significant concern for young bowlers. Cricket Australia's youth guidelines provide an excellent framework:</p>
      <ul>
        <li>Under 13: Maximum 4 overs per spell, 8 overs per day</li>
        <li>Under 15: Maximum 5 overs per spell, 10 overs per day</li>
        <li>Under 17: Maximum 6 overs per spell, 16 overs per day</li>
      </ul>

      <p>These guidelines should be adjusted further for players who demonstrate signs of fatigue or are returning from injury.</p>

      <h2>Progressive Skill Development</h2>
      <p>Young bowlers should develop skills in a structured progression:</p>

      <h3>Stage 1: Accuracy (Ages 10-12)</h3>
      <p>Focus initially on bowling consistently to a target. Use drills like:</p>
      <ul>
        <li>Target bowling with hoops or markers on the pitch</li>
        <li>"Channel bowling" aiming for a corridor outside off stump</li>
        <li>Partner bowling with feedback on line and length</li>
      </ul>

      <h3>Stage 2: Variation (Ages 13-15)</h3>
      <p>Once accuracy is established, introduce variations in pace and movement:</p>
      <ul>
        <li>Bowling with different seam positions</li>
        <li>Developing a slower ball</li>
        <li>Understanding how conditions affect the ball</li>
      </ul>

      <h3>Stage 3: Strategic Bowling (Ages 16+)</h3>
      <p>Integrate tactical awareness into training:</p>
      <ul>
        <li>Situation-based exercises</li>
        <li>Identifying and targeting batsman weaknesses</li>
        <li>Building pressure through consistent bowling to plans</li>
      </ul>

      <h2>Physical Conditioning for Young Bowlers</h2>
      <p>Bowling places unique demands on the body. Age-appropriate strength and conditioning should focus on:</p>

      <h3>Core Stability</h3>
      <p>Exercises like planks, medicine ball rotations, and stability ball work build the foundation for bowling actions.</p>

      <h3>Lower Body Strength</h3>
      <p>Bodyweight exercises like lunges and squats develop the leg drive needed for bowling. For older teens, progressive resistance training can be introduced under qualified supervision.</p>

      <h3>Shoulder and Upper Back</h3>
      <p>Carefully structured resistance band exercises can strengthen the shoulder complex. Emphasis should be on rotator cuff stability and scapular control.</p>

      <h2>Recovery and Injury Prevention</h2>
      <p>Young bowlers need to learn proper recovery practices early:</p>
      <ul>
        <li>Post-bowling stretching routines</li>
        <li>Adequate hydration and nutrition</li>
        <li>Proper sleep habits</li>
        <li>Reporting any pain or discomfort immediately</li>
      </ul>

      <p>Regular screening by qualified sports medicine professionals can help identify and address biomechanical issues before they lead to injury.</p>

      <h2>Mental Aspects of Bowling</h2>
      <p>The psychological side of bowling is often overlooked in young players. Develop mental resilience through:</p>
      <ul>
        <li>Visualization techniques</li>
        <li>Breathing and centering exercises</li>
        <li>Constructive review of performance</li>
        <li>Celebrating the process rather than just results</li>
      </ul>

      <p>By taking a holistic approach to developing young bowlers—balancing technical work, physical conditioning, appropriate workloads, and mental skills—coaches and parents can help nurture bowling talent while promoting long-term participation in cricket.</p>
    `,
    author: 'Priya Patel',
    date: 'June 10, 2024',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    readTime: '8 min read'
  }
  // Add more blog posts as needed following this structure
};

// Function to find a blog post by ID (simulated fetch)
const getBlogPost = (id) => {
  return blogPostsData[id];
};

export default function SingleBlogPostPage() {
  const { id } = useParams(); // Get the ID from the URL parameters
  const post = getBlogPost(id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Blog post not found</h1>
          <p className="mt-4 text-gray-500">The post you are looking for does not exist or has been removed.</p>
          <div className="mt-8">
            <Link to="/blog" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Return to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar /> {/* Render the Navbar */}
      
      {/* Hero section with featured image */}
      <div className="relative h-96 md:h-[30rem] lg:h-[40rem]">
        <div className="absolute inset-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        </div>
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {post.category}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-3 text-xl text-white opacity-90">
                {post.summary}
              </p>
              
              <div className="mt-8 flex items-center">
                <div className="flex-shrink-0">
                  {/* Placeholder SVG for author image/avatar */}
                  <svg className="h-10 w-10 rounded-full bg-gray-200 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14.25c4.14 0 7.5 1.68 7.5 3.75v2.25h-15v-2.25c0-2.07 3.36-3.75 7.5-3.75z" />
                    <path d="M12 13.5c2.48 0 4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{post.author}</p>
                  <div className="flex space-x-1 text-sm text-white opacity-80">
                    <time dateTime="2020-03-16">{post.date}</time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-50" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-50" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* The `prose` class assumes @tailwindcss/typography plugin is configured */}
            <div className="prose prose-lg prose-indigo mx-auto" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Share and tags section */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-2 flex space-x-2">
                    {/* These tags are hardcoded based on the example. You might dynamically generate them from `post.tags` if it were structured to support multiple tags */}
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Sports
                    </span>
                    {/* Add other tags as relevant or if derived from a tags array */}
                    {/* For example, if you had a tags property like post.tags = ['Training', 'Technique']
                    {post.tags.split(',').map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {tag.trim()}
                        </span>
                    ))}
                    */}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Share</h3>
                  <div className="mt-2 flex space-x-3">
                    {/* Share icons linking to social media */}
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0
                        0 01-2.91 5.452 4.072 4.072 0 01-1.86-.505v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Author section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Placeholder SVG for author image/avatar */}
                  <svg className="h-14 w-14 rounded-full bg-gray-200 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14.25c4.14 0 7.5 1.68 7.5 3.75v2.25h-15v-2.25c0-2.07 3.36-3.75 7.5-3.75z" />
                    <path d="M12 13.5c2.48 0 4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">About the author</h2>
                  <div className="mt-1 text-md font-medium text-gray-900">{post.author}</div>
                  <p className="mt-2 text-base text-gray-500">
                    Sports journalist specializing in youth athletics and talent development across multiple sports disciplines in India. Former national-level athlete with over 15 years of experience in sports education.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Related posts - These links will also use react-router-dom Link */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">You might also like</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div className="flex flex-col rounded-lg shadow-sm overflow-hidden">
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Athletics" />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link to="/blog/3" className="block"> {/* Updated to react-router-dom Link */}
                        <p className="text-xl font-semibold text-gray-900">How Neeraj Chopra Changed Indian Athletics Forever</p>
                        <p className="mt-3 text-base text-gray-500">The impact of Neeraj Chopra's Olympic gold medal on the future of athletics in India.</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col rounded-lg shadow-sm overflow-hidden">
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Nutrition" />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link to="/blog/4" className="block"> {/* Updated to react-router-dom Link */}
                        <p className="text-xl font-semibold text-gray-900">Nutrition Guide for Young Athletes</p>
                        <p className="mt-3 text-base text-gray-500">Essential dietary guidelines for optimal performance and development in adolescent athletes.</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Back to blog */}
            <div className="mt-12 text-center">
              <Link to="/blog" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ← Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}