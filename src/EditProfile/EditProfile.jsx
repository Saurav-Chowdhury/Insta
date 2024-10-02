import Nav from '../Nav/Nav';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditProfile.module.css';
import { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import { render } from 'react-dom';

function EditProfile() {

    const {username}=useParams();
    const fileRef=useRef();
    const [loader,setLoader]=useState(true);
    const [resData,setData]=useState();
    const navigate=useNavigate();
    document.title=username+' Edit Profile . Instagram'
    const getCall=async()=>{
        try{
            await fetch('http://localhost:8000/profile/editprofile/'+username,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('uid')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: 'editprofile'
                })
            }).then(async(data)=>{
                return await data.json();
            }).then((res)=>{
                if(res.status=='failed' || res.status=='invalid token'){
                    navigate('/login')
                }
                else if(res.status=='restricted'){navigate('/home')}
                else if(res.status=='success'){
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

    const handleChangePhoto=()=>{
        const upld=document.getElementsByClassName(styles.uploader)[0]

        upld.style.display="flex";
        upld.style.zIndex=100;
        const cont=document.getElementsByClassName(styles.container)[0];
        cont.style.zIndex=-100;
        cont.style.opacity="20%";
    }

    const handleCancel=()=>{
        const upld=document.getElementsByClassName(styles.uploader)[0]

        upld.style.display="none";
        upld.style.zIndex=-100;
        const cont=document.getElementsByClassName(styles.container)[0];
        cont.style.zIndex=100;
        cont.style.opacity="100%";
    }

    const handleUpload=()=>{
        fileRef.current.click();
        
    }

    const handleSubmit=async()=>{
        setLoader(true);

        await fetch('http://localhost:8000/profile/updateprofile/'+username,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('uid')}`
            },
            body: JSON.stringify({
                bio: resData.bio,
                gender: resData.gender
            })
        }).then(async(data)=>{
            return await data.json();
        }).then((res)=>{
            if(res.status=='success'){
                setData({...resData,bio: res.data.bio,gender: res.data.gender});
                setLoader(false)
            }
        })
    }

    const handleProfileChange=async()=>{
        const file=new FormData();
        file.append('photo',fileRef.current.files[0]);

        await fetch('http://localhost:8000/profile/profilePic/'+username,{
            method: 'POST',
            body: file,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('uid')}`
            }
        }).then(async (data)=>{
            return await data.json()
        }).then((res)=>{
            if(res.status=='failed' || res.status=='invalid token'){
                navigate('/login')
            }
            else if(res.status=='restricted'){navigate('/home')}
            else if(res.status=='success'){
                setData({...resData,
                    profilePic: res.profilePic
                });
                navigate('/router',{state: {username: username,
                    path: 'editProfile'
                }})
            }
        })
    }

    return ( <>
        {(!loader)?<>
            <div className={styles.container}>
            <div className={styles.navbar}>
                <Nav/>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>Edit Profile</h2>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profile}>
                    <img src={`http://localhost:8000/${resData.profilePic}`} alt="" />
                    <div className={styles.names}>
                        <span><b>{resData.username}</b></span>
                        <span id={styles.fullname}>{resData.fullname}</span>
                    </div>
                    </div>
                    <button onClick={()=>handleChangePhoto()} className={styles.btn}><b>Change Photo</b></button>
                </div>
                <div className={styles.bio}>
                    <h3>Bio</h3>
                    <input onChange={(e)=>{setData({...resData,bio: e.target.value})}} type='textarea' value={resData.bio} name="" className={styles.textarea}/>
                </div>
                <div className={styles.gender}>
                    <h3>Gender</h3>
                    <select onChange={(e)=>{setData({...resData,gender: e.target.value})}} value={resData.gender}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Others</option>
                    </select>
                    <span>This won't be part of your public profile.</span>
                </div>
                <div className={styles.submit}>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>

        </div>
        <div className={`${styles.uploader}`}>
            <h3>Change Profile Photo</h3>
            <input onChange={handleProfileChange} ref={fileRef} type="file" hidden />
            <div onClick={handleUpload} style={{color: "rgb(39, 154, 199)"}} className={styles.photolinks}><b>Upload Photo</b></div>
            <div style={{color: "red"}} className={styles.photolinks}><b>Remove Current Photo</b></div>
            <div onClick={handleCancel} className={styles.photolinks}>Cancel</div>
        </div>
        </>:<Loader/>}
    </> );
}

export default EditProfile;