import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Router() {

    const param=useParams();
    const loc=useLocation();
    const navigate=useNavigate();

    const getCall=()=>{
        if(loc.state.path=='editProfile'){
            navigate(`/${loc.state.username}/editprofile`)
        }
        else if(loc.state.path=='profile'){
            navigate(`/profile/${loc.state.username}`)
        }
    };

    useEffect(()=>{
        getCall()
    },[])

    return ( <>

    </> );
}

export default Router;