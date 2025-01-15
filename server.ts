import express from 'express';
import cors from 'cors';

// Utils
import { getAllPhotos } from './lib/files';
import { BASE_PATH, OUT_PATH } from './config';


;(async () => {
    const app = express();
    app.use(cors())

    const dirs = await getAllPhotos();
    app.get('/info', async (req, res) => {
        res.json(dirs);
    });

    // Serve all "raw photos" as-is from the base directory, as well as the processed, optimized
    // web-friendly photos from `/out`.
    app.use(express.static(BASE_PATH));
    app.use(express.static(OUT_PATH));

    app.listen(8000, () => {
        console.log('Server listening on port 8000')
    });
})();
