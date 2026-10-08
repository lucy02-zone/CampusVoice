import { useEffect, useState } from "react";
import { getCommentsByPost, createComment } from "../api/commentApi";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId }) => {
    const { token, isAuthenticated } = useAuth();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const loadComments = async () => {
        try {
            const data = await getCommentsByPost(postId);

            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            setError("Failed to load comments");
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await createComment(
                {
                    postId,
                    content,
                },
                token
            );

            if (data.success) {
                setContent("");
                loadComments();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create comment"
            );
        }
    };

    return (
        <div>
            <h2>Comments</h2>

            {error && <p>{error}</p>}

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id}>
                        <p>{comment.content}</p>
                        <hr />
                    </div>
                ))
            )}

            {isAuthenticated && (
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Write a comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Add Comment
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentSection;