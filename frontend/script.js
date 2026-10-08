
const homeScreen = document.getElementById("homeScreen");
const processingScreen = document.getElementById("processingScreen");
const successScreen = document.getElementById("successScreen");
const errorScreen = document.getElementById("errorScreen");

const scanQrBtn = document.getElementById("scanQrBtn");
const uploadBtn = document.getElementById("uploadBtn");

const imageInput = document.getElementById("imageInput");

const scanAnotherBtn = document.getElementById("scanAnotherBtn");

const successBackBtn = document.getElementById("successBackBtn");
const errorBackBtn = document.getElementById("errorBackBtn");

const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");

const screens = [
    homeScreen,
    processingScreen,
    successScreen,
    errorScreen
];


// ================= SCREEN CONTROL =================

function showScreen(screen) {

    screens.forEach((item) => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}


// ================= ERROR CONTROL =================

function showError(title, message) {

    errorTitle.textContent = title;

    errorMessage.textContent = message;

    showScreen(errorScreen);
}


// ================= PROCESSING =================

function startProcessing(source) {

    showScreen(processingScreen);

    /*
        Temporary mock behavior.

        Later:

        QR  → actual QR scanner
        IMG → actual OCR system
    */

    setTimeout(() => {

        // Temporary demo:
        // Both currently show success.

        showScreen(successScreen);

    }, 1800);
}


// ================= SCAN QR =================

scanQrBtn.addEventListener("click", () => {

    /*
        Actual QR camera scanning will be added later.

        For now it only demonstrates
        the processing → success flow.
    */

    startProcessing("qr");

});


// ================= UPLOAD IMAGE =================

uploadBtn.addEventListener("click", () => {

    imageInput.click();

});


imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }


    // Check whether selected file is an image

    if (!file.type.startsWith("image/")) {

        showError(
            "Invalid Image",
            "Please upload a valid package image."
        );

        return;
    }


    // Start processing

    startProcessing("image");

});


// ================= SCAN ANOTHER =================

scanAnotherBtn.addEventListener("click", () => {

    imageInput.value = "";

    showScreen(homeScreen);

});


// ================= SUCCESS → HOME =================

successBackBtn.addEventListener("click", () => {

    imageInput.value = "";

    showScreen(homeScreen);

});


// ================= ERROR → HOME =================

errorBackBtn.addEventListener("click", () => {

    imageInput.value = "";

    showScreen(homeScreen);

});

