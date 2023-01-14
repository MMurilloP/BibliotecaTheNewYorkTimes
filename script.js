const firebaseConfig = {
  apiKey: "AIzaSyAPRYBYjYXYBWeYBxrvI-095ke_Wh06vn0",
  authDomain: "biblioteca-1c604.firebaseapp.com",
  projectId: "biblioteca-1c604",
  storageBucket: "biblioteca-1c604.appspot.com",
  messagingSenderId: "646669203474",
  appId: "1:646669203474:web:7a5c08b26d494edb1d40cb"
};

firebase.initializeApp(firebaseConfig);// Inicializar app Firebase
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore


const login1= document.querySelector(".btnLogin");
login1.addEventListener("click", function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // El usuario está autenticado
      let favoriteBooks = [{title: 'Libro 1', author: 'Autor 1'}, {title: 'Libro 2', author: 'Autor 2'}];
      db.collection("favorites").add({
          userID: user.uid,
          books: favoriteBooks,
          email: user.email
      })
          .then(function(docRef) {
              console.log("Libros favoritos guardados con ID: " , docRef.id);
      })
          .catch (function(error) {
              console.error("Error guardando libros favoritos", error);
          });
    } else {
      // El usuario no está autenticado
    }
  });
})


// seleccionar boton register/login
const btnRegisterLogin = document.querySelector("#btnRegisterLogin");
let esVisible = false;
// hacer que aparezca y desaparezca el formulario al piulsar el boton.
btnRegisterLogin.addEventListener("click", function(){
  if (esVisible) {
      document.querySelector(".form-wrapper").style.display = "none";
      esVisible = false;
  } else {
      document.querySelector(".form-wrapper").style.display = "block";
      esVisible = true;
  }
});


const articleELCategorias = document.querySelector("#cards-container");

const articleELLibros = document.querySelector("#books-container");

const header = document.querySelector("header");
const buttonContainer = document.querySelector("#button-container");

//boton indice
const btnIndice = document.getElementById("btnIndice");
btnIndice.addEventListener("click", function () {
  location.reload();
});

//Boton para subir arriba.
const bntArriba = document.getElementById("btnArriba");
bntArriba.addEventListener("click", scrollToTop);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

// api key de la libreria new york times
const apiKey = "fKCM4Ap0uTAGSmRBKnWjpB49UTwkcG8P";

// funcion que imprime categorias, pagina principal.
function categoriasLibros() {
  document.querySelector(".loader").style.display = "block";
  setTimeout(function() {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        const div = document.createElement("div");
        div.setAttribute("id", "cartas");
        div.innerHTML = `<h3>${data.results[i].display_name}</h3>
                          <p><strong>Oldest:</strong> ${
                            data.results[i].oldest_published_date
                          }</p>
                          <p><strong>Newest:</strong> ${
                            data.results[i].newest_published_date
                          }</p>
                          <p><strong>Updated:</strong> ${
                            data.results[i].updated
                          }</p>
                          <button class=" btnEL${[
                            i,
                          ]} btn" > READ MORE! </button>`;

        document.querySelector("#cards-container").appendChild(div);
        document.querySelector(".loader").style.display = "none";

        let btns = document.querySelector(`.btnEL${[i]}`);
        btns.addEventListener("click", function libros() {
          document.querySelector(".loader").style.display = "none";
          document.querySelector("#btnIndice").style.display ="block"
          fetch(
            `https://api.nytimes.com/svc/books/v3/lists/current/${data.results[i].list_name_encoded}.json?api-key=${apiKey}`
          )
            .then((response) => response.json())
            .then((data) => {
              for (let i = 0; i < data.results.books.length; i++) {
                const div = document.createElement("div");
                div.setAttribute("id", "cartasLibros");
                div.innerHTML += `<h6>${data.results.list_name}</h6><h6> #${data.results.books[i].rank}. Title:   ${data.results.books[i].title} </h6>                  
                                  <img id="img" src="${data.results.books[i].book_image}">
                                  <p>Week on list: ${data.results.books[i].weeks_on_list}</p>
                                  <p>${data.results.books[i].description}</p>
                                  <button class="fav-btn" data-book-id="${data.results.books[i].id}">&#9733;</button>

                                  <button id="btnAmazon"><a target= "_black" href="${data.results.books[i].amazon_product_url}">BUY AT AMAZON > </a></button>`;
                document.querySelector("#books-container").appendChild(div);
                document.querySelector("#cards-container").style.display ="none";
                document.querySelector(".form-wrapper").style.display ="none";
                

              }
            });
        });
      }
    });
},1500);
}
categoriasLibros();

