import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createReport } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

const ReportPost = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token } = useAuth();

    const postId = searchParams.get("postId");

    const [formData, setFormData] = useState({
        reason: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            const data = await createReport(
                {
                    postId,
                    reason: formData.reason,
                    description: formData.description,
                },
                token
            );

            if (data.success) {
                setMessage("Report submitted successfully");

                setTimeout(() => {
                    navigate("/posts");
                }, 1000);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit report"
            );
        }
    };

    return (
        <div>
            <h1>Report Post</h1>

            <form onSubmit={handleSubmit}>
                <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select reason</option>
                    <option value="SPAM">Spam</option>
                    <option value="HARASSMENT">Harassment</option>
                    <option value="INAPPROPRIATE">
                        Inappropriate Content
                    </option>
                    <option value="OTHER">Other</option>
                </select>

                <textarea
                    name="description"
                    placeholder="Describe the issue..."
                    value={formData.description}
                    onChange={handleChange}
                />

                <button type="submit">
                    Submit Report
                </button>
            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default ReportPost;