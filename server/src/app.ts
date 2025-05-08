import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { rootRouter } from "./routes/rootRouter";
import morgan from "morgan";
dotenv.config();

const app=express();


app.use(cors());
app.use(morgan('dev'));
//to test the website in production
app.get('/test',(_req,res)=>{
    res.status(200).send("Application is running! Healthy: healthy");
})

app.use(express.json());

//Route handling
app.use("/api/v1", rootRouter);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
});

// import express from 'express';
// import { rootRouter } from './routes/rootRouter';

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// app.use("/api/v1", rootRouter);
// const PORT = 8080;
// app.listen(PORT, () => {
//   console.log(`Test server running on port ${PORT}`);
// });