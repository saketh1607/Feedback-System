// // src/components/AdminPanel.jsx
// import { useState, useEffect } from 'react';
// import { collection, query, where, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import ReplyForm from './ReplyForm';
// import FeedbackChart from './FeedbackChart';
// import AIAssistant from './AIAssistant';


// export default function AdminPanel() {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const q = query(collection(db, 'feedbacks'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setFeedbacks(data);
//     });
//     return () => unsubscribe();
//   }, []);

//   const filteredFeedbacks = feedbacks.filter(fb => {
//     const matchesFilter = filter === 'all' || fb.sentiment === filter;
//     const matchesSearch = fb.message.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <h1 className="text-3xl font-bold text-gray-800">Feedback Dashboard</h1>
//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Search feedback..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="p-2 border rounded-lg"
//           />
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="p-2 border rounded-lg bg-white"
//           >
//             <option value="all">All Feedbacks</option>
//             <option value="positive">Positive</option>
//             <option value="negative">Negative</option>
//           </select>
//         </div>
//       </div>
//       <AIAssistant feedbacks={feedbacks} />

//       <FeedbackChart feedbacks={feedbacks} />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//         {filteredFeedbacks.map(feedback => (
//           <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="font-semibold text-lg">{feedback.name}</h3>
//               <span className={`px-2 py-1 rounded-full text-sm ${
//                 feedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {feedback.sentiment}
//               </span>
//             </div>
//             <p className="text-gray-600 mb-4">{feedback.message}</p>
//             <div className="flex justify-between items-center text-sm text-gray-500">
//               <span>{new Date(feedback.createdAt?.toDate()).toLocaleDateString()}</span>
//               <button
//                 onClick={() => setSelectedFeedback(feedback)}
//                 className="text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Reply
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedFeedback && (
//         <ReplyForm 
//           feedback={selectedFeedback}
//           onClose={() => setSelectedFeedback(null)}
//         />
//       )}
//     </div>
//   );
// }
// src/components/AdminPanel.jsx
// src/components/AdminPanel.jsx
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

  // Check if user prefers dark mode by default
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Apply dark mode class to body element
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
    const matchesSearch = fb.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scrollCarousel = (direction) => {
    const scrollAmount = 400;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

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
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <AIAssistant feedbacks={filteredFeedbacks} />
      {feedbacks && feedbacks.length > 0 && (
  <FeedbackChart feedbacks={feedbacks} />
)}

      <div className="feedback-section">
        <div className="section-header">
          <h2>Recent Feedback</h2>
          <div className="carousel-controls">
            <button onClick={() => scrollCarousel('left')} className="carousel-button">
              ←
            </button>
            <button onClick={() => scrollCarousel('right')} className="carousel-button">
              →
            </button>
          </div>
        </div>
        <div className="feedback-carousel" ref={carouselRef}>
          {filteredFeedbacks.map(feedback => (
            <div
              key={feedback.id}
              className="feedback-card"
            >
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
                  {feedback.createdAt ? new Date(feedback.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                </span>
                <button onClick={() => setSelectedFeedback(feedback)}>
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFeedback && (
        <ReplyForm
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}