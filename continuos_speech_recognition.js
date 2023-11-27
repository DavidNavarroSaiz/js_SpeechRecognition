
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"

const speech_key = process.env.AZURE_SPEECH_KEY;
const speech_region = process.env.AZURE_SPEECH_REGION;
const speechConfig = sdk.SpeechConfig.fromSubscription(speech_key, speech_region);
speechConfig.speechRecognitionLanguage = "en-US";
const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
// speechConfig.speechRecognitionLanguage = "es-ES";

speechRecognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
};

speechRecognizer.recognized = (s, e) => {
    if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
    }
    else if (e.result.reason == sdk.ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be recognized.");
    }
};

speechRecognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == sdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log("CANCELED: Did you set the speech resource key and region values?");
    }

    speechRecognizer.stopContinuousRecognitionAsync();
};

speechRecognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    speechRecognizer.stopContinuousRecognitionAsync();
};



speechRecognizer.startContinuousRecognitionAsync();