import { Router } from 'express';


const wordsRouter = Router();

wordsRouter.get('/', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

export default wordsRouter;
