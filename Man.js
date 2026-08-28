  
document.addEventListener('DOMContentLoaded', function() {
    
    // =========== VARIABLES ===========
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('fermer_btn');
    const sidebar = document.querySelector('aside');
    const themeToggler = document.querySelector('.them-toggler');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const recentOrderLink = document.querySelector('.recent-order a');
    const addProductBtn = document.querySelector('.itheme_add_products');
    
    // =========== FONCTIONS UTILITAIRES ===========
    
    // Fonction pour sauvegarder le thème dans localStorage
    function saveTheme(theme) {
        localStorage.setItem('dashboard-theme', theme);
    }
    
    // Fonction pour charger le thème depuis localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme-variable');
            // Mettre à jour les icônes du sélecteur de thème
            if (themeToggler) {
                const spans = themeToggler.querySelectorAll('span');
                spans[0].classList.remove('active');
                spans[1].classList.add('active');
            }
        }
    }
    
    // Fonction pour mettre à jour le compteur de messages
    function updateMessageCount() {
        const messageCount = document.querySelector('.message-count');
        if (messageCount) {
            const randomCount = Math.floor(Math.random() * 50);
            messageCount.textContent = randomCount;
            
            // Ajouter une animation
            messageCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                messageCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Fonction pour simuler la mise à jour des données
    function simulateDataUpdate() {
        const percentages = document.querySelectorAll('.sprogres .number p');
        percentages.forEach(p => {
            const currentValue = parseInt(p.textContent);
            const newValue = Math.min(100, Math.max(0, currentValue + (Math.random() * 10 - 5)));
            p.textContent = Math.round(newValue) + '%';
            
            // Mettre à jour la barre de progression circulaire
            const parentCard = p.closest('.ninithe > div');
            if (parentCard) {
                const circle = parentCard.querySelector('circle');
                if (circle) {
                    const offset = 100 - newValue;
                    circle.style.strokeDashoffset = offset;
                }
            }
        });
        
        // Mettre à jour les valeurs des titres
        const amounts = document.querySelectorAll('.ninithe .lef h1');
        amounts.forEach(amount => {
            const current = parseInt(amount.textContent.replace('FCFA', '').trim()) || 0;
            const change = Math.floor(Math.random() * 10000 - 5000);
            const newAmount = Math.max(0, current + change);
            amount.textContent = new Intl.NumberFormat('fr-FR').format(newAmount) + ' FCFA';
        });
    }
    
    // Fonction pour ajouter une nouvelle ligne au tableau
    function addTableRow() {
        const tableBody = document.querySelector('main table tbody');
        if (tableBody) {
            const newRow = document.createElement('tr');
            const products = ['Drone Pro X', 'Camera 4K', 'Smart Watch', 'Wireless Headphones', 'Laptop Stand'];
            const statuses = ['warning', 'success', 'danger'];
            const statusText = ['pending', 'delivered', 'cancelled'];
            
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomStatus = Math.floor(Math.random() * 3);
            
            newRow.innerHTML = `
                <td>${randomProduct}</td>
                <td>${Math.floor(Math.random() * 90000) + 10000}</td>
                <td>Due</td>
                <td class="${statuses[randomStatus]}">${statusText[randomStatus]}</td>
                <td class="primary">Détails</td>
            `;
            
            tableBody.insertBefore(newRow, tableBody.firstChild);
            
            // Animation d'entrée
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                newRow.style.transition = 'all 0.3s ease';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            }, 10);
            
            // Limiter à 10 lignes maximum
            if (tableBody.children.length > 10) {
                tableBody.removeChild(tableBody.lastChild);
            }
        }
    }
    
    // =========== GESTION DU MENU MOBILE ===========
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }
    
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        });
    }
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== menuBtn && 
            !menuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // =========== GESTION DU THÈME ===========
    if (themeToggler) {
        // Charger le thème sauvegardé
        loadTheme();
        
        themeToggler.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme-variable');
            
            const spans = themeToggler.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            // Sauvegarder le thème
            const isDark = document.body.classList.contains('dark-theme-variable');
            saveTheme(isDark ? 'dark' : 'light');
            
            // Ajouter une animation au changement de thème
            themeToggler.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeToggler.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // =========== GESTION DES LIENS DE LA SIDEBAR ===========
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Retirer la classe active de tous les liens
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            link.classList.add('active');
            
            // Si on est en mobile, fermer le menu après le clic
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Animation de feedback
            link.style.transform = 'translateX(5px)';
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
            }, 200);
            
            // Empêcher le comportement par défaut si c'est un lien #
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    // =========== GESTION DU LIEN "SHOW ALL" ===========
    if (recentOrderLink) {
        recentOrderLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Simulation de chargement
            recentOrderLink.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Chargement...';
            recentOrderLink.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // Ajouter 5 nouvelles lignes
                for (let i = 0; i < 5; i++) {
                    addTableRow();
                }
                
                // Restaurer le lien
                recentOrderLink.innerHTML = 'Show All';
                recentOrderLink.style.pointerEvents = 'auto';
                
                // Message de confirmation
                showNotification('5 nouvelles commandes chargées avec succès', 'success');
            }, 1000);
        });
    }
    
    // =========== GESTION DU BOUTON "ADD PRODUCTS" ===========
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            // Animation de clic
            addProductBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addProductBtn.style.transform = 'scale(1)';
            }, 200);
            
            // Ouvrir un modal ou rediriger (simulation)
            showNotification('Fonctionnalité "Ajouter un produit" bientôt disponible!', 'warning');
        });
    }
    
    // =========== FONCTION POUR AFFICHER LES NOTIFICATIONS ===========
    function showNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">
                ${type === 'success' ? '<i class="fa-solid fa-check"></i>' : 
                  type === 'warning' ? '<i class="fa-solid fa-exclamation"></i>' : 
                  type === 'danger' ? '<i class="fa-solid fa-times"></i>' : 
                  '<i class="fa-solid fa-info"></i>'}
            </span>
            <span class="notification-message">${message}</span>
            <span class="notification-close"><i class="fa-solid fa-times"></i></span>
        `;
        
        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success, #41f1b6)' : 
                        type === 'warning' ? 'var(--color-warning, #ffbb55)' : 
                        type === 'danger' ? 'var(--color-danger, #ff7782)' : 
                        'var(--color-primary, #7388cc)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-2);
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Afficher la notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Fermer la notification
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // =========== MISE À JOUR AUTOMATIQUE DES DONNÉES ===========
    // Mettre à jour les données toutes les 30 secondes
    setInterval(simulateDataUpdate, 30000);
    
    // Mettre à jour le compteur de messages toutes les minutes
    setInterval(updateMessageCount, 60000);
    
    // =========== GESTION DES ÉVÉNEMENTS CLAVIER ===========
    document.addEventListener('keydown', (e) => {
        // Échap pour fermer le menu
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // T pour changer le thème
        if (e.key === 't' || e.key === 'T') {
            if (themeToggler) {
                themeToggler.click();
            }
        }
    });
    
    // =========== SIMULATION DE DONNÉES INITIALES ===========
    // Mettre à jour les données une première fois
    setTimeout(simulateDataUpdate, 1000);
    setTimeout(updateMessageCount, 500);
    
    // =========== AJOUT DE STYLES CSS DYNAMIQUES ===========
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-close {
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .dark-theme-variable {
            --color-background: #181a1e;
            --color-white: #202528;
            --color-dark: #edeffd;
            --color-dark-variant: #a3bdcc;
            --color-link: rgba(0, 0, 0, 0.4);
            --box-shadow: 0 2rem 3rem var(--color-link);
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 80px;
                right: 10px;
                left: 10px;
            }
        }
    `;
    document.head.appendChild(dynamicStyles);
    
    // =========== LOG DE DÉMARRAGE ===========
    console.log('Dashboard initialisé avec succès!');
});

 // Gestionnaire d'ajout de produits
function initializeProductManager() {
    // Éléments DOM
    const addProductTrigger = document.getElementById('addProductTrigger');
    const productFormOverlay = document.getElementById('productFormOverlay');
    const closeProductForm = document.getElementById('closeProductForm');
    const cancelProductForm = document.getElementById('cancelProductForm');
    const productForm = document.getElementById('productForm');
    
    // Ouvrir le formulaire
    addProductTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        productFormOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Empêche le scroll
    });
    
    // Fermer le formulaire
    function closeForm() {
        productFormOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Réactive le scroll
        productForm.reset(); // Réinitialise le formulaire
    }
    
    closeProductForm.addEventListener('click', closeForm);
    cancelProductForm.addEventListener('click', closeForm);
    
    // Fermer en cliquant en dehors du formulaire
    productFormOverlay.addEventListener('click', function(e) {
        if (e.target === productFormOverlay) {
            closeForm();
        }
    });
    
    // Soumission du formulaire
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation des données
        const productData = {
            name: document.getElementById('productName').value.trim(),
            number: document.getElementById('productNumber').value.trim(),
            price: parseInt(document.getElementById('productPrice').value) || 0,
            quantity: parseInt(document.getElementById('productQuantity').value) || 0,
            category: document.getElementById('productCategory').value,
            status: document.getElementById('productStatus').value,
            description: document.getElementById('productDescription').value.trim(),
            date: new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        };
        
        // Validation basique
        if (!productData.name || !productData.number) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Ajouter le produit au tableau
        addToRecentOrders(productData);
        
        // Mettre à jour les statistiques
        updateStatistics(productData);
        
        // Afficher notification de succès
        showNotification('Produit ajouté avec succès !', 'success');
        
        // Fermer le formulaire
        closeForm();
    });
}

// Fonction pour ajouter au tableau Recent Orders
function addToRecentOrders(product) {
    const tableBody = document.querySelector('.recent-order tbody');
    
    // Créer la nouvelle ligne
    const newRow = document.createElement('tr');
    
    // Déterminer la classe CSS pour le statut
    let statusClass = 'warning';
    let statusText = product.status;
    
    switch(product.status) {
        case 'En stock':
            statusClass = 'success';
            break;
        case 'Rupture':
            statusClass = 'danger';
            break;
        case 'Commande':
            statusClass = 'warning';
            break;
    }
    
    newRow.innerHTML = `
        <td>${product.name}</td>
        <td>${product.number}</td>
        <td>${product.price.toLocaleString()} FCFA</td>
        <td class="${statusClass}">${statusText}</td>
        <td class="primary">Détails</td>
    `;
    
    // Ajouter au début du tableau
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Limiter à 6 lignes maximum
    if (tableBody.children.length > 6) {
        tableBody.removeChild(tableBody.lastChild);
    }
}

// Fonction pour mettre à jour les statistiques
function updateStatistics(product) {
    // Mettre à jour le compteur de commandes en ligne
    const onlineOrders = document.querySelectorAll('.item_online h3');
    if (onlineOrders.length > 0) {
        const firstOnlineOrder = onlineOrders[0];
        let currentCount = parseInt(firstOnlineOrder.textContent) || 0;
        firstOnlineOrder.textContent = (currentCount + 1).toString();
    }
    
    // Mettre à jour le total des ventes
    const totalSalesElement = document.querySelector('.sales h1');
    if (totalSalesElement) {
        // Dans un vrai système, vous récupéreriez le total depuis une base de données
        // Pour l'exemple, nous ajoutons simplement le prix
        console.log(`Produit ajouté: ${product.name} - ${product.price} FCFA`);
    }
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `product-notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeProductManager);

// Gestionnaire de thème
function initializeTheme() {
    // Vérifier si l'utilisateur a une préférence sauvegardée
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Appliquer le thème sauvegardé
    applyTheme(savedTheme);
    
    // Créer un bouton pour changer de thème (optionnel)
    createThemeToggle();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('theme-dark'); // Supprime l'ancienne classe si elle existe
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme', 'theme-dark');
        document.body.setAttribute('data-theme', 'light');
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('theme', theme);
}

function createThemeToggle() {
    // Créer un bouton de toggle si vous en voulez un
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = `
        <i class="fa-solid fa-moon"></i>
        <span>Changer de thème</span>
    `;
    
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 100;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
    
    document.body.appendChild(themeToggle);
}

// Si vous voulez un thème fixe (toujours sombre), ajoutez simplement :
document.addEventListener('DOMContentLoaded', function() {
    
});