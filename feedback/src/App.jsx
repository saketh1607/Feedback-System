// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import FeedbackForm from './components/FeedbackForm';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import './App.css';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route 
              path="/admin" 
              element={
                user ? <AdminPanel /> : <Navigate to="/login" />
              } 
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;