import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import styles from './Admin.module.css';
import Loader from "@/components/Loader";
import Link from "next/link";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function UserListAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingUser, setLoadingUser] = useState(null);

    useEffect(() => {
        async function getUserList() {
            const records = await pb.collection('users_admin_list').getFullList({
                sort: '-created', filter: `username ~ '${searchTerm}'`
            });
            setUserList(records)
        }

        
        async function authUpdate() {
            try {
                const authData = await pb.collection('users').authRefresh();
                if (!pb.authStore.isValid) {
                    pb.authStore.clear();
                    return window.location.replace("/auth/login");
                }
                if (!authData.record?.admin) {
                    return window.location.replace('/')
                } else {
                    getUserList()
                    setIsLoading(false)
                }
            } catch (error) {
                pb.authStore.clear();
                return window.location.replace('/auth/login');
            }
        }

        authUpdate()

        
    }, [searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    async function disableUser(user) {
        setLoadingUser(user.id);
        const data = {
            "disabled": true
        };
        const record = await pb.collection('users').update(user.id, data);
        setLoadingUser(null);
        setUserList(prevUserList => {
            const updatedUserList = prevUserList.map(u => {
                if (u.id === user.id) {
                    return { ...u, disabled: true };
                }
                return u;
            });
            return updatedUserList;
        });
    }

    async function enableUser(user) {
        setLoadingUser(user.id);
        const data = {
            "disabled": false
        };
        const record = await pb.collection('users').update(user.id, data);
        setLoadingUser(null);
        setUserList(prevUserList => {
            const updatedUserList = prevUserList.map(u => {
                if (u.id === user.id) {
                    return { ...u, disabled: false };
                }
                return u;
            });
            return updatedUserList;
        });
    }

    if(isLoading){
        return <Loader/>
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>User list</h1>
                </div>

                <div className={styles.user_list_container}>
                    <div className={styles.userlist}>
                        <div className={styles.filter}>
                            <input type="text" placeholder="Search by username" value={searchTerm} onChange={handleSearch} />
                            <Link href='/u/users/noti' className={`${styles.buttondefault}`} >Notify users</Link>
                            
                        </div>
                        <div className={styles.grid_names}>
                            <h2>Id</h2>
                            <h2>Username</h2>
                            <h2>Email</h2>
                            <h2>Status</h2>
                        </div>
                        {userList.length === 0 ? (
                            <div className={styles.nothing_found}>No results</div>
                        ) : (
                            userList.map((user) => (
                                <div className={styles.user} key={user.id}>
                                    <h3>{user.id}</h3>
                                    <h3>@{user.username}</h3>
                                    <h3>{user.email}</h3>
                                    {loadingUser === user.id ? (
                                        <button disabled className={styles.loading_btn}>Loading...</button>
                                    ) : user.disabled ? (
                                        <button onClick={() => (enableUser(user))} type="button" className={styles.enable_btn}>Enable account</button>
                                    ) : (
                                        <button onClick={() => (disableUser(user))} type="button" className={styles.disabled_btn}>Disable account</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
};
