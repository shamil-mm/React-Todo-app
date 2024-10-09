import express,{Request,Response}  from "express";
import cors from "cors";



const app=express()

const PORT=3001;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


interface Todo{
    id:number;
    title:string;
    completed:boolean;
}

let todos:Todo[]=[]

app.get('/api/todos',(req:Request,res:Response)=>{
    res.json(todos)
})

app.post('/api/todos',(req: Request,res: Response)=>{
    const {title}=req.body
    let repeat=todos.find((t)=>t.title===title)
    if(repeat){
       return
    }

    if(!title){
     res.status(400).json({error:'invalid title'})
    }

    const newTodo:Todo={
        id:todos.length+1,
        title,
        completed:false
    }
    todos.push(newTodo)
    res.status(201).json(newTodo)
})

app.put('/api/todos/:id',(req:Request,res:Response)=>{
    const {id}=req.params
    const {title,completed}=req.body

    const todoIndex= todos.findIndex(t=>t.id===parseInt(id))

    if(title && typeof title!== "string"){
        res.status(400).json({error:'Invalid title'})
    }
    if(completed !== undefined && typeof completed !== 'boolean'){
        res.status(400).json({error:"Invalid completed status"})
    }
 
    todos[todoIndex]={...todos[todoIndex],...req.body}
    res.json(todos[todoIndex])

})

app.delete('/api/todos/:id',(req:Request,res:Response)=>{
    const {id}=req.params;
    const todoIndex=todos.findIndex((t)=>t.id===parseInt(id))
    if(todoIndex=== -1){
        res.status(400).json({error:'todo not found'})
    }

    todos.splice(todoIndex,1)
    res.status(204).send()
})

app.put('/api/todos_edit/:id',(req:Request,res:Response)=>{
    const id=parseInt(req.params.id)

    const todoIndex=todos.findIndex(t=>t.id===id)
    if(todoIndex!==-1){
        todos[todoIndex]={...todos[todoIndex],...req.body}
        res.json(todos[todoIndex])
    } else {
        res.status(404).json({ message: 'Todo not found' })
    }
})
   

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})