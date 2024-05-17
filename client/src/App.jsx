import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [renderAdd, setRenderAdd] = useState(false);
  const [done, setDone] = useState(false);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      await axios
        .get("https://todo-server-phi-teal.vercel.app/")
        .then((response) => {
          console.log(response.data);
          response.data.forEach((td) => {
            if (td.done == "yes") {
              setDone(true);
            } else{
              setDone(false);
            }
          });
          setTodos(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getTodos();
  }, [renderAdd]);

  // useEffect(() => {
  //   async function getTodos() {
  //     await axios
  //       .get("https://todo-server-phi-teal.vercel.app/done")
  //       .then((response) => {
  //         console.log(response.data);
  //         setDone(response.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   getTodos();
  // }, [renderDone]);

  async function addTodo(e) {
    e.preventDefault();
    await axios
      .post("https://todo-server-phi-teal.vercel.app/add", {
        todo_title: title,
        todo_content: content,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setTitle("");
    setContent("");
    setRenderAdd(!renderAdd);
  }

  async function finishTodo(id) {
    await axios
      .post("https://todo-server-phi-teal.vercel.app/done", {
        todo_id: id,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setRenderAdd(!renderAdd);
  }

  async function undoTodo(id) {
    await axios
      .post("https://todo-server-phi-teal.vercel.app/undo", { todo_id: id })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setRenderAdd(!renderAdd);
  }

  async function deleteTodo(id) {
    await axios
      .delete("https://todo-server-phi-teal.vercel.app/delete", {
        data: { id },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setRenderAdd(!renderAdd);
  }

  return (
    <>
      <h1>ROHAN TODO LIST</h1>
      <form onSubmit={addTodo} className="todo-form">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          placeholder="Enter title..."
        ></input>
        <label htmlFor="todo">Todo:</label>
        <input
          type="text"
          id="todo"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
          placeholder="Enter todo..."
        ></input>
        <button type="submit">ADD</button>
      </form>
      <h2>{todos.length ? "TODOS:" : "YOU HAVE NOTHING-TODO"}</h2>
      <div className="todos">
        {todos.map((todo) => {
          return todo.done == "no" ? (
            <div className="todo-item" key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.content}</p>
              <button
                onClick={() => {
                  finishTodo(todo.id);
                }}
              >
                Done
              </button>
              <button
                onClick={() => {
                  deleteTodo(todo.id);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <></>
          );
        })}
        <h2>{done ? "FINISHED TODOS:" : null}</h2>
        <div className="finished">
          {todos.map((todo) => {
            return todo.done == "yes" ? (
              <div key={todo.id}>
                <h3>{todo.title}</h3>
                <p>{todo.content}</p>
                <button
                  onClick={() => {
                    undoTodo(todo.id);
                  }}
                >
                  Undo
                </button>
                <button
                  onClick={() => {
                    deleteTodo(todo.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <></>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
