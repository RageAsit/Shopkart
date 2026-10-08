import mongoose from 'mongoose';

// Snapshot sub-schema for order items preserving product state at purchase time
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
            alias: 'productId',
        },
        name: {
            type: String,
            required: [true, 'Product name snapshot is required'],
            alias: 'productName',
        },
        price: {
            type: Number,
            required: [true, 'Product price snapshot is required'],
            min: [0, 'Price snapshot cannot be negative'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity cannot be less than 1'],
            default: 1,
        },
        image: {
            type: String,
            required: false,
            default: '',
        },
    },
    { _id: true }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'User reference is required'],
            alias: 'customer',
        },
        items: {
            type: [orderItemSchema],
            required: [true, 'Order items are required'],
            validate: {
                validator: function (items) {
                    return Array.isArray(items) && items.length > 0;
                },
                message: 'Order must contain at least one item',
            },
            alias: 'orderItems',
        },
        shippingAddress: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Shipping address is required'],
            alias: 'address',
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total amount cannot be negative'],
            alias: 'total',
        },
        status: {
            type: String,
            enum: {
                values: [
                    'Pending',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                    'PLACED',
                    'Placed',
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled',
                    'placed',
                ],
                message: '{VALUE} is not a valid order status',
            },
            default: 'Pending',
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'PAID', 'Failed', 'pending', 'paid', 'failed'],
            default: 'Pending',
        },
        razorpayOrderId: {
            type: String,
            default: null,
        },
        razorpayPaymentId: {
            type: String,
            default: null,
        },
        razorpaySignature: {
            type: String,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtuals for flexible access
orderSchema.virtual('userId')
    .get(function () {
        return this.user;
    })
    .set(function (value) {
        this.user = value;
    });

orderSchema.virtual('customerId')
    .get(function () {
        return this.user;
    })
    .set(function (value) {
        this.user = value;
    });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export { Order };
export default Order;
