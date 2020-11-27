$(document).ready(function () {
    $("#contactForm").submit(function () {
        alert("Your Request has been submitted successfully.\nWe will contact you shortly.\n\nThank you..!");
        // clearContactForm();
        setTimeout(function(){
            console.log("Clearing Form");
            clearContactForm();
        }, 2000);
    });
});

// Similat Workaround
// function showSubmitAlert() {
//     alert("Your Request has been submitted successfully.\nWe will contact you shortly.\n\nThank you..!");
//     setTimeout(function () {
//         console.log("Clearing Form");
//         clearContactForm();
//     }, 2000);
// }

function clearContactForm() {
    document.getElementById("contactForm").reset();
}