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

//generate prompt from ai
const input = document.getElementById("user-input-prompt");
const submit_btn = document.getElementById("generate_response");
const welcome_mssg = document.querySelector(".chat-welcome-message");
const chat_container = document.getElementById("chat_container");

submit_btn.addEventListener("click", async() => {
  const user_input = input.value.trim();
  if (!user_input) return;

  if (welcome_mssg) welcome_mssg.remove();

  // 1) Create the row wrapper for this single “turn”
  const chatRow = document.createElement("section");
  chatRow.className = "chat-row"; // optional class for spacing

  // 2) Create user side
  const user_message_container = document.createElement("div");
  user_message_container.className = "user-message-container";

  const user_input_message = document.createElement("div");
  user_input_message.className = "user-input-message";
  user_input_message.textContent = user_input;

  const user_utility = document.createElement("div");
  user_utility.className = "user-utility";

  user_message_container.appendChild(user_input_message);
  user_message_container.appendChild(user_utility);
  chatRow.appendChild(user_message_container);
  input.value = "";
chat_container.appendChild(chatRow);
  // 3) Create AI side
  const ai_response_container = document.createElement("div");
  ai_response_container.className = "ai-response-container";

  

 const res = await fetch("http://127.0.0.1:8000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model:"nvidia/nemotron-3-nano-30b-a3b:free",
    messages: [{ role: "user", content: user_input }],
  })
});

if (!res.ok) {
  const errText = await res.text();
  throw new Error(`HTTP ${res.status}: ${errText}`);
}

const data = await res.json();     // ✅ await
const ai_response = data.reply;    // ✅ get reply

  const ai_message = document.createElement("div");
  ai_message.className = "ai-message";
  ai_message.textContent = ai_response;

  const ai_utility = document.createElement("div");
  ai_utility.className = "ai-utility";

  ai_response_container.appendChild(ai_message);
  ai_response_container.appendChild(ai_utility);

  // 4) Put both into this row, then append row to main chat list
  
  chatRow.appendChild(ai_response_container);
  chatRow.style.marginBottom = "15px";
  

  // 5) Clear input + scroll
  
  // chat_container.scrollTop = chat_container.scrollHeight;
});
