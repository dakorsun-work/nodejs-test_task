import { Router } from 'express';
import { countWords } from './controller';


const wordsRouter = Router();

wordsRouter.get('/', countWords);

export default wordsRouter;
