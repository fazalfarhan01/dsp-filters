function startCalculations() {

    // Check Form Validity
    var valid = document.getElementById("filterDesignerForm").checkValidity()

    if (!valid) {
        // Show Alert To The User
        alert("Please Enter Valid Options..!");
    } else {
        // Grab Form Values
        var variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});

        // Show Results
        document.getElementById("filterCalculations").style.display = "block";

        // Take Absolute Values of Gains
        variablesFromForm.minPassBandGain = math.abs(variablesFromForm.minPassBandGain);
        variablesFromForm.maxStopBandGain = math.abs(variablesFromForm.maxStopBandGain);

        // Changing Values on screen
        document.getElementById("minPassBandGain").value = variablesFromForm.minPassBandGain;
        document.getElementById("maxStopBandGain").value = variablesFromForm.maxStopBandGain;

        if (variablesFromForm.passBandFrequency > variablesFromForm.stopBandFrequency) {
            let temp = variablesFromForm.passBandFrequency;
            variablesFromForm.passBandFrequency = variablesFromForm.stopBandFrequency;
            variablesFromForm.stopBandFrequency = temp;
            document.getElementById("passBandFrequency").value = variablesFromForm.passBandFrequency;
            document.getElementById("stopBandFrequency").value = variablesFromForm.stopBandFrequency;
        }

        // Convert to Rad/Sec
        if (document.getElementById("frequencyType").value == "hz") {
            variablesFromForm.passBandFrequency = parseFloat((variablesFromForm.passBandFrequency * Math.PI * 2).toFixed(2));
            variablesFromForm.stopBandFrequency = parseFloat((variablesFromForm.stopBandFrequency * Math.PI * 2).toFixed(2));;
        }

        // Formula
        // \(N\geq\frac{\log_{10}[\frac{\frac{1}{A_{s}^{2}}}-1{\frac{1}{A_{p}^{2}}}-1]}{2\times\log_{10}\frac{\Omega_{s}}{\Omega _{p}}}\)

        // Display The Values
        document.getElementById("display_minPassBandGain").innerText = `\\(A_{p}: ${variablesFromForm.minPassBandGain}\\)`;
        document.getElementById("display_maxStopBandGain").innerText = `\\(A_{s}: ${variablesFromForm.maxStopBandGain}\\)`;
        document.getElementById("display_passBandFrequency").innerText = `\\(\\Omega_{p} : ${variablesFromForm.passBandFrequency} rad/s\\)`;
        document.getElementById("display_stopBandFrequency").innerText = `\\(\\Omega_{s} : ${variablesFromForm.stopBandFrequency} rad/s\\)`;

        // Show Values in the Formula
        var normalFormula = `\\(N\\geq\\frac{\\log_{10}[\\frac{\\frac{1}{${variablesFromForm.maxStopBandGain}^{2}}}-1{\\frac{1}{${variablesFromForm.minPassBandGain}^{2}}}-1]}{2\\times\\log_{10}\\frac{${variablesFromForm.stopBandFrequency}}{${variablesFromForm.passBandFrequency}}}\\)`;
        var decibleFormula = `\\(N \\geq \\frac{\\log_{10} [ \\frac{10^{0.1 \\times ${variablesFromForm.maxStopBandGain}}}-1{10^{0.1 \\times ${variablesFromForm.minPassBandGain}}}-1]}{2 \\times \\log_{10} \\frac{${variablesFromForm.stopBandFrequency}}{${variablesFromForm.passBandFrequency}}}\\)`;

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

        // Show Order
        var order = math.abs(getOrder());
        selectedOrder = Math.ceil(order);
        document.getElementById("nonRoundedOrder").innerText = `\\(N\\geq ${parseFloat(order.toFixed(4))}\\)`;
        document.getElementById("roundedOrder").innerText = `\\(N = ${selectedOrder}\\)`;

        // Calculate and Show The Cutoffs
        if (document.getElementById("gainType").value == "decibles") {

            // Show Cutoff Formula for decibles
            omegaCp = parseFloat((cutoffFreqForDecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, selectedOrder)).toFixed(3));
            document.getElementById("passBandCutoff").innerHTML = `<p>\\(\\Omega_{cp} =  \\frac{\\Omega_{p}}{(10^{0.1A_{p}})-1^\\frac{1}{2N}}\\)</p>
            <p>\\(\\Omega_{cp} =  \\frac{${variablesFromForm.passBandFrequency}}{(10^{0.1 \\times ${variablesFromForm.minPassBandGain}})-1^\\frac{1}{2 \\times ${selectedOrder}} }\\)</p>
            <p>\\(\\Omega_{cp} = ${omegaCp}\\)</p>`;

            omegaCs = parseFloat((cutoffFreqForDecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, selectedOrder)).toFixed(3));
            document.getElementById("stopBandCutoff").innerHTML = `<p>\\(\\Omega_{cs} =  \\frac{\\Omega_{s}}{(10^{0.1A_{s}})-1^\\frac{1}{2N}}\\)</p>
            <p>\\(\\Omega_{cs} =  \\frac{${variablesFromForm.stopBandFrequency}}{(10^{0.1 \\times ${variablesFromForm.maxStopBandGain}})-1^\\frac{1}{2 \\times ${selectedOrder}} }\\)</p>
            <p>\\(\\Omega_{cs} = ${omegaCs}\\)</p>`;
        } else {

            // Show Cutoff Formula for Normal Calculations
            omegaCp = parseFloat((cutoffFreqForNonDecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, selectedOrder)).toFixed(3))
            document.getElementById("passBandCutoff").innerHTML = `<p>\\(\\Omega_{cp} =  \\frac {\\Omega_{p}}{(\\frac{1}{A_{p}^{2}}-1)^{\\frac{1}{2N}}}\\)</p>
            <p>\\(\\Omega_{cp} =  \\frac {${variablesFromForm.passBandFrequency}}{(\\frac{1}{${variablesFromForm.minPassBandGain}^{2}}-1)^{\\frac{1}{2\\times ${selectedOrder}}}}\\)</p>
            <p>\\(\\Omega_{cp} = ${omegaCp}\\)</p>`;

            omegaCs = parseFloat((cutoffFreqForNonDecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, selectedOrder)).toFixed(3))
            document.getElementById("stopBandCutoff").innerHTML = `<p>\\(\\Omega_{cs} =  \\frac {\\Omega_{s}}{(\\frac{1}{A_{s}^{2}}-1)^{\\frac{1}{2N}}}\\)</p>
            <p>\\(\\Omega_{cs} =  \\frac {${variablesFromForm.stopBandFrequency}}{(\\frac{1}{${variablesFromForm.maxStopBandGain}^{2}}-1)^{\\frac{1}{2\\times ${selectedOrder}}}}\\)</p>
            <p>\\(\\Omega_{cs} = ${omegaCs}\\)</p>`;
        }
        document.getElementById("finalFilterCutoff1").innerHTML = `<p>\\( \\Omega_{c} = \\frac {\\Omega_{cp} + \\Omega_{cs}} {2}\\)</p>`;
        document.getElementById("finalFilterCutoff2").innerHTML = `<p>\\(=\\frac {${omegaCp} + ${omegaCs}} {2} \\)</p>`;
        omegaC = (omegaCs + omegaCp) / 2;
        document.getElementById("finalFilterCutoff3").innerHTML = `<p>\\(=${omegaC}rad/s\\)</p>`;

        designNormalised();

        // Convert To MathJax Form
        MathJax.typeset();
    }

}

function getCutoff() {
    var variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
    // console.log(variablesFromForm);

    if (document.getElementById("frequencyType").value == "hz") {
        variablesFromForm.passBandFrequency = variablesFromForm.passBandFrequency * Math.PI * 2;
        variablesFromForm.stopBandFrequency = variablesFromForm.stopBandFrequency * Math.PI * 2;
    }

    // console.log(variablesFromForm);
    // console.log(getOrder());
    if (document.getElementById("gainType").value == "decibles") {
        // console.log("Triggered decibels")
        var frequency1 = cutoffFreqForDecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, Math.ceil(getOrder()));
        var frequency2 = cutoffFreqForDecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, Math.ceil(getOrder()));
    } else {
        // console.log("Triggered Normal")
        var frequency1 = cutoffFreqForNonDecibles(variablesFromForm.minPassBandGain, variablesFromForm.passBandFrequency, Math.ceil(getOrder()));
        var frequency2 = cutoffFreqForNonDecibles(variablesFromForm.maxStopBandGain, variablesFromForm.stopBandFrequency, Math.ceil(getOrder()));
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


function cutoffFreqForNonDecibles(Gain, freq, _filteOrderN) {
    numerator = freq;
    denominator = Math.pow((1 / Math.pow(Gain, 2) - 1), 1 / (2 * _filteOrderN));
    return (numerator / denominator);
}

function cutoffFreqForDecibles(Gain, freq, _filteOrderN) {
    numerator = freq;
    denominator = Math.pow((Math.pow(10, 0.1 * Gain) - 1), 1 / (2 * _filteOrderN));
    return (numerator / denominator);
}

function orderFromNonDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((1 / (Math.pow(maxStopBandGain, 2)) - 1) / (1 / (Math.pow(minPassBandGain, 2)) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return (numerator / denominator);
}

function orderFromDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((Math.pow(10, 0.1 * maxStopBandGain) - 1) / (Math.pow(10, 0.1 * minPassBandGain) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return (numerator / denominator);
}

function showResult(newLine) {
    resultContainer = document.getElementById("filterResults");
    resultContainer.style.display = "block";
    newLine = newLine + "\n";
    resultContainer.innerText = resultContainer.innerText + newLine;
}

function clearResults() {
    resultContainer = document.getElementById("filterCalculations");
    // resultContainer.innerHTML = "";
    resultContainer.style.display = "none";
}