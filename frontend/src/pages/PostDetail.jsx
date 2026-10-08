import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByPost } from "../api/commentApi";
import { getPosts } from "../api/postApi";
import CommentSection from "../components/CommentSection";
import { votePost } from "../api/voteApi";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
    const { id } = useParams();
    const { token, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await getPosts();

                if (postData.success) {
                    const foundPost = postData.posts.find(
                        (item) => item.id === Number(id)
                    );

                    if (!foundPost) {
                        setError("Post not found");
                        return;
                    }

                    setPost(foundPost);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load post"
                );
            }
        };

        loadPost();
    }, [id]);

    const handleVote = async (voteType) => {
        try {
            await votePost(
                {
                    postId: post.id,
                    voteType,
                },
                token
            );

            alert(`${voteType} recorded successfully`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit vote"
            );
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{post.title}</h1>

            <p>{post.content}</p>

            <p>Category: {post.category}</p>

            {isAuthenticated && (
                <div>
                    <button onClick={() => handleVote("UPVOTE")}>
                        👍 Upvote
                    </button>

                    <button onClick={() => handleVote("DOWNVOTE")}>
                        👎 Downvote
                    </button>
                </div>
            )}

            <hr />

            <CommentSection postId={post.id} />
        </div>
    );
};

export default PostDetail;