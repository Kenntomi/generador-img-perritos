const img = document.getElementById('dog-img');
const btn = document.getElementById('fetch-btn');
const breedSelect = document.getElementById('breed-select');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error-msg');
const downloadBtn = document.getElementById('download-btn');

fetch('https://dog.ceo/api/breeds/list/all')
    .then(res => res.json())
    .then(data => {
        const breeds = data.message;
        for (const breed in breeds) {
            if (breeds[breed].length === 0) {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
                breedSelect.appendChild(option);
            } else {
                breeds[breed].forEach(sub => {
                    const option = document.createElement('option');
                    option.value = `${breed}/${sub}`;
                    option.textContent = `${breed.charAt(0).toUpperCase() + breed.slice(1)} (${sub})`;
                    breedSelect.appendChild(option);
                });
            }
        }
    });

breedSelect.addEventListener('change', () => {
    errorMsg.style.display = 'none';
});

breedSelect.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        fetchDog();
    }
});

function fetchDog() {
    let url = 'https://dog.ceo/api/breeds/image/random';
    if (breedSelect.value) {
        url = `https://dog.ceo/api/breed/${breedSelect.value}/images/random`;
    }
    loader.style.display = 'block';
    img.style.opacity = '0.3';
    errorMsg.style.display = 'none';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                img.src = data.message;
                img.onload = () => {
                    loader.style.display = 'none';
                    img.style.opacity = '1';
                };
            } else {
                throw new Error("No se pudo cargar la imagen.");
            }
        })
        .catch(() => {
            loader.style.display = 'none';
            img.style.opacity = '1';
            errorMsg.textContent = "Ocurrió un error al cargar la imagen. Intenta de nuevo.";
            errorMsg.style.display = 'block';
        });
}

downloadBtn.addEventListener('click', () => {
    fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'perro.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
});
btn.addEventListener('click', fetchDog);