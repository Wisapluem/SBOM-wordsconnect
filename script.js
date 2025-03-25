const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "th-TH";
recognition.interimResults = true;
recognition.continuous = true;

let isListening = false;
let lastSpokenText = ""; // ⭐ ป้องกันคำซ้ำ
let interimText = ""; // ⭐ ข้อความชั่วคราว
let userText = ""; // ⭐ เก็บข้อความที่ผู้ใช้พิมพ์เอง

const outputTextDiv = document.getElementById("outputText");

// ⭐ ตรวจจับการพิมพ์ของผู้ใช้ (บันทึกข้อความที่พิมพ์เอง)
outputTextDiv.addEventListener("input", () => {
    userText = outputTextDiv.innerText; // เก็บข้อความล่าสุดที่ผู้ใช้พิมพ์เอง
});

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
    outputTextDiv.innerHTML = "";
    lastSpokenText = "";
    interimText = "";
    userText = "";
}

recognition.onresult = function(event) {
    let lastResult = event.results[event.results.length - 1];
    let newText = lastResult[0].transcript.trim();

    if (lastResult.isFinal) {
        if (newText !== lastSpokenText) {
            userText += (userText ? " / " : "") + newText;
            lastSpokenText = newText;
        }
        interimText = "";
    } else {
        interimText = newText;
    }

    // ⭐ รวมข้อความที่พิมพ์เอง + ข้อความจากเสียง
    outputTextDiv.innerHTML = userText + 
        (interimText ? ` <span class="interim">${interimText}</span>` : "");

    restartRecognition();
};

function restartRecognition() {
    recognition.stop();
    setTimeout(() => {
        if (isListening) recognition.start();
    }, 100);
}

recognition.onend = function() {
    if (isListening) {
        recognition.start();
    }
};
