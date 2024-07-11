function toggleRatioInput() {
    const select = document.getElementById('svg-select');
    const ratioInput = document.getElementById('ratio-input');
    const countInput = document.getElementById('count-input');
    if (select.value === 'water.svg') {
        ratioInput.style.display = 'block';
        countInput.style.display = 'none';
    } else {
        ratioInput.style.display = 'none';
        countInput.style.display = 'block';
    }
}

async function fetchSVG(fileName) {
    const response = await fetch(`svg_library/${fileName}`);
    if (!response.ok) {
        throw new Error(`Could not fetch ${fileName}: ${response.statusText}`);
    }
    return await response.text();
}

function applyWaterRatio(svgContent, ratio) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    const path = svgDoc.querySelector('path');

    if (path) {
        const viewBox = svgElement.viewBox.baseVal;
        const height = viewBox.height;
        const fillHeight = height * ratio;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', viewBox.x);
        rect.setAttribute('y', viewBox.y + (height - fillHeight));
        rect.setAttribute('width', viewBox.width);
        rect.setAttribute('height', fillHeight);
        rect.setAttribute('fill', 'blue');

        svgElement.appendChild(rect);
    }

    return new XMLSerializer().serializeToString(svgDoc);
}

async function renderSVG() {
    const container = document.getElementById('svg-container');
    const fileName = document.getElementById('svg-select').value;
    container.innerHTML = '';
    try {
        let svgContent = await fetchSVG(fileName);
        if (fileName === 'water.svg') {
            const ratio = document.getElementById('ratio-value').value;
            svgContent = applyWaterRatio(svgContent, ratio);
            const div = document.createElement('div');
            div.classList.add('svg-item');
            div.innerHTML = svgContent;
            container.appendChild(div);
        } else {
            const count = document.getElementById('object-count').value;
            for (let i = 0; i < count; i++) {
                const div = document.createElement('div');
                div.classList.add('svg-item');
                div.innerHTML = svgContent;
                container.appendChild(div);
            }
        }
    } catch (error) {
        container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

window.onload = toggleRatioInput;
