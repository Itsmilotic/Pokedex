const sort_wrapper = document.querySelector(".sort-wrapper");

sort_wrapper.addEventListener("click", () => {
    dropDownSortMenu();
})

function dropDownSortMenu() {
    document.querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-toggled");
    document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}

const pokeball = document.querySelector(".logo-wrapper")

pokeball.addEventListener("click", toggleTheme);

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
}