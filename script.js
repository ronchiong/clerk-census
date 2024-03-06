document.querySelectorAll('.collapsible').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
});


document.getElementById('calculate').addEventListener('click', function() {
    const totalIntake = sumValues(document.getElementById('total-intake').value);
    const totalOutput = sumValues(document.getElementById('total-output').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const hours = parseInt(document.getElementById('hours').value, 10);
    const urineOutput = calculateUrineOutput(totalOutput, weight, hours);

    // Further modified line to also exclude "ml" from the FB line
    const output = `I&O: ${totalIntake} vs ${totalOutput}\nFB: ${totalIntake - totalOutput}\nUrine output of ${urineOutput}cc/kg/hr in ${hours} hours`;
    
    document.getElementById('output').innerText = output;
    
    copyToClipboard(output);
});

function sumValues(input) {
    return input.split(' ').reduce((total, value) => total + parseInt(value.replace('ml', ''), 10), 0);
}

function calculateUrineOutput(totalOutput, weight, hours) {
    return (totalOutput / weight / hours).toFixed(2);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Output copied to clipboard!');
    }, (err) => {
        console.error('Failed to copy: ', err);
    });
}


// document.getElementById('format-cbc').addEventListener('click', function() {
//     const cbcInput = document.getElementById('cbc-input').value;
//     const cbcOutput = formatCBC(cbcInput);
//     document.getElementById('cbc-output').innerText = cbcOutput;
//     copyToClipboard(cbcOutput);
// });

// function formatCBC(input) {
//     const lines = input.toUpperCase().split('\n');
//     let values = [];
//     let thrombocyteValue = ''; // To append at the end
//     let eosinophilValue = ''; // To handle Eosinophil specifically if needed

//     lines.forEach(line => {
//         const parts = line.split(' ');
//         const label = parts[0];
//         let value = parts.slice(1).join(' ');

//         // Simplify parsing by directly handling expected labels
//         switch (label) {
//             case 'HEMOGLOBIN':
//                 values.push(parts[1]);
//                 break;
//             case 'HEMATOCRIT':
//                 value = parseFloat(value) * 100;
//                 if (!isNaN(value)) values.push(Math.round(value).toString());
//                 break;
//             case 'WHITE':
//                 values.push(parts[3]); // Assuming WHITE BLOOD CELL
//                 break;
//             case 'NEUTROPHIL':
//                 value = parseFloat(parts[3]) * 100; // Adjusted to parts[3] if format is NEUTROPHIL (BLOOD) H
//                 if (!isNaN(value)) values.push(Math.round(value).toString());
//                 break;
//             case 'LYMPHOCYTE':
//                 value = parseFloat(parts[3]) * 100; // Adjusted to parts[3] if format is LYMPHOCYTE (BLOOD) L
//                 if (!isNaN(value)) values.push(Math.round(value).toString());
//                 break;
//             case 'MONOCYTE':
//                 value = parseFloat(parts[2]) * 100;
//                 if (!isNaN(value)) values.push(Math.round(value).toString());
//                 break;
//             case 'BAND':
//                 value = parseFloat(parts[1]) * 100;
//                 if (!isNaN(value)) values.push('B' + Math.round(value));
//                 break;
//             case 'EOSINOPHIL':
//                 eosinophilValue = Math.round(parseFloat(parts[1]) * 100).toString(); // To be added if specific handling is needed
//                 break;
//             case 'THROMBOCYTE':
//                 thrombocyteValue = parts[1]; // Capture separately
//                 break;
//         }
//     });

//     // Check and add Eosinophil value if it's processed separately
//     if (eosinophilValue !== '') {
//         values.push(eosinophilValue);
//     }

//     // Append THROMBOCYTE value at the end
//     if (thrombocyteValue !== '') {
//         values.push(thrombocyteValue);
//     }

//     const today = new Date();
//     const datePrefix = ` (${today.getDate()}) CBC:`;

//     const output = datePrefix + ' ' + values.join(' ');
//     document.getElementById('cbc-output').innerText = output;

//     // Copy to clipboard
//     navigator.clipboard.writeText(output).then(() => {
//         console.log('CBC output copied to clipboard.');
//     }, (err) => {
//         console.error('Failed to copy: ', err);
//     });
// }




// function copyToClipboard(text) {
//     navigator.clipboard.writeText(text).then(() => {
//         alert('CBC output copied to clipboard!');
//     }, (err) => {
//         console.error('Failed to copy: ', err);
//     });
// }


document.getElementById('calculate-ibw').addEventListener('click', function() {
    const gender = document.getElementById('gender').value;
    const age = parseFloat(document.getElementById('age').value);
    const currentWeight = parseFloat(document.getElementById('current-weight').value);
    const height = parseFloat(document.getElementById('height').value);
    let ibw;

    if (age < 1) { // Age in months
        ibw = (age * 12 + 9) / 2;
    } else if (age <= 6) {
        ibw = (age * 2) + 8;
    } else if (age <= 12) {
        ibw = ((age * 7) - 5) / 2;
    } else { // Over 12 years old
        if (gender === 'male') {
            ibw = ((height - 152.4) * 0.9) + 50;
        } else { // Female
            ibw = ((height - 152.4) * 0.9) + 45;
        }
    }

    const output = `${currentWeight} kg/ ${ibw.toFixed(2)} kg/ ${height} cm`;
    document.getElementById('ibw-output').innerText = output;

    // Copy to clipboard
    navigator.clipboard.writeText(output).then(() => {
        alert('IBW output copied to clipboard!');
    }, (err) => {
        console.error('Failed to copy: ', err);
    });
});

// Function to format Vital Signs and copy to clipboard
function formatVitalSigns() {
    const inputText = document.getElementById('vital-signs-input').value;
    const vitalSignsMap = {
        'Wt': /Wt\s*:\s*([\d.]+) kg/,
        'Ht': /Ht\s*:\s*([\d.]+) cm/,
        'BMI': /BMI\s*:\s*([\d.]+)/,
        'Sys': /Sys\s*:\s*([\d.]+) mmHg/,
        'Dia': /Dia\s*:\s*([\d.]+) mmHg/,
        'PR': /PR\s*:\s*([\d.]+) bpm/,
        'RR': /RR\s*:\s*([\d.]+) cpm/,
        'T': /T\s*:\s*([\d.]+) °C/,
        'SpO2': /SpO2\s*:\s*([\d.]+) %/,
    };

    let formattedVitalSigns = '';
    const vitalSignsOrder = ['Wt', 'Ht', 'BMI', 'Sys', 'Dia', 'PR', 'RR', 'T', 'SpO2'];

    vitalSignsOrder.forEach(sign => {
        const regex = vitalSignsMap[sign];
        const match = inputText.match(regex);
        if (match) {
            let value = match[1];
            // Check if the value is a whole number and format accordingly
            value = parseFloat(value);
            value = value % 1 === 0 ? value.toString() : value.toFixed(2);

            switch (sign) {
                case 'Wt':
                    formattedVitalSigns += `${value}kg `;
                    break;
                case 'Ht':
                    formattedVitalSigns += `${value}cm BMI `;
                    break;
                case 'BMI':
                    formattedVitalSigns += `${value}\nBP `;
                    break;
                case 'Sys':
                    formattedVitalSigns += `${value}/`;
                    break;
                case 'Dia':
                    formattedVitalSigns += `${value} `;
                    break;
                case 'PR':
                    formattedVitalSigns += `HR ${value} `;
                    break;
                case 'RR':
                    formattedVitalSigns += `RR ${value} `;
                    break;
                case 'T':
                    formattedVitalSigns += `Temp ${value}C `;
                    break;
                case 'SpO2':
                    formattedVitalSigns += `O2 ${value}% at room air`;
                    break;
            }
        }
    });

    document.getElementById('vital-signs-output').innerText = formattedVitalSigns;

    // Auto-copy formatted vital signs to clipboard
    navigator.clipboard.writeText(formattedVitalSigns).then(() => {
        console.log('Formatted vital signs copied to clipboard.');
    }, (err) => {
        console.error('Failed to copy formatted vital signs: ', err);
    });
}
