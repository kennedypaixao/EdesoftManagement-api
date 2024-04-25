import express from 'express';
import { Encrypt } from '../helpers';
import { AddUserAsync, GetUserByEmailAsync, UpdateUserAsync } from '../repository/userRepository';
import { HttpResponse } from '../model/httpResponse';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await GetUserByEmailAsync(email);
    if (!user) {
      return res.status(401).json(HttpResponse(null, ["Usuário não identificado."])).end();
    }

    const encryptPwd = Encrypt(password);

    if (encryptPwd !== user.Password) {
      return res.status(401).json(HttpResponse(null, ["Senha inválida."])).end();
    }

    res.cookie(process?.env?.APP_NAME, user.Email, { domain: req.get('origin') ?? "localhost", path: req.get('path') ?? "/" });

    return res.status(200).json(HttpResponse()).end();
  } catch (error) {
    console.error("[Authentication - Login] Ocorreu um erro ao realizar o login", error);
    return res.sendStatus(400).end();
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email) {
      return res.status(400).json(HttpResponse(null, ["É preciso informar o e-mail."])).end();
    }

    if (!password) {
      return res.status(400).json(HttpResponse(null, ["É preciso informar a senha."])).end();
    }

    if (!name) {
      return res.status(400).json(HttpResponse(null, ["É preciso informar o nome."])).end();
    }

    await AddUserAsync(email, Encrypt(password), name);

    return res.status(200).end();

  } catch (error) {
    console.error("[Authentication - Register] Ocorreu um erro ao realizar o cadastro", error);
    return res.sendStatus(400).end();
  }
}

export const update = async (req: express.Request, res: express.Response) => {
  try {
    const { uid } = req.params;
    const { isAdmin, password, name } = req.body;

    if(!uid) {
      return res.status(400).json(HttpResponse(null, ["É preciso informar o UID do usuário."])).end();
    }

    const updated = await UpdateUserAsync(uid, name, password, isAdmin);
    if(!updated) {
      return res.status(400).json(HttpResponse(null, ["Não foi possível realizar a alteração ou o registro não existe."])).end();
    }

    return res.status(200).end();

  } catch (error) {
    console.error("[Authentication - Register] Ocorreu um erro ao atualizar o cadastro", error);
    return res.sendStatus(400).end();
  }
}