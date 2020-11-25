
function getCutoff() {
    var variablesFromForm = Array.from(document.querySelectorAll("#findOrderFrom input")).reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {});
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
    resultContainer = document.getElementById("resultOrder");
    resultContainer.style.display = "block";
    if (document.getElementById("frequencyType").value == "hz") {
        resultContainer.innerText = "CUTOFF FEQUENCY IN hz IS: " + cutofffrequency;
    }
    else {
        resultContainer.innerText = "CUTOFF FEQUENCY In rad/sec IS: " + cutofffrequency;
    }

}


function getOrder() {
    var variablesFromForm = Array.from(document.querySelectorAll("#findOrderFrom input")).reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {});
    if (document.getElementById("frequencyType").value == "hz") {
        variablesFromForm.passBandFrequency = variablesFromForm.passBandFrequency * Math.PI * 2;
        variablesFromForm.stopBandFrequency = variablesFromForm.stopBandFrequency * Math.PI * 2;
    }

    if (document.getElementById("gainType").value == "decibles") {
        var order = orderFromDecibles(variablesFromForm.minPassBandGain, variablesFromForm.maxStopBandGain, variablesFromForm.passBandFrequency, variablesFromForm.stopBandFrequency);
    } else {
        var order = orderFromNonDecibles(variablesFromForm.minPassBandGain, variablesFromForm.maxStopBandGain, variablesFromForm.passBandFrequency, variablesFromForm.stopBandFrequency);
    }

    resultContainer = document.getElementById("resultOrder");
    resultContainer.style.display = "block";
    resultContainer.innerText = "ORDER OF THE FILTER IS: " + order;
    return order;
}


function cutofffreqfornodecibles(Gain, freq, _filteOrderN) {
    numerator = freq;
    denominator = Math.pow((1/Math.pow(Gain, 2) - 1), 1 / (2 * _filteOrderN));
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