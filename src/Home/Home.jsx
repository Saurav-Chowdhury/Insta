import { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import styles from './Home.module.css';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';

function Home() {

    const [data,setData]=useState([]);
    const [loader,setLoader]=useState(true);

    document.title='Home . Instagram';
    const getCall=async()=>{
        await fetch('http://localhost:8000/post/allPosts',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('uid')}`
            }
        }).then(async (data)=>{
            return await data.json();
        }).then((res)=>{
            if(res.status=='success'){
                setData(res.dataArr);
                
                setLoader(false)
            }
        })
    };

    useEffect(()=>{
        getCall();
    },[])

    return ( <>
        {(loader)?<Loader />:
        <div className={styles.container}>
        <div className={styles.navbar}>
            <Nav/>
        </div>
        <div className={styles.content}>
            {data.map((d)=><Post key={d._id} data={d}/>)}
        </div>
        <div className={styles.chat}>
            <p>Chat functionality coming soon</p>

        </div>
    </div>}
    </> );
}

export default Home;