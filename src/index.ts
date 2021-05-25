import express from 'express';
import { responseBuilder } from './common/response-builder';
import authorizeUser from './service/authorize-service';
const app = express()
const port = 3000

app.use(express.json())

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });


const basicAuthHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader: any = req.headers['authorization'];
  try {
    authorizeUser(authHeader);
  } catch(err) {
    // User should not see the cause of the error, it should be for internal use only
    console.error("Error raised with the cause: ", err.message);
    responseBuilder(err, res);
  }
  
  next()
}

app.get('/basic-auth', basicAuthHandler, (req: express.Request, res: express.Response) => {
  res.status(200).end();
})

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})