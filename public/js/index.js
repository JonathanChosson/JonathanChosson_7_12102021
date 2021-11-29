import { recipes } from "./recipes.js";
console.log(recipes);
//Eléments du DOM
let main = document.getElementById('main');
let champRecherche = document.getElementById('champRecherche');
let bntRecherche = document.getElementsByClassName('fa-search');
let fermer = document.getElementsByClassName('fermer');

//variables Globales
let rechercheEnCours = [];
let tagActif = [];

/**
 * Génére et affiche une card par recette 
 * @param {array} tableauEntree Tableau des recettes filtré ou non
 */
function afficheCard(tableauEntree){
    main.innerHTML =``;
    let div = document.createElement('div');
    tableauEntree.forEach(recette => {
        // console.log(recette);
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
    afficheListeTag();
};

/**
 * Affiche à l'utilisateur les tags actifs
 */
function afficheTag(){
    console.log(tagActif);
    let div = document.createElement('div');
    div.setAttribute('id', 'tagActif');
    if(document.getElementById('tagActif')){
        document.getElementById('tagActif').remove();
    }
    let span = document.createElement('span');
    span.classList.add('badge', 'm-1');
    for (let i = 0; i < tagActif.length; i++) {
        let spanActif = span.cloneNode();
        if(tagActif[i].source === 'i'){
            spanActif.classList.add('badge-primary');
        }else if(tagActif[i].source === 'a'){
            spanActif.classList.add('vert');
        }else if(tagActif[i].source === 'u'){
            spanActif.classList.add('rouge');
        }
        spanActif.innerHTML = tagActif[i].tag + ' ' + `<i id="${tagActif[i].tag}" class="far fa-times-circle fermer"></i>`;
        div.append(spanActif);    
    }
    champRecherche.parentNode.insertAdjacentElement('afterend',div);
    fermetureTag();
}

/**
 * Ecoute la saisi sur le champ recherche
 */
function ecouteRecherche(){
    // bntRecherche[0].parentNode.setAttribute('disabled',"");
    // champRecherche.addEventListener('click', function(event){
    //     event.target.value = "";
    // });
    // champRecherche.addEventListener('input', function(event){
    //     if(event.target.value.length > 2){
    //         bntRecherche[0].parentNode.removeAttribute('disabled',"");
    //     }
    // });
    // champRecherche.addEventListener('keypress', function(event){
    //     if(event.key === "Enter" & champRecherche.value.length > 2){
    //         rechercheTag(champRecherche.value.split(' '));
    //         champRecherche.value ="";
    //     }
    // });
    // bntRecherche[0].parentNode.addEventListener('click', function(){
    //     rechercheTag(champRecherche.value.split(' '));
    //     champRecherche.value ="";
    //     // rechercheClassique(champRecherche.value);  A CODER PLUS TARD 
    // });
    bntRecherche[0].parentNode.setAttribute('disabled',"");
    champRecherche.addEventListener('click', function(event){
        event.target.value = "";
    });
    champRecherche.addEventListener('input', function(event){
        if(event.target.value.length > 2){
            bntRecherche[0].parentNode.removeAttribute('disabled',"");
        }
    });
    champRecherche.addEventListener('keypress', function(event){
        if(event.key === "Enter" & champRecherche.value.length > 2){
            rechercheGlobal(champRecherche.value.split(' '));
            champRecherche.value ="";
        }
    });
    bntRecherche[0].parentNode.addEventListener('click', function(){
        rechercheGlobal(champRecherche.value.split(' '));
        champRecherche.value ="";
    });
};

/**
 * Fonction qui recherche dans le titre et dans la description des recettes 
 * @param {array} tableauRecherche tableau fournis par {@link ecouteRecherche}
 */
function rechercheGlobal(tableauRecherche){
    rechercheEnCours = [];
    for (let j = 0; j < tableauRecherche.length; j++) {
        for (let i = 0; i < recipes.length; i++) {
            if(recipes[i].name.toUpperCase().split(' ').includes(tableauRecherche[j].toUpperCase()) || recipes[i].description.toUpperCase().split(' ').includes(tableauRecherche[j].toUpperCase())){
                ajoutRecetteRecherche(recipes[i]);
            }
        }
    }
    afficheCard(rechercheEnCours);
}

/**
 * Vérifie que le mot en entrée est présent dans ingrédients 
 * @param {string} tag 
 */
function rechercheTagCategorie(tag){
    if(rechercheEnCours.length <= 0){
        for (let i = 0; i < recipes.length; i++) {
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                if(recipes[i].ingredients[j].ingredient.toUpperCase().split(' ').includes(tag.toUpperCase())){
                    ajoutRecetteRecherche(recipes[i]);
                    ajoutTagActif(tag , 'i');
                }
            }
            if(recipes[i].appliance.toUpperCase().split(' ').includes(tag.toUpperCase())){
                ajoutRecetteRecherche(recipes[i]);
                ajoutTagActif(tag , 'a');
            }
            for (let j = 0; j < recipes[i].ustensils.length; j++) {
                if(recipes[i].ustensils[j].toUpperCase().split(' ').includes(tag.toUpperCase())){
                    ajoutRecetteRecherche(recipes[i]);
                    ajoutTagActif(tag , 'u');
                }
            }
        }
    }else{
        let tableauTemporaire = []
        for (let i = 0; i < rechercheEnCours.length; i++) {
            for (let j = 0; j < rechercheEnCours[i].ingredients.length; j++) {
                if(rechercheEnCours[i].ingredients[j].ingredient.toUpperCase().split(' ').includes(tag.toUpperCase()) === true){
                    console.log(rechercheEnCours[i]);
                    tableauTemporaire.push(rechercheEnCours[i]);
                    ajoutTagActif(tag , 'i');
                }
            }
        }
        for (let i = 0; i < rechercheEnCours.length; i++) {
            if(rechercheEnCours[i].appliance.toUpperCase().split(' ').includes(tag.toUpperCase()) === true){
                tableauTemporaire.push(rechercheEnCours[i]);
                ajoutTagActif(tag , 'a');
            }
        }
        for (let i = 0; i < rechercheEnCours.length; i++) {
            for (let j = 0; j < rechercheEnCours[i].ustensils.length; j++) {
                if(rechercheEnCours[i].ustensils[j].toUpperCase().split(' ').includes(tag.toUpperCase()) === true){
                    tableauTemporaire.push(rechercheEnCours[i]);
                    ajoutTagActif(tag , 'u');
                }
            }
        }
        if(tableauTemporaire.length > 0 ){
            rechercheEnCours = tableauTemporaire;
        }
    }
}

/**
 * Vérifie si la recette fait déjà partie de la recherche
 * @param {object} recette 
 */
function ajoutRecetteRecherche(recette){
    if(!rechercheEnCours.includes(recette)){
        rechercheEnCours.push(recette);
    }
}

/**
 * Vérifie si le tag fait déjà parti des tagActif
 * @param {string} tag 
 */
function ajoutTagActif(tag, source){
    let tagAjout = {
        tag : tag.toUpperCase(),
        source
    }
    let estActif = 0; 
    for (let i = 0; i < tagActif.length; i++) {
        if(tagActif[i].tag === tagAjout.tag){
            estActif ++;
        }
    }
    if(estActif < 1){
        tagActif.push(tagAjout);
    }
    afficheTag();
}

/**
 * Ecoute le clic sur le bouton fermer d'un tag 
 */
function fermetureTag(){
    for (let i = 0; i < fermer.length; i++) {
        fermer[i].addEventListener('click', function(){
            let tableauTag = [];
            for (let i = 0; i < tagActif.length; i++) {
                tableauTag.push(tagActif[i].tag);
            }
            tableauTag.splice(tableauTag.indexOf(fermer[i].id), 1);
            tagActif = [];
            if(tableauTag.length >0){
                rechercheTag(tableauTag);
            }else{
                rechercheEnCours = [];
                afficheCard(recipes);
            }
            afficheTag();
        })
    }
}

/**
 * Affiche la liste des tags pour les 3 catégories
 */
function afficheListeTag(){
    let listeIngredientsRecherche = [];
    let listeAppareilsRecherche = [];
    let listeUstensilesRecherche = [];
    if(rechercheEnCours.length === 0){
        for (let i = 0; i < recipes.length; i++) {
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                if(!listeIngredientsRecherche.includes(recipes[i].ingredients[j].ingredient)){
                    listeIngredientsRecherche.push(recipes[i].ingredients[j].ingredient);
                }
            }
        };
        for (let i = 0; i < recipes.length; i++) {
            if(!listeAppareilsRecherche.includes(recipes[i].appliance)){
                listeAppareilsRecherche.push(recipes[i].appliance);
            }
        };
        for (let i = 0; i < recipes.length; i++) {
            for (let j = 0; j < recipes[i].ustensils.length; j++) {
                if(!listeUstensilesRecherche.includes(recipes[i].ustensils[j])){
                    listeUstensilesRecherche.push(recipes[i].ustensils[j]);
                }
            }
        }
    }else{
        for (let i = 0; i < rechercheEnCours.length; i++) {
            for (let j = 0; j < rechercheEnCours[i].ingredients.length; j++) {
                if(!listeIngredientsRecherche.includes(rechercheEnCours[i].ingredients[j].ingredient)){
                    listeIngredientsRecherche.push(rechercheEnCours[i].ingredients[j].ingredient);
                }
            }
        };
        for (let i = 0; i < rechercheEnCours.length; i++) {
            if(!listeAppareilsRecherche.includes(rechercheEnCours[i].appliance)){
                listeAppareilsRecherche.push(rechercheEnCours[i].appliance);
            }
        };
        for (let i = 0; i < rechercheEnCours.length; i++) {
            for (let j = 0; j < rechercheEnCours[i].ustensils.length; j++) {
                if(!listeUstensilesRecherche.includes(rechercheEnCours[i].ustensils[j])){
                    listeUstensilesRecherche.push(rechercheEnCours[i].ustensils[j]);
                }
            }
        }
    }
    let listeIngredients = document.querySelectorAll('.listeIngredients');
    let listeAppareils = document.querySelectorAll('.listeAppareils');
    let listeUstensiles = document.querySelectorAll('.listeUstensiles');

    
    listeIngredients[0].innerHTML = '';
    listeAppareils[0].innerHTML = '';
    listeUstensiles[0].innerHTML ='';

    let p = document.createElement('p');
    p.classList.add('btnTag');
    for (let i = 0; i < listeIngredientsRecherche.length; i++) {
        let tag =  p.cloneNode();
        tag.setAttribute('id', listeIngredientsRecherche[i]);
        tag.innerHTML = listeIngredientsRecherche[i];
        listeIngredients[0].append(tag);
    };
    for (let i = 0; i < listeAppareilsRecherche.length; i++) {
        let tag =  p.cloneNode();
        tag.setAttribute('id', listeAppareilsRecherche[i]);
        tag.innerHTML = listeAppareilsRecherche[i];
        listeAppareils[0].append(tag);
    };
    for (let i = 0; i < listeUstensilesRecherche.length; i++) {
        let tag =  p.cloneNode();
        tag.setAttribute('id', listeUstensilesRecherche[i]);
        tag.innerHTML = listeUstensilesRecherche[i];
        listeUstensiles[0].append(tag);
    };
    ecouteClicTag();
}

/**
 * Fonction qui gere l'ouverture des recherche par tag
 */
function ouvreRechercheTag() {
    let tagIngredient = document.querySelectorAll('.btn-primary');
    let tagAppareil = document.querySelectorAll('.vert1');
    let tagUstensiles = document.querySelectorAll('.rouge1');
    let listeIngredients = document.querySelectorAll('.listeIngredients');
    let listeAppareils = document.querySelectorAll('.listeAppareils');
    let listeUstensiles = document.querySelectorAll('.listeUstensiles');
    for (let i = 0; i < tagIngredient.length; i++) {
        tagIngredient[i].addEventListener('click', function(event){
            toggleAffichageTag(listeIngredients[0],event, listeAppareils[0], listeUstensiles[0]);
        })
    };
    for (let i = 0; i < tagAppareil.length; i++) {
        tagAppareil[i].addEventListener('click', function(event){
            toggleAffichageTag(listeAppareils[0],event, listeIngredients[0], listeUstensiles[0] );
        });
    };
    for (let i = 0; i < tagUstensiles.length; i++) {
        tagUstensiles[i].addEventListener('click', function(event){
            toggleAffichageTag(listeUstensiles[0],event, listeIngredients[0], listeAppareils[0] );
        });
    };
};


/**
 * Fonction qui toggle l'affichage ou non des tags
 * @param {object} categorie categorie à afficher ou à masquer
 * @param {object} event si champ texte on le vide
 * @param {object} categorieOff1 catégorie à masquer
 * @param {object} categorieOff2 catégorie à masquer
 */
function toggleAffichageTag(categorie, event, categorieOff1, categorieOff2){
    if(categorie.style.display === "" || categorie.style.display === "none"){
        categorie.style.display = "flex";
        categorieOff1.style.display = "none";
        categorieOff2.style.display = "none";
    }else{
        categorie.style.display = "none"
    };
    if(event.target.type === "text"){
        event.target.value = "";
    };
};

function ecouteClicTag(){
    let btnTag = document.querySelectorAll('.btnTag');
    console.log(btnTag);
}

ecouteRecherche();
ouvreRechercheTag();
afficheCard(recipes);
