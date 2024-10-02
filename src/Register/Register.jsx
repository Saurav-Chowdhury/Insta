import styles from './Register.module.css';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const username=useRef('');
    const password=useRef('');
    const fullname=useRef('');
    const email=useRef('');
    const [status,setStatus]=useState('');
    const navigate=useNavigate();
    
    const register=async ()=>{
        await fetch('http://localhost:8000/user/register',{
            method: 'POST',
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value,
                fullname: fullname.current.value,
                email: email.current.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res)=>{
            return await res.json(); 
        }).then((data)=>{ 
            if(data.status=="Please provide all the Details"){
                setStatus(data.status)
            }
            else if(data.status=="Something Went Wrong"){
                setStatus('Username or Email already exists')
            }
            else if(data.status=="success"){navigate('/login')}
            else{
                console.log(data.status);
                
            }
        })
    }

    document.title='Sign Up . Instagram'

    return(<>
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.loginInfo}>
                    <div className={styles.logo}>
                        <img src="src\Login\Instagram-name-logo-clipart-PNG.png" alt="" />
                    </div>
                    <div className={styles.textInfo}>
                        <p>Sign up to see photos and videos from your friends.</p>
                    </div>
                    <div className={styles.loginCont}>
                        <input ref={email} className={styles.Input} placeholder='Email Address' type="email" required />   
                        <input ref={username} className={styles.Input} placeholder='Username' type="text" required />
                        <input ref={fullname} className={styles.Input} placeholder='Full Name' type="text" required />
                        <input ref={password} className={styles.Input} placeholder='Password' type="password" required />
                    </div>
                    <p className={styles.stat}>{status}</p>
                    <div className={styles.terms}>
                        <p>People who use our service may have uploaded your contact information to Instagram. Learn more.
                            <br/>By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.</p>
                    </div>
                    <div className={styles.logBtn}>
                        <button onClick={()=>register()}>Sign Up</button>
                    </div>
                </div>

                <div className={styles.register}>
                    <p>Have an account? <Link to='/login' className={styles.Link}>Log In</Link></p>
                </div>
            </div>
        </div>
    </>);
}

export default Register;