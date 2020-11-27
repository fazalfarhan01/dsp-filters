$(document).ready(function () {
    $("#contactForm").submit(function () {
        alert("Your Request has been submitted successfully.\nWe will contact you shortly.\n\nThank you..!");
        // clearContactForm();
    });
});

function clearContactForm() {
    document.getElementById("contactForm").reset();
}