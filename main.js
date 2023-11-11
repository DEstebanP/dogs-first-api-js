const randomBtn = document.querySelector(".random-btn");
randomBtn.onclick = getDogImage;
const spanError = document.getElementById("error");

const likeBtns = document.querySelectorAll(".like-btn");
for (const likeBtn of likeBtns) {
    likeBtn.onclick = (event) => {
        const eventBtn = event.currentTarget;
        const imageId = eventBtn.parentNode.id;
        saveDogFavorites(imageId);
    };
}

const API = "https://api.thedogapi.com/v1/";
const API_KEY = "api_key=live_5BGMn5C4CLIjnUvRs1m2FMURxpqW7WlIt1kVWtUqBh9tJXQGMGdNNoSPow6SupPI";

async function fetchData(urlApi) {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        if (response.status != 200) throw data.message;
        return data;
    } catch(err) {
        console.log(err);
        spanError.innerText = `Lo sentimos hubo un error ${err}`;
    }
} 

async function getDogImage() {
    const imgs = document.querySelectorAll(".dog-img");
    const dataObj = await fetchData(`${API}images/search?limit=4&${API_KEY}`);
    console.log(dataObj);
    for (let i = 0; i < imgs.length; i++) {
        const element = imgs[i];
        element.src = dataObj[i].url;
        element.parentNode.id = dataObj[i].id;
    }
}
async function getDogFavorites() {
    try {
        const favoritesObj = await fetchData(`${API}favourites?${API_KEY}`);
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
        const favoritesObj = await fetchData(`${API}favourites?${API_KEY}`);
        const isSaved = favoritesObj.some((element) => {return element.image.id == id});
        
        if (isSaved) {
            spanError.innerText = "Esta foto ya fue agregada a tus favoritos"
        } else {
            const response = await fetch(`${API}favourites?${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    'image_id': id
                }),
            });
    
            // Render fav images 
            renderFavorites();
            getDogFavorites();
    
            const data = await response.json();
            console.log(data);
            console.log(response);
            if (response.status != 200) throw data.message;
            spanError.innerText = "";
        }
    } catch (err) {
        console.log(err);
        spanError.innerText = `Lo sentimos hubo un error ${err}`;
    }
}
function renderFavorites() {
    const section = document.querySelector(".fav-images .images-container");
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
}
async function deleteDogFavorites(id) {
    try {
        console.log(id);
        const response = await fetch(`${API}favourites/${id}?${API_KEY}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
        });
        renderFavorites();
        getDogFavorites();
    } catch(err) {
        console.log(err);
    }
}
getDogImage();
getDogFavorites();