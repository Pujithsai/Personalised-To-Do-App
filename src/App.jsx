import './App.css';
import React, { useEffect, useState } from 'react';
import {Routes,Route,Link,BrowserRouter} from 'react-router-dom';
import Login from './pages/Login';
import UserContext from './pages/UserContext'
import Register from './pages/Register';  
import axios from 'axios';
import Home from './pages/Home';

function App() {

  const [email,setEmail] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/user', {withCredentials:true})
    .then(info => {
      
      setEmail(info.data.email);
      
    });
  },[]);

  function Logout(ev){
    ev.preventDefault();
    axios.post('http://localhost:4000/logout',{withCredentials:true}).then(() =>{
        setEmail("");
    });
  }


  return (
      <UserContext.Provider value={{email,setEmail}}>
          <BrowserRouter>
            <nav>
              <Link to={'/'}>Home</Link>
              {!email && (
                <>
                  <Link to={'/login'}>Login</Link>
                  <Link to={'/register'}>Register</Link>
                </>
                
              )}
              {!!email && (
                <>
                  <a onClick={ev => Logout(ev)}>Logout</a>
                </>
              )}
            </nav>
            <main>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
              </Routes>
            </main>
        </BrowserRouter>
      </UserContext.Provider>
      
    
  );
}

export default App;
