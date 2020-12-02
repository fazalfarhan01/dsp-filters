// Returns the equation with K and N values
function calculateUnsolvedEquation(k, order) {
    return `\\( P_{${k}} = \\pm e^{ \\frac {i(2 \\times ${k} \\space + \\space 1 \\space + \\space ${order})\\pi} {2 \\times ${order}} } \\)`;
}


function calculateSolvedEquation(k, order) {
    var numerator = parseFloat((((2 * k) + 1 + order) * Math.PI).toFixed(2));
    var denominator = 2 * order;

    realPart = math.round(math.cos(numerator / denominator), 3);
    imaginaryPart = math.round(math.sin(numerator / denominator), 3);

    pole = math.complex(realPart, imaginaryPart);

    return `\\(P_{${k}} = \\pm e^{ \\frac {${numerator} \\space i} {${denominator}} }\
        = \\pm (${pole.toString()}) \\)`;
}


function returnNumbers(k, order) {
    var numerator = parseFloat((((2 * k) + 1 + order) * Math.PI).toFixed(2));
    var denominator = 2 * order;

    realPart = (math.cos(numerator / denominator));
    imaginaryPart = (math.sin(numerator / denominator));

    pole = math.complex(realPart, imaginaryPart);

    return pole;
}

function deduceEquation(a, b, order) {

    // if order is even
    if (order % 2 == 0) {
        var firstTerm = math.round(2 * a, 3);
        var secondTerm = math.round(2 * b, 3);
        return (String.raw `S^{2} + ${firstTerm}S + 1`);
    }

}


function eliminateConjugate(rootsArray) {
    var splicedArray = rootsArray.splice(0, Math.ceil(rootsArray.length / 2))
    for (let index = 0; index < splicedArray.length; index++) {
        let element = splicedArray[index];
        element["re"] = math.abs(element["re"])
    }
    return splicedArray;
}

function getFinalNormalised(simplifiedEquations) {
    return String.raw `\( H(S) = \frac {1} {(${simplifiedEquations.join(" )( ")})} \)`;
}

function designNormalised() {
    var order = getOrder();
    var selectedOrder = Math.ceil(order);

    // Showing Main Formula
    document.getElementById("mainRootsFormula").innerHTML = `<p>${calculateUnsolvedEquation("K","N")}</p>`;

    // Showing Formula for each case
    var formula = "";
    for (let index = 0; index < selectedOrder; index++) {
        formula += `<p>${calculateUnsolvedEquation(index,selectedOrder)}</p>`
    }
    document.getElementById("normalisedFilterUnsolved").innerHTML = formula;

    // Stores Formula
    var formula = "";

    // Stores Roots
    roots = [];

    for (let index = 0; index < selectedOrder; index++) {
        formula += `<p>${calculateSolvedEquation(index,selectedOrder)}</p>`
        complexRoot = returnNumbers(index, selectedOrder);
        if (math.isNegative(complexRoot.re)) {
            roots.push(complexRoot);
        } else {
            roots.push(math.multiply(complexRoot, -1));
        }
    }
    document.getElementById("normalisedFilterSolved").innerHTML = formula;

    parsedRoots = [];
    var rootsRounded = math.round(roots, 3);
    for (let index = 0; index < rootsRounded.length; index++) {
        let equation = math.parse(`S + ${math.multiply(rootsRounded[index], -1).toString()}`).toString();
        parsedRoots.push(equation);
    }

    var equationFinal = `(${parsedRoots.join(")(")})`;

    document.getElementById("equations").innerHTML = String.raw `<p>\(H(S) = \frac {1} {${math.parse(equationFinal).toTex()}} \)</p>`;

    nonConjugateRoots = eliminateConjugate(roots);
    simplifiedEquation = []
    for (let index = 0; index < nonConjugateRoots.length; index++) {
        let element = nonConjugateRoots[index];
        simplifiedEquation.push(deduceEquation(math.round(element["re"], 3), math.round(element["im"], 3), selectedOrder));
    }

    var normallised = `<p>${getFinalNormalised(simplifiedEquation)}</p>`;
    document.getElementById("equations").innerHTML += normallised;
}