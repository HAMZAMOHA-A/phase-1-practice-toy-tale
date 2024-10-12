document.addEventListener("DOMContentLoaded", () => {
    const toyCollection = document.getElementById("toy-collection");
    const addToyBtn = document.getElementById("add-toy-btn");
    const toyForm = document.getElementById("toy-form");
    const createToyForm = document.getElementById("create-toy-form");

    const API_URL = "http://localhost:3000/toys";

    function fetchToys() {
        fetch(API_URL)
            .then(response => response.json())
            .then(toys => {
                toys.forEach(renderToy);
            })
            .catch(error => console.error("Error fetching toys:", error));
    }

    function renderToy(toy) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(card);

        const likeBtn = card.querySelector(".like-btn");
        likeBtn.addEventListener("click", () => {
            updateLikes(toy.id, toy.likes);
        });
    }

    createToyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("toy-name").value;
        const image = document.getElementById("toy-image").value;

        const newToy = {
            name: name,
            image: image,
            likes: 0
        };

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newToy)
        })
        .then(response => response.json())
        .then(toy => {
            renderToy(toy);
            createToyForm.reset();
            toyForm.style.display = "none";
        })
        .catch(error => console.error("Error creating toy:", error));
    });

    function updateLikes(id, currentLikes) {
        const newLikes = currentLikes + 1;

        fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ likes: newLikes })
        })
        .then(response => response.json())
        .then(updatedToy => {
            const card = toyCollection.querySelector(`#${updatedToy.id}`);
            card.previousElementSibling.innerText = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error("Error updating likes:", error));
    }

    addToyBtn.addEventListener("click", () => {
        toyForm.style.display = toyForm.style.display === "none" ? "block" : "none";
    });

    fetchToys();
});
