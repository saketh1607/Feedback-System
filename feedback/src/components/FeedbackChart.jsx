// src/components/FeedbackChart.jsx
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function FeedbackChart({ feedbacks }) {
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ['#00C49F', '#FF8042']; // Green (Positive), Orange (Negative)

  useEffect(() => {
    const analyzeSentiments = async () => {
      try {
        if (!feedbacks?.length) {
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          '/.netlify/functions/analyze-sentiment',
          { feedbacks },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Transform AI response to chart format
        const counts = data.analysis.reduce((acc, { sentiment }) => {
          acc[sentiment] = (acc[sentiment] || 0) + 1;
          return acc;
        }, {});

        setSentimentData([
          { name: 'Positive', value: counts.positive || 0 },
          { name: 'Negative', value: counts.negative || 0 }
        ]);

      } catch (err) {
        toast.error('Failed to load sentiment analysis');
      } finally {
        setLoading(false);
      }
    };

    analyzeSentiments();
  }, [feedbacks]);

  if (loading) return <div className="p-4 text-gray-500">Analyzing feedbacks...</div>;
  if (!sentimentData.length) return <div className="p-4 text-gray-500">No sentiment data available</div>;

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sentimentData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {sentimentData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}