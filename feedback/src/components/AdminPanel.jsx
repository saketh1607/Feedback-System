import { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReplyForm from './ReplyForm';
import FeedbackChart from './FeedbackChart';
import AIAssistant from './AIAssistant';
import './AdminPanel.css';

export default function AdminPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesFilter = filter === 'all' || fb.sentiment === filter;
    const matchesSearch = fb.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scrollCarousel = (direction) => {
    const scrollAmount = 400;
    carouselRef.current?.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div className={`admin-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-header">
        <h1>Feedback Dashboard</h1>
        <p>Monitor and respond to customer feedback in real-time</p>
        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="sentiment">Filter</label>
            <select 
              id="sentiment"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Feedbacks</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <AIAssistant feedbacks={filteredFeedbacks} />
      
      {feedbacks.length > 0 && <FeedbackChart feedbacks={feedbacks} />}

      <div className="feedback-section">
        <div className="section-header">
          <h2>Recent Feedback</h2>
          <div className="carousel-controls">
            <button 
              onClick={() => scrollCarousel('left')} 
              className="carousel-button"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button 
              onClick={() => scrollCarousel('right')} 
              className="carousel-button"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="feedback-carousel" ref={carouselRef}>
          {filteredFeedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <h3>{feedback.name || 'Anonymous'}</h3>
              <span className={`sentiment ${feedback.sentiment}`}>
                {feedback.sentiment}
              </span>
              <p>
                {searchQuery && feedback.message ? 
                  feedback.message.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                    part.toLowerCase() === searchQuery.toLowerCase() ? 
                      <span key={i} className="highlight">{part}</span> : part
                  ) : 
                  feedback.message
                }
              </p>
              <div className="meta">
                <span className="date">
                  {feedback.createdAt?.toDate?.()?.toLocaleString() || 'Unknown date'}
                </span>
                <button 
                  onClick={() => setSelectedFeedback(feedback)}
                  className="reply-button"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFeedback && (
        <div className="modal-overlay">
          <ReplyForm 
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
          />
        </div>
      )}
    </div>
  );
}
