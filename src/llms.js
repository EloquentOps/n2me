const systemPrompt = items => `
You are a helpful assistant.
You are given a list of my writings and a question.
You answer exclusively based on the writings.
Here are the writings:

<MY_WRITINGS>
${JSON.stringify(items)}
</MY_WRITINGS>

Answer the question based exclusively on the provided writings.
If you don't know the answer, just say so.
`

const urls = {
    openai: 'https://api.openai.com/v1/chat/completions'
}

const payloads = {
    openai(question, items, history){
        return {
            model: 'gpt-4o-mini',
            messages: [
                {role: 'system', content: systemPrompt(items)},
                ...history.map(h => ({role: 'user', content: h.question})),
                ...history.map(h => ({role: 'assistant', content: h.answer})),
                {role: 'user', content: question}
            ]
        }
    }
}


export const getLLMPayload = ({vendor, question, items, history}) => {
    return {
        payload: payloads[vendor](question, items, history),
        url: urls[vendor]
    }
}