import { Request, Response } from "express";
import { CreateMessageService } from "../services/CreateMessageService";

class CreateMessageController {
  async handle(request: Request, response: Response) {
    //receber o id do usuário, precisa estar logado e autenticado na aplicação para criar uma mensagem
    const { message } = request.body;
    const { user_id } = request;

    const service = new CreateMessageService();

    const result = await service.execute(message, user_id);

    return response.json(result);
  }
}

export { CreateMessageController };
