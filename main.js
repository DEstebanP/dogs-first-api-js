const randomBtn = document.querySelector(".random-btn");
randomBtn.onclick = getDogImage;
const spanError = document.getElementById("error");

const likeBtns = document.querySelectorAll(".like-btn");
const API = "https://api.thedogapi.com/v1/";
const API_KEY = "live_5BGMn5C4CLIjnUvRs1m2FMURxpqW7WlIt1kVWtUqBh9tJXQGMGdNNoSPow6SupPI";

const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1',
    headers: {'X-API-KEY': API_KEY}
})

async function fetchData(urlApi, infoApi) {
    try {
        const response = infoApi ? await fetch(urlApi, infoApi) : await fetch(urlApi);
        const data = await response.json();
        if (response.status != 200) throw data.message;
        return data;
    } catch(err) {
        console.log(err);
        
    }
} 

async function getDogImage() {
    const imgs = document.querySelectorAll(".dog-img");
    const dataObj = await fetchData(`${API}images/search?limit=4`, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    console.log(dataObj);
    for (let i = 0; i < imgs.length; i++) {
        const element = imgs[i];
        element.src = dataObj[i].url;
        element.parentNode.id = dataObj[i].id;
    }
    for (const likeBtn of likeBtns) {
        likeBtn.onclick = (event) => {
            const eventBtn = event.currentTarget;
            const imageId = eventBtn.parentNode.id;
            saveDogFavorites(imageId);
        };
    }
}
async function getDogFavorites() {
    try {
        const favoritesObj = await fetchData(`${API}favourites`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        const section = document.querySelector(".fav-images .images-container");
        console.log(favoritesObj);
        for (const favorite of favoritesObj) {
            const article = document.createElement('article');
            const img = document.createElement('img');
            img.src = favorite.image.url;
            img.classList.add('dog-img');
            const btn = document.createElement('button');
            btn.classList.add('delete-btn');
            btn.innerText = "Delete";

            btn.onclick = () => deleteDogFavorites(favorite.id);

            article.append(img, btn);

            section.appendChild(article);
        }

    } catch (err) {
        console.log(err);
    }
}

async function saveDogFavorites(id) {
    try {
        const favoritesObj = await fetchData(`${API}favourites`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        const isSaved = favoritesObj.some((element) => {return element.image.id == id});
        
        if (isSaved) {
            spanError.innerText = "Esta foto ya fue agregada a tus favoritos"
        } else {
            const {data, status} = await api.post('/favourites', {
                'image_id': id
            })

            /* const response = await fetch(`${API}favourites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'X-API-KEY': API_KEY
                },
                body: JSON.stringify({
                    'image_id': id
                }),
            }); */
    
            // Render fav images 
            cleanFavorites();
            getDogFavorites();
    
            /* const data = await response.json();
            console.log(data);
            console.log(response); */
            if (status != 200) throw data.message;
            spanError.innerText = "";
        }
    } catch (err) {
        console.log(err);
        spanError.innerText = `Lo sentimos hubo un error ${err}`;
    }
}

function cleanFavorites() {
    const section = document.querySelector(".fav-images .images-container");
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
}
async function deleteDogFavorites(id) {
    try {
        const response = await fetch(`${API}favourites/${id}`, {
            method: 'DELETE',
            headers : {
                'X-API-KEY': API_KEY
            }
        });
        cleanFavorites();
        getDogFavorites();
    } catch(err) {
        console.log(err);
    }
}

function previewImage() {
    const fileInput = document.getElementById('file-dog');
    const previewImage = document.getElementById('image-preview');

    const file = fileInput.files[0];
    console.log(fileInput.value);
    if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            previewImage.src = event.target.result;
        }
        reader.readAsDataURL(file);
        console.log(reader.readAsDataURL(file));
    } else {
        previewImage.src = '';
    }
}

async function uploadingDogPhoto() {
    try {
        const form = document.getElementById('uploading-photo');
        const formData = new FormData(form);
        const {data, status} = await api.post('/images/upload', formData)
        console.log({data, status})
        
        /* const response = await fetch(`${API}images/upload`, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY
            },
            body: formData
        });
        const data = await response.json(); */
        if (status != 201) {
            console.log(status);
            throw data.message;
        } else {
            console.log("Foto de perrito cargada :)");
            console.log({ data });
            console.log(data.url);
            saveDogFavorites(data.id)

            //Clean input file
            const fileInput = document.getElementById('file-dog');
            fileInput.value = '';
            previewImage();
        }
    } catch (err) {
        spanError.innerText = `There was an error uploading your photo: ${err} `
    }
}
getDogImage();
getDogFavorites();