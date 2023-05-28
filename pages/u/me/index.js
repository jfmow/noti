import styles from '@/styles/Acc.module.css';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import Compressor from 'compressorjs';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Head from 'next/head';
import Link from 'next/link';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Account() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function authUpdate() {
      try {
        const authData = await pb.collection('users').authRefresh();
        if (pb.authStore.isValid == false) {
          pb.authStore.clear();
          return window.location.replace("/auth/login");
        }
        if (authData.record.disabled) {
          pb.authStore.clear()
          return window.location.replace('/u/disabled')
        }
        setIsLoading(false)
      } catch (error) {
        pb.authStore.clear();
        return window.location.replace('/auth/login');
      }
    }
    authUpdate()
  }, []);


  function clearAuthStore() {
    pb.authStore.clear();
    window.location.replace('/');
  }
  if (isLoading) {
    return (<Loader />)
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Settings: {pb.authStore.model?.username}</title>
        <link rel="favicon" href="/favicon.ico" />
        <meta name="robots" content="noindex"></meta>
      </Head>
      <main className={styles.main}>
        <h1>My Account</h1>
      </main>
      <div className={styles.forms}>
        <AvatarForm />
        <AccManagementForm />
      </div>
      <button className={styles.logoutbtn} onClick={clearAuthStore}>Logout</button>

    </div>
  )
}


function AvatarForm() {

  async function rmAvatar(e) {

    e.preventDefault();

    try {
      const response = await toast.promise(
        pb.collection('users').update(pb.authStore.model.id, { avatar: null }),
        {
          pending: 'Updaing...',
          success: 'Avatar removed successfuly. 👌',
          error: 'Update failed 🤯'
        }
      );

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFileInputChange(event) {
    const selectedFile = event.target.files[0];
    document.getElementById('fileInputName').textContent = 'Uploading...';
    if (selectedFile) {
      const formData = new FormData();
      const compressedFile = await toast.promise(
        new Promise((resolve, reject) => {
          new Compressor(selectedFile, {
            quality: 1,
            // Set the quality of the output image to a high value
            maxWidth: 2000, // Limit the maximum width of the output image to 1920 pixels
            maxHeight: 2000, // Limit the maximum height of the output image to 1920 pixels
            mimeType: "image/jpeg",
            maxSize: 3 * 1024 * 1024,

            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        }),
        {
          pending: "Compressing img... 📸",
          error: "failed 🤯",
        }
      );
      formData.append('avatar', compressedFile);

      try {
        const response = await toast.promise(
          pb.collection('users').update(pb.authStore.model.id, formData),
          {
            pending: 'Uploading...',
            success: 'Avatar updated successfuly. 👌',
            error: 'Upload failed 🤯'
          }
        );
        document.getElementById('fileInputName').textContent = 'Uploaded!';
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <form className={styles.aform} id="form" onChange={handleFileInputChange}>
        <h2>Avatar</h2>
        <img loading='lazy' className={styles.usericon} src={pb.baseUrl + "/api/files/_pb_users_auth_/" + pb.authStore.model.id + "/" + pb.authStore.model.avatar || `https://github.com/identicons/${pb.authStore.model.username}.png`} />
        <div className={styles.uploader}>
          <button className={`${styles.buttondefault} ${styles.buttonred}`} onClick={rmAvatar} type="button" >
            Remove
          </button>
          <div className={`${styles.buttondefault}`}>
            <label class={styles.customfileupload}>
              <input type="file" name="file" id="fileInput" accept="image/*" className={styles.finput} />
              <p id="fileInputName">Select New</p>
            </label>
          </div>
          <h5>Change take effect immediately</h5>
        </div>
      </form>
    </>
  )
}


function AccManagementForm() {

  const [userNameField, setUsernameField] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [delAccField, setDelAccField] = useState(false);
  const [userInfoOpen, setUserInfoDisplay] = useState(false);


  async function deleteAccount(e) {
    e.preventDefault();

    try {
      const response = await toast.promise(
        pb.collection('users').delete(pb.authStore.model.id),
        {
          pending: 'Deleting account...',
          success: 'Account deleted successfuly. 👌',
          error: 'Failed to delete account 🤯'
        }
      );

      pb.authStore.clear();
      location.replace('/');
    } catch (error) {
      console.log(error);
    }

    return response.json();
  }
  async function authUpdate() {
    try {
      const authData = await pb.collection('users').authRefresh();
      if (pb.authStore.isValid == false) {
        pb.authStore.clear();
        return window.location.replace("/auth/login");
      }
      setIsLoading(false)
    } catch (error) {
      pb.authStore.clear();
      return window.location.replace('/auth/login');
    }
  }
  async function changeUsername(e) {
    e.preventDefault()

    if (newUsername.length <= 2) {
      toast.warning('Must be longer than 3 char', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return
    }
    const sanitizedName = newUsername
    const res = await fetch('/api/filterusername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sanitizedName })
    });
    if (res.status === 429) {
      return toast.error(`Rate limited!`)
    }
    const filteredUsername = await res.json();
    if (filteredUsername.error) {
      return toast.error(`${filteredUsername.error}`)
    }
    const data = {
      "username": newUsername,
    };

    const record = await pb.collection('users').update(pb.authStore.model.id, data);
    authUpdate();
    setUsernameField(false);
    toast.success('Username updated 👍', { position: toast.POSITION.TOP_RIGHT })
    return
  }
  function checkLength() {
    if (newUsername.length <= 2) {
      document.getElementById('usrnameinput').style.outline = '#ff3737 2px solid';
    } else {
      document.getElementById('usrnameinput').style.outline = '#59d4af 2px solid';
    }
  }
  async function sendEmailVerf() {
    try {
      const email = await pb.collection('users').requestVerification(pb.authStore.model.email)
      return toast.success('Sent! Please check your inbox for an email.')
    } catch (error) {
      return toast.error('Failed to send email. Please try again soon!')
    }
  }

  async function downloadUserData() {
    // Get the data from the API
    const [privateData, userData] = await Promise.all([
      pb.collection("private_data").getFullList({
        sort: "-created", filter: `user = '${pb.authStore.model.id}'`
      }),
      pb.collection("users").getOne(pb.authStore.model.id),
    ]);

    // Merge the privateData and userData into a single object
    const data = {
      privateData,
      userData,
    };
    // Create a blob with the data
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element and click it to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();

    // Release the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <form className={styles.pform}>
        <h2>Account management</h2>
        <div className={styles.accmanagemt_btns}>
          <button type='button' className={styles.buttondefault} onClick={() => setUserInfoDisplay(true)}>
            Account Info
          </button>
          <button className={`${styles.buttondefault} ${styles.buttongreen}`} type="button" onClick={() => setUsernameField(true)}>
            Edit username
          </button>

          <button className={`${styles.buttondefault} ${styles.buttonred}`} onClick={() => setDelAccField(true)} type="button">
            Delete account
          </button>
          <button className={`${styles.buttondefault}`} onClick={downloadUserData} type="button">
            Download my data
          </button>
          {pb.authStore.model.notis ? (
            <button className={`${styles.buttondefault} ${styles.buttonred}`} onClick={unsubscribeFromPush} type="button">
              Disable push notifications
            </button>
          ) : (
            <button className={`${styles.buttondefault} ${styles.buttongreen}`} onClick={subscribeToPush} type="button">
              Enable push notifications
            </button>
          )}

          {pb.authStore.model.verified ? ('') : (
            <button className={`${styles.buttondefault}`} onClick={sendEmailVerf} type="button">
              Request verification
            </button>
          )}
          {pb.authStore.model.admin && (
            <button className={`${styles.buttondefault}`} onClick={() => window.location.replace('/u/users')} type="button">
              Management
            </button>
          )}
        </div>
        <div>
          <h5>Quick links</h5>
          <h6><Link href='/termsandconditions'>Terms & Conditions</Link> | <Link href='/privacypolicy'>Privacy policy</Link></h6>
        </div>

        {userNameField ?
          (
            <>
              <div className={styles.usrname_container} onClick={() => { setUsernameField(false) }}>
                <div className={styles.usrname_bg}>
                  <div className={styles.usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={() => { setUsernameField(false) }} className={styles.usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    <form onChange={checkLength}>
                      <h2>Edit username:</h2>
                      <div className={styles.usrname_edit_form}>
                        <input autoCorrect='false' autoCapitalize='false' id='usrnameinput' onChange={event => setNewUsername(event.target.value)} type='text' placeholder={`@${pb.authStore.model.username}`} />
                      </div>
                      <button style={{ justifySelf: 'end' }} className={`${styles.buttondefault}`} type='submit' onClick={changeUsername}>Update</button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) :
          ('')}
        {delAccField ?
          (
            <>
              <div className={styles.usrname_container} onClick={() => { setDelAccField(false) }}>
                <div className={styles.usrname_bg}>
                  <div className={styles.usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={() => { setDelAccField(false) }} className={styles.usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    <form >
                      <h2>DELETE ACCOUNT</h2>
                      <div className={styles.usrname_edit_form}>
                        <p>By deleting your account, you acknowledge that all of your data linked to this account will be deleted and can NOT be restored. This will have an immediate effect!</p>
                      </div>
                      <button style={{ justifySelf: 'end' }} className={`${styles.buttondefault} ${styles.buttonred}`} type='submit' onClick={deleteAccount}>Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) :
          ('')}
        {userInfoOpen ? (<UserInfoList onClose={() => setUserInfoDisplay(false)} />) : ('')}
      </form>
    </>
  )
}

function UserInfoList({ onClose }) {
  function setClosed() {
    onClose()
  }
  return (
    <>
      <div className={styles.userinfopannel_container} onClick={setClosed}>
        <div className={styles.userinfopannel}>
          <div className={styles.usrname_block} onClick={(event) => event.stopPropagation()}>
            <button type='button' onClick={setClosed} className={styles.usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
            <form>
              <h4>Username: {pb.authStore.model.username}</h4>
              <h4>Verified: {pb.authStore.model.verified ? ('true') : ('false')}</h4>
              <p>Email visibility: {pb.authStore.model.emailVisibility ? ('visible') : ('hidden')}</p>
              <p>Email: {pb.authStore.model.email}</p>
              <p>Joined: {new Date(pb.authStore.model.created).toLocaleString()}</p>
              <h6>Unique user id: {pb.authStore.model.id}</h6>
              <h6>(DO NOT SHARE)</h6>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}






//push notifications:
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  try {
    Notification.requestPermission()
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    postToServer('/api/add-subscription', subscription);
    const data = {
      "notis": true
    };

    await pb.collection('users').update(pb.authStore.model.id, data);
    toast.info('Subscribed to notis')
    setTimeout(() => {
      window.location.reload()
    }, 1500);

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
  const data = {
    "notis": false
  };

  await pb.collection('users').update(pb.authStore.model.id, data);
  toast.info('Unsubbed from notis')
  setTimeout(() => {
    window.location.reload()
  }, 1500);
}

async function postToServer(url, data) {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data, user: { token: pb.authStore.token, id: pb.authStore.model.id } })
  });
}

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