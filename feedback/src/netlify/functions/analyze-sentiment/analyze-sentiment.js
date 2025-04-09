// netlify/functions/analyze-sentiment/analyze-sentiment.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event) => {
  try {
    console.log('Received request:', event.body);

    // Check API key first
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable not configured');
    }

    // Validate method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
      };
    }

    // Parse body
    let feedbacks;
    try {
      const body = JSON.parse(event.body);
      feedbacks = body.feedbacks;
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request format' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
      };
    }

    // Validate feedbacks
    if (!Array.isArray(feedbacks)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Feedbacks must be an array' }),
        headers: { 'Access-Control-Allow-Origin': '*' }
      };
    }

    // Prepare messages
    const messages = feedbacks
      .map((f, i) => `${i}: ${(f.message || '').slice(0, 200)}`) // Limit message length
      .join('\n');

    // Initialize AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create prompt
    const prompt = `Analyze these messages. For each line (format: "index: message"), respond with JSON:
    [{"index": number, "sentiment": "positive"|"negative"}]
    
    Messages:
    ${messages}
    
    Rules:
    1. Use only "positive" or "negative"
    2. No explanations
    3. Valid JSON only`;

    console.log('Sending prompt:', prompt);

    // Get response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '');
    
    console.log('Raw AI response:', text);

    // Parse response
    const analysis = JSON.parse(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    };

  } catch (error) {
    console.error('Full error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Analysis failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
};