import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import './FeedbackForm.css';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'feedbacks'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setFormData({ name: '', email: '', message: '' });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Submission error:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="feedback-form-container">
      <h2 className="feedback-form-title">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Feedback Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="form-input form-textarea"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="submit-button"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}