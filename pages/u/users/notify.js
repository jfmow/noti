import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import styles from './Admin.module.css';
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function UserListAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [notiTitle, setNotiTitle] = useState('');
    const [notiMsg, setNotiMsg] = useState('');
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Added selectAll state

    useEffect(() => {
        async function getUserList() {
            const records = await pb.collection('users').getFullList({
                sort: '-created',
            });
            setUserList(records);
        }

        async function authUpdate() {
            try {
                const authData = await pb.collection('users').authRefresh();
                if (!pb.authStore.isValid) {
                    pb.authStore.clear();
                    return window.location.replace("/auth/login");
                }
                if (!authData.record?.admin) {
                    return window.location.replace('/');
                } else {
                    getUserList();
                    setIsLoading(false);
                }
            } catch (error) {
                pb.authStore.clear();
                return window.location.replace('/auth/login');
            }
        }

        authUpdate();
    }, []);

    function addUser(userId) {
        if (users.includes(userId)) {
            setUsers(users.filter((id) => id !== userId));
        } else {
            setUsers([...users, userId]);
        }
    }

    function handleSelectAll() {
        if (selectAll) {
            setUsers([]);
        } else {
            const allUserIds = userList.map((user) => user.id);
            setUsers(allUserIds);
        }
        setSelectAll(!selectAll);
    }

    async function postNoti() {
        if (!notiTitle || !notiMsg) {
            return toast.warning('Please fill out all inputs!');
        }
        if (users.length === 0) {
            return toast.warning('Please select at least one user!');
        }
        try {
            const data = {
                "user": users,
                "title": notiTitle,
                "message": notiMsg,
            };

            const record = await pb.collection('notifications').create(data);
            setNotiMsg('');
            setNotiTitle('');
            toast.success('Posted!');
        } catch (err) {
            toast.error('Failed to post');
        }
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Notify</h1>
                </div>

                <div className={styles.user_list_container}>
                    <div className={styles.userlist}>
                        <div className={styles.notdiv}>
                            <input
                                className={styles.notinput}
                                value={notiTitle}
                                type="text"
                                onChange={(event) => setNotiTitle(event.target.value)}
                                placeholder="Title"
                            />
                            <input
                                className={styles.notinput}
                                value={notiMsg}
                                type="text"
                                onChange={(event) => setNotiMsg(event.target.value)}
                                placeholder="Message"
                            />

                            <h3>Users</h3>
                            <div className={styles.useroptions}>
                                <div className={styles.optionuser}>
                                    <input
                                        onChange={handleSelectAll} // Added select all handler
                                        type="checkbox"
                                        checked={selectAll}
                                    />
                                    <h5>Select All</h5>
                                </div>
                                {userList.map((user) => (
                                    <div className={styles.optionuser} key={user.id}>
                                        <input
                                            onChange={(event) => addUser(event.target.value)}
                                            type="checkbox"
                                            value={user.id}
                                            checked={users.includes(user.id)}
                                        />
                                        <h5>{user.username}</h5>
                                    </div>
                                ))}
                            </div>
                            <button onClick={postNoti} className={styles.buttondefault}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
