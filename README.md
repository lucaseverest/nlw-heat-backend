<h1 align="center">NLW Heat - BackEnd - Node.js</h1>

Next Level Week is a [Rocketseat](https://www.rocketseat.com.br/) event to learn programming by building a complete application.

## 💻 Main Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Prisma](https://www.prisma.io/)
- [JSON Web Token](https://jwt.io/)
- [Socket.IO](https://socket.io/)

## 🔌 How to run

> Obs.: We have Authentication with Github's Oauth in this Project
- Make a copy of the `.env.example` file to `.env` and fill in your GitHub credentials;

```sh
gh repo clone lucaseverest/nlw-heat-backend
yarn
yarn prisma migrate dev
yarn dev
```

The application can be accessed at [`localhost:4000`](http://localhost:4000).
