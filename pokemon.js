const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.getElementById("search-input");
const nameFilter = document.getElementById("name");
const numberFilter = document.getElementById("number");
const notFoundMessage = document.getElementById("not-found-message");
const closeButton = document.getElementById("search-close-icon");


let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results; 
    //.results is an array in the json with the poke name and img url

    displayPokemons(allPokemons);
})

async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${id}`)
        .then((response) => response.json()),

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        
        ])
        return true;
    } catch(error) {
        console.error("Failed to fetch data before redirect");
    }
}
async function fetchPokemonDetailsAndSetColor(pokemonID, listItem) {
    try {
        // Fetch the Pokémon details
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        const data = await response.json();

        // Extract Pokémon types
        const pokemonSpecies = data.types;

        // Set the background color based on the type
        setTypeBackgroundColor(pokemonSpecies, listItem);
    } catch (error) {
        console.error(`Failed to fetch details for Pokémon ID ${pokemonID}:`, error);
    }
}
function preloadPokemonImages(pokemonID) {
    const frontImage = new Image();
    frontImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;

    const backImage = new Image();
    backImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonID}.png`;

    return { frontImage, backImage };
}


function displayPokemons(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach(pokemon => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        const { frontImage, backImage } = preloadPokemonImages(pokemonID);
        

        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class = "number-wrap">
                <p class = "caption-fonts">${pokemonID}</p>
            </div>
            <div class = "img-wrap">
                <img class="image front" src="${frontImage.src}" alt="${pokemon.name}" >
                <img class="image back" src="${backImage.src}" alt="${pokemon.name}" >
                <img class="background-svg" src="./assets/pokeball1.svg" alt="pokeball">
            </div>
            <div class = "name-wrap">
                <p class = "body3-fonts">${pokemon.name}</p>
            </div>     
            <div class = "type-icon-wrapper">
            </div>
        `;

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if(success) {
                window.location.href = `./details.html?id=${pokemonID}`;
            }
        });

        let mouseEnterTimeout;
        let mouseLeaveTimeout;

        // listItem.addEventListener("mouseenter", () => {
        //     clearTimeout(mouseLeaveTimeout);
        //     mouseEnterTimeout = setTimeout(() => {
        //         const backSprite = listItem.querySelector("img");
        //         backSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonID}.png`;
        //     }, 0);
        // });

        // listItem.addEventListener("mouseleave", () => {
        //     clearTimeout(mouseEnterTimeout);
        //     mouseLeaveTimeout = setTimeout(() => {
        //         const frontSprite = listItem.querySelector("img");
        //         frontSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;
        //     }, 100);
        // });
        
        listWrapper.appendChild(listItem);

        // createAndAppendElement(listItem, "div", {
        //     className: "type-icon-wrapper",
        // })

        //bg color for list-item according to monType make it async later
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
        .then((response) => response.json())
        .then((data) => {
            const pokemonSpecies = data.types;

            setTypeBackgroundColor(pokemonSpecies, listItem);

            const typeIconWrapper = listItem.querySelector(".type-icon-wrapper");

            addtypeIcons(pokemonSpecies, typeIconWrapper);
        })
        
        

    });

}

searchInput.addEventListener("keyup", pokemonSearch);

function pokemonSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredMon;

    if (searchTerm === "") {
        filteredMon = allPokemons;
        displayNotFound()
    } else if(numberFilter.checked){
        filteredMon = allPokemons.filter( pokemon => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID === searchTerm;
        });
    } else if (nameFilter.checked){
        filteredMon = allPokemons.filter(pokemon => {
            console.log(pokemon.name.includes(searchTerm));
            return pokemon.name.includes(searchTerm);  
        });
    } else {
        filteredMon = allPokemons
        
    }
    displayPokemons(filteredMon);

    if(filteredMon.length === 0){
        notFoundMessage.style.display = "block";
    }
}


closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons);
    displayNotFound();
}

function displayNotFound() {
    notFoundMessage.style.display = "none";
}
//////////////////////////////////////////////
const typeColors = {
    fire: "#e03a3a",
    grass: "#50C878",
    electric: "#fad343",
    water: "#1E90FF",
    ground: "#735139",
    rock: "#63594f",
    fairy: "#EE99AC",
    poison: "#b34fb3",
    bug: "#A8B820",
    dragon: "#fc883a",
    psychic: "#882eff",
    flying: "#87CEEB",
    fighting: "#bf5858",
    normal: "#D2B48C",
    ghost: "#7B62A3",
    dark: "#414063",
    steel: "#808080",
    ice: "#98D8D8",
}
const iconColors = {
    "grass": "#5fbd58",
    "bug": "#92bc2c",
    "dark": "#595761",
    "dragon": "#0c69c8",
    "electric": "#f2d94e",
    "fairy": "#ee90e6",
    "fighting": "#d3425f",
    "fire": "#dc872f",
    "flying": "#a1bbec",
    "ghost": "#5f6dbc",
    "ground": "#da7c4d",
    "ice": "#75d0c1",
    "normal": "#a0a29f",
    "poison": "#b763cf",
    "psychic": "#ff2ca8",
    "rock": "#a38c21",
    "steel": "#5695a3",
    "water": "#539ddf",


}
function setElementStyle(elements, cssProperty, value){
    elements.forEach(element => {
        element.style[cssProperty] = value;
    });
}

function setTypeBackgroundColor(pokemon, listItem) {
    const firstType = pokemon[0].type.name;
    
    const color = typeColors[firstType]
    setElementStyle([listItem], "backgroundColor", color);
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag)

    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}

function addtypeIcons (pokemon, typeIconWrapper) {
    const firstType = pokemon[0].type.name;
    const secondType = pokemon[1]?.type.name;
    const colorOne = iconColors[firstType];
    const colorTwo = iconColors[secondType];

    createAndAppendElement(typeIconWrapper, "div", {
        className: "type-icon-wrap-first",
    });
    const typeIconWrap = typeIconWrapper.querySelector(".type-icon-wrap-first")
    
    //
    createAndAppendElement(typeIconWrap, "img", {
        className: "type-icon",
        src: `./assets/Icons/${firstType}.svg`,
        alt: `${firstType}`,
    });
    setElementStyle([typeIconWrap], "backgroundColor", colorOne);

    if(secondType) {
        createAndAppendElement(typeIconWrapper, "div", {
            className: "type-icon-wrap-second",
        });
        const typeIconWrap2 = typeIconWrapper.querySelector(".type-icon-wrap-second")
        
        //
        createAndAppendElement(typeIconWrap2, "img", {
            className: "type-icon",
            src: `./assets/Icons/${secondType}.svg`,
            alt: `${secondType}`,
        });
        setElementStyle([typeIconWrap2], "backgroundColor", colorTwo);
    }
    

}
