import "babel-polyfill"
import { h, app } from "hyperapp"
import axios from "axios"
import styles from "./index.css"
const state = {
    todoValue: "",
    todos: []
}

const actions = {
    getTodo:  () => (state,actions) => {
        axios.get("/api/todos").then(res => {
            console.log(res.data)
            actions.setTodo(res.data.todos)
        })
    },
    setTodo: data => state => ({todos: data}),
    addTodo: todoValue => (state,actions) => {
        console.log(todoValue)
        var params = new URLSearchParams()
        params.append("value",todoValue)
        axios.post("/api/todos",params).then(resp => {
            console.log(resp.data)
         }).catch(error=>{
            console.log(error)
        }
        )
        actions.todoEnd()
        actions.getTodo()
    },
    onInput: value => state => {
        state.todoValue = value
    },
    deleteTodo: id => (state,actions) => {
        console.log(id)
        axios.delete("/api/todos/" + id).then(resp => {
            console.log(resp.data)
        }).catch(error => {
            console.log(error)
        })
        actions.getTodo()
    },
    checkTodo: e => {
        console.log(e)
        console.log(e.path[1].id)
        const id = e.path[1].id
        console.log("/api/todos/" + id)
        var params = new URLSearchParams()
        params.append("completed",e.target.checked)
        axios.put("/api/todos/" + id,params).then(resp => {
            console.log(resp.data)
        }).catch(error => {
            console.log(error)
        })

        if (e.target.checked == true){
            document.getElementById(id).style.opacity ="0.5"
            document.getElementById("button_" + id).style.display = "inline"
        }
        else{
            document.getElementById(id).style.opacity ="1"
            document.getElementById("button_" + id).style.display = "none" 
        }
    },
    todoEnd: () => state => ({todoValue:""})
}

const Todos = () => (state, actions) => {
//   actions.setTodos()
   // state.todos = actions.setTodos
    console.log(state.todos)
    return (
    <div class={styles.todos}>
        <h1>Todoリスト</h1>
        <h2>Todoを追加</h2>
        <input type="text" value={state.todoValue} oninput={e => actions.onInput(e.target.value)} onkeydown={e => e.keyCode === 13 ? actions.addTodo(e.target.value) : '' }  />
        <p>{state.todos.length}個のTodo</p>
        <ul>
        {
         state.todos.map((todo) => {
            if (todo.completed){
                return (
                        <li class={styles.checked} id={ todo.id}><input type="checkbox" checked={todo.completed} onclick={e => actions.checkTodo(e)} />{todo.value}<button class={styles.checked}id={"button_" + todo.id} onclick={() => actions.deleteTodo(todo.id)}>消去</button></li>
                )
            }
            else{
                return (
                        <li id={todo.id}><input type="checkbox" checked={todo.completed} onclick={e => actions.checkTodo(e)}/>{todo.value}<button id={"button_" + todo.id} onclick={() => actions.deleteTodo(todo.id)}>消去</button></li>
                )
            }
        })
        }
        </ul>
    </div>
)}
const view = (state, actions) => {
    if (state.todos.length == 0){
        actions.getTodo()
    }
    return (<Todos />) 
}

app(state, actions, view, document.body)
