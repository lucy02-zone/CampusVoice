import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByPost } from "../api/commentApi";
import { getPosts } from "../api/postApi";
import CommentSection from "../components/CommentSection";

const PostDetail = () => {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
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

                const commentData = await getCommentsByPost(id);

                if (commentData.success) {
                    setComments(commentData.comments);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load post"
                );
            }
        };

        loadData();
    }, [id]);

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

            <hr />

            <CommentSection postId={post.id} />

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
        </div>
    );
};

export default PostDetail;