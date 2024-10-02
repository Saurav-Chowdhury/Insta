import { useRef, useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import styles from './Create.module.css';
import Switch from '@mui/material/Switch';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

function Create() {
    document.title='Create new Post . Instagram'
    const [pic,setPic]=useState('');
    const [user,setUser]=useState('');

    const navigate=useNavigate();

    const caption = useRef();
    const [likes,setlikes]=useState(false);
    const [comments,setComments]=useState(false);
    const [loader,setLoader]=useState(false);


    const getCall=async ()=>{
        const token=localStorage.getItem('uid');
        await fetch('http://localhost:8000/user/profilePic',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(async (data)=>{
            return await data.json();
        }).then((res)=>{
            if(res.status=='invalid token'){
                navigate('/login')
            }
            else if(res.status=='success'){
                setPic(res.profilePic);
                setUser(res.username)
            }
        })
    }

    useEffect(()=>{
        getCall();
    },[])

    const files=useRef();
    const imgs=useRef();
    const handleimageClick=()=>{
        files.current.click();
    }

    const handleImageSelect=(e)=>{
        imgs.current.files=e.target.files[0];
        imgs.current.src=URL.createObjectURL(e.target.files[0]);
    }

    const handleSubmit=async ()=>{
        const form = new FormData();
        form.append('files',imgs.current.files);
        form.append('caption',caption.current.value);
        form.append('likesOff',likes);
        form.append('commentsOff',comments);

        setLoader(true)

        await fetch('http://localhost:8000/post/upload',{
            method: 'POST',
            body: form,
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('uid')
            }
        }).then(async (data)=>{
            return await data.json();
        }).then((res)=>{
            if(res.status=='success'){
                setLoader(false);
                navigate('/post/'+res.data._id)
            }
        })
        
    }

    return ( <>
        {(!loader)?<div className={styles.container}>
            <div className={styles.navbar}>
                <Nav/>
            </div>
            <div className={styles.create}>
                <div className={styles.header}>
                    <p></p>
                    <h4>Create new Post</h4>
                    <h5 onClick={handleSubmit} style={{color: "sky",cursor: "pointer"}}>POST</h5>
                </div>
                <div className={styles.content}>
                    <input onChange={handleImageSelect} ref={files} type="file" hidden />
                    <img ref={imgs} onClick={handleimageClick} src="src\Create\template.png" alt="" />
                </div>
                <div className={styles.caption}>
                    <div className={styles.info}>
                        <div className={styles.userInfo}>
                            <img src={`http://localhost:8000/${pic}`} alt="" />
                            <p><b>{user}</b></p>
                        </div>
                        <div className={styles.captiontext}>
                            <textarea placeholder='Caption..' ref={caption}></textarea>
                        </div>
                    </div>
                    <div className={styles.access}>
                        <div className={styles.advance}>
                            <div className={styles.likes}>
                                <p><b>Hide likes count</b></p>
                                <Switch id={styles.Switch} onChange={()=>setlikes(!likes)} value="true" />
                            </div>
                            <div className={styles.comments}>
                                <p><b>Turn off Commenting</b></p>
                                <Switch id={styles.Switch} onChange={()=>setComments(!comments)} />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>:<Loader/>}
    </> );
}

export default Create;