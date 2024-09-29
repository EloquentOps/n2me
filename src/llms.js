const systemPrompt = `
You are a helpful assistant.
`

const urls = {
    openai: 'https://api.openai.com/v1/chat/completions'
}

const payloads = {
    openai(question){
        return {
            model: 'gpt-4o-mini',
            messages: [
                {role: 'system', content: systemPrompt},
                {role: 'user', content: question}
            ]
        }
    }
}


export const getLLMPayload = ({vendor, question}) => {
    return {
        payload: payloads[vendor](question),
        url: urls[vendor]
    }
}