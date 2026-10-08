import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <Link to="/">CampusVoice</Link>{" "}
            <Link to="/posts">Posts</Link>{" "}

            {isAuthenticated ? (
                <>
                    <Link to="/create-post">Create Post</Link>{" "}
                    <Link to="/notifications">Notifications</Link>{" "}

                    {user?.role === "MENTOR" && (
                        <>
                            <Link to="/admin/reports">Reports</Link>{" "}
                            <Link to="/admin/complaint-responses">
                                Complaints
                            </Link>{" "}
                        </>
                    )}

                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>{" "}
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;