import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from 'axios';

const Home = () => {

    const context = useContext(UserContext);
    const [inputVal,setInputVal] = useState('');
    const [todo,setTodo] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/todos' , {withCredentials:true})
        .then(response => {
            setTodo(response.data);
        });
    },[]);

    if (!context.email){
        return 'You need to Login';
    }

    function addTodo(ev){
        ev.preventDefault();
        axios.put('http://localhost:4000/todos', {text:inputVal,done:false}, {withCredentials:true})
        .then(response => {
            setTodo([...todo, {text: response.data.text, done: response.data.done}]);
            setInputVal('');
        });
    }

    function updateTodo(entry){
        const data = {id:entry._id,done:!entry.done};
        axios.post('http://localhost:4000/todos', data , {withCredentials:true})
        .then(() => {
            const newTodo = todo.map(t => {
                if (t._id === entry._id){
                    t.done = !t.done;
                }
                return t;
            });
            setTodo([...newTodo]);
        });
        
    }

    return (
        <div>
            
            <form onSubmit={ev => addTodo(ev)}>
            <input value={inputVal} onChange={ev => setInputVal(ev.target.value)} placeholder="What do you want to do?"/>
            <button> Submit </button>
            </form>
            <div>
                <ul>
                    {todo.map(task => (
                        <li key={task._id}>
                            <input 
                                type="checkbox" 
                                checked={task.done} 
                                onChange={() => updateTodo(task)}
                            /> 
                            {task.done ?<del>{task.text}</del> : task.text}
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;
