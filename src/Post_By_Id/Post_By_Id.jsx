import { useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';
import styles from './PostById.module.css';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';

function PostById() {
    const params=useParams();
    const postId=params.id
    const [data,setData]=useState();
    const [loader,setloader]=useState(true);

    const getCall=async ()=>{
        await fetch('http://localhost:8000/post/'+postId,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('uid')}`
            }
        }).then(async (data)=>{
            return await data.json();
        }).then((res)=>{
            if(res.status=='success'){
                setData(res.dataArr);
                setloader(false);
            }
        })
    }

    useEffect(()=>{
        getCall();
    },[])
    
    return ( <>
        {(loader)?<Loader/>:<div className={styles.container}>
            <div className={styles.navbar}>
                <Nav/>    
            </div>
            <div className={styles.content}>
                <Post data={data} />
            </div>    
        </div>}
    </> );
}

export default PostById;