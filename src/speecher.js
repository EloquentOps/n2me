let recognition
let paused = false
let isError = false

const messages = []


export const buildSpeecher = ({lang, keepActive = true}) => {
    
    recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = lang
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
        console.log('onresult')
        const res = event.results[0]
        const a = res[0]
        const msg = a.transcript.trim()
        
        if(res.isFinal) {
            messages.push(msg)
        }
    }

    recognition.onstart = function() { 
        isError = false
    }

    recognition.onerror = function(event) { 

        if(event.error === 'no-speech' && keepActive){

        }else{
            isError = true
        }
    }
    recognition.onend = function() { 
        if(isError) return
        if(keepActive && !paused) startSpeecher()
    }

}

export const startSpeecher = () => {
    paused = false
    recognition.start()
}

export const stopSpeecher = () => {
    paused = true
    recognition.stop()
    return messages
}
