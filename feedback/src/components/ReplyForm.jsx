import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ReplyForm({ feedback, onClose }) {
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: `Dear ${feedback.name},\n\nThank you for your feedback!`
  });

  const handleSend = async () => {
    try {
      await axios.post('/.netlify/functions/send-reply', {
        toEmail: feedback.email,
        subject: emailContent.subject,
        body: emailContent.body
      });
      toast.success('Email sent successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send email');
      console.error('Email error:', error);
    }
  };

  return (
    <div className="modal-content">
      <h3>Reply to {feedback.name}</h3>
      
      <input
        type="text"
        placeholder="Email Subject"
        value={emailContent.subject}
        onChange={(e) => setEmailContent(prev => ({...prev, subject: e.target.value}))}
      />
      
      <textarea
        value={emailContent.body}
        onChange={(e) => setEmailContent(prev => ({...prev, body: e.target.value}))}
      />
      
      <div className="modal-actions">
        <button onClick={onClose} className="secondary-button">
          Cancel
        </button>
        <button onClick={handleSend} className="primary-button">
          Send Email
        </button>
      </div>
    </div>
  );
}