import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await createPost(formData, token);

            if (data.success) {
                navigate("/posts");
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to create post"
            );
        }
    };

    return (
        <div>
            <h1>Create Anonymous Post</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Post title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="content"
                    placeholder="Write your message..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Publish Post</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
};

export default CreatePost;