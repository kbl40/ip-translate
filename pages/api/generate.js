import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const basePromptPrefix = `Provide a summary of US Patent Number `;

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 250,
    })

    const basePromptOutput = baseCompletion.data.choices.pop()

    // build the second prompt that feeds in the summary output from prompt 1

    const secondPrompt = `
        List five to ten commercialization ideas for the technology described in US Patent Number ${req.body.userInput}. It was described as ${basePromptOutput.text}.
    `

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.8,
        max_tokens: 1000,
    })

    const secondPromptOutput = secondPromptCompletion.data.choices.pop()

    res.status(200).json({ output: secondPromptOutput })
}

export default generateAction