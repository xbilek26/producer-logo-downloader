async function fetchAndDisplayData() {
    const productCode = document.getElementById('productCodeInput').value.trim();
    if (!productCode) {
        alert('Prosím, zadejte kód produktu.');
        return;
    }

    const url = `https://www.alza.cz/kod/${productCode}`;
    console.log(`Fetching HTML from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Chyba při načítání stránky! Status: ${response.status}`);
    }

    const html = await response.text();
    const imageUrl = extractImageUrlFromHtml(html);

    displayImage(imageUrl);
    const brandName = extractBrandNameFromHtml(html);

    downloadImage(imageUrl, brandName);
}

function extractImageUrlFromHtml(html) {
    const regex = /https:\/\/image\.alza\.cz\/Foto\/vyrobci\/.*?\.png/;
    const match = html.match(regex);
    if (!match) {
        throw new Error('URL obrázku nebyla nalezena.');
    }
    return match[0];
}

function extractBrandNameFromHtml(html) {
    const regex = /"brand"\s*:\s*"([^"]+)"/;
    const match = html.match(regex);
    if (!match || match.length < 2) {
        throw new Error('Hodnota "brand" nebyla nalezena.');
    }

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
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Chyba při stažení obrázku! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${brandName.toLowerCase().replace(/ /g, '_')}_IB.png`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Chyba při stahování obrázku:', error);
        alert(`Nastala chyba při stahování obrázku: ${error.message}`);
    }
}
