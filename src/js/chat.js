console.log("sidebar JS loaded");

const side_bar_button = document.getElementById("sideBar");
const sideBar = document.querySelector(".side-bar");
const modelSelector = document.getElementById("model-selector");
function openSideBar(){
    sideBar.classList.toggle("open");
    modelSelector.classList.add("adjust-model-selector")

}
side_bar_button.addEventListener("click",openSideBar)

const close_side_bar = document.getElementById("close_sideBar")
function closeSideBar(){
    sideBar.classList.toggle("open");
    modelSelector.classList.remove("adjust-model-selector")
    console.log("sidebar JS loaded");

}
close_side_bar.addEventListener("click",closeSideBar)