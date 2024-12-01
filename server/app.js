import dot from 'dotenv'
dot.config();
import 'express-async-errors';

//express
import express from 'express';
const app = express();

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import fs from 'fs'
const jsonString = fs.readFileSync('./public/openapi.json', 'utf-8');
const swaggerDocument = JSON.parse(jsonString);
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean'
import cors from 'cors'
import ExpressMongoSanitize from 'express-mongo-sanitize';



//database
import { connectDB } from './db/connect.js';

//routers 
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import orderRouter from './routes/orderRoutes.js'



//middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

app.set('trust proxy',1)
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(ExpressMongoSanitize()) 

app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'))

app.use(fileUpload())


app.get('/api/v1',(req, res)=>{
    console.log(req.signedCookies);
    
    res.send('Hello World')

})
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)
const port = process.env.PORT || 5000
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening at ${port}`));
        
    } catch (error) {
        console.log(error);
        
    }
}
start();