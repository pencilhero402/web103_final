import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import UserPage from './pages/UserPage';
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' });
            const json = await response.json();
            if (json.success) setUser(json.user);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    const logout = async () => {
        try {
            const url = `${API_URL}/auth/logout`;
            const response = await fetch(url, { credentials: 'include' });
            const json = await response.json();
            window.location.href = 'http://localhost:5173/';  
        } catch (err) {
            console.error("Logout erorr: ", err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header api_url={API_URL} user={user} logout={logout}/>
            <main className="flex-grow">
            <Routes>
                <Route path="/" element={<MoviesPage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/:username" element={user ? <UserPage user={user}/>: <h1>Please log in</h1>} />
            </Routes>
            </main>
            <Footer />
        </div>
        </Router>
    );
}

export default App;
