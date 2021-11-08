import { recipes } from "./recipes.js";

//Eléments du DOM
let main = document.getElementById('main');

/**
 * Génére et affiche une card par recette 
 * @param {array} tableauEntree Tableau des recettes filtré ou non
 */
function afficheCard(tableauEntree){
    main.innerHTML =``;
    let div = document.createElement('div');
    tableauEntree.forEach(recette => {
        console.log(recette);
        let card = div.cloneNode(true);
        card.classList.add('card','mb-2','cardPerso');
        // card.setAttribute('style', 'width:33%');
        card.innerHTML = `<img src="./images/recettes-de-cuisine-en-video.jpg" class="card-img-top" alt="Image de la recette">`;
        let cardBody = div.cloneNode(true);
        cardBody.classList.add('card-body','bg-light');
        let divTitre = div.cloneNode(true);
        divTitre.classList.add('d-flex','justify-content-between');
        divTitre.innerHTML =`
            <h5 class="card-title h6 col 5">${recette.name}</h5>
            <p class="font-weight-bold"><i class="far fa-clock"></i> ${recette.time} min</p>
        `;
        let divRecette = div.cloneNode(true);
        divRecette.classList.add('d-flex', 'justify-content-center');
        let divIngredients = div.cloneNode(true);
        divIngredients.classList.add('d-flex', 'flex-column');
        recette.ingredients.forEach(ingredient => {
            let span = document.createElement('small');
            let quantite = ingredient.quantity === undefined ? '' : `: ${ingredient.quantity}`;
            let unite = ingredient.unit === undefined ? '' : ingredient.unit;
            span.innerHTML = `<span>${ingredient.ingredient} ${quantite} ${unite}</span>`;
            divIngredients.append(span)
        });
        let divDescription = div.cloneNode(true);
        divDescription.classList.add('col-6','ellipsisDesc');
        divDescription.innerHTML = `<p>${recette.description}</p>`;
        divRecette.append(divIngredients);
        divRecette.append(divDescription);
        cardBody.append(divTitre);
        cardBody.append(divRecette);
        card.append(cardBody);
        main.append(card);
    });
}


afficheCard(recipes);