function deNormallised() {
    let filterType = document.getElementById("filterType").value;
    switch (filterType) {
        case "lp":
            var numerator = math.parse((omegaC ** 2).toExponential(2)).toTex();
            break;
        case "hp":
            var numerator = math.parse(`S^2`).toTex();
            break;
        case "bp":
            break;
        default:
            break;
    }
    var denominator = getDenominator();

    var replacement = getReplacement();
    var deNormallisedEquation = getFinalDeNormalised(numerator, denominator);

    document.getElementById("deNormallised").innerHTML = replacement + deNormallisedEquation;
    // console.log(denominator)
}

function getDenominator() {
    simplifiedDeNormallisedEquation = []
    for (let index = 0; index < nonConjugateRoots.length; index++) {
        let element = nonConjugateRoots[index];
        simplifiedDeNormallisedEquation.push(deduceDenominator(math.round(element["re"], 3), math.round(element["im"], 3), selectedOrder, index, omegaC));
    }
    return simplifiedDeNormallisedEquation;
}

function deduceDenominator(a, b, order, index, cutoff) {

    // console.log(a, b);
    // if order is even
    let filterType = document.getElementById("filterType").value;
    let cutoffSquared = cutoff ** 2;
    switch (filterType) {
        // For LPF
        case "lp":
            if ((order % 2 == 0) || (index < Math.floor(order / 2))) {
                var firstTerm = (2 * a * cutoff).toExponential(2);
                var secondTerm = (cutoffSquared * (a ** 2 + b ** 2)).toExponential(2);
                return (math.parse(String.raw `S^2 + ${firstTerm} S + ${secondTerm}`).toTex());
            } else {
                var firstTerm = math.round(a, 3);
                return (math.parse(String.raw `${cutoff}S + ${(firstTerm * cutoff**2).toExponential(2)}`).toTex());
            }
            break;

            // For HPF
        case "hp":
            if ((order % 2 == 0) || (index < Math.floor(order / 2))) {
                var firstTerm = (a ** 2 + b ** 2).toExponential(2);
                var secondTerm = (2 * a * cutoff).toExponential(2);
                return (math.parse(String.raw `${firstTerm}S^2 + ${secondTerm} S + ${(cutoffSquared).toExponential(2)}`).toTex());
            } else {
                var firstTerm = math.round(a, 3);
                return (math.parse(String.raw `${cutoff}S + ${firstTerm}S^2`).toTex());
            }
            break;
        case "bp":
            break;
        default:
            break;
    }

}

function getFinalDeNormalised(numerator, denominator) {
    return String.raw `\( H(S) = \frac {${numerator}} {(${denominator.join(" )( ")})} \)`;
}

function getReplacement() {
    let filterType = document.getElementById("filterType").value;
    let replacementString = "";
    if (filterType == "lp") {
        replacementString = String.raw `<p>\( S \Rightarrow \frac {S}{\Omega_{c}} \)</p><p>\( S \Rightarrow \frac {S}{${math.round(omegaC,3)}} \)</p>`
    } else if (filterType == "hp") {
        replacementString = String.raw `<p>\( S \Rightarrow \frac {\Omega_{c}}{S} \)</p><p>\( S \Rightarrow \frac {${math.round(omegaC,3)}}{S} \)</p>`
    }
    return replacementString;
}