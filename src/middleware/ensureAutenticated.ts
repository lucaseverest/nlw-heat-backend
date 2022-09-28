import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

//Middleware para garantir que o usuário está autenticado
export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // recupera o token JWT no header da requisicão
  const authToken = request.headers.authorization;

  //se não tiver umm token responde com um erro de token inválido
  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  // tirar o [0] Bearer e deixar só o token
  const [, token] = authToken.split(" ");

  try {
    // verificar se o token que está no header do usuário é igual ao que foi injetato na autenticação.
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

    // adiciona as o user id na request
    request.user_id = sub;

    // função do express pra dar seguimento à rota solicitada inicialmente
    return next();
  } catch (err) {
    return response.status(401).json({ errorCode: "token.expired " });
  }
}
