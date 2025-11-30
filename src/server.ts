import express, { Request, Response } from 'express'
import inialDb from './config/DB.js'
import config from './config/index.js'
import { Pool } from 'pg'
const app = express()

// middleware
app.use(express.json())

const pool = new Pool({
    connectionString:config.app.DB
})




inialDb()

// users
app.post("/users",async(req:Request,res:Response)=>{
  const {name,email}=req.body;
 try {
   await pool.query(`
    INSERT INTO users(name,email) VALUES($1,$2)
    `,[name,email])

    res.status(201).json({sucess:true,message:"data added sucessfully"})
 } catch (error) {
      res.status(500).json({sucess:false,message:"data not added"})
 }

})
app.get("/users",async(req:Request,res:Response)=>{
  try {
    const result =await pool.query(`
    SELECT * FROM users;
    `)
    res.status(201).json({sucess:true,message:"data get sucessfully",data:result.rows})
  } catch (error) {
    res.status(404).json({sucess:true,message:"data get not found"})
  }
})

app.get("/users/:id",async(req:Request,res:Response)=>{
 const {id} = req.params;
  try {
      const restult = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `,[id])
      res.status(201).json({sucess:true,message:"data get sucessfully",data:restult.rows[0]})
  } catch (error) {
    res.status(404).json({sucess:true,message:"data not found"})
  }

})

app.put("/users/:id",async(req:Request,res:Response)=>{
  
  const {name,email} = req.body;
  try {
    const result = await pool.query(`
      UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *
      `,[name,email,req.params.id])

    res.status(201).json({sucess:true,message:"data update sucessfully",data:result.rows})
  } catch (error) {
    res.status(404).json({sucess:true,message:"data not found"})
  }
})

app.delete("/users/:id",async(req:Request,res:Response)=>{
  const {id}= req.params;
  try {
    const result = await pool.query(`
      DELETE FROM users WHERE id=$1 RETURNING *
      `,[id])
    res.status(201).json({sucess:true,message:"data delete sucessfully",data:result})
  } catch (error) {
    res.status(404).json({sucess:true,message:"data not delete"})
  }
})

// todos
app.post("/todos",async(req:Request,res:Response)=>{
  const {user_id,title} =req.body;
  console.log(user_id,title);
  try {
    const result = await pool.query(`
      INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *
      `,[user_id,title])
      res.status(201).json({sucess:true,message:"todos data added sucessfully",data:result})
  } catch (error:any) {
    res.status(404).json({sucess:false,message:"don't add todos data",Error:error.message})
  }
})

app.get("/todos",async(req:Request,res:Response)=>{
  
    try {
      const result =await pool.query(`
    SELECT * FROM todos;
    `)
    res.status(201).json({sucess:true,message:"data get sucessfully",data:result.rows})
    } catch (error:any) {
      res.status(404).json({sucess:false,message:"data added sucessfully",Error:error.message})
    }
})

app.put("/todos/:id",async(req:Request,res:Response)=>{
  const {id}=req.params;
  const {title} = req.body
  
    try {
      const result = await pool.query(`
    UPDATE todos SET title=$1 WHERE id=$2 RETURNING *
    `,[title,id])
    res.status(201).json({sucess:true,message:"todos data update sucessfully",data:result.rows})

      
    } catch (error) {
      res.status(404).json({sucess:false,message:"don't updata todos data"})
    }
})

app.delete("/todos/:id",async(req:Request,res:Response)=>{
  const {id}=req.params;
  try {
    const result = await pool.query(`
      DELETE FROM todos WHERE id=$1 RETURNING *
      `,[id])
      res.status(201).json({sucess:true,message:"data delete sucessfully",data:result})
  } catch (error) {
    res.status(404).json({sucess:true,message:"don't data delete"})
  }
})


app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(config.app.port, () => {
  console.log(`Example app listening on port `)
})
