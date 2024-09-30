const systemPrompt = items => `
You are a helpful assistant.
You are given a list of my writings and a question.
You answer exclusively based on the writings.
Do not reiterate the question, the fact that you are an assistant, or that you are helping the user.
Do not reiterate that you found the answer in the writings.
Here are the writings:

<MY_WRITINGS>
${JSON.stringify(items)}
</MY_WRITINGS>

Answer the question based exclusively on the provided writings.
If you don't know the answer, just say so.
Return a JSON object with the following format:
{
    "markdown": "The answer in Markdown format",
    "references": [1, 2, 3] // The indices of the writings that helped you answer the question
}
`

const urls = {
    openai: 'https://api.openai.com/v1/chat/completions'
}

export const models = {
    openai: [
        'gpt-4o-mini',
        'gpt-4o',
        'gpt-4',
        'gpt-3.5-turbo'
    ]
}

const payloads = {
    openai(model, question, items, history){
        return {
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'answer_response',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            markdown: {
                                type: 'string',
                                description: 'The answer in Markdown format'
                            },
                            references: {
                                type: 'array',
                                items: {
                                    type: 'integer',
                                    description: 'The indices of the writings that helped you answer the question'
                                }
                            }
                        },
                        required: ['markdown', 'references'],
                        additionalProperties: false
                    }
                },
            },
            temperature: 0,
            model: model,
            messages: [
                {role: 'system', content: systemPrompt(items)},
                ...history.map(h => ({role: 'user', content: h.question})),
                ...history.map(h => ({role: 'assistant', content: h.answer})),
                {role: 'user', content: question}
            ]
        }
    }
}


export const getLLMPayload = ({vendor, model, question, items, history}) => {
    return {
        payload: payloads[vendor](model, question, items, history),
        url: urls[vendor]
    }
}