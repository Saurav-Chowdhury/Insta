import { renderMatches, useLocation, useNavigate } from "react-router-dom";
import styles from "./Post.module.css";
import Nav from "../Nav/Nav";
import heart from "./heart.png";
import heartFilled from "./heart-filled.png";
import chat from "./chat-bubble.png";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { render } from "react-dom";
import Comment from "../Comment/Comment";

function Post({ data }) {
  const [data1, setData] = useState(data);
  const [liked, setliked] = useState(data.likedby);
  const [comt, setComt] = useState("none");

  const location = useLocation();
  //
  const navigate = useNavigate();
  const username = JSON.parse(
    atob(localStorage.getItem("uid").split(".")[1])
  ).username;

  const handleLikes = async (postid) => {
    await fetch(`http://localhost:8000/post/${postid}/setlikes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("uid")}`,
      },
    })
      .then(async (d) => {
        return await d.json();
      })
      .then((res) => {
        if (res.status == "success") {
          setliked(res.likedby);
        }
      });
  };

  return (
    <>
      {data1 ? (
        <div className={styles.container}>
          <div className={styles.post}>
            <div className={styles.postContent}>
              <div className={styles.header}>
                <img src={`http://localhost:8000/${data1.profilePic}`} alt="" />
                <h4
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/router", {
                      state: { username: data1.username, path: "profile" },
                    });
                  }}
                >
                  {data1.username}
                </h4>
              </div>
              <div className={styles.caption}>
                <p>{data1.caption}</p>
              </div>
              <div
                onDoubleClick={() => handleLikes(data1._id)}
                className={styles.image}
              >
                <img src={`http://localhost:8000/${data1.postUrl}`} alt="" />
              </div>
              <div className={styles.icons}>
                <img
                  onClick={() => handleLikes(data1._id)}
                  src={liked.includes(username) ? heartFilled : heart}
                  alt=""
                />
                {!data1.offComments ? <img src={chat} alt="" /> : ""}
              </div>
              <div className={styles.statInfo}>
                {!data1.offLikes ? (
                  liked.length == 0 ? (
                    <p>
                      <b>{`${liked.length} likes`}</b>
                    </p>
                  ) : liked.length == 1 ? (
                    <p>
                      <b>{`liked by ${liked[0]}`}</b>
                    </p>
                  ) : liked.length > 1 ? (
                    <p>
                      <b>{`liked by ${liked[0]} and ${
                        liked.length - 1
                      } others`}</b>
                    </p>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}

                {!data1.offComments ? (
                  <span onClick={() => setComt("block")}>view comments</span>
                ) : (
                  <span>Comments are turned off for this post</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
      {!data1.offComments ? (
        <div style={{ display: comt }} className={styles.cmt}>
          <Comment prop={{ prop: data1, setComt }} />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Post;
