let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  // Get and display the toy info
  getToyInfo();

  // POST a new toy
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createNewToy(event);
    form.reset();
  })

  // Add toy button (default behaviour)
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
    
  });
});

function getToyInfo(){
  // Refreshes the data on the page based on the database file: db.json
  return fetch("http://localhost:3000/toys").then(response => response.json()).then(data => {
    const toyCollection = document.getElementById('toy-collection');
    data.forEach(toy => makeToyCards(toyCollection, toy));
  })
}

function makeToyCards(toyCollection, toy){ 
    let card = document.createElement('div')
    card.setAttribute('class', 'card')
    card.innerHTML =
        `<h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar"/>
        <p>${toy.likes}</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `
    let likeButton = card.querySelector('button');
    likeButton.addEventListener('click', () => updateLikes(toy));
    toyCollection.appendChild(card);  
}

function createNewToy(event){
  // Get the new information on the new toy and create and object
  let toyName = event.target[0].value
  let toyImg = event.target[1].value
  const newToy = {
    name: toyName,
    image: toyImg,
    likes: 0
  }
  
  // POST request, then refresh Toy Cards
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  }).then((response) => response.json()).then((data) =>{
    const toyCollection = document.getElementById('toy-collection');
    makeToyCards(toyCollection, data);
  })
  
}

function updateLikes(toy){
  let newNumberOfLikes = ++toy.likes;

  // PATCH request, then refresh Toy Cards
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  }).then((response) => response.json()).then((data) => {
    document.getElementById(`${data.id}`).previousElementSibling.textContent = data.likes;
  })
}