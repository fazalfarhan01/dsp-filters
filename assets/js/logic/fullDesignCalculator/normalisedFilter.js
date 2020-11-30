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

    realPart = math.round(math.cos(numerator / denominator), 3);
    imaginaryPart = math.round(math.sin(numerator / denominator), 3);

    pole = math.complex(realPart, imaginaryPart);

    return pole;
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
    for (let index = 0; index < roots.length; index++) {
        equation = math.parse(`S + ${math.multiply(roots[index], -1).toString()}`).toString();
        parsedRoots.push(equation);
    }

    equationFinal = `(${parsedRoots.join(")(")})`;

    document.getElementById("equations").innerHTML = String.raw `<p>\(H(s) = \frac {1} {${math.parse(equationFinal).toTex()}} \)</p>`;

}