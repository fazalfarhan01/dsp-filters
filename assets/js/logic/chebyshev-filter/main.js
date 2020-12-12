// THIS FILE IS LOADED IN CHEBYSHEV-FILTER ONLY

// STEPS TO FOLLOW
/*
        1. CONVERT FROM DIGITAL TO ANALOG DOMAIN (ONLY IF NEEDED).  ✓
        2. CONVERT GAIN TO DECIBLES AND FREQUENCIES TO RAD/SEC.
        3. NORMALISING THE FREQUENCIES.
        4. FINDING EPSILON.
        5. FINDING ORDER. (N)
        6. FIND ROOTS AND H1(S).
        7. FINDING K.
        8. FREQUENCY TRANSFORMATIONS.
        9. ANALOG TO DIGITAL DOMAIN.
*/

// STEP 1 IMPLEMENTATION START

// Adding Event Listener to filterConvertionType => ON CHANGE if IIT time = 1; if BLT time = 2
document.getElementById("filterConvertionType").addEventListener("change", function() {
    let filterConvertionType = document.getElementById("filterConvertionType").value;
    if (filterConvertionType == "IIT") {
        document.getElementById("time").value = 1;
    } else if (filterConvertionType == "BLT") {
        document.getElementById("time").value = 2;
    }
});

// Adding Event Listener for Submit Button Press
document.getElementById("digital2AnalogSubmitButton").addEventListener("click", function() {
    if (document.getElementById("digitalToAnalogConverter").checkValidity()) {
        // IF FORM IS VALID, CONVERT TO ANALOG DOMAIN
        convertToAnalogDomain();
    }
});

// Function to convert Digital Domain parameters to Analog domain
function convertToAnalogDomain() {

    // GRABBING REQUIRED VALUES
    var digitalToAnalogFormValues = Array.from(document.querySelectorAll("#digitalToAnalogConverter input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
    filterConvertionType = document.getElementById("filterConvertionType").value;

    digitalToAnalogFormValues.digitalOmegaP = math.evaluate(digitalToAnalogFormValues.digitalOmegaP);
    digitalToAnalogFormValues.digitalOmegaS = math.evaluate(digitalToAnalogFormValues.digitalOmegaS);

    if (filterConvertionType == "IIT") {
        // IF FILTER CONVERSION TYPE IN IIT
        var omegaP = digitalToAnalogFormValues.digitalOmegaP / digitalToAnalogFormValues.time;
        var omegaS = digitalToAnalogFormValues.digitalOmegaS / digitalToAnalogFormValues.time;
    } else if (filterConvertionType == "BLT") {
        // IF FILTER CONVERSION TYPE IN BLT
        var omegaP = 2 / digitalToAnalogFormValues.time * Math.tan(digitalToAnalogFormValues.digitalOmegaP / 2);
        var omegaS = 2 / digitalToAnalogFormValues.time * Math.tan(digitalToAnalogFormValues.digitalOmegaS / 2);
    }

    // ROUNDING OFF TO 3 DECIMAL PLACES
    omegaP = math.round(omegaP, 3);
    omegaS = math.round(omegaS, 3);

    // CHANGING UI ELEMENTS
    // document.getElementById("frequencyType").value = "rads";
    document.getElementById("passBandFrequency").value = omegaP;
    document.getElementById("stopBandFrequency").value = omegaS;
    document.getElementById("analogOmegaP").innerHTML = String.raw `<p>\( \Omega_{p} = ${omegaP} \space rad/s \)</p>`;
    document.getElementById("analogOmegaS").innerHTML = String.raw `<p>\( \Omega_{s} = ${omegaS} \space rad/s \)</p>`;
    document.getElementById("analogDomain").style.display = "flex";

    MathJax.typeset();
}

// STEP 1 IMPLEMENTATION END

// STEP 2 IMPLEMENTATION START
function normalliseSpecifications(variables) {
    variables.normPassBandFrequency = math.round(variables.passBandFrequency / variables.passBandFrequency, 3);
    variables.normStopBandFrequency = math.round(variables.stopBandFrequency / variables.passBandFrequency, 3);
    return variables;
}

// Function to get variables from form
function getVars() {
    let variablesFromForm = {};
    variablesFromForm = Array.from(document.querySelectorAll("#filterDesignerForm input")).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
    variablesFromForm["gainType"] = document.getElementById("gainType").value;

    variablesFromForm.minPassBandGain = math.abs(variablesFromForm.minPassBandGain);
    variablesFromForm.maxStopBandGain = math.abs(variablesFromForm.maxStopBandGain);

    if (variablesFromForm.passBandFrequency > variablesFromForm.stopBandFrequency) {
        let temp = variablesFromForm.passBandFrequency;
        variablesFromForm.passBandFrequency = variablesFromForm.stopBandFrequency;
        variablesFromForm.stopBandFrequency = temp;
    }

    document.getElementById("passBandFrequency").value = variablesFromForm.passBandFrequency;
    document.getElementById("stopBandFrequency").value = variablesFromForm.stopBandFrequency;
    document.getElementById("minPassBandGain").value = variablesFromForm.minPassBandGain;
    document.getElementById("maxStopBandGain").value = variablesFromForm.maxStopBandGain;

    return variablesFromForm;
}

// Function to convert to decibels if in direct form
function convertToDecibles(variables) {
    if (variables["gainType"] == "direct") {
        variables["minPassBandGain"] = math.round(-20 * math.log10(variables["minPassBandGain"]), 3);
        variables["maxStopBandGain"] = math.round(-20 * math.log10(variables["maxStopBandGain"]), 3);
    }
    return variables;
}

// Function to find epsilon
function findEpsilonAndOrder(variables) {
    variables.epsilon = math.round(math.sqrt(math.pow(10, 0.1 * variables.minPassBandGain) - 1), 3);
    variables.order = math.round((variables.maxStopBandGain - 20 * math.log10(variables.epsilon) + 6) / (6 + 20 * math.log10(variables.normStopBandFrequency)), 3);
    variables.selectedOrder = math.ceil(variables.order);
    return variables;
}


// Function to find roots
function findRoots(variables) {
    variables.sigma = {};
    variables.omega = {};
    for (let index = 1; index <= variables.selectedOrder; index++) {
        variables.sigma[`sigma${index}`] = -math.sinh((1 / variables.selectedOrder) * math.asinh(1 / variables.epsilon)) * math.sin(((2 * index - 1) / (2 * variables.selectedOrder)) * math.PI);
        variables.omega[`omega${index}`] = math.cosh((1 / variables.selectedOrder) * math.asinh(1 / variables.epsilon)) * math.cos(((2 * index - 1) / (2 * variables.selectedOrder)) * math.PI);
    }
    return variables;
}

// Function to find K
function findK(variables) {
    // If Odd
    variables.b0 = 1;
    for (let index = 1; index <= math.ceil(variables.selectedOrder / 2); index++) {
        variables.b0 = variables.b0 * (math.pow(variables.sigma[`sigma${index}`], 2) + math.pow(variables.omega[`omega${index}`], 2))
    }
    if (variables.selectedOrder % 2 == 1) {
        variables.k = variables.b0;
    } else {
        variables.k = variables.b0 / math.sqrt(1 + math.pow(variables.epsilon, 2));
    }
    return variables;
}


function designchebyshev() {
    vars = getVars();
    vars = convertToDecibles(vars);
    vars = normalliseSpecifications(vars);
    vars = findEpsilonAndOrder(vars);
    vars = findRoots(vars);
    vars = findK(vars);
    console.log(vars);
}

function clearResults() {;
}