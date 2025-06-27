import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";

const BlockAnyUser = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingToggleUserId, setLoadingToggleUserId] = useState(null);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/auth/getAllUsers");
            console.log("Users fetched:", response.data.users);
            setAllUsers(response.data.users);
        } catch (err) {
            console.error("Users not found", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlockToggle = async (userId) => {
        setLoadingToggleUserId(userId);
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/toggleBlock/${userId}`);
            console.log(res.data.message);
            await fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error toggling block status:", error);
        } finally {
            setLoadingToggleUserId(null);
        }
    };


    return (
        <div className="container p-2">
            <h2>All Users</h2>
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
                                        </div>
                                        <Button
                                            variant={user.isBlocked ? "danger" : "primary"}
                                            size="sm"
                                            onClick={() => handleBlockToggle(user._id)}

                                            disabled={loadingToggleUserId === user._id}
                                        >
                                            {loadingToggleUserId === user._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : user.isBlocked ? (
                                                "Blocked"
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
        </div>
    );
};

export default BlockAnyUser;
