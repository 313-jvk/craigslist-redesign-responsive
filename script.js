// ====================================
// 2.4. Menu Hamburger Fonctionnel
// ====================================

// Sélectionne l'icône du menu hamburger
const menuIcon = document.querySelector('#menu-icon');

// Sélectionne le conteneur de la navigation principale
const navMenu = document.querySelector('.main-nav');

// Ajoute un écouteur d'événement 'click' à l'icône du menu
menuIcon.addEventListener('click', () => {
    // Bascule la classe 'active' sur l'icône du menu (pour changer son apparence, ex: en 'x')
    // Pour cela, assurez-vous d'avoir une classe Boxicons pour le 'x' si vous voulez cet effet.
    // Par exemple, si vous utilisez 'bx bx-menu', vous pouvez basculer vers 'bx bx-x' ou simplement une classe 'active' pour changer la couleur.
    // Pour l'instant, nous allons juste basculer 'active' sur le menu.
    menuIcon.classList.toggle('active'); // Vous pouvez styliser #menu-icon.active dans votre CSS si vous voulez qu'il change de couleur ou de forme

    // Bascule la classe 'active' sur le menu de navigation
    // Cette classe 'active' est celle que nous avons définie dans responsive.css pour afficher/cacher le menu.
    navMenu.classList.toggle('active');
}); 

// ====================================
// 3.1. Fonctionnalité de Recherche/Filtrage en Temps Réel (list.html)
// ====================================

// Références aux éléments HTML
const searchInput = document.querySelector('#search-input');
const filterSelect = document.querySelector('#filter-select');
const adListContainer = document.querySelector('#ad-list-container'); // La UL qui contient les annonces

// Stocke toutes les annonces originales une fois le DOM chargé
// C'est crucial pour pouvoir toujours filtrer/trier sur la liste complète
let allAdItems = [];

// Fonction utilitaire pour extraire le prix d'une chaîne de texte
function extractPrice(priceString) {
    const numericPart = priceString.replace(/[^0-9]/g, ''); // Garde seulement les chiffres
    return parseInt(numericPart, 10) || 0; // Convertit en nombre, 0 si non valide
}

// Fonction principale qui gère le filtrage et le tri
function performFilteringAndSorting() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = filterSelect.value;

    // Étape 1: Filtrer les annonces basées sur le terme de recherche
    const filteredAds = allAdItems.filter(ad => {
        const title = ad.querySelector('.ad-title').textContent.toLowerCase();
        const description = ad.querySelector('p') ? ad.querySelector('p').textContent.toLowerCase() : ''; // Si description existe
        // Ou vous pouvez ajouter d'autres champs à rechercher comme la location
        const location = ad.querySelector('.ad-location') ? ad.querySelector('.ad-location').textContent.toLowerCase() : '';

        return title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm);
    });

    // Étape 2: Trier les annonces filtrées
    filteredAds.sort((a, b) => {
        if (sortValue === 'date-desc') {
            // Pour l'instant, les dates sont des chaînes, un tri simple basé sur le texte fonctionne (Juil 29 > Juil 28)
            // Pour un tri exact, il faudrait convertir les dates en objets Date
            const dateA = a.querySelector('.ad-date').textContent;
            const dateB = b.querySelector('.ad-date').textContent;
            return dateB.localeCompare(dateA); // Trie par ordre décroissant (plus récent d'abord)
        } else if (sortValue === 'price-asc') {
            const priceA = extractPrice(a.querySelector('.ad-price').textContent);
            const priceB = extractPrice(b.querySelector('.ad-price').textContent);
            return priceA - priceB; // Trie par prix croissant
        } else if (sortValue === 'price-desc') {
            const priceA = extractPrice(a.querySelector('.ad-price').textContent);
            const priceB = extractPrice(b.querySelector('.ad-price').textContent);
            return priceB - priceA; // Trie par prix décroissant
        }
        return 0; // Pas de tri si 'default' ou autre
    });

    // Étape 3: Mettre à jour l'affichage
    // Vide le conteneur actuel
    adListContainer.innerHTML = '';
    // Ajoute les annonces filtrées et triées
    filteredAds.forEach(ad => {
        adListContainer.appendChild(ad);
    });
}

// ... (code existant pour le menu hamburger, etc.) ...

// ====================================
// 3.1. Fonctionnalité de Recherche/Filtrage en Temps Réel (list.html)
// ====================================

// ... (code existant pour searchInput, filterSelect, adListContainer, extractPrice, performFilteringAndSorting) ...

// ====================================
// 3.2. "Voir Plus" / Pagination Dynamique (list.html)
// ====================================

// ... (code existant pour loadMoreBtn, adsPerPage, currentDisplayedAds, displayMoreAds, surcharge de performFilteringAndSorting) ...


// Initialisation pour la pagination et le pré-filtrage au chargement de la page (si la page est list.html)
document.addEventListener('DOMContentLoaded', () => {
    if (adListContainer) {
        // Peupler allAdItems dès que le DOM est prêt
        allAdItems = Array.from(adListContainer.children);

        // NOUVEAU CODE POUR LA LECTURE DES PARAMÈTRES D'URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('q'); // Récupère la valeur du paramètre 'q'

        if (searchTermFromUrl) {
            // Décode le terme (remplace %20 par des espaces, etc.)
            const decodedSearchTerm = decodeURIComponent(searchTermFromUrl);
            // Définit la valeur de l'input de recherche
            searchInput.value = decodedSearchTerm;
        }
        // FIN DU NOUVEAU CODE


        // Attache les écouteurs d'événements (ceci était déjà là)
        searchInput.addEventListener('input', performFilteringAndSorting);
        filterSelect.addEventListener('change', performFilteringAndSorting);
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentDisplayedAds += adsPerPage;
                performFilteringAndSorting(); // Appelle la version surchargée
            });
        }

        // Appelle la fonction de filtrage/tri/pagination au chargement initial de la page
        // Ceci appliquera soit le filtre de l'URL, soit aucun filtre si le champ est vide.
        window.performFilteringAndSorting(); // Appel initial pour appliquer filtres/pagination
    }
}); 

// Note pour la navigation par catégorie depuis index.html:
// Si vous voulez filtrer directement par catégorie depuis index.html, il faudrait
// ajouter une logique pour lire les paramètres d'URL (ex: ?category=for-sale)
// et appeler `performFilteringAndSorting` avec un pré-filtre au chargement de list.html.
// Nous pouvons le faire si vous le souhaitez après cette tâche. 

// ====================================
// 3.2. "Voir Plus" / Pagination Dynamique (list.html)
// ====================================

// Référence au bouton "Voir plus"
const loadMoreBtn = document.querySelector('#load-more-btn');

// Variable pour gérer les annonces actuellement affichées et le nombre à afficher
const adsPerPage = 5; // Nombre d'annonces à afficher par "page" ou chargement
let currentDisplayedAds = adsPerPage; // Commence avec le nombre d'annonces déjà visibles par défaut

// Fonction pour afficher plus d'annonces
function displayMoreAds() {
    // Si allAdItems n'est pas encore défini (par exemple, si on arrive directement sur list.html)
    // On s'assure qu'il est peuplé
    if (allAdItems.length === 0 && adListContainer) {
        allAdItems = Array.from(adListContainer.children);
    }

    // Cache toutes les annonces initialement
    allAdItems.forEach(ad => ad.style.display = 'none');

    // Affiche les annonces jusqu'à currentDisplayedAds
    for (let i = 0; i < currentDisplayedAds && i < allAdItems.length; i++) {
        allAdItems[i].style.display = 'flex'; // Ou 'block' ou autre selon votre display par défaut pour .ad-item
    }

    // Cache le bouton "Voir plus" s'il n'y a plus d'annonces à afficher
    if (currentDisplayedAds >= allAdItems.length && loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    } else if (loadMoreBtn) {
        loadMoreBtn.style.display = 'block'; // S'assurer qu'il est visible si des annonces restent
    }
}

// Gère le clic sur le bouton "Voir plus"
if (loadMoreBtn) { // S'assure que le bouton existe avant d'ajouter l'écouteur
    loadMoreBtn.addEventListener('click', () => {
        currentDisplayedAds += adsPerPage; // Incrémente le nombre d'annonces à afficher
        performFilteringAndSorting(); // Applique le filtre/tri et le nouvel affichage
    });
}

// Surcharge la fonction performFilteringAndSorting existante pour inclure l'affichage limité
// C'est important car le filtrage et le tri doivent aussi respecter la pagination
const originalPerformFilteringAndSorting = window.performFilteringAndSorting; // Sauvegarde la référence originale

window.performFilteringAndSorting = function() {
    originalPerformFilteringAndSorting(); // Appelle la logique de filtrage et de tri existante

    // Après le filtrage/tri, on applique la logique de pagination
    // Il faut que allAdItems contienne les éléments DOM dans leur état actuel (après filtrage/tri)
    // Pour cela, on va remodifier légèrement performFilteringAndSorting pour qu'elle renvoie la liste filtrée et triée, ou qu'elle mette à jour une variable globale.
    // Plus simple : on prend directement les enfants actuels du conteneur après le tri.

    const currentlyVisibleAds = Array.from(adListContainer.children); // Prend les éléments DOM actuellement dans le conteneur

    // Cache tous les éléments, puis affiche seulement les X premiers
    currentlyVisibleAds.forEach(ad => ad.style.display = 'none');
    for (let i = 0; i < currentDisplayedAds && i < currentlyVisibleAds.length; i++) {
        currentlyVisibleAds[i].style.display = 'flex'; // ou 'block'
    }

    // Cache/montre le bouton Voir plus en fonction du nombre d'annonces actuellement disponibles
    if (loadMoreBtn) {
        if (currentDisplayedAds >= currentlyVisibleAds.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
};


// Initialisation pour la pagination au chargement de la page (si la page est list.html)
// ... (code existant pour le menu hamburger, etc.) ...

// ====================================
// 3.1. Fonctionnalité de Recherche/Filtrage en Temps Réel (list.html)
// ====================================

// ... (code existant pour searchInput, filterSelect, adListContainer, extractPrice, performFilteringAndSorting) ...

// ====================================
// 3.2. "Voir Plus" / Pagination Dynamique (list.html)
// ====================================

// ... (code existant pour loadMoreBtn, adsPerPage, currentDisplayedAds, displayMoreAds, surcharge de performFilteringAndSorting) ...


// Initialisation pour la pagination et le pré-filtrage au chargement de la page (si la page est list.html)
document.addEventListener('DOMContentLoaded', () => {
    if (adListContainer) {
        // Peupler allAdItems dès que le DOM est prêt
        allAdItems = Array.from(adListContainer.children);

        // NOUVEAU CODE POUR LA LECTURE DES PARAMÈTRES D'URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('q'); // Récupère la valeur du paramètre 'q'

        if (searchTermFromUrl) {
            // Décode le terme (remplace %20 par des espaces, etc.)
            const decodedSearchTerm = decodeURIComponent(searchTermFromUrl);
            // Définit la valeur de l'input de recherche
            searchInput.value = decodedSearchTerm;
        }
        // FIN DU NOUVEAU CODE


        // Attache les écouteurs d'événements (ceci était déjà là)
        searchInput.addEventListener('input', performFilteringAndSorting);
        filterSelect.addEventListener('change', performFilteringAndSorting);
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentDisplayedAds += adsPerPage;
                performFilteringAndSorting(); // Appelle la version surchargée
            });
        }

        // Appelle la fonction de filtrage/tri/pagination au chargement initial de la page
        // Ceci appliquera soit le filtre de l'URL, soit aucun filtre si le champ est vide.
        window.performFilteringAndSorting(); // Appel initial pour appliquer filtres/pagination
    }
}); 


// Note importante : La logique de `performFilteringAndSorting` que nous avons écrite précédemment
// vide et repeuple `adListContainer`. Pour que la pagination fonctionne bien avec,
// il faut s'assurer que `currentDisplayedAds` soit bien pris en compte APRES le tri.
// La surcharge ci-dessus gère cela en ré-appliquant la limite après le tri. 

