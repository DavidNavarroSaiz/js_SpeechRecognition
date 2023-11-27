const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speech_key = process.env.AZURE_SPEECH_KEY;
const speech_region = process.env.AZURE_SPEECH_REGION;
const speechConfig = sdk.SpeechConfig.fromSubscription(speech_key, speech_region);
speechConfig.speechRecognitionLanguage = "en-US";

function fromFile() {
    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("./microphone-results_2.wav"));
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    speechRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
        speechRecognizer.close();
    });
}
fromFile();