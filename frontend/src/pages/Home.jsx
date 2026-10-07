import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div>
            <h1>CampusVoice</h1>

            <p>
                A safe space for students to share their campus experiences
                anonymously.
            </p>

            {isAuthenticated ? (
                <>
                    <p>Welcome, {user.name}</p>

                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <br />
                    <Link to="/register">Register</Link>
                </>
            )}
        </div>
    );
};

export default Home;