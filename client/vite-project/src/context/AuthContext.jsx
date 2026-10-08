import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";


const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchCustomer = async ()=>{
            try {
                const customerData = await axiosInstance.get('/customers/me');
                setCustomer(customerData.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                }
                setCustomer(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    },[]);

    return (
    <AuthContext.Provider value={{customer, setCustomer, loading}}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = ()=> useContext(AuthContext)

