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
    const [enableServiceModeModal, setEnableServiceModeModal] = useState(false);

    useEffect(() => {
        async function getUserList() {
            const records = await pb.collection('users').getFullList({
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

    async function serviceMode(event) {
        event.preventDefault()
        //get the id of the service mode item
        const recordId = await pb.collection('server').getFirstListItem('option="service"');
        console.log(recordId)
        const data = {
            "option": "service",
            "value": true
        };
        //enable service mode
        await pb.collection('server').update(recordId.id, data);
        return window.location.reload();
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
                            <button className={`${styles.buttondefault}`} type="button" onClick={() => setEnableServiceModeModal(true)}>Enable service mode</button>
                            <Link href='/u/users/noti' className={`${styles.buttondefault}`} >Notify users</Link>
                            {enableServiceModeModal &&
                                (
                                    <>
                                        <div className={styles.usrname_container} onClick={() => { setDelAccField(false) }}>
                                            <div className={styles.usrname_bg}>
                                                <div className={styles.usrname_block} onClick={(event) => event.stopPropagation()}>
                                                    <button type='button' onClick={() => { setEnableServiceModeModal(false) }} className={styles.usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                                                    <form >
                                                        <h2>Enable service mode</h2>
                                                        <div className={styles.usrname_edit_form}>
                                                            <p>Please be advised that enabling the service mode will result in the temporary suspension of the website. If this is your intention, please proceed with caution!</p>
                                                        </div>
                                                        <button style={{ justifySelf: 'end' }} className={`${styles.buttondefault} ${styles.buttonred}`} type='submit' onClick={(event)=>serviceMode(event)}>Enable</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
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
