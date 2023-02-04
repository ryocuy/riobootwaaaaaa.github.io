const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const ChatAIHandler = async (text, msg) => {

    const cmd = text.split('/');

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *#ask/PERTANYAAN*');
    }

    msg.reply('sedang diproses, tunggu bentar ya.');

    const question = cmd[1];
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply('Terjadi Kesalahan.');
    }

    return msg.reply(response.data);
}
// api key open ai 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
// api key 2 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
const ChatGPTRequest = async (question) => {

    const result = {
        success: false,
        data: "Aku gak tau",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 1000,
            temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${API_KEY_OPEN_AI}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {

                const { choices } = response.data;

                if (choices && choices.length) {
                    result.success = true;
                    result.data = choices[0].text || "SAYA TIDAK TAHU";
                }

            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ChatAIHandler
}