const inputArea = document.getElementById('input');
const outputArea = document.getElementById('output');
const slider = document.getElementById('multiplier');
const label = document.getElementById('multiplier-label');
const logicNote = document.getElementById('logic-note');

// Educational Data: Standard weight for 1 cup of common items
const CONVERSIONS = {
    flour: 125,
    sugar: 200,
    butter: 227,
    milk: 240,
    water: 240
};

function processRecipe() {
    const factor = parseFloat(slider.value);
    label.innerText = factor + 'x';
    
    // Update the logic note for the user
    if(factor > 1) logicNote.innerText = `Scaling UP: Multiplying by ${factor}`;
    else if(factor < 1) logicNote.innerText = `Scaling DOWN: Dividing by ${1/factor}`;
    else logicNote.innerText = "Original Recipe Scale";

    const text = inputArea.value;
    const lines = text.split('\n');
    let htmlOutput = '';

    lines.forEach(line => {
        if (line.trim() === "") return;

        // Find numbers and scale them
        let scaledLine = line.replace(/(\d+(\.\d+)?)/g, (match) => {
            const newNum = (parseFloat(match) * factor);
            // Round to 2 decimal places, but remove trailing zeros
            return `<span class="math-highlight">${Number(newNum.toFixed(2))}</span>`;
        });

        // TEACHING LOGIC: Check for cups to grams conversion
        let hint = "";
        const lowerLine = line.toLowerCase();
        
        for (const [item, weight] of Object.entries(CONVERSIONS)) {
            if (lowerLine.includes('cup') && lowerLine.includes(item)) {
                // Find the number of cups in this specific line
                const cupMatch = line.match(/(\d+(\.\d+)?)/);
                if (cupMatch) {
                    const totalGrams = Math.round(parseFloat(cupMatch[0]) * factor * weight);
                    hint = `<span class="conversion-hint">💡 Logic: ${item} is heavy! That's about ${totalGrams}g.</span>`;
                }
            }
        }

        htmlOutput += `<div class="ingredient-line">${scaledLine}${hint}</div>`;
    });

    outputArea.innerHTML = htmlOutput || "Start typing your recipe to see the math...";
}

inputArea.addEventListener('input', processRecipe);
slider.addEventListener('input', processRecipe);