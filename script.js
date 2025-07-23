// script.js
let inputField = document.getElementById("input");
let historyList = document.getElementById("history-list");
let mode = "DEG";

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key >= '0' && key <= '9') || ["+", "-", "*", "/", ".", "(", ")"].includes(key)) {
        insert(key);
    } else if (key === "Enter") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearInput();
    } else if (key === "^") {
        insert('^');
    }
});

// DEG/RAD toggle
document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", () => {
        mode = document.querySelector('input[name="mode"]:checked').value;
    });
});

function insert(value) {
    if (value === "pi") value = "π";
    if (value === "e") value = Math.E;
    inputField.value += value;
}

function clearInput() {
    inputField.value = "";
}

function deleteLast() {
    inputField.value = inputField.value.slice(0, -1);
}

function calculate() {
    let expr = inputField.value;

    try {
        let processed = expr
            .replace(/\^/g, "**")
            .replace(/sin\(/g, `Math.sin(`)
            .replace(/cos\(/g, `Math.cos(`)
            .replace(/tan\(/g, `Math.tan(`)
            .replace(/log\(/g, `Math.log10(`)
            .replace(/ln\(/g, `Math.log(`)
            .replace(/sqrt\(/g, `Math.sqrt(`)
            .replace(/π/g, `Math.PI`);

        if (mode === "DEG") {
            processed = processed.replace(/Math\.(sin|cos|tan)\((.*?)\)/g, (match, fn, val) => {
                return `Math.${fn}(((${val}) * Math.PI) / 180)`;
            });
        }

        let result = eval(processed);
        historyList.innerHTML += `<li>${expr} = ${result}</li>`;
        inputField.value = result;
    } catch (err) {
        inputField.value = "Error";
    }
}

function clearHistory() {
    historyList.innerHTML = "";
}
