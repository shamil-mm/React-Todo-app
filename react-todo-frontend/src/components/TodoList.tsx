import React, { useState, useEffect } from "react";
import axios from "axios";
import './TodoListStyle.css'


const TodoList: React.FC = () => {

    interface Todo {
        id: number;
        title: string;
        completed: boolean
    }
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState<string>('')
    const [editingTodo,setEditingTodo]=useState< Todo |null>(null)
    const [editingTitle,setEditingTitle]=useState<string>('')
    useEffect(()=>{
        fetchTodos();
    },[]);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/todos')
            setTodos(response.data)
        } catch (error) {
            console.error('Error fetching todos : ', error)
        }
    }


    const addTodo = async () => {

        if (!newTodo.trim()) return

        try {

            const response = await axios.post('http://localhost:3001/api/todos', { title: newTodo })
            console.log([...todos, response.data])
            setTodos([...todos, response.data])
            setNewTodo('')


        } catch (error) {
            console.error('Error adding todos : ', error)
        }
    }

    const toggleTodo = async (id: number) => {

        try {
            const todo = todos.find(t => t.id === id)

            if (!todo) return;
            const response = await axios.put(`http://localhost:3001/api/todos/${id}`, { ...todo, completed: !todo.completed });
            setTodos(todos.map(t => t.id === id ? response.data : t))


        } catch (error) {
            console.log('Error toggleing todo : ', error)
        }

    }

    const deleteTodo = async (id: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
        if(!confirmDelete){
            return;
        }
        try {
            await axios.delete(`http://localhost:3001/api/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id))

        } catch (error) {
            console.error('Error deleting todo:', error)
        }
    }

    const editTodo=async(todo:Todo)=>{

        try {
            setEditingTodo(todo)
            setEditingTitle(todo.title)
            
        } catch (error) {
            console.error('Error editing todo:', error)
        }

    }

    const updateTodo = async()=>{
        if (!editingTodo || !editingTitle.trim()) return;
        
        try {
            const response=await axios.put(`http://localhost:3001/api/todos_edit/${editingTodo.id}`,{...editingTodo,title:editingTitle})

            setTodos(todos.map(t=>(t.id===editingTodo.id?response.data:t)))

            setEditingTodo(null);
            setEditingTitle('');

        } catch (error) {
            console.error('Error updating todo:', error);
        }

    }


    return (
        <div className="todo-container">
            <h1 className="todo-header">Todo List</h1>
    
            <div>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo"
                    className="todo-input"
                />
                <button onClick={addTodo} className="add-button">Add Todo</button>
            </div>
    
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <div>
                            <input
                                type="checkbox"
                                onChange={() => toggleTodo(todo.id)}
                                className="todo-checkbox"
                                checked={todo.completed}
                            />

                            {
                                editingTodo?.id ===todo.id?(
                                    <>
                                    <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e)=>setEditingTitle(e.target.value)}
                                    className="todo-edit-input"
                                    />
                                <button onClick={updateTodo} className="delete-button"  >save</button>
                                    </>

                                ):(
                                    <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                                {todo.title}
                                </span>
                                    

                                )
                                
                            }


                            
                        </div>
                        <button onClick={() => deleteTodo(todo.id)} className="delete-button"> delete </button>
                        <button onClick={() => editTodo(todo)} className="delete-button"> edit </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default TodoList;