import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const basePromptPrefix = `Patent text: `;

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.patentSummary}`)

    // redo prompt
    const summaryPrompt = `${basePromptPrefix}${req.body.patentSummary}. Write a simple summary of this patent text and describes what makes the patent novel. Ignore the numbering of the words in the original patent text.`

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: summaryPrompt,
        temperature: 0.2,
        max_tokens: 1000,
    })

    // should be the same from here down.

    const summaryOutput = baseCompletion.data.choices.pop()

    const secondPrompt = `
        The patented technology was described as ${summaryOutput.text}. List five ideas for how the technology described in US Patent Number ${req.body.userInput} could be applied in an industry.
    `

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.2,
        max_tokens: 750,
    })

    const secondPromptOutput = secondPromptCompletion.data.choices.pop()

    const thirdPrompt = `
    ${secondPromptOutput.text}

    List some companies that operate in the technology sectors relevant to US Patent Number ${req.body.userInput}. Categorize the listed companies by small, medium, and large businesses. Provide some indication of why each of the listed companies would be a good fit for this patented technology. Include contact information for each company if it is available.
    `

    const thirdPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${thirdPrompt}`,
        temperature: 0.2, 
        max_tokens: 1000,
    })

    const thirdPromptOutput = thirdPromptCompletion.data.choices.pop()
    
    const totalOutput = `${summaryOutput.text}\n\nPotential Commercialization Areas:\n${secondPromptOutput.text}\n\nCompanies Operating in this Technology Sector:\n${thirdPromptOutput.text}`

    res.status(200).json({ output: totalOutput })
}

export default generateAction