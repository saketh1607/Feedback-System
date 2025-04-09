// src/components/AIAssistant.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AIAssistant({ feedbacks }) {
  const [adminPrompt, setAdminPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleAskAI = async () => {
    if (!adminPrompt.trim()) return toast.error('Please enter your question.');
    
    setLoading(true);
    try {
      // Convert Firestore timestamps
      const safeFeedbacks = feedbacks.map(fb => ({
        ...fb,
        createdAt: fb.createdAt?.toDate ? fb.createdAt.toDate().toISOString() : new Date().toISOString()
      }));
      
      const response = await axios.post(
        '/.netlify/functions/ai-assistant',
        {
          prompt: adminPrompt,
          feedbacks: safeFeedbacks
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000 // Increased timeout to 60 seconds
        }
      );
      
      if (!response.data?.reply) {
        throw new Error('Empty response from AI');
      }
      
      setAiReply(response.data.reply);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      toast.error(`AI Error: ${errorMessage}`);
      console.error('Full error details:', {
        error: err,
        response: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">🤖 Ask AI Assistant</h2>
      <textarea
        value={adminPrompt}
        onChange={(e) => setAdminPrompt(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 h-28"
        placeholder="e.g., What is the biggest concern from feedbacks?"
      />
      
      <button
        onClick={handleAskAI}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        disabled={loading}
      >
        {loading ? 'Asking AI...' : 'Ask AI'}
      </button>
      
      {aiReply && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-gray-800">
          <h3 className="font-semibold mb-2">AI Assistant Reply:</h3>
          <div dangerouslySetInnerHTML={{ __html: aiReply }} />
        </div>
      )}
    </div>
  );
}