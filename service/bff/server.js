import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.all('/:recipient/*', async (req, res) => {
    const { recipient } = req.params;
    const recipientURL = process.env[recipient];

    if (!recipientURL) {
        return res.status(502).send('Cannot process request');
    }

    try {
        const response = await axios({
            ...req,
            url: req.url.replace(`/${recipient}`, recipientURL)
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});

app.listen(port, () => {
    console.log(`BFF Service listening at http://localhost:${port}`);
});
