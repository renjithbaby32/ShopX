import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import fileupload from 'express-fileupload';
import connectDB from './config/db.js';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import bodyparser from 'body-parser';
import morgan from 'morgan';
import shortid from 'shortid';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import Razorpay from 'razorpay';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Order from './models/orderModel.js';

const app = express();
app.use(
  compression({
    level: 6,
    threshold: 100 * 100,
  })
);

dotenv.config();

connectDB();

app.use(express.json({ limit: '50mb' }));

//setting up cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getOrder = async (id) => {
  const data = Order.findById(id).populate('user', 'name email');
  return data;
};

app.post('/razorpay/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  const payment_capture = 1;
  const amount = 500;
  const currency = 'INR';

  const options = {
    amount: order.totalPrice * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/razorpay/success/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json('success');
});

app.use('/api/products', fileupload());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/offer', offerRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/coupon', couponRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
app.use(bodyparser.urlencoded({ extended: true }));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
