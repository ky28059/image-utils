import express from 'express';
import cors from 'cors';

// Utils
import { getAllPhotos } from './lib/files';
import { BASE_PATH, OUT_PATH } from './config';


;(async () => {
    const app = express();
    app.use(cors())

    const dirs = await getAllPhotos();
    const dirMap = Object.fromEntries(dirs.map(({ name, files }) => [name, files]));
    const dirInfo = dirs.map(({ name, files }) => ({ name, size: files.length })); // TODO?

    app.get('/info', async (req, res) => {
        res.json(dirInfo);
    });
    app.get('/info/:id', async (req, res) => {
        try {
            res.json(dirMap[req.params.id]);
        } catch {
            res.status(400).json({ error: 'Directory not found.' });
        }
    })

    // Serve all "raw photos" as-is from the base directory, as well as the processed, optimized
    // web-friendly photos from `/out`.
    app.use(express.static(BASE_PATH));
    app.use(express.static(OUT_PATH));

    app.listen(8000, () => {
        console.log('Server listening on port 8000')
    });
})();
