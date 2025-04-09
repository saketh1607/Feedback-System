// src/components/ReplyForm.jsx
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
      toast.error('Failed to send email');
      console.error('Email error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Reply to {feedback.name}</h3>
        
        <input
          type="text"
          placeholder="Email Subject"
          value={emailContent.subject}
          onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        
        <textarea
          value={emailContent.body}
          onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
          className="w-full h-48 p-2 border rounded-lg mb-4"
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}