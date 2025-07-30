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

// Initialisation au chargement de la page pour la page de liste
document.addEventListener('DOMContentLoaded', () => {
    // S'assurer que nous sommes bien sur la page list.html avant d'activer les écouteurs
    if (adListContainer) {
        // Stocke une copie des éléments d'annonce originaux
        allAdItems = Array.from(adListContainer.children); // Convertit la NodeList en Array

        // Attache les écouteurs d'événements
        searchInput.addEventListener('input', performFilteringAndSorting); // 'input' pour une recherche en temps réel
        filterSelect.addEventListener('change', performFilteringAndSorting); // 'change' quand la sélection change

        // Pour s'assurer que le tri initial est appliqué si l'option par défaut n'est pas "Plus récent"
        // performFilteringAndSorting(); // Peut être appelé ici si vous voulez un tri par défaut différent de l'ordre HTML
    }
});

// Note pour la navigation par catégorie depuis index.html:
// Si vous voulez filtrer directement par catégorie depuis index.html, il faudrait
// ajouter une logique pour lire les paramètres d'URL (ex: ?category=for-sale)
// et appeler `performFilteringAndSorting` avec un pré-filtre au chargement de list.html.
// Nous pouvons le faire si vous le souhaitez après cette tâche. 

