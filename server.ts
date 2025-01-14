import express from 'express';
import { BASE_PATH } from './config';


const server = express();

// Serve all "raw photos" as-is from the base directory, as well as the processed, optimized
// web-friendly photos from `/out`.
server.use(express.static(BASE_PATH));
server.use(express.static(__dirname + '/out'));

server.listen(3000, () => {
    console.log('Server listening on port 3000')
});
