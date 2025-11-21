const socket = io();

const form = document.getElementById("form");
const username = document.getElementById("username");
const msg = document.getElementById("msg");
const messages = document.getElementById("messages");

const imgInput = document.getElementById("imageInput"); 
const imgBtn = document.querySelector(".img-btn");      

let myName = "";

username.addEventListener("change", () => {
    myName = username.value.trim();
});

msg.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (msg.value.trim() !== "") {
            form.dispatchEvent(new Event("submit"));
        }
    }
});


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = msg.value.trim();
    const user = username.value.trim() || "Anon";

    if (text === "") return; 

    myName = user;

    socket.emit("chat-message", {
        username: user,
        message: text,
        type: "text",
        time: getHour()
    });

    msg.value = "";
    msg.focus();
});


imgBtn.addEventListener("mousedown", (e) => {
    e.preventDefault(); 
    imgInput.value = "";
    imgInput.click();
});

imgInput.addEventListener("click", () => {
    imgInput.value = ""; 
});

imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (!file) return;

    const user = username.value.trim() || "Anon";
    myName = user;

    const reader = new FileReader();

    reader.onload = () => {
        socket.emit("chat-message", {
            username: user,
            image: reader.result,
            type: "image",
            time: getHour()
        });

        imgInput.value = "";
        msg.focus();
    };

    reader.readAsDataURL(file);
});

socket.on("chat-message", (payload) => {
    const box = document.createElement("div");
    box.classList.add("message");

    if (payload.username === myName) {
        box.classList.add("sent");
    } else {
        box.classList.add("received");
    }

    const name = document.createElement("div");
    name.classList.add("username");
    name.textContent = payload.username;
    box.appendChild(name);

    if (payload.type === "text") {
        const text = document.createElement("div");
        text.classList.add("text");
        text.textContent = payload.message;
        box.appendChild(text);
    }

    if (payload.type === "image") {
        const img = document.createElement("img");
        img.src = payload.image;
        box.appendChild(img);
    }

    const time = document.createElement("div");
    time.classList.add("time");
    time.textContent = payload.time;
    box.appendChild(time);

    messages.appendChild(box);
    messages.scrollTop = messages.scrollHeight;
});



function getHour() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const toggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});
