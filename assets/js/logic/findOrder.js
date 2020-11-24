// Parameters format
// minPassBandGain => Ap
// maxStopBandGain => As
// passBandFreq => Ωp - in rad/s
// stopBandFreq => Ωs - in rad/s

// ###############################################################
// Sample
// ###############################################################

// var minPassBandGain = 0.8;
// var maxStopBandGain = 0.2;
// var passBandFreq = 1000 * 2 * Math.PI;
// var stopBandFreq = 5000 * 2 * Math.PI;

// console.log(Math.ceil(findOrder(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq)));

// ###############################################################


function findOrder(minPassBandGain, maxStopBandGain, passBandFreq, stopBandFreq) {
    var numerator = Math.log10((1 / (Math.pow(maxStopBandGain, 2)) - 1) / (1 / (Math.pow(minPassBandGain, 2)) - 1));
    var denominator = 2 * Math.log10(stopBandFreq / passBandFreq);
    return Math.ceil(numerator / denominator);
}