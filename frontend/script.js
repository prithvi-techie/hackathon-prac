
const homeScreen = document.getElementById("homeScreen");
const qrScreen = document.getElementById("qrScreen");
const processingScreen = document.getElementById("processingScreen");
const successScreen = document.getElementById("successScreen");
const errorScreen = document.getElementById("errorScreen");

const scanQrBtn = document.getElementById("scanQrBtn");
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");

const qrBackBtn = document.getElementById("qrBackBtn");
const qrStatus = document.getElementById("qrStatus");

const scanAnotherBtn = document.getElementById("scanAnotherBtn");
const successBackBtn = document.getElementById("successBackBtn");
const errorBackBtn = document.getElementById("errorBackBtn");

const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");

const detailsContainer = document.getElementById("detailsContainer");
const processingMessage = document.getElementById("processingMessage");

const screens = [
    homeScreen,
    qrScreen,
    processingScreen,
    successScreen,
    errorScreen
];

let qrScanner = null;
let qrScannerRunning = false;
let qrScanCompleted = false;

function showScreen(screen) {
    screens.forEach((item) => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}

function showError(title, message) {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    showScreen(errorScreen);
}

const fieldLabels = {
    product_name: "Product Name",
    brand: "Brand",
    net_quantity: "Net Quantity",
    mrp: "MRP",
    batch_number: "Batch Number",
    manufacturing_date: "Manufacturing Date",
    best_before: "Best Before",
    manufacturer: "Manufacturer",
    fssai_license: "FSSAI License",
    customer_care: "Customer Care"
};

function renderPackageDetails(data) {
    detailsContainer.innerHTML = "";

    Object.entries(fieldLabels).forEach(([key, label]) => {
        const row = document.createElement("div");
        row.className = "detail-row";

        const labelElement = document.createElement("span");
        labelElement.textContent = label;

        const valueElement = document.createElement("strong");
        const value = data[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            valueElement.textContent = value;
        } else {
            valueElement.textContent = "Not found";
            valueElement.classList.add("not-found");
        }

        row.appendChild(labelElement);
        row.appendChild(valueElement);

        detailsContainer.appendChild(row);
    });
}

const demoData = {
    product_name: "Parle-G",
    brand: "Parle",
    net_quantity: "800 g",
    mrp: "₹80",
    batch_number: "ABC123",
    manufacturing_date: "08/2026",
    best_before: "6 months",
    manufacturer: "Parle Products Pvt. Ltd.",
    fssai_license: "10012011001234",
    customer_care: "1800-123-4567"
};

async function startQrScanner() {
    if (typeof Html5Qrcode === "undefined") {
        showError(
            "QR Scanner Unavailable",
            "QR scanner library could not be loaded. Check your internet connection."
        );
        return;
    }

    showScreen(qrScreen);

    qrStatus.textContent = "Requesting camera permission...";
    qrScanCompleted = false;

    try {
        qrScanner = new Html5Qrcode("qrReader");

        await qrScanner.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            async (decodedText) => {
                if (qrScanCompleted) {
                    return;
                }

                qrScanCompleted = true;

                qrStatus.textContent = "QR code detected.";

                console.log("QR Data:", decodedText);

                await stopQrScanner();

                startQrProcessing(decodedText);
            },
            () => {}
        );

        qrScannerRunning = true;

        qrStatus.textContent =
            "Point the camera at the QR code.";
    } catch (error) {
        console.error("QR Scanner Error:", error);

        qrScannerRunning = false;

        showError(
            "Camera Access Failed",
            "Allow camera permission and run the website on localhost or HTTPS."
        );
    }
}

async function stopQrScanner() {
    if (!qrScanner) {
        return;
    }

    try {
        if (qrScannerRunning) {
            await qrScanner.stop();
        }
    } catch (error) {
        console.error("Error stopping QR scanner:", error);
    }

    try {
        qrScanner.clear();
    } catch (error) {
        console.error("Error clearing QR scanner:", error);
    }

    qrScanner = null;
    qrScannerRunning = false;
}

function startQrProcessing(decodedText) {
    showScreen(processingScreen);

    processingMessage.textContent =
        "QR code detected. Reading package information...";

    console.log("Decoded QR Data:", decodedText);

    setTimeout(() => {
        processingMessage.textContent =
            "Extracting package information...";
    }, 700);

    setTimeout(() => {
        renderPackageDetails(demoData);
        showScreen(successScreen);
    }, 1800);
}

function startProcessing(file) {
    showScreen(processingScreen);

    processingMessage.textContent =
        "Reading package image...";

    setTimeout(() => {
        processingMessage.textContent =
            "Extracting package information...";
    }, 700);

    setTimeout(() => {
        renderPackageDetails(demoData);
        showScreen(successScreen);
    }, 1800);
}

scanQrBtn.addEventListener("click", () => {
    startQrScanner();
});

uploadBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        showError(
            "Invalid Image",
            "Please upload a valid package image."
        );

        imageInput.value = "";

        return;
    }

    startProcessing(file);
});

qrBackBtn.addEventListener("click", async () => {
    await stopQrScanner();
    showScreen(homeScreen);
});

scanAnotherBtn.addEventListener("click", async () => {
    await stopQrScanner();

    imageInput.value = "";

    showScreen(homeScreen);
});

successBackBtn.addEventListener("click", async () => {
    await stopQrScanner();

    imageInput.value = "";

    showScreen(homeScreen);
});

errorBackBtn.addEventListener("click", async () => {
    await stopQrScanner();

    imageInput.value = "";

    showScreen(homeScreen);
});

