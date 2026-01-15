import dotenv from 'dotenv/config';
import cors from 'cors';
import express from 'express';

import receiptRouter from './routes/receiptRouter.js';

const app = express();
app.use(express.json()); // Allows backend to receive and read JSON data and comes in as JS object in req.body

const allowedOrigin = ['http://localhost:5173', 'https://taesh-price-calculator.netlify.app/']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
    // methods: ['GET','POST','PUT','DELETE'],
    // allowedHeaders: ['Content-Type','Authorization']
}))

app.use('/api/receipt', receiptRouter);

app.use('/', (req, res) => {
    res.send('Completed!! Received in catch all')
});



const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})
