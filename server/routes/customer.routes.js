import express from 'express'
import {
    registerCustomer,
    loginCustomer,
    getMyProfile,
    logOutCustomer,
    changePassword
} from '../controllers/customer.controller.js'

import { authMiddleware } from '../middlewares/auth.middleware.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registerCustomer)
customerRoutes.post('/login', loginCustomer)
customerRoutes.get('/me', authMiddleware, getMyProfile)
customerRoutes.post('/logout',logOutCustomer)
customerRoutes.patch('/change-password', changePassword)

export default customerRoutes