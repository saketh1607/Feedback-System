import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeSentiment } from './gemini.cjs';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handler(event) {
  const { name, email, message } = JSON.parse(event.body);
  
  try {
    const sentiment = await analyzeSentiment(message);

    const docRef = await addDoc(collection(db, 'feedbacks'), {
      name,
      email,
      message,
      sentiment,
      createdAt: serverTimestamp()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
