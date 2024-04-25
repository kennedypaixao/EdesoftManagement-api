import express from 'express';

import { login, register, update } from '../controllers/account';

export default (router: express.Router) => {
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.put('/user/update/:uid', update)
}