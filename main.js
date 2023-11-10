const randomBtn = document.querySelector(".random-btn");
randomBtn.onclick = getDogImage;
const spanError = document.getElementById("error");

const likeBtns = document.querySelectorAll(".like-btn");
for (const likeBtn of likeBtns) {
    likeBtn.onclick = saveDogFavorites;
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
    }
    return dataObj
}
async function getDogFavorites() {
    const dataObj = await fetchData(`${API}favourites?${API_KEY}`);
    console.log(dataObj);
}

async function saveDogFavorites() {
    try {
        const response = await fetch(`${API}favourites?${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                'image_id': 'ryPgVl5N7'
            }),
        });
    
        const data = await response.json();
        console.log(data);
        console.log(response);
        if (response.status != 200) throw data.message;
    } catch (err) {
        console.log(err);
        spanError.innerText = `Lo sentimos hubo un error ${err}`;
    }
}
getDogImage();
getDogFavorites();