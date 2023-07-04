import Head from "next/head";
import styles from './Ad.module.css'
import { useEffect, useRef, useState } from "react";
import PocketBase from 'pocketbase'
import GraphComponent from "@/components/Graph";
import Nav from "@/components/Nav";
import { toast } from "react-toastify";
import { AlternateButton, ModalCheckBox, ModalContainer, ModalForm, ModalInput, ModalTitle } from "@/lib/Modal";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)
export default function Admin() {
    return (
        <>
            <Head>
                <title>Admin</title>
            </Head>
            <Nav />
            <div className={styles.container}>
                <Stats />
                <Users />
            </div>
        </>
    )
}

function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usersList, setUsersList] = useState([])
    const userContainerRef = useRef(null);
    const [SendNoti, setSendNoti] = useState(false)
    const [msg, msgBody] = useState('')
    const [msgtitle, msgTitle] = useState('')

    useEffect(() => {
        async function getUsers() {
            try {
                const records = await pb.collection('users_admin_list').getFullList({
                    sort: '-created', filter: `email ~ '${searchTerm}'`
                });
                setUsers(records);
            } catch (err) {
                console.error(err);
            }
        }
        getUsers();
    }, [searchTerm]);

    async function toggle(user, currentState) {
        const changeToast = toast.loading(`Updating user's account to ${currentState ? 'enabled' : 'disabled'}`);
        const data = {
            disabled: currentState ? false : true
        };

        // Update the array
        const updatedUsers = users.map((u) => {
            if (u.id === user) {
                return { ...u, ...data };
            }
            return u;
        });
        setUsers(updatedUsers);

        // Update the database
        await pb.collection('users').update(user, data);
        toast.done(changeToast);
    }

    function scrollToTop() {
        if (userContainerRef.current) {
            userContainerRef.current.scrollTop = 0;
        }
    }

    return (
        <>
            <div ref={userContainerRef} className={styles.users_container}>
                <input
                    id="top"
                    className={styles.filter}
                    type="text"
                    placeholder="Search userlist"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <AlternateButton click={() => setSendNoti(true)}>Send notifications</AlternateButton>
                {users.map((user) => (
                    <div key={user.id} className={styles.user}>
                        <span>{user.id}</span>
                        <span>{user.email}</span>
                        <span>
                            <ModalCheckBox checked={usersList.includes(user.id)} chngevent={() => addUser(user.id)} />
                        </span>
                        <span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={user.disabled}
                                    onChange={() => toggle(user.id, user.disabled)}
                                />
                                <span className={styles.slider} title={user.disabled ? ('Enable account') : ('Disable account')}></span>
                            </label>
                        </span>
                    </div>
                ))}
                <button className={styles.users_top} onClick={scrollToTop}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M13 19V7.83l4.88 4.88c.39.39 1.03.39 1.42 0 .39-.39.39-1.02 0-1.41l-6.59-6.59c-.39-.39-1.02-.39-1.41 0l-6.6 6.58c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L11 7.83V19c0 .55.45 1 1 1s1-.45 1-1z" />
                    </svg>
                </button>
            </div>
            {SendNoti && (
                <>
                    <ModalContainer events={() => setSendNoti(false)}>
                        <ModalForm>
<ModalTitle>Notification sender</ModalTitle>
                            <ModalInput chngevent={msgTitle} place={'Title'} />
                            <ModalInput chngevent={msgBody} place={'Body'} />

                            <AlternateButton click={postNoti}>Send notification to {usersList.length} user{usersList.length === 1 ? ('') : ('s')}</AlternateButton>
                            <AlternateButton click={handleSelectAll}>Select all users</AlternateButton>
                            <p>To send to indivduals click the checkbox next to their emails on the previous screen</p>
                        </ModalForm>
                    </ModalContainer>
                </>
            )}

        </>
    );


    function addUser(userId) {
        if (usersList.includes(userId)) {
            setUsersList(usersList.filter((id) => id !== userId));
        } else {
            setUsersList([...usersList, userId]);
        }
    }


    function handleSelectAll() {
        const usersListJSON = JSON.stringify(usersList);
        const usersJSON = JSON.stringify(users.map((user) => user.id));

        if (usersListJSON === usersJSON) {
            setUsersList([]);
        } else {
            const allUserIds = users.map((user) => user.id);
            setUsersList(allUserIds);
        }
    }

    async function postNoti() {
        if (!msg || !msgtitle) {
            return toast.warning("Please fill out all inputs!");
        }
        if (usersList.length === 0) {
            return toast.warning("Please select at least one user!");
        }

        const sendingToastID = toast.loading("Sending please wait...")

        try {
            const response = await fetch("/api/sendnotif", {
                method: "POST",

                body: JSON.stringify({
                    msg: { title: msgtitle, body: msg },
                    user: { token: pb.authStore.token, id: usersList },
                }),
            });
            if (response.status === 409) {
                toast.warning('There are no subscribed endpoints to send messages to, yet! (No users have notis on)')
            }
            if (response.status !== 200) {
                return toast.warning("Failed to send!");
            }
            msgBody('')
            msgTitle('')
            setUsersList([]);
            toast.update(sendingToastID, { render: "Sent", type: "success", isLoading: false });
        } catch (err) {
            console.log(err);
            toast.error("Failed to send!");
        }
        toast.done(sendingToastID)

    }

}


function Stats() {
    const [gpdata, setGpData] = useState([])
    const [gpdata2, setGpData2] = useState([])
    useEffect(() => {
        async function getStats() {
            try {
                const records = await pb.collection('Total_pages_per_user').getFullList();
                setGpData(records)
                const records2 = await pb.collection('total_files_per_user').getFullList();
                setGpData2(records2)
            } catch (err) {
                console.error(err)
            }
        }
        getStats()
    }, [])
    return (
        <div>
            <GraphComponent data1={gpdata} data2={gpdata2} />
        </div>
    )
}