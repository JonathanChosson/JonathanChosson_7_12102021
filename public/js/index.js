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
let listeIngredients = document.querySelectorAll('.listeIngredients');
let listeAppareils = document.querySelectorAll('.listeAppareils');
let listeUstensiles = document.querySelectorAll('.listeUstensiles');

/**
 * Génére et affiche une card par recette 
 * @param {array} tableauEntree Tableau des recettes filtré ou non
 */
function afficheCard(tableauEntree){
    main.innerHTML =``;
    let div = document.createElement('div');
    if(tableauEntree.length === 0){
        main.innerHTML = `<p class='h1 text-center'>Votre recherche ne renvoie aucun résultat`;
    }
    tableauEntree.forEach(recette => {
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
    let div = document.createElement('div');
    div.setAttribute('id', 'tagActif');
    if(document.getElementById('tagActif')){
        document.getElementById('tagActif').remove();
    }
    let span = document.createElement('span');
    span.classList.add('badge', 'm-1');
    tagActif.forEach(tag => {
        let spanActif = span.cloneNode();
        if(tag.source === 'i'){
            spanActif.classList.add('badge-primary');
        }else if(tag.source === 'a'){
            spanActif.classList.add('vert');
        }else if(tag.source === 'u'){
            spanActif.classList.add('rouge');
        }
        spanActif.innerHTML = tag.tag + ' ' + `<i id="${tag.tag}" class="far fa-times-circle fermer"></i>`;
        div.append(spanActif);
    });
    champRecherche.parentNode.insertAdjacentElement('afterend',div);
    fermetureTag();
    toggleAffichageTag();
}

/**
 * Ecoute la saisi sur le champ recherche
 */
function ecouteRecherche(){
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
 * fonction qui recherche pour chaque mot si c'est un tag ingredient
 * @param {array} tableauRecherche tableau fournis par {@link ecouteRecherche}
 */
function rechercheTag(tableauRecherche){
    rechercheEnCours = [];
    tableauRecherche.forEach(recherche => {
        if(recherche.length > 2){
            rechercheTagCategorie(recherche);
        }
    });
    afficheCard(rechercheEnCours);
}


/**
 * Fonction qui recherche dans le titre et dans la description des recettes 
 * @param {array} tableauRecherche tableau fournis par {@link ecouteRecherche}
 */
function rechercheGlobal(tableauRecherche){
    rechercheEnCours = [];
    tableauRecherche.forEach(recherche => {
        recipes.forEach(recette => {
            if(recette.name.toUpperCase().split(' ').includes(recherche.toUpperCase()) || recette.description.toUpperCase().split(' ').includes(recherche.toUpperCase())){
                ajoutRecetteRecherche(recette);
            }
        });
    });
    afficheCard(rechercheEnCours);
}

/**
 * Vérifie que le mot en entrée est présent dans ingrédients 
 * @param {string} tag 
 */
function rechercheTagCategorie(tag){
    if(rechercheEnCours.length <= 0){
        recipes.forEach(recette => {
            recette.ingredients.forEach(ingredient => {
                if(ingredient.ingredient.toUpperCase().includes(tag)){
                    ajoutRecetteRecherche(recette);
                    ajoutTagActif(tag , 'i');
                }
            });
            if(recette.appliance.toUpperCase().includes(tag)){
                ajoutRecetteRecherche(recette);
                ajoutTagActif(tag , 'a');
            };
            recette.ustensils.forEach(ustensil => {
                if(ustensil.toUpperCase().includes(tag)){
                    ajoutRecetteRecherche(recette);
                    ajoutTagActif(tag , 'u');
                }
            });
        });

    }else{
        let tableauTemporaire = []
        rechercheEnCours.forEach(recetteEnCours => {
            recetteEnCours.ingredients.forEach(ingredient => {
                if(ingredient.ingredient.toUpperCase().includes(tag) === true){
                    tableauTemporaire.push(recetteEnCours);
                    ajoutTagActif(tag , 'i');
                }
            });
            if(recetteEnCours.appliance.toUpperCase().includes(tag) === true){
                tableauTemporaire.push(recetteEnCours);
                ajoutTagActif(tag , 'a');
            };
            recetteEnCours.ustensils.forEach(ustensil => {
                if(ustensil.toUpperCase().includes(tag) === true){
                    tableauTemporaire.push(recetteEnCours);
                    ajoutTagActif(tag , 'u');
                }
            });
        });
        if(tableauTemporaire.length > 0 ){
            rechercheEnCours = tableauTemporaire;
        }
    }
    afficheCard(rechercheEnCours);
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
    tagActif.forEach(tag => {
        if(tag.tag === tagAjout.tag){
            estActif ++;
        }
    });
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
            tagActif.forEach(tag => {
                tableauTag.push(tag.tag);
            });
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
        recipes.forEach(recette => {
            recette.ingredients.forEach(ingredient => {
                if(!listeIngredientsRecherche.includes(ingredient.ingredient)){
                    listeIngredientsRecherche.push(ingredient.ingredient);
                }
            });
            if(!listeAppareilsRecherche.includes(recette.appliance)){
                listeAppareilsRecherche.push(recette.appliance);
            };
            recette.ustensils.forEach(ustensil => {
                if(!listeUstensilesRecherche.includes(ustensil)){
                    listeUstensilesRecherche.push(ustensil);
                }
            });
        });
    }else{
        rechercheEnCours.forEach(recetteEnCours => {
            recetteEnCours.ingredients.forEach(ingredient => {
                if(!listeIngredientsRecherche.includes(ingredient.ingredient)){
                    listeIngredientsRecherche.push(ingredient.ingredient);
                }
            });
            if(!listeAppareilsRecherche.includes(recetteEnCours.appliance)){
                listeAppareilsRecherche.push(recetteEnCours.appliance);
            };
            recetteEnCours.ustensils.forEach(ustensil => {
                if(!listeUstensilesRecherche.includes(ustensil)){
                    listeUstensilesRecherche.push(ustensil);
                }
            });
        });
    }
    let listeIngredients = document.querySelectorAll('.listeIngredients');
    let listeAppareils = document.querySelectorAll('.listeAppareils');
    let listeUstensiles = document.querySelectorAll('.listeUstensiles');

    
    listeIngredients[0].innerHTML = '';
    listeAppareils[0].innerHTML = '';
    listeUstensiles[0].innerHTML ='';

    let p = document.createElement('p');
    p.classList.add('btnTag');
    listeIngredientsRecherche.forEach(ingredient => {
        let tag =  p.cloneNode();
        tag.setAttribute('id', ingredient);
        tag.innerHTML = ingredient;
        listeIngredients[0].append(tag);
    });
    listeAppareilsRecherche.forEach(appareil => {
        let tag =  p.cloneNode();
        tag.setAttribute('id', appareil);
        tag.innerHTML = appareil;
        listeAppareils[0].append(tag);
    });
    listeUstensilesRecherche.forEach(ustensile => {
        let tag =  p.cloneNode();
        tag.setAttribute('id', ustensile);
        tag.innerHTML = ustensile;
        listeUstensiles[0].append(tag);
    });
    ecouteClicTag();
    ecouteRechercheTag();
}

/**
 * Fonction qui gere l'ouverture des recherche par tag
 */
function ouvreRechercheTag() {
    let tagIngredient = document.querySelectorAll('.btn-primary');
    let tagAppareil = document.querySelectorAll('.vert1');
    let tagUstensiles = document.querySelectorAll('.rouge1');
    tagIngredient.forEach(btnTag => {
        btnTag.addEventListener('click', function(event){
            toggleAffichageTag(listeIngredients[0],event, listeAppareils[0], listeUstensiles[0]);
        })
    });
    tagAppareil.forEach(btnTag => {
        btnTag.addEventListener('click', function(event){
            toggleAffichageTag(listeAppareils[0],event, listeIngredients[0], listeUstensiles[0] );
        });
    });
    tagUstensiles.forEach(btnTag => {
        btnTag.addEventListener('click', function(event){
            toggleAffichageTag(listeUstensiles[0],event, listeIngredients[0], listeAppareils[0] );
        });
    });
};


/**
 * Fonction qui toggle l'affichage ou non des tags
 * @param {object} categorie categorie à afficher ou à masquer
 * @param {object} event si champ texte on le vide
 * @param {object} categorieOff1 catégorie à masquer
 * @param {object} categorieOff2 catégorie à masquer
 */
function toggleAffichageTag(categorie, event, categorieOff1, categorieOff2){
    if(!categorie){
        listeAppareils[0].style.display = "none";
        listeIngredients[0].style.display = "none";
        listeUstensiles[0].style.display = "none";
    }else if(categorie.style.display === "" || categorie.style.display === "none"){
        categorie.style.display = "flex";
        categorieOff1.style.display = "none";
        categorieOff2.style.display = "none";
    }else{
        categorie.style.display = "none"
    };
    if(event != undefined && event.target.type === "text"){
        event.target.value = "";
    };
};

/**
 * Ecoute le clic sur un tag 
 */
function ecouteClicTag(){
    let btnTag = document.querySelectorAll('.btnTag');
    btnTag.forEach(btn => {
        btn.addEventListener('click', function(){
            rechercheTagCategorie(btn.id.toUpperCase());
        })
    });
};


/**
 * Ecoute la saisie dans les champs de tag 
 */
function ecouteRechercheTag(){
    let champIngredients = document.getElementById('Ingredients');
    let champAppareils = document.getElementById('Appareils');
    let champUstensiles = document.getElementById('Ustensiles');
    let champs = [champAppareils, champIngredients, champUstensiles];
    champs.forEach(champ => {
        champ.addEventListener('keypress', function(event){
            if(event.key === "Enter" & champ.value.length > 2){
                rechercheTagCategorie(event.target.value.toUpperCase());
                event.target.value = "";
            }
        });
    });
}

ecouteRecherche();
ouvreRechercheTag();
afficheCard(recipes);

/**
 * Verifie ou l'on click afin de basculer au besoin l'affichage des tags
 */
document.addEventListener('click', function(event){
    if(!event.target.classList.contains('bg-primary') && !event.target.classList.contains('btn-primary') && !event.target.classList.contains('vert') && !event.target.classList.contains('vert1') && !event.target.classList.contains('rouge') && !event.target.classList.contains('rouge1')){
        toggleAffichageTag();
    }
})
