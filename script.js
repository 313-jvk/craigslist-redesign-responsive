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