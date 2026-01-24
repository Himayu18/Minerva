

const sideBar = document.querySelector(".side-bar");
const modelSelector = document.getElementById("model-selector");
function openSideBar(){
    sideBar.classList.toggle("open");
    modelSelector.classList.add("adjust-model-selector")

}
document.querySelectorAll(".sideBar").forEach(btn => btn.addEventListener("click",openSideBar))

function closeSideBar(){
    sideBar.classList.toggle("open");
    modelSelector.classList.remove("adjust-model-selector")
    console.log("sidebar JS loaded");
    
}
document.querySelectorAll(".close_sideBar").forEach(btn=> btn.addEventListener("click",closeSideBar))
// Trigger light or dark mode
const trigger_mode = document.getElementById("themeToggle")
trigger_mode.addEventListener("click",()=>{document.documentElement.classList.toggle("dark")})