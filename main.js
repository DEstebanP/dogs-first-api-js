const randomBtn = document.querySelector(".random-btn");
randomBtn.onclick = getDogImage;
const API = "https://api.thedogapi.com/v1/images/search?limit=3&api_key=live_5BGMn5C4CLIjnUvRs1m2FMURxpqW7WlIt1kVWtUqBh9tJXQGMGdNNoSPow6SupPI";

async function fetchData(urlApi) {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        return data;
    } catch(err) {
        console.log(err);
    }
} 

async function getDogImage() {
    const imgs = document.querySelectorAll(".dog-img");
    const dataObj = await fetchData(API);
    
    for (let i = 0; i < imgs.length; i++) {
        const element = imgs[i];
        element.src = dataObj[i].url;
    }

}
getDogImage();