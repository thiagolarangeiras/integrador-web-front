import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getTesteLogin, logout } from "../requests";

export function Auth({ children }) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        getTesteLogin().then((value) => {
            setAuth(value);
            if (!value) {
                logout()
                navigate("/login");
            }
        })
    }, []);

    // useEffect(() => {
    //     if (!auth) navigate("/login");
    // }, [auth]);

    if (auth) return children;
    return <></>;
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