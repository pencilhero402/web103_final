import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';  // Use react-router for routing
import './App.css';
import Login from './pages/Login.jsx';

const API_URL = 'http://localhost:3000';

const App = () => {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' });
        const json = await response.json();
        setUser(json.user);
    };

    const logout = async () => {
        const url = `${API_URL}/auth/logout`;
        const response = await fetch(url, { credentials: 'include' });
        const json = await response.json();
        window.location.href = '/';  
    };

    useEffect(() => {
        getUser();
    }, []);

    let element = useRoutes([
        {
            path: '/',
            element: user ? (
                <div>
                    <h1>Welcome, {user.name}</h1>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <Login api_url={API_URL} /> 
            ),
        },
    ]);

    return (
        <div className='app'>
            <h1>HELLO</h1>
            {element}
        </div>
    );
};

export default App;
