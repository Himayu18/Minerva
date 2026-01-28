const sideBar = document.querySelector(".side-bar");
const modelSelector = document.getElementById("model-selector");
function openSideBar() {
  sideBar.classList.toggle("open");
  modelSelector.classList.add("adjust-model-selector")

}
document.querySelectorAll(".sideBar").forEach(btn => btn.addEventListener("click", openSideBar))

function closeSideBar() {
  sideBar.classList.toggle("open");
  modelSelector.classList.remove("adjust-model-selector")
  console.log("sidebar JS loaded");

}
document.querySelectorAll(".close_sideBar").forEach(btn => btn.addEventListener("click", closeSideBar))
// Trigger light or dark mode
const trigger_mode = document.getElementById("themeToggle")
trigger_mode.addEventListener("click", () => { document.documentElement.classList.toggle("dark") })

//generate prompt from ai
const input = document.getElementById("user-input-prompt");
const submit_btn = document.getElementById("generate_response");
const welcome_mssg = document.querySelector(".chat-welcome-message");
const chat_container = document.getElementById("chat_container");

let selectedModel = modelSelector.value;
const buttonIcon = document.getElementById("button-icon")
function setLoading(isLoading) {
  if (isLoading) {
    submit_btn.disabled = true;
    submit_btn.classList.add("opacity-60", "cursor-not-allowed");

    buttonIcon.remove();
    submit_btn.innerHTML = `<div class="spinner"></div>`;
  } else {
    submit_btn.disabled = false;
    submit_btn.classList.remove("opacity-60", "cursor-not-allowed");

    submit_btn.innerHTML = `
      <img id="sendIcon" src="/assets/images/icons/up-arrow.png" height="20" width="20" />
    `;
  }
}

// run once (top of your script)
marked.setOptions({ gfm: true, breaks: true });

submit_btn.addEventListener("click", async () => {
  const user_input = input.value.trim();
  if (!user_input) return;

  if (welcome_mssg) welcome_mssg.remove();

  const chatRow = document.createElement("section");
  chatRow.className = "chat-row";

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

  const ai_response_container = document.createElement("div");
  ai_response_container.className = "ai-response-container";

  const ai_message = document.createElement("div");
  ai_message.className = "ai-message";
  ai_message.textContent = "";

  const ai_utility = document.createElement("div");
  ai_utility.className = "ai-utility";

  ai_response_container.appendChild(ai_message);
  ai_response_container.appendChild(ai_utility);
  chatRow.appendChild(ai_response_container);

  chatRow.style.marginBottom = "15px";

  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: selectedModel,
      messages: [{ role: "user", content: user_input }],
      temperature: 0.7,
      max_tokens: 512
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    ai_message.textContent = `Error: HTTP ${res.status} - ${errText}`;
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullText = "";
  setLoading(true)

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        if (!part.startsWith("data:")) continue;

        const chunk = part.startsWith("data: ") ? part.slice(6) : part.slice(5);

        if (chunk === "[DONE]") {
          ai_message.innerHTML = marked.parse(fullText);
          chat_container.scrollTop = chat_container.scrollHeight;
          return;
        }

        if (chunk.startsWith("[ERROR]")) {
          ai_message.textContent = chunk;
          return;
        }

        fullText += chunk;
        ai_message.textContent = fullText;
        chat_container.scrollTop = chat_container.scrollHeight;
      }
    }

    ai_message.innerHTML = marked.parse(fullText);
    chat_container.scrollTop = chat_container.scrollHeight;

  } catch (err) {
    ai_message.textContent = `Stream error: ${err.message || err}`;
  } finally {
    reader.releaseLock();
    setLoading(false)
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !submit_btn.disabled) {
    e.preventDefault(); // stop newline / form submit
    submit_btn.click(); // reuse existing logic
  }
});


