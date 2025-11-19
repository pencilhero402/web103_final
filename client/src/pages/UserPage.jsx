import { useState, useEffect } from 'react';
import { useParams} from "react-router-dom";

function UserPage () {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user information
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
        
            try {
                const response = await fetch(`http://localhost:3001/api/user/${username}`);
                const data = await response.json();
        
                if (data) {
                    setUser(data);
                } else {
                    setError("User not found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setError("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };
    
        if (username) {
            fetchUser();
        }
    }, [username]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-24"> User Profile </h1>
            {/* Profile Container*/}
            {user && (
                <div className="flex flex-row items-start bg-transparent">
                    {/* Profile Image */}
                    <img
                        src={user.avatarurl || "https://via.placeholder.com/200"}
                        alt={`${user.username}-profile`}
                        width="200"
                        height="200"
                        className="object-contain border border-[2px] rounded"
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/200";
                        }}
                    />

                    {/* User Information */}
                    <div className="p-4">
                        <h2 className="text-2xl font-semibold">{user.username}</h2>
                        <p>Number of Movies Reviewed: {/* Add logic later */}</p>
                        <p>Favorite Movie: {/* Add logic later */}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserPage;