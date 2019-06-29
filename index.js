const express = require("express");

const server = express();
server.use(express.json());

// middleware global
server.use((req, res, next) => {
  console.log("middleware comum a todas as rotas");
  console.log(`Metodo=${req.method} | URL= ${req.url}`);
  return next();
});

const users = ["Lucas", "João", "Pedro", "Alberto"];

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "preencha o campo do usuário" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  user = users[req.params.id];
  if (!user) {
    return res.status(400).json({ error: "usuário não encotrado" });
  }
  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:id", checkUserInArray, (req, res) => {
  //const { id } = req.params;
  //return res.json(users[id]);
  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:id", checkUserInArray, checkUserExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  users[id] = name;
  return res.json(users);
});

server.delete("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params;
  users.splice(id, 1);
  return res.json({ message: "excluido com sucesso" });
});

/*
server.get("/", (req, res) => {
  return res.send("Hello World");
});

// Query Param = localhost:3000/user?page=3
server.get("/users", (req, res) => {
  return res.json(users);
});

// Query Param = localhost:3000/user?page=3
server.get("/user", (req, res) => {
  const page = req.query.page;
  return res.json({ message: `Exibindo página: ${page}` });
});

// Route Param = localhost:3000/user/2
server.get("/user/:id", (req, res) => {
  const { id } = req.params;
  return res.json({ message: `Exibindo usuário de ID: ${id}` });
});
*/
server.listen(3000);
