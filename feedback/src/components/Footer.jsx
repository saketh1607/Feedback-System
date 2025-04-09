// src/components/Footer.jsx
export default function Footer() {
    return (
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>Feedback Collector System | Created by K.Saketh</p>
          <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    );
  }