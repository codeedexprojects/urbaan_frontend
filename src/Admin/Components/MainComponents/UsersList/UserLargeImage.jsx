import { Button, ButtonGroup } from '@material-tailwind/react';
import React, { useContext, useState, useEffect } from 'react';
import { UserSuspendModal } from './UserSuspendModal';
import { UserReactivateModal } from './UserReactivateModal';
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import { AppContext } from "../../../../StoreContext/StoreContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri';

const UserLargeImage = ({ user }) => {
    const { BASE_URL, open, handleOpen } = useContext(AppContext);
    const [selectUser, setSelectUser] = useState(null);
    const [isSuspend, setIsSuspend] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false); // Ensure it's a boolean
    const [statusFind, setStatusFind] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/users/view-all/`);
                setStatusFind(response?.data?.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUserList();
    }, [BASE_URL]);

    useEffect(() => {
        // Check if the user is marked as a favorite
        const userStatus = statusFind.some(
            (userItem) => (userItem.id || userItem._id) === (user.id || user._id) && userItem.isFavorite
        );
        setIsFavorite(userStatus);
    }, [statusFind, user]);

    const handleActiveStatus = async (userId) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/admin/users/toggle/${userId}`,
                { status: isActive },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            setStatusFind((prev) =>
                prev.map((userItem) =>
                    (userItem.id || userItem._id) === userId
                        ? { ...userItem, status: true }
                        : userItem
                )
            );
            setSelectUser(null);
            toast.success('User has been Activated.');
            handleOpen();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSuspendStatus = async (userId) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/admin/users/toggle/${userId}`,
                { status: isSuspend },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            setStatusFind((prev) =>
                prev.map((userItem) =>
                    (userItem.id || userItem._id) === userId
                        ? { ...userItem, status: false }
                        : userItem
                )
            );
            setSelectUser(null);
            toast.success('User has been suspended.');
            handleOpen();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async (UserId) => {
        if (!UserId) {
            console.error("UserId is undefined. Cannot delete user.");
            toast.error("User ID is missing.");
            return;
        }
        try {
            const response = await axios.delete(`${BASE_URL}/admin/users/delete/${UserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            handleOpen();
            setSelectUser(null);
            toast.success("User is deleted");
            navigate('/userslist');
        } catch (error) {
            console.log(error);
        }
    };

    const handleFavourite = async (userId) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/admin/users/favorite/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            setIsFavorite((prevState) => !prevState);
            toast.success(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update favorites');
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-3">
                <div className="relative w-56 h-56">
                    <img
                        src='/userProfile.jpg'
                        alt={user.name}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                    {!statusFind.some(
                        (userItem) => (userItem.id || userItem._id) === (user.id || user._id) && userItem.status === false
                    ) && (
                            isFavorite ? (
                                <RiHeart3Fill
                                    onClick={() => handleFavourite(user.id || user._id)}
                                    className="absolute top-2 right-2 text-4xl bg-white text-primary z-50 rounded-full shadow-md p-1 cursor-pointer"
                                />
                            ) : (
                                <RiHeart3Line
                                    onClick={() => handleFavourite(user.id || user._id)}
                                    className="absolute top-2 right-2 text-4xl bg-white text-primary z-50 rounded-full shadow-md p-1 cursor-pointer"
                                />
                            )
                        )}

                    {statusFind.some(
                        (userItem) => (userItem.id || userItem._id) === (user.id || user._id) && userItem.status === false
                    ) && (
                            <>
                                <div className="absolute inset-0 rounded-2xl bg-black opacity-50 transition-opacity"></div>
                                <div className="absolute inset-0 flex justify-center items-center h-auto w-full">
                                    <img src="/suspended.png" alt="Suspended" className="w-auto h-auto" />
                                </div>
                            </>
                        )}
                </div>


                <ButtonGroup className="flex gap-2">
                    <Button
                        onClick={() => {
                            handleOpen("suspendModal");
                            setSelectUser(user.id || user._id);
                        }}
                        className="rounded-lg font-custom text-sm font-normal capitalize tracking-wider bg-processingBg border-none"
                    >
                        Suspend
                    </Button>
                    <Button
                        onClick={() => {
                            handleOpen("reactivateModal");
                            setSelectUser(user.id || user._id);
                        }}
                        className="rounded-lg font-custom text-sm font-normal capitalize tracking-wider bg-shippedBg border-none"
                    >
                        Reactivate
                    </Button>
                    <Button
                        onClick={() => {
                            handleOpen("deleteProfileModal");
                            setSelectUser(user.id || user._id);
                        }}
                        className="rounded-lg font-custom text-sm font-normal capitalize tracking-wider bg-deleteBg border-none"
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </div>

            <UserSuspendModal
                open={open === "suspendModal"}
                handleOpen={handleOpen}
                userId={selectUser}
                handleSuspend={handleSuspendStatus}
                setIsSuspend={setIsSuspend}
            />
            <UserReactivateModal
                open={open === "reactivateModal"}
                handleOpen={handleOpen}
                userId={selectUser}
                handleActivate={handleActiveStatus}
                setIsActive={setIsActive}
            />
            <DeleteModal
                open={open === "deleteProfileModal"}
                handleOpen={handleOpen}
                handleDelete={handleDeleteUser}
                UserId={selectUser}
                modalType="user"
                title="Delete this profile?"
                description="This action is permanent and cannot be undone."
            />
        </>
    );
};

export default UserLargeImage;
