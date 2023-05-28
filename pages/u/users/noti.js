import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import styles from './Admin.module.css';

import PocketBase from 'pocketbase';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false);
export default function Home() {
  const [msg, setMessage] = useState('')
  const [msg_body, setMessageBody] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


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


  async function notifyAll() {
    const response = await fetch('/api/notify-all', {
      method: 'POST',

      body: JSON.stringify({ msg: { title: msg, body: msg_body }, user: { token: pb.authStore.token, id: pb.authStore.model.id } })
    });
    if (response.status === 409) {
      document.getElementById('notification-status-message').textContent =
        'There are no subscribed endpoints to send messages to, yet.';
    }
    if (response.status != 200) {
      toast.warning('Failed to send!')
    }
  }


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
    if (!msg || !msg_body) {
      return toast.warning('Please fill out all inputs!');
    }
    if (users.length === 0) {
      return toast.warning('Please select at least one user!');
    }

    try {
      const response = await fetch('/api/sendnotif', {
        method: 'POST',

        body: JSON.stringify({ msg: { title: msg, body: msg_body }, user: { token: pb.authStore.token, id: users } })
      });
      if (response.status === 409) {
        document.getElementById('notification-status-message').textContent =
          'There are no subscribed endpoints to send messages to, yet.';
      }
      if (response.status !== 200) {
        return toast.warning('Failed to send!')
      }
      setMessage('');
      setMessageBody('');
      setUsers([])
      toast.success('Posted!');
    } catch (err) {
      console.log(err)
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
                value={msg}
                type="text"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Title"
              />
              <input
                className={styles.notinput}
                value={msg_body}
                type="text"
                onChange={(event) => setMessageBody(event.target.value)}
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
              <button onClick={notifyAll} type="button" className={`${styles.buttondefault} ${styles.buttonred}`}>
                Send to all users
              </button>
              <button type="button" onClick={postNoti} className={styles.buttondefault}>
                Send to select users
              </button>
              <button
                id="subscribe"
                onClick={subscribeToPush}
              >
                Subscribe to push
              </button>
              <button
                id="unsubscribe"
                onClick={unsubscribeFromPush}
              >
                Unsubscribe from push
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}




const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

/* Push notification logic. */

async function registerServiceWorker() {
  console.log('hg')
  await navigator.serviceWorker.register('service-worker.js');
  toast.success('Sw enabled')
}

async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.getRegistration();
  await registration.unregister();
  toast.success('Sw removed')
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  try {
    Notification.requestPermission()
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    console.log(subscription)
    postToServer('/api/add-subscription', subscription);
    toast.info('Subscribed to notis')
  } catch (err) {
    console.log(err)
    return toast.error('Permision denied. Enable notifs')
  }

}

async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  postToServer('/api/remove-subscription', {
    endpoint: subscription.endpoint
  });
  await subscription.unsubscribe();
  toast.info('Unsubbed from notis')
}

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

async function postToServer(url, data) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data, user: { token: pb.authStore.token, id: pb.authStore.model.id } })
  });
}

