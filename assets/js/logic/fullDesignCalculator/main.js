function startCalculations() {
    // Grab Form Values
    var variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});

    // Show Results
    document.getElementById("filterCalculations").style.display = "block";

    // Convert to Rad/Sec
    if (document.getElementById("frequencyType").value == "hz") {
        variablesFromForm.passBandFrequency = parseFloat((variablesFromForm.passBandFrequency * Math.PI * 2).toFixed(2));
        variablesFromForm.stopBandFrequency = parseFloat((variablesFromForm.stopBandFrequency * Math.PI * 2).toFixed(2));;
    }

    // Formula
    // \(N\geq\frac{\log_{10}[\frac{\frac{1}{A_{s}^{2}}-1}{\frac{1}{A_{p}^{2}}-1}]}{2\times\log_{10}\frac{\Omega_{s}}{\Omega _{p}}}\)

    // Display The Values
    document.getElementById("display_minPassBandGain").innerText = `\\(A_{p}: ${variablesFromForm.minPassBandGain}\\)`;
    document.getElementById("display_maxStopBandGain").innerText = `\\(A_{s}: ${variablesFromForm.maxStopBandGain}\\)`;
    document.getElementById("display_passBandFrequency").innerText = `\\(\\Omega_{p} : ${variablesFromForm.passBandFrequency} rad/s\\)`;
    document.getElementById("display_stopBandFrequency").innerText = `\\(\\Omega_{s} : ${variablesFromForm.stopBandFrequency} rad/s\\)`;

    // Show Values in the Formula
    var normalFormula = `\\(N\\geq\\frac{\\log_{10}[\\frac{\\frac{1}{${variablesFromForm.maxStopBandGain}^{2}}-1}{\\frac{1}{${variablesFromForm.minPassBandGain}^{2}}-1}]}{2\\times\\log_{10}\\frac{${variablesFromForm.stopBandFrequency}}{${variablesFromForm.passBandFrequency}}}\\)`;
    var decibleFormula = `\\(N \\geq \\frac{\\log_{10} [ \\frac{10^{0.1 \\times ${variablesFromForm.maxStopBandGain}}-1}{10^{0.1 \\times ${variablesFromForm.minPassBandGain}}-1}]}{2 \\times \\log_{10} \\frac{${variablesFromForm.stopBandFrequency}}{${variablesFromForm.passBandFrequency}}}\\)`;

    // Display Formulas Based On Gain Type
    if (document.getElementById("gainType").value == "decibles") {
        document.getElementById("orderFormulaDecible").style.display = "block";
        document.getElementById("orderFormulaNormal").style.display = "none";
        document.getElementById("orderFormulaWithValues").innerText = decibleFormula;
    } else {
        document.getElementById("orderFormulaNormal").style.display = "block";
        document.getElementById("orderFormulaDecible").style.display = "none";
        document.getElementById("orderFormulaWithValues").innerText = normalFormula;
    }
    MathJax.typeset();

}

function getCutoff() {
    var variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
    // console.log(variablesFromForm);

    if (document.getElementById("frequencyType").value == "hz") {
        variablesFromForm.passBandFrequency = variablesFromForm.passBandFrequency * Math.PI * 2;
        variablesFromForm.stopBandFrequency = variablesFromForm.stopBandFrequency * Math.PI * 2;
    }

    console.log(variablesFromForm);
    console.log(getOrder());
    if (document.getElementById("gainType").value == "decibles") {
        console.log("Triggered decibels")
        var frequency1 = cutofffreqfordecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, getOrder());
        var frequency2 = cutofffreqfordecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, getOrder());
    } else {
        console.log("Triggered Normal")
        var frequency1 = cutofffreqfornodecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, getOrder());
        var frequency2 = cutofffreqfornodecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, getOrder());
    }
    cutofffrequency = (frequency1 + frequency2) / 2;
    return cutofffrequency;
}


function getOrder() {
    var variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
    if (document.getElementById("frequencyType").value == "hz") {
        variablesFromForm.passBandFrequency = variablesFromForm.passBandFrequency * Math.PI * 2;
        variablesFromForm.stopBandFrequency = variablesFromForm.stopBandFrequency * Math.PI * 2;
    }

    if (document.getElementById("gainType").value == "decibles") {
        var order = orderFromDecibles(variablesFromForm.minPassBandGain, variablesFromForm.maxStopBandGain, variablesFromForm.passBandFrequency, variablesFromForm.stopBandFrequency);
    } else {
        var order = orderFromNonDecibles(variablesFromForm.minPassBandGain, variablesFromForm.maxStopBandGain, variablesFromForm.passBandFrequency, variablesFromForm.stopBandFrequency);
    }
    return order;
}


function cutofffreqfornodecibles(Gain, freq, _filteOrderN) {
    numerator = freq;
    denominator = Math.pow((1 / Math.pow(Gain, 2) - 1), 1 / (2 * _filteOrderN));
    return (numerator / denominator);
}

function cutofffreqfordecibles(Gain, freq, _filteOrderN) {
    numerator = freq;
    denominator = Math.pow((Math.pow(10, 0.1 * Gain) - 1), 1 / (2 * _filteOrderN));
    return (numerator / denominator);
}

function orderFromNonDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((1 / (Math.pow(maxStopBandGain, 2)) - 1) / (1 / (Math.pow(minPassBandGain, 2)) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return Math.ceil(numerator / denominator);
}

function orderFromDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((Math.pow(10, 0.1 * maxStopBandGain) - 1) / (Math.pow(10, 0.1 * minPassBandGain) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return Math.ceil(numerator / denominator);
}

function showResult(newLine) {
    resultContainer = document.getElementById("filterResults");
    resultContainer.style.display = "block";
    newLine = newLine + "\n";
    resultContainer.innerText = resultContainer.innerText + newLine;
}

function clearResults() {
    resultContainer = document.getElementById("filterResults");
    resultContainer.innerText = "";
    resultContainer.style.display = "none";
}