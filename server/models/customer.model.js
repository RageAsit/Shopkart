import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
                alias: 'productId'
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity cannot be less than 1'],
                default: 1
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Customer = mongoose.model('Customer', customerSchema)
export const User = Customer
export default Customer