import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router';
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json());
app.use('/static', express.static('static'))
app.use(fileUpload());

const server = http.createServer(app);
const port = process.env.PORT ?? "8080"
server.listen(port, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}/`);
});

// connection to database here

app.use('/', router());