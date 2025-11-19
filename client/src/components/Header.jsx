import { Link } from "react-router-dom";
import React from 'react';

function Header({ api_url, user, logout }) {
    const AUTH_URL = `${api_url}/auth/github`;

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">Scene it</h1>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
                <Link
                to="/movies"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                Movies
                </Link>
                <Link
                to="/watchlist"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                WatchList
                </Link>
                {/* Login & Logout Conditional */}
                {user ? (<>
                        <Link to={`/${user.username}`}> {user.username} </Link>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors" onClick={logout}>Logout</button>
                    </>
                    ) : (
                        <a href={AUTH_URL}>
                            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">Login</button>
                        </a>
                    )
                }
            </nav>
            </div>
        </div>
        </header>
    );
}

export default Header;
