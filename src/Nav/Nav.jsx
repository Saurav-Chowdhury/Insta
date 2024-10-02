import { useNavigate } from 'react-router-dom';
import styles from './Nav.module.css'
import { useEffect, useState } from 'react';
import home from './home.png';
import create from './tab.png';
import search from './search.png'
import logo from '../Login/Instagram-name-logo-clipart-PNG.png'

function Nav() {
    const [pic,setPic]=useState('');
    const navigate=useNavigate();
    let username
    try{
        username=JSON.parse(atob(localStorage.getItem('uid').split('.')[1])).username;
    }
    catch(err){
        navigate('/login')
    }

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
                setPic(res.profilePic)
            }
        })
    }

    useEffect(()=>{
        getCall();
    },[])

    
    const arr=[{
        src: home,
        link: '/home',
        text: 'Home'
    },
    {
        src: search,
        link: '/search',
        text: 'Search'
    },
    {
        src: create,
        link: '/create',
        text: 'Create'
    },
    {
        src: `http://localhost:8000/${pic}`,
        link: '/profile/'+username,
        text: 'Profile'
    },
]
    return ( <>
        <div className={styles.navContainer}>
            <div className={styles.logo}>
                <img src={logo} alt="" />
            </div>
            {
                arr.map((data)=>{
                    return(
                        <div key={data.text} onClick={()=>navigate(data.link)} className={styles.navlinks}>
                            <img src={data.src} id={(data.text)=='Profile'?styles.profile:'gg'}  alt="" />
                            <p>{data.text}</p>
                        </div>
                    )
                })
            }
        </div>
    </> );
}

export default Nav;