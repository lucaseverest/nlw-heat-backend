import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";
import { router } from "./routes";

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(express.json());

app.use(router);

// Rotar para ir no Git Hub para o usuário se autenticar
app.get("/github", (request, response) => {
  response.redirect(
    `http://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

// Rota para validar se o usuário tem permissão, se vamos conseguir criar o token no github
// Rota para onde o GH redireciona o usuário depois que ele dá a permissao, com o code/token na query
app.get("/signin/callback", (request, response) => {
  const { code } = request.query;

  response.json(code);
});

export { serverHttp, io };
