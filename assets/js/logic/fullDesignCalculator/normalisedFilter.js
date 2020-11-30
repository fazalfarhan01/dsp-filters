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

    var formula = "";
    for (let index = 0; index < selectedOrder; index++) {
        formula += `<p>${calculateSolvedEquation(index,selectedOrder)}</p>`
    }
    document.getElementById("normalisedFilterSolved").innerHTML = formula;
}