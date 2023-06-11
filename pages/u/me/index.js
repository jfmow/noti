import styles from '@/styles/Acc.module.css';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import Compressor from 'compressorjs';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Head from 'next/head';
import Link from 'next/link';
import Nav from '@/components/Nav';
import compressImage from '@/lib/CompressImg';

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
    <>
      <Nav />
      <div className={styles.container}>
        <Head>
          <title>Settings: {pb.authStore.model?.username}</title>
          <link rel="favicon" href="/favicon.ico" />
          <meta name="robots" content="noindex"></meta>
        </Head>

        <div className={styles.user_account_form_container}>
          <AvatarForm />
          <AccManagementForm />
        </div>

        <div>
          <h5>Quick links</h5>
          <h6><Link href='/termsandconditions'>Terms & Conditions</Link> | <Link href='/privacypolicy'>Privacy policy</Link></h6>
        </div>

        <button className={styles.logoutBtn} onClick={clearAuthStore}>

          <div className={styles.logoutBtn_sign}><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div className={styles.logoutBtn_text}>Logout</div>
        </button>

      </div>
    </>
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
      const compressedBlob = await compressImage(selectedFile); // Maximum file size in KB (100KB in this example)
      const compressedFile = new File([compressedBlob], selectedFile.name, { type: 'image/jpeg' });
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
      <form className={styles.user_account_form_avatar_settings} id="form" onChange={handleFileInputChange}>
        <img loading='lazy' className={styles.user_account_form_avatar_settings_icon} src={pb.baseUrl + "/api/files/_pb_users_auth_/" + pb.authStore.model.id + "/" + pb.authStore.model.avatar || `https://github.com/identicons/${pb.authStore.model.username}.png`} />
        <div className={styles.uploader}>
          <button className={`${styles.buttondefault} ${styles.buttonred}`} onClick={rmAvatar} type="button" >
            Remove
          </button>
          <div className={`${styles.buttondefault}`}>
            <label class={styles.customfileupload}>
              <input type="file" name="file" id="fileInput" accept="image/*" className={styles.user_account_form_avatar_settings_fileinput_inputbtn_hide} />
              <p id="fileInputName">Select New</p>
            </label>
          </div>
          <h5>Changes take effect immediately</h5>
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
  const [notiField, setNotiField] = useState(false)


  async function deleteAccount(e) {
    e.preventDefault();
    //  await pb.send("/hello", {
    //    // for all possible options check
    //    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
    //    query: { "abc": 123 },
    //});

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

  return (
    <>
      <form className={styles.user_account_form_profile_settings}>
        <div className={styles.user_setting_buttons_grid}>
          <button type='button' className={styles.acc_button} onClick={() => setUserInfoDisplay(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M21 8V7l-3 2-3-2v1l2.72 1.82c.17.11.39.11.55 0L21 8zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm7.5-6h-7c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5z" /></svg>
            <p className={styles.acc_button_text}>Info</p>
          </button>
          <button className={styles.acc_button} type="button" onClick={() => setUsernameField(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /></g><g><path d="M20,24H4c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h16c1.1,0,2,0.9,2,2v0C22,23.1,21.1,24,20,24z M13.06,5.19l3.75,3.75l-8.77,8.77C7.86,17.9,7.6,18,7.34,18H5c-0.55,0-1-0.45-1-1v-2.34c0-0.27,0.11-0.52,0.29-0.71L13.06,5.19z M17.88,7.87l-3.75-3.75l1.83-1.83c0.39-0.39,1.02-0.39,1.41,0l2.34,2.34c0.39,0.39,0.39,1.02,0,1.41L17.88,7.87z" enable-background="new" /></g></svg>            <p className={styles.acc_button_text}>Edit username</p>
          </button>
          <button className={`${styles.acc_button} ${styles.acc_button_red}`} type="button" onClick={() => setDelAccField(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg>            <p className={styles.acc_button_text}>Delete Account</p>
          </button>
          {pb.authStore.model.admin && (
            <button type='button' className={styles.acc_button} onClick={() => window.location.replace('/u/users')}>
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><g><path d="M17,11c0.34,0,0.67,0.04,1,0.09V7.58c0-0.8-0.47-1.52-1.2-1.83l-5.5-2.4c-0.51-0.22-1.09-0.22-1.6,0l-5.5,2.4 C3.47,6.07,3,6.79,3,7.58v3.6c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55C11.41,19.47,11,18.28,11,17 C11,13.69,13.69,11,17,11z" /><path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38c0.62,0,1.12,0.51,1.12,1.12 s-0.51,1.12-1.12,1.12s-1.12-0.51-1.12-1.12S16.38,14.38,17,14.38z M17,19.75c-0.93,0-1.74-0.46-2.24-1.17 c0.05-0.72,1.51-1.08,2.24-1.08s2.19,0.36,2.24,1.08C18.74,19.29,17.93,19.75,17,19.75z" /></g></g></svg>
              <p className={styles.acc_button_text}>Admin</p>
            </button>
          )}
          <button className={styles.acc_button} type="button" onClick={() => setNotiField(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg>
            <p className={styles.acc_button_text}>Notifications</p>
          </button>
        </div>

        {userNameField ?
          (
            <>
              <div className={styles.default_settings_modal_container} onClick={() => { setUsernameField(false) }}>
                <div className={styles.default_settings_modal_container_usrname_bg}>
                  <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={() => { setUsernameField(false) }} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    <form onChange={checkLength}>
                      <h2>Edit username:</h2>
                      <div className={styles.default_settings_modal_container_usrname_edit_form}>
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
              <div className={styles.default_settings_modal_container} onClick={() => { setDelAccField(false) }}>
                <div className={styles.default_settings_modal_container_usrname_bg}>
                  <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                    <button type='button' onClick={() => { setDelAccField(false) }} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
                    <form >
                      <h2>DELETE ACCOUNT</h2>
                      <div className={styles.default_settings_modal_container_usrname_edit_form}>
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
        {notiField ?
          (
            <>
              <div className={styles.default_settings_modal_container} onClick={() => { setNotiField(false) }}>
                <div className={styles.default_settings_modal_container_usrname_bg}>
                  <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
                    <form>
                  <h2>Toggle notifications</h2>
                      
                    <Notitoggle />
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
      <div className={styles.default_settings_modal_container} onClick={setClosed}>
        <div className={styles.default_settings_modal_container_userinfopannel}>
          <div className={styles.default_settings_modal_container_usrname_block} onClick={(event) => event.stopPropagation()}>
            <button type='button' onClick={setClosed} className={styles.default_settings_modal_container_usrclose_btn}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" /></svg></button>
            <form>
              <h4>Username: {pb.authStore.model.username}</h4>
              <h4>Verified: {pb.authStore.model.verified ? ('true') : ('false')}</h4>
              <p>Email visibility: {pb.authStore.model.emailVisibility ? ('visible') : ('hidden')}</p>
              <p>Email: {pb.authStore.model.email}</p>
              <p>Joined: {new Date(pb.authStore.model.created).toLocaleString()}</p>
              <h6>Unique user id: {pb.authStore.model.id}</h6>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}


function Notitoggle() {
  const [push, setPush] = useState(false);
  const [pendingPush, setPendingPush] = useState(false);
  useEffect(() => {
    async function getPu() {
      const registration = await navigator.serviceWorker.getRegistration();

      const subscription = await registration.pushManager.getSubscription();
      setPush(subscription?.endpoint ? true : false)
    }
    getPu()
  }, [])



  //push notifications:
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  async function subscribeToPush() {
    setPendingPush(true)
    setPush(true)
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
      setPendingPush(false)

    } catch (err) {
      console.log(err)
      return toast.error('Permision denied. Enable notifs')
    }

  }

  async function unsubscribeFromPush() {
    setPendingPush(true)
    setPush(false)
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
    setPendingPush(false)
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


  return (
    <>
      <label className={styles.switch}>
        <input type="checkbox" checked={push} disabled={pendingPush} onChange={push ? unsubscribeFromPush : subscribeToPush} />
        <div className={styles.slider} style={{ backgroundColor: pendingPush && '#424242' }}></div>
        <div className={styles.slidercard}>
          <div className={`${styles.slidercardface} ${styles.slidercardfront}`}><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm7.29-4.71L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM14.5 9.33c0 .31-.11.6-.3.84l-2.5 3.03h1.9c.5 0 .9.4.9.9s-.4.9-.9.9h-2.78c-.73 0-1.32-.59-1.32-1.32v-.01c0-.31.11-.6.3-.84l2.5-3.03h-1.9c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h2.78c.73 0 1.32.59 1.32 1.33z" /></svg></div>
          <div className={`${styles.slidercardface} ${styles.slidercardback}`}><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.68-1.5-1.51-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.3 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16zm-6.01 6c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zM6.77 4.73c.42-.38.43-1.03.03-1.43-.38-.38-1-.39-1.39-.02C3.7 4.84 2.52 6.96 2.14 9.34c-.09.61.38 1.16 1 1.16.48 0 .9-.35.98-.83.3-1.94 1.26-3.67 2.65-4.94zM18.6 3.28c-.4-.37-1.02-.36-1.4.02-.4.4-.38 1.04.03 1.42 1.38 1.27 2.35 3 2.65 4.94.07.48.49.83.98.83.61 0 1.09-.55.99-1.16-.38-2.37-1.55-4.48-3.25-6.05z" /></svg></div>
        </div>
      </label>
    </>
  )
}




