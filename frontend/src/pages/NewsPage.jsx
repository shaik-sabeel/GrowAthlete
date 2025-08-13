import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import '../pages_css/NewsPage.css';
import AI_News from '../assets/images/AI_News.png';
import Doc from '../assets/images/Doc.png';
import Brands from '../assets/images/Brands.png';
import FC from '../assets/images/FC.png';


// --- Mock Data: In a real app, you would fetch this from an API ---
const allArticles = [
  { id: 1, category: 'Technology', title: 'The Digital Revolution in Indian Sports', excerpt: 'Explore how technology is transforming athlete scouting, training, and fan engagement across the nation.', image:  AI_News },
  { id: 2, category: 'Community', title: 'Grassroots to Glory: Unearthing Future Champions', excerpt: 'A deep dive into how local sports communities are becoming the breeding ground for India\'s next top athletes.', image: FC  },
  { id: 3, category: 'Business', title: 'Sponsorship in the New Age of Sports', excerpt: 'Understand the changing dynamics of sports sponsorships and how brands are connecting with athletes.', image:  Brands  },
  { id: 4, category: 'Training', title: 'The Science of Recovery for Peak Performance', excerpt: 'Top physiotherapists share their secrets on how athletes can optimize recovery for better results.', image:  Doc },
  { id: 5, category: 'E-Sports', title: 'E-Sports Officially Recognized as a Mainstream Sport', excerpt: 'The Indian government has now officially recognized E-Sports, opening new doors for professional gamers.', image:  AI_News  },
  { id: 6, category: 'Community', title: 'How Local Clubs Are Changing the Game for Youth', excerpt: 'Discover the impact of small, community-funded sports clubs on nurturing young talent.', image:  AI_News },
  { id: 7, category: 'Technology', title: 'AI in Action: How Data Analytics is Predicting the Next Stars', excerpt: 'Scouts are now using advanced AI models to analyze performance data and find future champions.', image:  AI_News  },
];

// Let's select the first article as our featured one
const featuredArticle = allArticles[0];
const regularArticles = allArticles.slice(1);

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedArticles, setDisplayedArticles] = useState(regularArticles.slice(0, 3));
  const [next, setNext] = useState(3);

  const categories = ['All', 'Technology', 'Community', 'Business', 'Training', 'E-Sports'];

  useEffect(() => {
    // Filter articles when category changes
    if (activeCategory === 'All') {
      setDisplayedArticles(regularArticles.slice(0, 3));
    } else {
      const filtered = regularArticles.filter(article => article.category === activeCategory);
      setDisplayedArticles(filtered);
    }
    setNext(3); // Reset the "load more" counter
  }, [activeCategory]);
  
  const loadMoreArticles = () => {
    const newArticles = regularArticles.slice(next, next + 3);
    setDisplayedArticles(prev => [...prev, ...newArticles]);
    setNext(next + 3);
  };

  const hasMoreArticles = activeCategory === 'All' && next < regularArticles.length;

  return (
    <div className="news-page-container">
      
      {/* --- 1. Featured Article Section --- */}
      <header className="featured-article-section">
        <div className="featured-image-container">
          {/* In a real app, this would be an <img /> tag */}
          <img src={featuredArticle.image} alt={featuredArticle.title} className="featured-image-placeholder" />
{/*         
          <div className="featured-image-placeholder"></div> */}
        </div>
        <div className="featured-content">
          <span className="featured-tag">Featured News</span>
          <h1 className="featured-title">{featuredArticle.title}</h1>
          <p className="featured-excerpt">{featuredArticle.excerpt}</p>
          <Link to={`/news/${featuredArticle.id}`} className="read-more-button">Read Full Story &rarr;</Link>
        </div>
      </header>

      <main className="latest-news-section">
        {/* --- 2. Category Filter Section --- */}
        <div className="category-filters">
          {categories.map(category => (
            <button 
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --- 3. News Grid Section --- */}
        <div className="news-grid">
          {displayedArticles.map(article => (
            <div className="news-card" key={article.id}>
              <img src={article.image} alt={article.title} className="news-image-placeholder" />
              <div className="news-content">
                <span className="news-category-tag">{article.category}</span>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-excerpt">{article.excerpt}</p>
                <Link to={`/news/${article.id}`} className="read-more-link">Read More &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* --- 4. Load More Button Section --- */}
        {hasMoreArticles && (
          <div className="load-more-container">
            <button onClick={loadMoreArticles} className="load-more-button">Load More Articles</button>
          </div>
        )}

      </main>
    </div>
  );
};

export default NewsPage;