import express from "express"
import pg from "pg"
import bodyParser from "body-parser";
import dotenv from 'dotenv';
// import { database, password } from "pg/lib/defaults";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json())

const db = new pg.Client({
  user:process.env.DB_User,
  host:process.env.DB_Host,
  database:process.env.DB_Name,
  password:process.env.DB_Password,
  port:process.env.DB_Port
})

db.connect()

app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})

app.get("/add_expense",(req,res)=>{
    res.render("add_expense.ejs")
})

app.post("/register",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const result = await db.query(
        "Insert into users(email,password) VALUES($1,$2)",[username,password]
      );
    // console.log(result)
    res.redirect("/")
}
)

// app.post("/submit",async (req,res)=>{
//     const username = req.body.username;
//     const password = req.body.password;
//     const action = req.body.action;
//     // console.log(username);
//     // console.log(password);
//     const result = await db.query(
//         "select * from users where email=$1 and password=$2",[username,password]
//       );
//     if(result.rows.length>0){
//         if(action=='summarise'){
//             res.redirect("You clicked on summarise")
//         }else if(action=="add_expense"){
//             res.redirect("/add_expense")
//         }
//     }else{
//         res.send("User does not exist")
//     }
// }
// )


app.post("/submit",async (req,res)=>{
    const action = req.body.action;
    try{
    if(action=='add_expense'){
        const username = req.body.username;
        const password = req.body.password;
        const result = await db.query("select * from users where email=$1 and password=$2",[username,password]);
        if(result.rows.length>0){
            res.redirect("/add_expense")
        }
    }else if(action=='summarise'){
        const username = req.body.username;
        const password = req.body.password;
        const result = await db.query("select * from users where email=$1 and password=$2",[username,password]);
        if(result.rows.length>0){
            res.redirect("/add_expense")
        }
    } else if(action=='insert'){
        const username = req.body.username;
        const Purpose = req.body.Purpose;
        const Amount = Number(req.body.Amount);
        const Category = req.body.Category;
        const Year = Number(req.body.Year);
        const Month = Number(req.body.Month);
        // console.log([username,Purpose,Amount,Category,Year,Month])
        const result = await db.query("insert into expenses values($1,$2,$3,$4,$5,$6)",[username,Purpose,Amount,Category,Year,Month]);
        res.redirect("/add_expense")
}
}catch(err){
    console.log(err)
}
}
);




app.listen(PORT,()=>{
    console.log(`webpage is listening on port ${PORT}`)
})

