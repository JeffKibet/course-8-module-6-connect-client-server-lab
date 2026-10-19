const API_URL = "http://localhost:5000/events";
const list = document.querySelector("#event-list");
const message = document.querySelector("#message");

function renderEvent(event) {
  const li = document.createElement("li");
  li.textContent = event.title;
  list.appendChild(li);
}

function showMessage(text) {
  message.textContent = text;
}

fetch(API_URL)
  .then((response) => response.json())
  .then((events) => events.forEach(renderEvent))
  .catch(() =>
    showMessage("Could not load events. Is the Flask server running?"),
  );

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#title");
  const title = input.value.trim();

  if (!title) {
    showMessage("Please enter an event title.");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error);
        });
      }
      return response.json();
    })
    .then((newEvent) => {
      renderEvent(newEvent);
      input.value = "";
      showMessage("");
    })
    .catch((err) => showMessage(err.message || "Could not add event."));
});
