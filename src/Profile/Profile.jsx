import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';
import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import heart from '../Post/heart.png'

function Profile() {
    const {username}=useParams();
    const [loader,setLoader]=useState(true);
    const [resData,setData]=useState();
    const navigate=useNavigate();
    document.title=username+' Profile . Instagram'
    const getCall=async()=>{
        try{
            await fetch('http://localhost:8000/profile/'+username,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('uid')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: 'getprofile'
                })
            }).then(async(data)=>{
                return await data.json();
            }).then((res)=>{
                if(res.status=='failed' || res.status=='invalid token'){
                    navigate('/login')
                }
                else if(res.status=='success' || res.status=='restricted'){
                    setData(res.data);
                    setLoader(false)
                }
            })
        }
        catch(err){
            navigate('/login')
        }
    }

    useEffect(()=>{
        getCall();
    },[]);
    

    return ( <>
        {(!loader)?<div className={styles.container}>
            <div className={styles.navbar}>
                <Nav/>
            </div>
            <div className={styles.content}>
                <div className={styles.profileCont}>
                    <div className={styles.profileImg}>
                        <img src={`http://localhost:8000/${resData.profilePic}`} alt="" />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.header}>
                            <p>{resData.username}</p>
                            {resData.sameUser?<><button onClick={()=>navigate(`/${username}/editprofile`)} className={styles.edit}>Edit Profile</button>
                                <button className={styles.edit}>Log Out</button></>:''}
                        </div>
                        <div className={styles.follow}>
                            <p><b>{`${resData.posts.length} `}</b>posts</p>
                            <p><b>{`${resData.follower.length} `}</b>followers</p>
                            <p><b>{`${resData.following.length} `}</b>following</p>
                        </div>
                        <div className={styles.bio}>
                            <p><b>{`${resData.fullname} `}</b></p>
                            <p>{`"${resData.bio}"`}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.posts}>
                    {resData.posts.map((d)=>{
                        return(
                            <div key={d._id} onClick={()=>navigate('/post/'+d._id)} className={styles.images}>
                                <img className={styles.imgs} src={`http://localhost:8000/${d.postUrl}`} alt="" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>:<Loader />}
    </> );
}

export default Profile;