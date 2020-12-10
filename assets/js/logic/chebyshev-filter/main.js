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
    document.getElementById("frequencyType").value = "rads";
    document.getElementById("passBandFrequency").value = omegaP;
    document.getElementById("stopBandFrequency").value = omegaS;
    document.getElementById("analogOmegaP").innerHTML = String.raw `<p>\( \Omega_{p} = ${omegaP} \space rad/s \)</p>`;
    document.getElementById("analogOmegaS").innerHTML = String.raw `<p>\( \Omega_{s} = ${omegaS} \space rad/s \)</p>`;
    document.getElementById("analogDomain").style.display = "flex";

    MathJax.typeset();
}

// STEP 1 IMPLEMENTATION END