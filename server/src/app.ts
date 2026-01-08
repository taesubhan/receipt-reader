import dotenv from 'dotenv/config';
import cors from 'cors';
import express from 'express';

import receiptRouter from './routes/receiptRouter.js';

const app = express();
app.use(express.json());

app.use('/api/receipt', receiptRouter);

app.use('/', (req, res) => {
    res.send('Completed!! Received in catch all')
});



const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
})
