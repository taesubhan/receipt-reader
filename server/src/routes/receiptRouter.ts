import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const sizeLimitMB: number = 5 //in Megabytes
const receiptRouter = Router();
const storage = multer.diskStorage({
    // Defines the location and filename of the photo that the user uploads
    destination: (req, file, cb) => {
        cb(null, './dist/images/receipts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * sizeLimitMB
    }
});

receiptRouter.post('/upload', upload.single('avatar'), (req, res) => { 
    // name in upload.single('name') needs to match with front-end name attribute
    console.log('upload triggered!');
    console.log(req.file);
    res.send(req.file);
    console.log('image received');
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