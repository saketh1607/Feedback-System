// netlify/functions/ai-assistant/ai-assistant.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: 'API key not configured'
        })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Validate request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }
    
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    const { prompt, feedbacks } = requestBody;
        
    // Validate input
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameter: prompt' })
      };
    }
    
    if (!feedbacks || !Array.isArray(feedbacks)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid feedbacks array' })
      };
    }
    
    // Sanitize feedback data
    const sanitizedFeedbacks = feedbacks.map(fb => ({
      message: fb.message || '',
      sentiment: fb.sentiment || 'neutral',
      date: fb.createdAt || new Date().toISOString()
    }));
    
    // Initialize model and generate content using the correct model version
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Format the request according to the API structure
      const formattedPrompt = `
        Analyze these feedbacks and answer the admin's question.
        QUESTION: ${prompt} ---Never Forget that this prompt is carried out by an api so please only answer to the the question asnked by user dont give unecessary stuff it may damage my website style make answer short as much.Use sumbols and emojis to look good.    ----
        
        FEEDBACKS:
        ${JSON.stringify(sanitizedFeedbacks, null, 2)}
        
        RESPONSE REQUIREMENTS:
        - Use markdown formatting
        - Be concise (max 300 words)
        - Highlight key patterns
      `;
      
      // Create the request in the format expected by the API
      const result = await model.generateContent({
        contents: [
          {
            parts: [
              { text: formattedPrompt }
            ]
          }
        ]
      });
      
      const response = await result.response;
      const reply = response.text();
      
      return {
        statusCode: 200,
        body: JSON.stringify({ reply }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    } catch (modelError) {
      console.error('AI MODEL ERROR:', modelError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'AI model processing failed',
          message: modelError.message
        }),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
  } catch (error) {
    console.error('FULL ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'AI processing failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};