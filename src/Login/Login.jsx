import { useRef, useState } from 'react';
import styles from './Login.module.css';
import { json, Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const Login=()=>{

    document.title='Instagram Log in'

    const navigate=useNavigate();
    const [status,setStatus]=useState('')
    const userRef=useRef('');
    const pwdRef=useRef('');
    const [loader,setloader]=useState(false)

    const handleLogin=async ()=>{
        if(userRef.current.value.trim()=='' || pwdRef.current.value.trim()==''){
            setStatus('Mandatory Fields Not Filled')
        }
        else{
            setloader(true);
           await fetch('http://localhost:8000/user/login',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        username: userRef.current.value,
                        password: pwdRef.current.value
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(async (data)=>{
                return await data.json();
            }).then((res)=>{
                if(res.status=='not found'){
                    setStatus('Username or password wrong');
                    setloader(false);
                }
                else if(res.status=='success'){
                    localStorage.setItem('uid',res.token);
                    setloader(false);
                    navigate('/home')
                }
            })
        }
    }

    return(<>
        {(loader)?<Loader/>:
        <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.loginInfo}>
                <div className={styles.logo}>
                    <img src="src\Login\Instagram-name-logo-clipart-PNG.png" alt="" />
                </div>
                <div className={styles.loginCont}>
                    <input ref={userRef} className={styles.Input} placeholder='Username*' type="text" required />
                    <input ref={pwdRef} className={styles.Input} placeholder='Password*' type="password" required />
                    <p className={styles.status}>{status}</p>
                </div>
                <div className={styles.logBtn}>
                    <button onClick={handleLogin}>Log In</button>
                </div>
                <div className={styles.forgot}>
                    <div className={styles.line}>

                    </div>
                    <p>OR</p>
                    <div className={styles.line}>
                    </div>
                </div>
                <p className={styles.forgotPwd}>Forgot password</p>
            </div>

            <div className={styles.register}>
                <p>Don't have an account? <Link to='/register' className={styles.Link}>Sign Up</Link></p>
            </div>
        </div>
    </div>}
    </>)
}

export default Login;