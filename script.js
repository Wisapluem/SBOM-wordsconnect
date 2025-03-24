const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "th-TH";
recognition.interimResults = true;
recognition.continuous = true;

let isListening = false;
let finalText = ""; // เก็บข้อความสุดท้าย
let lastSpokenText = ""; // เก็บข้อความสุดท้ายเพื่อกันซ้ำ
let interimText = ""; // ข้อความชั่วคราว

function startListening() {
    if (!isListening) {
        isListening = true;
        recognition.start();
    }
}

function stopListening() {
    isListening = false;
    recognition.stop();
}

function clearText() {
    finalText = "";
    lastSpokenText = "";
    interimText = "";
    document.getElementById("outputText").innerHTML = "";
}

recognition.onresult = function(event) {
    let lastResult = event.results[event.results.length - 1];
    let newText = lastResult[0].transcript.trim();

    if (lastResult.isFinal) {
        if (newText !== lastSpokenText) {
            finalText += (finalText ? " / " : "") + newText;
            lastSpokenText = newText; // เก็บค่าล่าสุดเพื่อตรวจสอบซ้ำ
        }
        interimText = "";
    } else {
        interimText = newText;
    }

    document.getElementById("outputText").innerHTML = finalText + 
        (interimText ? ` <span class="interim">${interimText}</span>` : "");

    restartRecognition();
};

function restartRecognition() {
    recognition.stop();
    setTimeout(() => {
        if (isListening) recognition.start();
    }, 100); // ลดเวลาหยุด-เริ่มใหม่
}

recognition.onend = function() {
    if (isListening) {
        recognition.start();
    }
};
