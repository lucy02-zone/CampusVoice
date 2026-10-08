import { useEffect, useState } from "react";
import { getPosts } from "../api/postApi";
import { Link } from "react-router-dom";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await getPosts();

                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load posts"
                );
            }
        };

        loadPosts();
    }, []);

    return (
        <div>
            <h1>CampusVoice Posts</h1>

            {error && <p>{error}</p>}

            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>Category: {post.category}</p>
                        <Link to={`/posts/${post.id}`}>
                            View Post
                        </Link>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default Posts;