exports.handler = async (event) => {
  try {
    console.log("Incoming event body:", event.body); // ✅ LOG THIS

    // Validate request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }
    
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

    // Parse request body with error handling
    let feedbacks, prompt;
    try {
      const requestBody = JSON.parse(event.body);
      feedbacks = requestBody.feedbacks;
      prompt = requestBody.prompt;
    } catch (e) {
      console.error("JSON parse error:", e);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
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

    const instruction = `Act as an AI assistant for an admin panel. Your responses will be directly posted on a public website, so use short sentences and bullet points to highlight key insights or suggestions.`;
    
    const fullPrompt = `${instruction}\n\nAdmin's query: "${prompt}"\n\nFeedbacks: ${JSON.stringify(feedbacks)}`;
    
    console.log("Sending request to Gemini API with prompt:", fullPrompt.substring(0, 100) + "..."); // Log truncated prompt
    
    // Updated to use gemini-2.0-flash model instead of gemini-pro
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Gemini API error:", {
        status: res.status,
        statusText: res.statusText,
        errorBody: errorData
      });
      return {
        statusCode: 502,
        body: JSON.stringify({ 
          error: 'Error from Gemini API', 
          status: res.status,
          details: errorData
        })
      };
    }

    const data = await res.json();

    console.log("Gemini response:", data); // ✅ LOG THIS TOO

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected Gemini API response structure:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Unexpected response format from Gemini API', 
          details: 'Missing expected response data'
        })
      };
    }

    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (err) {
    console.error("AI assistant error:", err); // ✅ Watch this closely
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'AI assistant failed', 
        details: err.message
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};