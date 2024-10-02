import styles from './Loader.module.css';
import logo from '../assets/icons8-instagram-32.png'
function Loader() {
    return ( <>
        <div className={styles.loaderCont}>
            <div className={styles.image}>
                <img src={logo} alt="" />
            </div>
            <div className={styles.loader}>

            </div>
        </div>
    </> );
}

export default Loader;