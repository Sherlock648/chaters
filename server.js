const express = require('express');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

app.options('/openai-request', cors());
app.post('/openai-request', async (req, res) => {
  try {
    const apiKey = 'your_API';
    const apiUrl = 'https://api.openai.com/v1/assistants';

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
    };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
