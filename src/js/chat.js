console.log("sidebar JS loaded");

const side_bar_button = document.getElementById("sideBar")
const sideBar = document.querySelector(".side-bar");
function openSideBar(){
    sideBar.classList.toggle("open");
    console.log("sidebar JS loaded");

}
side_bar_button.addEventListener("click",openSideBar)

const close_side_bar = document.getElementById("close_sideBar")
function closeSideBar(){
    sideBar.classList.toggle("open");
    console.log("sidebar JS loaded");

}
close_side_bar.addEventListener("click",closeSideBar)