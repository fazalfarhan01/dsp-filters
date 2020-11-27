function grabDataForMail() {
    var contactFormData = Array.from(document.querySelectorAll("#contactForm input")).reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {});
    contactFormData.message = Array.from(document.querySelectorAll("#contactForm textarea")).reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {}).message;
    sendEmail(contactFormData.name, contactFormData.email, contactFormData.message);
    // sendEmail(contactFormData.name, contactFormData.email, contactFormData.message);
    // console.log(contactFormData);
    // var name = document.querySelector("#name").value;
    // var email = document.querySelector("#email").value;
    // var message = document.querySelector("#message").value;
    // sendEmail(name,email,message)

}
function sendEmail(name, email, message) {
    console.log($(message))
    Email.send({
        Host: "smtp-relay.sendinblue.com",
        Username: "fazal.farhan@gmail.com",
        Password: "GET IT FROM SENDINBLUE",
        To: 'fazal.farhan@gmail.com',
        From: "administrator@dspfilters.fazals.ml",
        Subject: `You have a new mail from ${name}`,
        Body: `Name: ${name}
        E-Mail: ${email}
        Message: ${message}`
    }).then(alert("We have received your request.\nWe will contact you shortly."));
}

$(document).ready(function () {
    $("#contactForm").submit(function () {
        alert("Your Request has been submitted successfully.\nWe will contact you shortly.\n\nThank you..!");
    });
});

function clearContactForm() {
    document.getElementById("contactForm").reset();
}