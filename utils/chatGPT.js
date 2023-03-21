const axios = require('axios');

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/engines/davinci-codex/completions',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHAT_GPT}`,
    },
});

async function postToChatGPT (prompt) {
    const response = await openai.post('', {
        prompt: prompt,
        max_tokens: 100,
    });
    return response.data.choices[0].text;
}

module.exports = {postToChatGPT}


