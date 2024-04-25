import express from 'express';
import { HttpResponse } from '../model/httpResponse';
import { GetProductByUIdAsync } from '../repository/productRepository';
import { GetOrderByUserUIdAsync, AddOrderAsync } from '../repository/OrderRepository';
import { GetUserByUIdAsync } from 'repository/userRepository';

export const getOrders = async (req: express.Request, res: express.Response) => {
    try {
        let { userUID, month, year } = req.params;

        if (!userUID) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o UID do usuário."])).end();
        }

        if (!month) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o mês."])).end();
        }

        if (!year) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o ano."])).end();
        }

        const orders = await GetOrderByUserUIdAsync(userUID, parseInt(month), parseInt(year));
        const user = await GetUserByUIdAsync(userUID);

        orders.forEach(async (element) => {
            (element as any).User = user;
            (element as any).Product = await GetProductByUIdAsync(element.ProductUID);
        });

        return res.status(200).json(HttpResponse(orders)).end();
    } catch (error) {
        console.error("[Order - getOrders] Ocorreu um erro ao realizar o login", error);
        return res.sendStatus(400).end();
    }
};

export const addOrders = async (req: express.Request, res: express.Response) => {
    try {

        let { userUID, products, createdBy } = req.body;

        if (products.length === 0) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar pelo menos um produto."])).end();
        }

        if (!userUID) {
            return res.status(400).json(HttpResponse(null, ["É preciso informar o usuário."])).end();
        }

        if (!createdBy) {
            createdBy = null;
        }

        products.forEach(async (p: any) => {
            await AddOrderAsync(userUID, p.UID, p.Quantity, createdBy);
        });
    
        return res.status(200).end();

    } catch (error) {
        console.error("[Order - addOrders] Ocorreu um erro ao realizar o cadastro", error);
        return res.sendStatus(400).end();
    }
}
