import express from "express"
import pg from "pg"
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import {exec} from 'child_process'
import fs from 'fs'
// import { database, password } from "pg/lib/defaults";

const app = express();
const PORT = process.env.PORT || 8080;
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json())

const db = new pg.Client({
  user:process.env.DB_User,
  host:process.env.DB_Host,
  database:process.env.DB_Name,
  password:process.env.DB_Password,
  port:process.env.DB_PORT||5432,
  ssl:{rejectUnauthorized:false}
})

db.connect()

let username_r;

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

app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});


app.get("/summarise",(req,res)=>{
    const outputFileName = 'plot.png';
    const username = username_r

  // Run the R script and pass the output file name as an argument
  exec(`Rscript plot_script.R ${outputFileName} ${username}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing R script: ${error.message}`);
      return res.status(500).send(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    // Check if the file was created and send it as a response
    fs.access(outputFileName, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(500).send("Plot image could not be generated.");
      }

      // Send the generated plot image as a response
      res.sendFile(outputFileName, { root: process.cwd() }, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
        } else {
          // Optionally delete the file after sending
          fs.unlink(outputFileName, (err) => {
            if (err) console.error(`Error deleting file: ${err}`);
          });
        }
      });
    });
  });
})

app.post("/register",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const result = await db.query(
        "Insert into users(email,password) VALUES($1,$2)",[username,password]
      );
    res.redirect("/")
}
)



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
        username_r = username
        const result = await db.query("select * from users where email=$1 and password=$2",[username,password]);
        if(result.rows.length>0){
            res.redirect("/summarise")
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




app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`webpage is listening on port ${PORT}`)
})

