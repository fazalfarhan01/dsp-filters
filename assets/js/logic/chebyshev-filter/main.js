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
        variables.sigma[`sigma${index}`] = math.round(-math.sinh((1 / variables.selectedOrder) * math.asinh(1 / variables.epsilon)) * math.sin(((2 * index - 1) / (2 * variables.selectedOrder)) * math.PI), 3);
        variables.omega[`omega${index}`] = math.round(math.cosh((1 / variables.selectedOrder) * math.asinh(1 / variables.epsilon)) * math.cos(((2 * index - 1) / (2 * variables.selectedOrder)) * math.PI), 3);
    }
    return variables;
}

// Function to find K
function findK(variables) {
    // If Odd
    variables.b0 = 1;
    for (let index = 1; index <= math.ceil(variables.selectedOrder / 2); index++) {
        if (variables.omega[`omega${index}`] != 0) {
            variables.b0 = variables.b0 * (math.pow(variables.sigma[`sigma${index}`], 2) + math.pow(variables.omega[`omega${index}`], 2));
        } else {
            variables.b0 = variables.b0 * (math.abs(variables.sigma[`sigma${index}`]));
        }
    }
    if (variables.selectedOrder % 2 == 1) {
        variables.k = math.round(variables.b0, 3);
    } else {
        variables.k = math.round(variables.b0 / math.sqrt(1 + math.pow(variables.epsilon, 2)), 3);
    }
    variables.b0 = math.round(variables.b0, 3);
    return variables;
}

function getAndProcessParameters() {
    vars = getVars();
    vars = convertToDecibles(vars);
    vars = normalliseSpecifications(vars);
    vars = findEpsilonAndOrder(vars);
    vars = findRoots(vars);
    vars = findK(vars);
}

// function to display given values
function displayGiven() {
    var passBandParameters = String.raw `<p>\( A_{p} = ${vars.minPassBandGain} \space db\)</p>
    <p>\( \Omega_{p} = ${vars.passBandFrequency} \space rad/s \)</p>`;
    var stopBandParameters = String.raw `<p>\( A_{s} = ${vars.maxStopBandGain} \space db\)</p>
    <p>\( \Omega_{s} = ${vars.stopBandFrequency} \space rad/s \)</p>`;

    document.getElementById("passBandParameters").innerHTML = passBandParameters;
    document.getElementById("stopBandParameters").innerHTML = stopBandParameters;
}

// function to display normallised frequencies
function displayNormallisedCutoffs() {
    var normallisedOmegaP = String.raw `<p>\( \Omega_{p}^{'} = \frac {\Omega_{p}}{\Omega_{p}} \)</p>
    <p>\( \Omega_{p}^{'} = \frac {${vars.passBandFrequency}}{${vars.passBandFrequency}} = ${vars.normPassBandFrequency} \space rad/s\)</p>`;
    var normallisedOmegaS = String.raw `<p>\( \Omega_{s}^{'} = \frac {\Omega_{s}}{\Omega_{p}} \)</p>
    <p>\( \Omega_{s}^{'} = \frac {${vars.stopBandFrequency}}{${vars.passBandFrequency}} = ${vars.normStopBandFrequency} \space rad/s\)</p>`;

    document.getElementById("normallisedOmegaP").innerHTML = normallisedOmegaP;
    document.getElementById("normallisedOmegaS").innerHTML = normallisedOmegaS;
}

// Function to show ripple factor
function displayRippleFactor() {
    var epsilonWithFormula = String.raw `<p>\( \varepsilon = \sqrt { 10^{ 0.1 \times ${vars.minPassBandGain} } -1} \)<p>
    <p>\( \varepsilon = ${vars.epsilon} \)</p>`;
    document.getElementById("epsilonWithFormula").innerHTML = epsilonWithFormula;
}

// Function to display order => N
function displayOrder() {
    var orderWithFormula = String.raw `<p>\(N = \frac {${vars.minPassBandGain} - 20 log_{10}(${vars.epsilon})+6} {6+20log_{10}(${vars.normStopBandFrequency})} \)</p>`;
    var order = String.raw `<p> \( N = ${vars.order} \space \space N = ${vars.selectedOrder}\) </p>`
    document.getElementById("orderFormulaWithValues").innerHTML = orderWithFormula;
    document.getElementById("finalOrder").innerHTML = order;
}

// Funuction to display roots from order
function displayRootsWithoutValues() {
    rootsList = [];
    for (let index = 1; index <= vars.selectedOrder; index++) {
        rootsList.push(`S-S_{${index}}`);
    }

    rootsBasedOnOrder = String.raw `<p>\( H_{1}(s) = \frac { K } { (${rootsList.join(" )( ")}) } \)</p>
    <p>\( S_{k} = \sigma_{k} + \Omega_{k} \)<p>`;

    document.getElementById("rootsBasedOnOrder").innerHTML = rootsBasedOnOrder;
}

// Function to show sigma and omega formula
function displaySigmaKAndOmegaK() {
    var sigmaKFormula = String.raw `<p> \(  \sigma_{k} = -Sinh[ \frac {1}{N} Sinh^{-1}( \frac {1} {\varepsilon} ) ] \times Sin(\frac { 2K-1 } {2N} \pi) \) </p>`
    var omegaKFormula = String.raw `<p> \(  \Omega_{k} = Cosh[ \frac {1}{N} Sinh^{-1}( \frac {1} {\varepsilon} ) ] \times Cos(\frac { 2K-1 } {2N} \pi) \) </p>`
    document.getElementById("sigmaKFormula").innerHTML = sigmaKFormula;
    document.getElementById("omegaKFormula").innerHTML = omegaKFormula;
}

// Function to show sigmas and omegas
function displaySigmasAndOmegas() {
    var sigmas = [];
    var omegas = [];

    for (let index = 1; index <= vars.selectedOrder; index++) {
        sigmas.push(String.raw `\sigma_{${index}} = ${vars.sigma[`sigma${index}`]}`);
        omegas.push(String.raw `\Omega_{${index}} = ${vars.omega[`omega${index}`]}`);
    }

    var sigmaString = String.raw `<p> \( ${sigmas.join("\\) </p><p> \\(")} \) </p>`;
    var omegaString = String.raw `<p> \( ${omegas.join("\\) </p><p> \\(")} \) </p>`;

    document.getElementById("sigmas").innerHTML = sigmaString;
    document.getElementById("omegas").innerHTML = omegaString;
}

// Function to display final normallised equation
function displayNormallisedEquation() {
    function deduceEquation(a, b, order, index) {
        // console.log(a, b);
        // if order is even
        if ((order % 2 == 0) || (index < Math.floor(order / 2))) {
            var firstTerm = math.round(2 * a, 3);
            var secondTerm = math.round(math.pow(a,2) + math.pow(b,2), 3);
            if (math.round(firstTerm, 2) == 1) {
                firstTerm = 1;
            }
            return (String.raw `S^{2} + ${firstTerm}S + ${secondTerm}`);
        } else {
            var firstTerm = math.round(a, 3);
            return (String.raw `S + ${firstTerm}`);
        }
    
    }
    rootsToDisplay = []
    for (let index = 1; index <= math.ceil(vars.selectedOrder/2); index++) {
        rootsToDisplay.push(deduceEquation(-vars.sigma[`sigma${index}`], -vars.omega[`omega${index}`], vars.selectedOrder, index-1));
    }
    document.getElementById("finalH1s").innerHTML = String.raw `<p>\( H_{1}(S) = \frac {K}{(${rootsToDisplay.join(")(")})} \)</p>`
}

// Function to display value of K
function displayK() {
    if (vars.selectedOrder%2 == 1) {
        // If Odd
        var kFormula = String.raw `<p>\( K = b_{0} = ${vars.k}\)</p>`
    }else{
        // If Even
        var kFormula = String.raw `<p>\( K = \frac {b_{0}} {\sqrt { 1 + \varepsilon^{2} } } = \frac {${vars.b0}} {\sqrt { 1 + ${vars.epsilon}^{2} } }\)</p>
        <p>\( K = ${vars.k} \)</p>`
    }


    document.getElementById("kFormula").innerHTML = kFormula;
}



// Function to check errors in form
function checkFormValidity() {
    return document.getElementById("filterDesignerForm").checkValidity();
}

// Showing Results div
function displayResults() {
    document.getElementById("results").style.display = "block";
    displayGiven();
    displayNormallisedCutoffs();
    displayRippleFactor();
    displayOrder();
    displayRootsWithoutValues();
    displaySigmaKAndOmegaK();
    displaySigmasAndOmegas();
    displayNormallisedEquation();
    displayK();
}

// Debug mode
function debug() {
    document.getElementById("gainType").value = "decibles"; // decibles or direct
    document.getElementById("minPassBandGain").value = "2.5"
    document.getElementById("maxStopBandGain").value = "30"
    document.getElementById("passBandFrequency").value = "20"
    document.getElementById("stopBandFrequency").value = "50"
    document.getElementById("filterType").value = "lp"
}

function designchebyshev() {

    // Debug mode for easier debugging
    // debug(); // Comment out in production

    // All Calculations are done from this function]
    if (checkFormValidity()) {
        getAndProcessParameters();
        displayResults();

        MathJax.typeset();
    }
}

function clearResults() {;
}