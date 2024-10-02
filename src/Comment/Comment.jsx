import { useEffect, useState } from "react";
import styles from "./Comment.module.css";
import Loader from "../Loader/Loader";
import close from "./close.png";
import socketio from "socket.io-client";

function Comment({ prop }) {
  const io = socketio("http://localhost:8000/");

  const handleClose = () => {
    prop.setComt("none");
  };

  const [reply, setReply] = useState("view replies");
  const [comm, getComm] = useState();
  const [loader, setLoader] = useState(true);
  const [comment, newcomment] = useState("");

  const getCall = async () => {
    await fetch(`http://localhost:8000/comment/${prop.prop._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("uid")}`,
      },
    })
      .then(async (data) => {
        return await data.json();
      })
      .then((res) => {
        getComm(res.data);
        setLoader(false);
      });
  };

  io.on("load", (d) => {
    console.log(d);
    getCall();
  });

  const handleadd = async () => {
    await fetch(`http://localhost:8000/comment/${prop.prop._id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("uid")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
      }),
    });
  };

  const handleViewReplies = (id) => {
    const dis = document.getElementsByClassName(id);
    for (let i = 0; i < dis.length; i++) {
      if (reply == "view replies") {
        dis[i].style.display = "flex";
      } else {
        dis[i].style.display = "none";
      }
    }
    if (reply == "view replies") {
      setReply("hide replies");
    } else {
      setReply("view replies");
    }
  };

  useEffect(() => {
    getCall();
  }, []);

  return (
    <>
      {!loader ? (
        <div className={styles.content}>
          <img onClick={handleClose} src={close} alt="" />
          {!loader ? (
            <div className={styles.child}>
              <img src={`http://localhost:8000/${prop.prop.postUrl}`} alt="" />
              <div className={styles.comments}>
                <div className={styles.commentarea}>
                  <div id={styles.caption} className={styles.user}>
                    <img
                      src={`http://localhost:8000/${prop.prop.profilePic}`}
                      alt=""
                    />
                    <span>
                      <b>{prop.prop.username}</b>
                      <span>{prop.prop.caption}</span>
                    </span>
                  </div>
                  {comm.map((d) => {
                    return (
                      <div key={d._id} className={styles.cmt}>
                        <div className={styles.user}>
                          <img
                            src={`http://localhost:8000/${d.profilePic}`}
                            alt=""
                          />
                          <span>
                            <b>{d.user}</b>
                            <span>{d.comment}</span>
                          </span>
                        </div>
                        <div className={styles.seprator}>
                          <div className={styles.line}></div>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewReplies(d._id)}
                          >{`view replies (${d.subcomments.length})`}</div>
                        </div>
                        {d.subcomments.map((d2) => {
                          return (
                            <div
                              key={d2._id}
                              className={`${styles.subcmt} ${d._id}`}
                            >
                              <img
                                src={`http://localhost:8000/${d2.profilePic}`}
                                alt=""
                              />
                              <span>
                                <b>{d2.user}</b>

                                <span>{d2.comment}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.text}>
                  <input
                    onDoubleClick={() => handleadd()}
                    type="text"
                    value={comment}
                    onChange={(e) => newcomment(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Comment;
