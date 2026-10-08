import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())

app.use(cookieParser())

app.use(cors(
        {
            origin: ["http://localhost:5173", "https://shop-kart-blond.vercel.app"],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        }
))

mongoose.connect(process.env.dbUrl)
    .then(() => {
        console.log('Db Connected')
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/customers/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/customers/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/customers/orders', orderRoutes)

app.get('/', (req, res) => {
    res.send('ShopKart Server Running')
})

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})