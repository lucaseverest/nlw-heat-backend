import axios from "axios";
import { sign } from "jsonwebtoken";
import prismaClient from "../prisma";
/* 
Retornar o tokem com as infos do user
*/

interface IAcessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    // Recuperar o acess_token no github passando o code do user e as informações da aplicação
    const { data: accessTokenResponse } = await axios.post<IAcessTokenResponse>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Recuperar infos do user no github
    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    // dados do usuário
    const { login, id, avatar_url, name } = response.data;

    // verificar se o usuário existe no DB
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    // Se SIM = Gera um token
    // Se NÃO = Cria no DB, e gera um token JWT
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }

    // Criação do token JWT
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user }; // com axios, toda informação retornada é inserida no data
    // lá na função de signIn esse token vai ser adicionado ao LocalStorage
  }
}

export { AuthenticateUserService };
