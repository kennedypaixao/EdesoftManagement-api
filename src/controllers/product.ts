import express from 'express';
import multer from 'multer';
import { HttpResponse } from '../model/httpResponse';
import { uuid } from 'uuidv4';

import { GetProductsAsync, AddProductAsync, UpdateProductAsync, GetProductByUIdAsync, DeleteProductAsync } from '../repository/productRepository';
import { AddHistoryAsync } from '../repository/productHistoryRepository';

export const getProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o UID do usuário."])).end();
        }

        const products = await GetProductByUIdAsync(uid);
        return res.status(200).json(HttpResponse(products)).end();
    } catch (error) {
        console.error("[Product - getProduct] Ocorreu um erro ao realizar o login", error);
        return res.sendStatus(400).end();
    }
};

export const getProducts = async (req: express.Request, res: express.Response) => {
    try {
        const products = await GetProductsAsync();
        return res.status(200).json(HttpResponse(products)).end();
    } catch (error) {
        console.error("[Product - getProducts] Ocorreu um erro ao realizar o login", error);
        return res.sendStatus(400).end();
    }
};

const getBase64Async = (file: any): Promise<string> => {
    return new Promise((success, error) => {
        try {
            // const base64String = new Buffer(file.data).toString('base64');
            const base64String = Buffer.from(file.data).toString('base64');
            const url = `data:${file.mimetype};base64, ${base64String}`;
            success(url);
        } catch (er) {
            error(er);
        }
    });
}

export const addProduct = async (req: express.Request, res: express.Response) => {
    try {

        let { name, quantity, price, createdBy } = req.body;

        if (!req.files) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar uma imagem do produto."])).end();
        }

        const file = (req.files as any)['picture'];
        const base64String = await getBase64Async(file);

        if (!name) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o nome."])).end();
        }

        if (!quantity) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar a quantidade."])).end();
        }

        if (!price) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o preço."])).end();
        }

        if (!createdBy) {
            createdBy = null;
        }

        const uid = uuid();
        const created = await AddProductAsync(uid, name, quantity, base64String, price, createdBy);
        if (!created) {
            return res.status(400).json(HttpResponse(null, ["Não foi possível criar o produto."])).end();
        }
        await AddHistoryAsync(uid, quantity, createdBy);
        return res.status(200).end();

    } catch (error) {
        console.error("[Product - addProduct] Ocorreu um erro ao realizar o cadastro", error);
        return res.sendStatus(400).end();
    }
}

export const updateProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;
        let { name, quantity, active, price, updatedBy } = req.body;

        if (!updatedBy) {
            updatedBy = null;
        }
        
        active = (active === 'true') ?? true;

        if (!uid) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o UID do usuário."])).end();
        }

        let base64String = null;

        if (req.files) {
            const file = (req.files as any)['picture'];
            base64String = await getBase64Async(file);
        }

        const updated = await UpdateProductAsync(uid, name, quantity, active, base64String, price, updatedBy);
        if (!updated) {
            return res.status(400).json(HttpResponse(null, ["Não foi possível realizar a alteração ou o registro não existe."])).end();
        }
        await AddHistoryAsync(uid, quantity, updatedBy);

        return res.status(200).end();

    } catch (error) {
        console.error("[Product - updateProduct] Ocorreu um erro ao atualizar o cadastro", error);
        return res.sendStatus(400).end();
    }
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;
        const { updatedBy } = req.body;

        if (!uid) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o UID do usuário."])).end();
        }

        const updated = await DeleteProductAsync(uid, updatedBy);
        if (!updated) {
            return res.status(400).json(HttpResponse(null, ["Não foi possível remover o produto ou o registro não existe."])).end();
        }

        return res.status(200).end();

    } catch (error) {
        console.error("[Product - deleteProduct] Ocorreu um erro ao remover o cadastro", error);
        return res.sendStatus(400).end();
    }
}