import styles from '@/styles/Acc.module.css';
import { useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Head from 'next/head';
import Link from 'next/link';
import Nav from '@/components/Nav';
import compressImage from '@/lib/CompressImg';
import { AlternateButton, ModalButton, ModalCheckBox, ModalContainer, ModalForm, ModalInput, ModalTitle } from '@/lib/Modal';

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
          <AccManagementForm />

          <div style={{ position: 'absolute', bottom: '3dvh', left: '0', right: '0' }}>
            <h5>Quick links</h5>
            <h6><Link href='/auth/terms-and-conditions'>Terms & Conditions</Link> | <Link href='/auth/privacy-policy'>Privacy policy</Link></h6>
          </div>
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
  const [newUsername, setNewUsernameData] = useState("");
  const [delAccField, setDelAccField] = useState(false);
  const [userInfoOpen, setUserInfoDisplay] = useState(false);
  const [notiField, setNotiField] = useState(false);
  const [updateEmailField, setUpdateEmailField] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);


  async function deleteAccount(e) {
    e.preventDefault();
    if (!confirmDel) {
      return
    }

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
      return toast.warning('Must be longer than 3 char');

    }
    const data = {
      "username": newUsername
    };
    setUsernameField(false);
    await pb.collection('users').update(pb.authStore.model.id, data);
    toast.success(`Username updated to ${newUsername} 👍`)
    return authUpdate();

  }

  async function ChangeEmail() {
    setUpdateEmailField(false);
    const updateEmailToastid = toast.loading("Please wait...")
    try {
      await pb.collection('users').requestEmailChange(newEmail);
      const response = await fetch("/api/user/emailchange", {
        method: "POST",
        body: JSON.stringify({
          user: { token: pb.authStore.token },
        }),
      });
      toast.update(updateEmailToastid, { render: `Please check the inbox of ${newEmail} to confirm the change.`, type: "success", isLoading: false });
      setTimeout(() => {
        toast.dismiss(updateEmailToastid)
      }, 2300);
    } catch (error) {
      console.log(error)
      toast.update(updateEmailToastid, { render: `Failed to request email change!`, type: "error", isLoading: false });
      setTimeout(() => {
        toast.dismiss(updateEmailToastid)
      }, 2300);
      return
    }


  }

  function setCheckDel(value) {
    setConfirmDel(value);
  }

  return (
    <>
      <form className={styles.user_account_form_profile_settings}>
        <div className={styles.user_setting_buttons_grid}>
          <AlternateButton click={() => setUserInfoDisplay(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M21 8V7l-3 2-3-2v1l2.72 1.82c.17.11.39.11.55 0L21 8zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm7.5-6h-7c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5z" /></svg>
            <p>Profile</p>
          </AlternateButton>
          <AlternateButton click={() => setDelAccField(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg>            <p>Delete Account</p>
          </AlternateButton>
          {pb.authStore.model.admin && (
            <AlternateButton click={() => window.location.replace('/u/users')}>
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" ><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><g><path d="M17,11c0.34,0,0.67,0.04,1,0.09V7.58c0-0.8-0.47-1.52-1.2-1.83l-5.5-2.4c-0.51-0.22-1.09-0.22-1.6,0l-5.5,2.4 C3.47,6.07,3,6.79,3,7.58v3.6c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55C11.41,19.47,11,18.28,11,17 C11,13.69,13.69,11,17,11z" /><path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38c0.62,0,1.12,0.51,1.12,1.12 s-0.51,1.12-1.12,1.12s-1.12-0.51-1.12-1.12S16.38,14.38,17,14.38z M17,19.75c-0.93,0-1.74-0.46-2.24-1.17 c0.05-0.72,1.51-1.08,2.24-1.08s2.19,0.36,2.24,1.08C18.74,19.29,17.93,19.75,17,19.75z" /></g></g></svg>
              <p>Admin</p>
            </AlternateButton>
          )}
          <AlternateButton click={() => setNotiField(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z" /></svg>            <p>Notifications</p>
          </AlternateButton>
          <AlternateButton isLink click='/u/me/pages'>
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M5,11h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5v4C3,10.1,3.9,11,5,11z" /><path d="M5,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2H5c-1.1,0-2,0.9-2,2v4C3,20.1,3.9,21,5,21z" /><path d="M13,5v4c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-4C13.9,3,13,3.9,13,5z" /><path d="M15,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v4C13,20.1,13.9,21,15,21z" /></g></g></svg>
            <p>Manage pages</p>
          </AlternateButton>
        </div>

        {userNameField && (
          <>
            <ModalContainer events={() => { setUsernameField(false) }}>
              <ModalForm>
                <ModalTitle>Update username</ModalTitle>
                <ModalInput chngevent={setNewUsernameData} place={`${pb.authStore.model.username}`} type={"text"} />
                <ModalButton events={changeUsername}>Change</ModalButton>
              </ModalForm>
            </ModalContainer>

          </>
        )}
        {updateEmailField && (
          <>
            <ModalContainer events={() => setUpdateEmailField(false)}>
              <ModalForm>
                <ModalTitle>Update email</ModalTitle>
                <ModalInput chngevent={setNewEmail} place={`${pb.authStore.model.email}`} type={"email"} />
                <ModalButton events={ChangeEmail}>Change</ModalButton>
              </ModalForm>
            </ModalContainer>

          </>
        )}

        {notiField && (
          <>
            <ModalContainer events={() => { setNotiField(false) }}>
              <ModalForm>
                <ModalTitle>Notification options</ModalTitle>
                <div className={styles.default_settings_modal_container_usrname_toggles}>Global <Notitoggle /></div>
                <div className={styles.default_settings_modal_container_usrname_toggles}>Hourly quotes (requires global to be enabled) <Quotetoggle /></div>
              </ModalForm>
            </ModalContainer>
          </>
        )}
        {userInfoOpen && !userNameField && !updateEmailField && (
          <ModalContainer events={() => setUserInfoDisplay(false)}>
            <ModalForm>
              <ModalTitle>Account details</ModalTitle>
              <h4>Username: {pb.authStore.model.username}</h4>
              <h4>Email: {pb.authStore.model.email}</h4>
              <p>Joined: {new Date(pb.authStore.model.created).toLocaleString()}</p>
              <p>UUID: {pb.authStore.model.id}</p>
              <AlternateButton click={() => setUsernameField(true)}>
                Change username
              </AlternateButton>
              <AlternateButton click={() => setUpdateEmailField(true)}>
                Update email
              </AlternateButton>
            </ModalForm>
          </ModalContainer>
        )}
        {delAccField && (
          <ModalContainer events={() => setDelAccField(false)}>
            <ModalForm>
              <ModalTitle>Delete account</ModalTitle>
              <p>By deleting your account, you acknowledge that all of your data linked to this account will be deleted and can NOT be restored. This will have an immediate effect!</p>
              <ModalCheckBox chngevent={setCheckDel}>Confirm:</ModalCheckBox>
              <ModalButton classnm={`${styles.buttonred}`} events={deleteAccount}>Delete</ModalButton>
            </ModalForm>
          </ModalContainer>
        )}
      </form>

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
      toast.info('Subscribed to notis')
      setPendingPush(false)

    } catch (err) {
      console.log(err)
      setPush(false)
      setPendingPush(false)
      return toast.error('Permision denied!')
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
        <input type="checkbox" checked={push} disabled={pendingPush} onChange={push ? unsubscribeFromPush : subscribeToPush}/>
          <span className={styles.slider}></span>
      </label>
    </>
  )
}

function Quotetoggle() {
  const [pendingPush, setPendingPush] = useState(false)
  async function toggle() {
    setPendingPush(true)
    const data = {
      "quotes": pb.authStore.model.quotes ? false : true
    };
    await pb.collection('users').update(pb.authStore.model.id, data);
    setPendingPush(false)
  }
  return (
    <>
    <label className={styles.switch}>
        <input type="checkbox" checked={pb.authStore.model.quotes} disabled={pendingPush} onChange={toggle}/>
          <span className={styles.slider}></span>
      </label>
    </>
  )
}

