import express from 'express';

import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product';

export default (router: express.Router) => {
    router.get('/product/list', getProducts)
    router.get('/product/:id', getProduct)
    router.post('/product/add', addProduct)
    router.put('/product/update/:uid', updateProduct)
    router.delete('/product/delete/:uid', deleteProduct)
}