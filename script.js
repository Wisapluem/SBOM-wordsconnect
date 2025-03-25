const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "th-TH";
recognition.interimResults = true;
recognition.continuous = true;

let isListening = false;
let lastSpokenText = "";
let interimText = "";
let userText = "";

const outputTextDiv = document.getElementById("outputText");

// ⭐ บันทึกตำแหน่งเคอร์เซอร์
function getCaretPosition(element) {
    let sel = window.getSelection();
    if (sel.rangeCount === 0) return 0;
    let range = sel.getRangeAt(0);
    let preRange = range.cloneRange();
    preRange.selectNodeContents(element);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
}

// ⭐ กำหนดตำแหน่งเคอร์เซอร์ใหม่
function setCaretPosition(element, position) {
    let range = document.createRange();
    let sel = window.getSelection();
    
    range.setStart(element.childNodes[0] || element, position);
    range.collapse(true);
    
    sel.removeAllRanges();
    sel.addRange(range);
}

// ⭐ ตรวจจับการพิมพ์ของผู้ใช้ (บันทึกข้อความที่พิมพ์เอง)
outputTextDiv.addEventListener("input", () => {
    userText = outputTextDiv.innerText;
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

    let caretPosition = getCaretPosition(outputTextDiv); // ⭐ เก็บตำแหน่งเคอร์เซอร์ก่อนอัปเดตข้อความ

    if (lastResult.isFinal) {
        if (newText !== lastSpokenText) {
            userText += (userText ? " / " : "") + newText;
            lastSpokenText = newText;
        }
        interimText = "";
    } else {
        interimText = newText;
    }

    outputTextDiv.innerHTML = userText + (interimText ? ` <span class="interim">${interimText}</span>` : "");

    setCaretPosition(outputTextDiv, caretPosition); // ⭐ คืนค่าตำแหน่งเคอร์เซอร์

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
