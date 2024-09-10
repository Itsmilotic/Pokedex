const MAX_POKEMON = 151;
let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
    
    const pokemonId = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonId, 10);

    if(id < 1 || id > MAX_POKEMON){
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json()),
    
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => response.json())
        ])

        const abilitiesWrapper = document.querySelector(
            ".pokemon-detail-wrap .pokemon-detail.move"
          );
          abilitiesWrapper.innerHTML = "";


        if(currentPokemonId === id) {
            displayPokemonDetails(pokemon);
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;

            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map( sel => document.querySelector(sel));

            leftArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);
            
            if(id !== 1){
                leftArrow.addEventListener("click", () => navigatePokemon(id - 1));
                
            }
            if(id !== MAX_POKEMON){
                
                rightArrow.addEventListener("click", () => navigatePokemon(id + 1)); 
            }

            window.history.pushState({}, "", `./details.html?id=${id}`)
        }
    } catch (error) {
        console.error("An error occured loading the details zzz", error)
    }  
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    loadPokemon(currentPokemonId);
}

const typeColors = {
    bug: "#92bc2c",
    grass: "#5fbd58",
    dark: "#595761",
    dragon: "#0c69c8",
    electric: "#f2d94e",
    fairy: "#ee90e6",
    fighting: "#d3425f",
    fire: "#dc872f",
    flying: "#a1bbec",
    ghost: "#5f6dbc",
    ground: "#da7c4d",
    ice: "#75d0c1",
    normal: "#a0a29f",
    poison: "#b763cf",
    psychic: "#ff2ca8",
    rock: "#a38c21",
    steel: "#5695a3",
    water: "#539ddf",
}

///////////////////////////////////////////////////////
function setElementStyle(elements, cssProperty, value){
    elements.forEach(element => {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1,3), 16),
        parseInt(hexColor.slice(3,5), 16),
        parseInt(hexColor.slice(5,7), 16),
    ].join(", ") ///////////////////////
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name; 
    const color1 = typeColors[mainType];
    

    const detailMainElement = document.querySelector(".detail-main");
    setElementStyle([detailMainElement], "backgroundColor", color1);
    setElementStyle([detailMainElement], "borderColor", color1);

    const typeElements1 = document.querySelectorAll(`.body3-fonts.type.${mainType}`);
    setElementStyle(typeElements1, "backgroundColor", color1);

    if (pokemon.types[1]) {
        const secondaryType = pokemon.types[1].type.name;
        const color2 = typeColors[secondaryType];

        const typeElements2 = document.querySelectorAll(`.body3-fonts.type.${secondaryType}`);
        setElementStyle(typeElements2, "backgroundColor", color2);
    }
    setElementStyle(
        document.querySelectorAll(".stats-wrap p.stats"), "color", color1);
    setElementStyle(
        document.querySelectorAll(".stats-wrap .progress-bar"), "color", color1);
    
    const rgbaColor = rgbaFromHex(color1)
    const styleTag = document.createElement("style");

    //
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: rgba(${rgbaColor}, 0.8);
        }  
    `;
    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag)

    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}
function displayPokemonDetails(pokemon){
    const  { name, id, types, weight, height, abilities, stats} = pokemon;
    const capitalizedPokemonName = capitalizeFirstLetter(name);

    document.querySelector("title").textContent = capitalizedPokemonName;

    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name-wrap .name").textContent =
    capitalizedPokemonName;

    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`

    const imageElement = document.querySelector(".detail-img-wrapper img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`

    const typeWrapper = document.querySelector(".power-wrapper")
    typeWrapper.innerHTML = ""
    types.forEach(({type}) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        })
    });

    document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
    ).textContent = `${weight / 10} kg`;

    document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
    ).textContent = `${height / 10} m`;

    const abilitiesWrapper = document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
          textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper")
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    }

    stats.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        });
        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });
        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColor(pokemon);
   
}

function getEnglishFlavorText(pokemonSpecies){
    for (let entry of pokemonSpecies.flavor_text_entries){
        if(entry.language.name === "en"){
            let flavor = entry.flavor_text.replace(/\f/g, "")
            return flavor;
        }
    }
    return "";
}