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
}

function orderFromNonDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((1 / (Math.pow(maxStopBandGain, 2)) - 1) / (1 / (Math.pow(minPassBandGain, 2)) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return Math.ceil(numerator / denominator);
}

function orderFromDecibles(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((Math.pow(10, 0.1 * maxStopBandGain) - 1)/(Math.pow(10, 0.1 * minPassBandGain) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return Math.ceil(numerator / denominator);
}