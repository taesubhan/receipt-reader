import { Router } from 'express';
import multer from 'multer';
import readReceipt from '../controllers/receiptReader.js';

const sizeLimitMB: number = 5 //in Megabytes
const receiptRouter = Router();
// const storage = multer.diskStorage({
//     // Defines the location and filename of the photo that the user uploads
//     destination: (req, file, cb) => {
//         cb(null, './dist/images/receipts');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// })
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * sizeLimitMB
    }
});

receiptRouter.post('/upload', upload.single('avatar'), async (req, res) => { 
    // name in upload.single('name') needs to match with front-end name attribute
    const buffer = req.file?.buffer;
    if (!buffer) {
        throw new Error('No image file received in server');
    }

    const receipt = await readReceipt(buffer);
    let items = [];
    for (const { valueObject: item } of (receipt.fields.Items && receipt.fields.Items.valueArray) || []) {
        items.push({
            menuItem: item?.Description.valueString || item?.Description.content,
            pricePerQuantity: item?.Price?.valueCurrency.amount,
            quantity: item?.Quantity.valueNumber || item?.Quantity.content,
            totalPrice: item?.TotalPrice?.valueCurrency.amount
        })
    }

    const receiptJSON = {
        merchantName: receipt.fields?.MerchantName?.valueString || receipt.fields?.MerchantName?.content,
        items: items,
        total: receipt.fields?.Total?.valueCurrency.amount,
        subtotal: receipt.fields?.Subtotal?.valueCurrency.amount,
        tax: receipt.fields?.TotalTax?.valueCurrency.amount,
        transactionDate: receipt.fields?.TransactionDate.valueDate,
        transactionTime: receipt.fields?.TransactionTime.valueTime
    }
    console.log('upload triggered!');
    // console.log(receipt.fields);
    res.send(receiptJSON);
})

// Consider moving to error module later
// receiptRouter.use((err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).send(`File size is too large. Max size is ${sizeLimitMB}MB`);
//         }

//         return res.status(400).send(`Multer error: ${err.message}`);
//     }
//     next(err);
// })


export default receiptRouter;