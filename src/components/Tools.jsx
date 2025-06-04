import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getTesteLogin, logout } from "../requests";

const Spinner = ({ size = 200 }) => (
     <svg
       className="spinner"
       width={size}
       height={size}
       viewBox="0 0 50 50"
     >
       <circle
         className="path"
         cx="25"
         cy="25"
         r="20"
         fill="none"
         strokeWidth="5"
       />
     </svg>
);

export function Auth({ children }) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [offline, setOffline] = useState(false);
    
    async function validate() {
        setOffline(false);
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        try {
            let value = await getTesteLogin();
            setAuth(value);
            if (!value) {
                logout();
                navigate("/login");
            }
        } catch (e){
            setOffline(true);
            
        }
    }

    useEffect(()=>{
        validate();
    }, []);

    if (auth) return children;
    if (offline) return (
        <>Desculpe o transtorno o sistma esté offline! tente novamente mais tarde!</>
    );
    
    return(<Spinner />);
}

export function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/login");
    }, []);
    return <></>;
}

export function Redirec() {
    return <Navigate to="/" />;
}