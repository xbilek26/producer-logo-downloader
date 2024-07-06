document.addEventListener("DOMContentLoaded", function () {

    var userInput = document.getElementById("productCodeInput");

    userInput.addEventListener("keydown", function (event) {
        if (!(event.ctrlKey && event.key === "v")) {
            event.preventDefault();
        }
    });

    userInput.addEventListener("paste", function (event) {

        event.preventDefault();

        var pastedText = (event.clipboardData || window.clipboardData).getData('text');

        userInput.value = pastedText;

        fetchAndDisplayData(event);
    });

    userInput.addEventListener("input", function (event) {

        if (userInput.value.length > 0) {
            userInput.value = userInput.value.charAt(0);
        }

        fetchAndDisplayData(event);
    });

    userInput.addEventListener("click", function (event) {
        userInput.select();
    });
});

async function fetchAndDisplayData() {
    const productCode = document.getElementById('productCodeInput').value.trim();

    const url = `https://www.alza.cz/kod/${productCode}`;

    const response = await fetch(url);
    const html = await response.text();
    const imageUrl = extractImageUrlFromHtml(html);
    const brandName = extractBrandNameFromHtml(html);

    displayImage(imageUrl);
    downloadImage(imageUrl, brandName);
}

function extractImageUrlFromHtml(html) {
    const regex = /https:\/\/image\.alza\.cz\/Foto\/vyrobci\/.*?\.(png|jpg)/;
    const match = html.match(regex);

    return match[0];
}

function extractBrandNameFromHtml(html) {
    const regex = /"brand"\s*:\s*"([^"]+)"/;
    const match = html.match(regex);

    return match[1];
}

function displayImage(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.style.maxWidth = '100%';

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';
    imageContainer.appendChild(imageElement);
}

async function downloadImage(imageUrl, brandName) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/ /g, '_')}_IB.${getFileExtension(imageUrl)}`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function getFileExtension(url) {
    return url.split('.').pop();
}