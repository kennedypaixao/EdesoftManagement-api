import express from 'express';
import account from './account';
import product from './product';

const router = express.Router();

export default (): express.Router => {
    account(router);
    product(router);
    return router;
}