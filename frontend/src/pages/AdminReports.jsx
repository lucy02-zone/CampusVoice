import { useEffect, useState } from "react";
import { getReports } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

const AdminReports = () => {
    const { token } = useAuth();

    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await getReports(token);

                if (data.success) {
                    setReports(data.reports);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load reports"
                );
            }
        };

        loadReports();
    }, [token]);

    return (
        <div>
            <h1>Reported Posts</h1>

            {error && <p>{error}</p>}

            {reports.length === 0 ? (
                <p>No reports available.</p>
            ) : (
                reports.map((report) => (
                    <div key={report.id}>
                        <h3>Report #{report.id}</h3>

                        <p>
                            Post ID: {report.postId}
                        </p>

                        <p>
                            Reason: {report.reason}
                        </p>

                        <p>
                            Description:{" "}
                            {report.description || "No description"}
                        </p>

                        <p>
                            Status: {report.status}
                        </p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminReports;