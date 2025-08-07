// api/webhook.js

const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const userQuery = req.body.queryResult?.queryText || "Hello";

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant who answers in Telugu and English, depending on the user's input. Be friendly and clear.",
        },
        {
          role: "user",
          content: userQuery
        }
      ]
    });

    const reply = completion.data.choices[0].message.content;

    res.json({
      fulfillmentText: reply
    });
  } catch (error) {
    console.error(error);
    res.json({
      fulfillmentText: "Sorry, I couldn't respond due to an error."
    });
  }
};
