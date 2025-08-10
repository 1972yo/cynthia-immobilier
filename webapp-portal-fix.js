/**
 * 🔧 FIX WEBAPP PORTAL - BOUTON ACHETER MA MAISON
 * Correction du lien vers fiche vendeur/acheteur
 */

// Code JavaScript corrigé pour le portail webapp

function openAchatDirecte() {
    console.log('🔍 Ouverture formulaire inscription acheteur');
    const confirmation = confirm('🏠 INSCRIPTION ACHETEUR\n\nLe formulaire d\'inscription va s\'ouvrir pour collecter vos critères de recherche.\n\nCynthia utilisera ces informations pour vous trouver la propriété idéale.\n\nContinuer ?');
    
    if (confirmation) {
        // ✅ URL CORRIGÉE - Pointer vers le bon formulaire
        const inscriptionUrl = '../assistant/index.html?type=acheteur';
        
        const newWindow = window.open(inscriptionUrl, '_blank', 'width=1200,height=800');
        
        if (!newWindow) {
            alert('ℹ️ Formulaire d\'inscription acheteur\n\nPour vos critères de recherche, nous allons ouvrir le formulaire complet.\n\nSi la popup est bloquée, naviguez vers :\n' + inscriptionUrl);
        } else {
            console.log('✅ Formulaire inscription acheteur ouvert');
        }
    }
}

// Fonction pour formulaire vendeur (au cas où)
function openVenteDirecte() {
    console.log('🔍 Ouverture formulaire inscription vendeur');
    const confirmation = confirm('🏠 INSCRIPTION VENDEUR\n\nLe formulaire va s\'ouvrir pour inscrire votre propriété à vendre.\n\nCynthia s\'occupera de tout le processus de vente.\n\nContinuer ?');
    
    if (confirmation) {
        // ✅ URL vers formulaire vendeur
        const inscriptionUrl = '../assistant/index.html?type=vendeur';
        
        const newWindow = window.open(inscriptionUrl, '_blank', 'width=1200,height=800');
        
        if (!newWindow) {
            alert('ℹ️ Formulaire d\'inscription vendeur\n\nPour inscrire votre propriété, nous allons ouvrir le formulaire complet.\n\nSi la popup est bloquée, naviguez vers :\n' + inscriptionUrl);
        } else {
            console.log('✅ Formulaire inscription vendeur ouvert');
        }
    }
}

// Détection automatique du type de formulaire selon le bouton cliqué
function openFormulaire(type) {
    console.log(`🔍 Ouverture formulaire ${type}`);
    
    const messages = {
        acheteur: {
            title: '🏠 INSCRIPTION ACHETEUR',
            text: 'Le formulaire d\'inscription va s\'ouvrir pour collecter vos critères de recherche.\n\nCynthia utilisera ces informations pour vous trouver la propriété idéale.'
        },
        vendeur: {
            title: '🏠 INSCRIPTION VENDEUR', 
            text: 'Le formulaire va s\'ouvrir pour inscrire votre propriété à vendre.\n\nCynthia s\'occupera de tout le processus de vente.'
        }
    };
    
    const message = messages[type] || messages.acheteur;
    const confirmation = confirm(`${message.title}\n\n${message.text}\n\nContinuer ?`);
    
    if (confirmation) {
        // ✅ LIENS CORRIGÉS vers le système unifié
        let inscriptionUrl;
        
        // Déterminer l'URL selon l'environnement
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // Pour GitHub Pages
            inscriptionUrl = `../../docs/assistant/index.html?type=${type}`;
        } else {
            // Pour environnement local/production
            inscriptionUrl = `../assistant/index.html?type=${type}`;
        }
        
        const newWindow = window.open(inscriptionUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (!newWindow) {
            // Fallback - rediriger dans la même fenêtre
            alert(`ℹ️ Formulaire d'inscription ${type}\n\nRedirection vers le formulaire...\n\nSi ça ne marche pas, naviguez manuellement vers :\n${inscriptionUrl}`);
            window.location.href = inscriptionUrl;
        } else {
            console.log(`✅ Formulaire inscription ${type} ouvert`);
            
            // Optionnel : suivre l'ouverture pour analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_open', {
                    'event_category': 'engagement',
                    'event_label': `inscription_${type}`
                });
            }
        }
    }
}

// ✅ VERSION SIMPLIFIÉE POUR INTEGRATION RAPIDE
// Remplacer directement dans le HTML :

/*
ANCIEN CODE À REMPLACER :
onclick="openAchatDirecte()"

NOUVEAU CODE :
onclick="openFormulaire('acheteur')"

OU POUR VENDEUR :
onclick="openFormulaire('vendeur')"
*/

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openFormulaire,
        openAchatDirecte,
        openVenteDirecte
    };
}