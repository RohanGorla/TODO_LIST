import "dotenv/config";
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

app.get("/", (req, res) => {
  db.query("select * from todos", (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  });
});

app.post("/add", (req, res) => {
  let sql = "insert into todos (title, content, done) values ?";
  let values = [[req.body.todo_title, req.body.todo_content, "no"]];
  db.query(sql, [values]);
  res.send("data inserted");
});

app.post("/toggle", (req, res) => {
  db.query("update todos set ? where id = ?", [
    { done: req.body.todo_done },
    req.body.todo_id,
  ]);
  res.send("update done");
});

app.delete("/delete", (req, res) => {
  db.query("delete from todos where id = ?", [req.body.id]);
  res.send("Deleted todo");
});

app.listen(PORT, () => {
  console.log(`Server running at  http://localhost:${PORT}`);
});
