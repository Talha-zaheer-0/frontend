import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button, Alert } from "react-bootstrap";
import Notification from '../Notification';

const BlockAnyUser = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingToggleUserId, setLoadingToggleUserId] = useState(null);
    const [error, setError] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token missing. Please log in again.");
                return;
            }
            const response = await axios.get("http://localhost:5000/api/auth/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Users fetched:", response.data.users);
            setAllUsers(response.data.users);
            if (response.data.users.length === 0) {
                setError("No users found in the system.");
            }
        } catch (err) {
            console.error("Error fetching users:", err.response?.data || err.message);
            setError(err.response?.data?.msg || "Failed to fetch users. Please try again.");
            setNotificationMessage(err.response?.data?.msg || "Failed to fetch users. Please try again.");
            setShowNotification(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlockToggle = async (userId) => {
        setLoadingToggleUserId(userId);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/auth/toggleBlock/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res.data.msg);
            await fetchUsers();
            setNotificationMessage(res.data.msg);
            setShowNotification(true);
        } catch (error) {
            console.error("Error toggling block status:", error.response?.data || error.message);
            setError(error.response?.data?.msg || "Failed to toggle block status. Please try again.");
            setNotificationMessage(error.response?.data?.msg || "Failed to toggle block status. Please try again.");
            setShowNotification(true);
        } finally {
            setLoadingToggleUserId(null);
        }
    };

    return (
        <div className="container p-2">
            <h2>All Users</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="row">
                    {allUsers.length > 0 ? (
                        allUsers.map((user) => (
                            <div className="col-md-12 mb-3" key={user._id}>
                                <div className="card p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{user.name}</h6>
                                            <p className="mb-0">{user.email}</p>
                                            <p className="mb-0 text-muted">Status: {user.isBlocked ? "Blocked" : "Active"}</p>
                                        </div>
                                        <Button
                                            variant={user.isBlocked ? "success" : "danger"}
                                            size="sm"
                                            onClick={() => handleBlockToggle(user._id)}
                                            disabled={loadingToggleUserId === user._id}
                                        >
                                            {loadingToggleUserId === user._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : user.isBlocked ? (
                                                "Unblock"
                                            ) : (
                                                "Block"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            )}
            <Notification 
                show={showNotification} 
                message={notificationMessage} 
                variant={notificationMessage.includes('Failed') ? 'danger' : 'success'}
                onClose={() => setShowNotification(false)} 
            />
        </div>
    );
};

export default BlockAnyUser;