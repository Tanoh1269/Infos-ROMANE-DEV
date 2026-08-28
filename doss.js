// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// fermer le menu en cliquant 
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Reservation Modal
const reserveButtons = document.querySelectorAll('.reserve-btn');
const reservationModal = document.getElementById('reservationModal');
const closeModal = document.querySelector('.close-modal');
const reservationSalle = document.getElementById('reservation-salle');
const reservationForm = document.getElementById('reservationForm');

// Paiement Modal
const paiementModal = document.getElementById('ModePaiement');
const fermerPaiement = document.querySelector('.fermer_Paiement');
const paiementForm = document.getElementById('ModeFrom');

// Variables pour stocker les données de réservation
let reservationData = {};

// Ouvrir le modal de réservation
reserveButtons.forEach(button => {
    button.addEventListener('click', function() {
        const salleName = this.getAttribute('data-salle');
        reservationSalle.value = salleName;
        reservationModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Fermer le modal de réservation
closeModal.addEventListener('click', function() {
    reservationModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Fermer le modal de paiement
fermerPaiement.addEventListener('click', function() {
    paiementModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Fermer les modals en cliquant en dehors
window.addEventListener('click', function(event) {
    if (event.target === reservationModal) {
        reservationModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    if (event.target === paiementModal) {
        paiementModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Soumission du formulaire de réservation
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    reservationData = {
        salle: document.getElementById('reservation-salle').value,
        name: document.getElementById('reservation-name').value,
        email: document.getElementById('reservation-email').value,
        phone: document.getElementById('reservation-phone').value,
        date: document.getElementById('reservation-date').value,
        guests: document.getElementById('reservation-guests').value,
        message: document.getElementById('reservation-message').value
    };
    
    // Vérifier les champs obligatoires
    if (!reservationData.name || !reservationData.email || !reservationData.date || !reservationData.guests) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Fermer le modal de réservation
    reservationModal.classList.remove('show');
    
    // Ouvrir le modal de paiement après 300ms
    setTimeout(() => {
        paiementModal.classList.add('show');
        
        // Afficher un récapitulatif dans le modal de paiement (optionnel)
        const recapDiv = document.createElement('div');
        recapDiv.className = 'reservation-recap';
        recapDiv.innerHTML = `
            <h3>Récapitulatif de votre réservation</h3>
            <p><strong>Salle:</strong> ${reservationData.salle}</p>
            <p><strong>Date:</strong> ${new Date(reservationData.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Nombre d'invités:</strong> ${reservationData.guests}</p>
            <p><strong>Total estimé:</strong> ${calculatePrice(reservationData.salle, reservationData.guests)}€</p>
        `;
        
        // Insérer le récapitulatif avant le formulaire de paiement
        const paiementForm = document.getElementById('ModeFrom');
        paiementForm.parentNode.insertBefore(recapDiv, paiementForm);
    }, 300);
});

// Fonction pour calculer le prix (exemple)
function calculatePrice(salle, guests) {
    const basePrices = {
        'Grande Salle de Réception': 1500,
        'Salle de Conférence Moderne': 800,
        'Salon Intime': 400
    };
    
    let price = basePrices[salle] || 500;
    
    // Supplément par personne au-delà de 50
    if (guests > 50) {
        price += (guests - 50) * 10;
    }
    
    return price;
}

// Soumission du formulaire de paiement
paiementForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer le moyen de paiement sélectionné
    const selectedPayment = document.querySelector('input[name="paiement"]:checked');
    
    if (!selectedPayment) {
        alert('Veuillez sélectionner un moyen de paiement.');
        return;
    }
    
    // Simulation de traitement de paiement
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Créer un message de confirmation
        const confirmationMessage = `
            ✅ Paiement effectué avec succès !
            
            Votre réservation a été confirmée.
            
            Détails :
            • Salle: ${reservationData.salle}
            • Date: ${new Date(reservationData.date).toLocaleDateString('fr-FR')}
            • Nombre d'invités: ${reservationData.guests}
            • Moyen de paiement: ${selectedPayment.value}
            
            Un email de confirmation a été envoyé à ${reservationData.email}
            
            Merci pour votre confiance !
        `;
        
        alert(confirmationMessage);
        
        // Fermer le modal de paiement
        paiementModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Réinitialiser les formulaires
        reservationForm.reset();
        paiementForm.reset();
        
        // Supprimer le récapitulatif s'il existe
        const recap = document.querySelector('.reservation-recap');
        if (recap) {
            recap.remove();
        }
        
        // Réinitialiser les données
        reservationData = {};
    }, 2000);
});

// Fonctions pour le chargement
function showLoading() {
    const submitBtn = paiementForm.querySelector('.btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    submitBtn.disabled = true;
}

function hideLoading() {
    const submitBtn = paiementForm.querySelector('.btn');
    submitBtn.textContent = 'Valider le paiement';
    submitBtn.disabled = false;
}

// Soumission du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulation d'envoi
    showContactLoading();
    
    setTimeout(() => {
        hideContactLoading();
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        this.reset();
    }, 1000);
});

function showContactLoading() {
    const submitBtn = document.querySelector('#contactForm .btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
}

function hideContactLoading() {
    const submitBtn = document.querySelector('#contactForm .btn');
    submitBtn.textContent = 'Envoyer le message';
    submitBtn.disabled = false;
}

// Fonctionnalité de recherche
document.getElementById('search-btn').addEventListener('click', function() {
    const date = document.getElementById('date').value;
    const capacity = document.getElementById('capacity').value;
    const type = document.getElementById('type').value;
    
    if (!date || !capacity || !type) {
        alert('Veuillez remplir tous les champs de recherche.');
        return;
    }
    
    // Animation de recherche
    const searchBtn = this;
    const originalText = searchBtn.textContent;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
    searchBtn.disabled = true;
    
    // Simulation de recherche
    setTimeout(() => {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
        
        // Afficher les résultats (simulation)
        const eventType = document.getElementById('type').options[document.getElementById('type').selectedIndex].text;
        alert(`Nous avons trouvé 3 salles disponibles pour votre ${eventType.toLowerCase()} le ${new Date(date).toLocaleDateString('fr-FR')} pour ${capacity} personnes.`);
        
        // Scroll vers les salles
        document.getElementById('salles').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Affichage de l'heure et vérification des horaires
function afficherHeure() {
    const maintenant = new Date();
    const heure = String(maintenant.getHours()).padStart(2, '0');
    const minute = String(maintenant.getMinutes()).padStart(2, '0');
    const seconde = String(maintenant.getSeconds()).padStart(2, '0');

    document.getElementById("heure-actuelle").textContent =
        "Heure actuelle : " + heure + ":" + minute + ":" + seconde;

    verifierHoraire(maintenant);
}

function verifierHoraire(maintenant) {
    const jour = maintenant.getDay(); 
    const heure = maintenant.getHours();
    const minute = maintenant.getMinutes();

    let ouvert = false;
    let prochainOuverture = "";

    // Lundi à Vendredi : 9h00 - 18h00
    if (jour >= 1 && jour <= 5) {
        if ((heure > 9 && heure < 18) || (heure === 9 && minute >= 0) || (heure === 18 && minute === 0)) {
            ouvert = true;
        }
        prochainOuverture = "demain à 9h00";
    }

    // Samedi : 10h00 - 16h00
    if (jour === 6) {
        if ((heure > 10 && heure < 16) || (heure === 10 && minute >= 0) || (heure === 16 && minute === 0)) {
            ouvert = true;
        }
        prochainOuverture = "lundi à 9h00";
    }

    // Dimanche : fermé
    if (jour === 0) {
        ouvert = false;
        prochainOuverture = "demain à 9h00";
    }

    const message = document.getElementById("message-fermeture");
    if (!ouvert) {
        message.textContent = "Nous sommes fermés, revenez " + prochainOuverture;
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}

// Initialiser l'heure
afficherHeure();

// Met à jour l'heure chaque seconde
setInterval(afficherHeure, 1000);

// Initialisation des dates
document.addEventListener('DOMContentLoaded', function() {
    // Définir la date minimale pour les champs date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('date');
    const reservationDateInput = document.getElementById('reservation-date');
    
    if (dateInput) {
        dateInput.min = today.toISOString().split('T')[0];
    }
    
    if (reservationDateInput) {
        reservationDateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Activer le header scroll au chargement
    window.dispatchEvent(new Event('scroll'));
});