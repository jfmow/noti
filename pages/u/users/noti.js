import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import styles from "./Admin.module.css";

import PocketBase from "pocketbase";
import Nav from "@/components/Nav";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function Home() {
  const [msg, setMessage] = useState("");
  const [msg_body, setMessageBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function getUserList() {
      const records = await pb.collection("users").getFullList({
        sort: "-created",
      });
      setUserList(records);
    }

    async function authUpdate() {
      try {
        const authData = await pb.collection("users").authRefresh();
        if (!pb.authStore.isValid) {
          pb.authStore.clear();
          return window.location.replace("/auth/login");
        }
        if (!authData.record?.admin) {
          return window.location.replace("/");
        } else {
          getUserList();
          setIsLoading(false);
        }
      } catch (error) {
        pb.authStore.clear();
        return window.location.replace("/auth/login");
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
    if (!msg || !msg_body) {
      return toast.warning("Please fill out all inputs!");
    }
    if (users.length === 0) {
      return toast.warning("Please select at least one user!");
    }

    try {
      const sendingToastID = toast.loading("Sending please wait...")
      const response = await fetch("/api/sendnotif", {
        method: "POST",

        body: JSON.stringify({
          msg: { title: msg, body: msg_body },
          user: { token: pb.authStore.token, id: users },
        }),
      });
      if (response.status === 409) {
        toast.warning('There are no subscribed endpoints to send messages to, yet! (No users have notis on)')
      }
      if (response.status !== 200) {
        return toast.warning("Failed to send!");
      }
      setMessage("");
      setMessageBody("");
      setUsers([]);
      toast.update(sendingToastID, { render: "Sent", type: "success", isLoading: false });
      setTimeout(() => {
        toast.dismiss(sendingToastID)
      }, 1000);
    } catch (err) {
      console.log(err);
      toast.error("Failed to send!");
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>

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
                  <h3 style={{ color: 'red' }}>Select All</h3>
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
              <div className={styles.Notification_buttons_div}>

                <button
                  onClick={postNoti} className={`${styles.noselect} `}>
                  <span className={styles.stext}>Send</span>
                  <span className={styles.sicon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}