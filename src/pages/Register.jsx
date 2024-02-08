import React, { useContext, useState } from "react";
import axios from 'axios';
import UserContext from "./UserContext";
import { Navigate } from 'react-router-dom';

const Register = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const context = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);

    function RegisterData(ev){
        ev.preventDefault();
        const data = {email,password}
        axios.post('http://localhost:4000/register', data, {withCredentials:true})
        .then(response =>{
            console.log(response);
            context.setEmail(response.data.email);
            setEmail('');
            setPassword('');
            setRedirect(true);
        });
        
    }

    if (redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <div>
            <form onSubmit={ev => RegisterData(ev)}>
                <input type="email" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="Email@.com"/><br/>
                <input type="password" value={password} onChange={ev => setPassword(ev.target.value)} placeholder="password..."/><br/>
                <button>Register</button>
            </form>
        </div>
    );
}

export default Register;