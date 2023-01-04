import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";


const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const loginUser = async (username, password) => {
        const response = await fetch("http://127.0.0.1:8000/api-token-auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200 && data !== '-1') {
            setAuthTokens(data);
            localStorage.setItem("authTokens", JSON.stringify(data));
            history.push("/");
        }else{
            return -1;
        }
    };


    const logoutUser = () => {
        setAuthTokens(null);
        localStorage.removeItem("authTokens");
        history.push("/");
    };

    const contextData = {
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser
    };

    useEffect(() => {
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};