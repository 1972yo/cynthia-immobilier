// 🌐 PORTAIL CYNTHIA - Logique ON/OFF adaptative
// Détecte automatiquement si site web est activé ou en mode privé

class CynthiaPortal {
    constructor() {
        this.siteConfig = {
            public_site_enabled: false, // Par défaut OFF
            last_checked: null,
            fallback_mode: 'private'
        };
        
        this.init();
    }

    async init() {
        console.log('🌐 Initialisation portail Cynthia...');
        
        // Protection identité immédiate
        if (!this.validatePageAccess()) {
            return;
        }

        // Détecter mode site (ON/OFF)
        await this.detectSiteMode();
        
        // Afficher contenu adapté
        this.renderContent();
    }

    validatePageAccess() {
        // Protection identité simple
        const urlParams = new URLSearchParams(window.location.search);
        const targetCity = urlParams.get('ville') || urlParams.get('city');
        
        if (targetCity && targetCity !== 'Lebel-sur-Quévillon') {
            window.IdentityProtection.blockAccess(`Accès tenté pour ${targetCity} - Redirection nécessaire`);
            return false;
        }
        
        return true;
    }

    async detectSiteMode() {
        try {
            // Tenter de détecter si site web public est activé
            const response = await fetch('../api/site-status.json', {
                method: 'GET',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const config = await response.json();
                this.siteConfig.public_site_enabled = config.public_site || false;
                this.siteConfig.last_checked = new Date().toISOString();
                
                console.log('📊 Mode site détecté:', this.siteConfig.public_site_enabled ? 'PUBLIC' : 'PRIVÉ');
            } else {
                throw new Error('Config non disponible');
            }
            
        } catch (error) {
            console.warn('⚠️ Impossible de détecter mode site, utilisation fallback:', this.siteConfig.fallback_mode);
            this.siteConfig.public_site_enabled = false; // Mode sûr par défaut
        }
    }

    renderContent() {
        const contentContainer = document.getElementById('portalContent');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        // Masquer spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        if (this.siteConfig.public_site_enabled) {
            this.renderPublicSite(contentContainer);
        } else {
            this.renderPrivatePortal(contentContainer);
        }
    }

    renderPublicSite(container) {
        console.log('🌐 Affichage site web public');
        
        container.innerHTML = `
            <div class="public-site-redirect">
                <div class="card">
                    <h2>🌐 Redirection vers le site web...</h2>
                    <p>Accès au site web complet de Cynthia Bernier</p>
                    <div class="spinner" style="margin: 20px auto;"></div>
                </div>
            </div>
        `;
        
        // Redirection automatique vers site web complet
        setTimeout(() => {
            window.location.href = '../website/index.html';
        }, 1500);
    }

    renderPrivatePortal(container) {
        console.log('🔒 Affichage portail privé');
        
        container.innerHTML = `
            <div class="private-portal">
                
                <!-- Message d'accueil -->
                <div class="card welcome-card">
                    <h2>🏠 Bienvenue !</h2>
                    <p>Votre courtière immobilière de confiance à Lebel-sur-Quévillon</p>
                    <p class="subtitle">Services personnalisés en Nord-du-Québec et Abitibi-Témiscamingue</p>
                </div>
                
                <!-- Contact direct -->
                <div class="card contact-card">
                    <h3>💬 Contactez-moi directement</h3>
                    
                    <div class="contact-grid">
                        <a href="tel:418-XXX-XXXX" class="contact-btn phone">
                            <div class="contact-icon">📞</div>
                            <div class="contact-info">
                                <span>APPELER</span>
                                <small>418-XXX-XXXX</small>
                            </div>
                        </a>
                        
                        <a href="mailto:cynthia@domain.com" class="contact-btn email">
                            <div class="contact-icon">📧</div>
                            <div class="contact-info">
                                <span>EMAIL</span>
                                <small>cynthia@domain.com</small>
                            </div>
                        </a>
                        
                        <a href="sms:418-XXX-XXXX" class="contact-btn sms">
                            <div class="contact-icon">💬</div>
                            <div class="contact-info">
                                <span>TEXTO</span>
                                <small>Message rapide</small>
                            </div>
                        </a>
                    </div>
                </div>
                
                <!-- Services FONCTIONNELS -->
                <div class="card services-card">
                    <h3>🏠 Mes services</h3>
                    <div class="services-grid">
                        <button class="service-item clickable" onclick="window.cynthiaPortal.openInscriptionVente()">
                            <div class="service-icon">🏠</div>
                            <h4>Vendre ma maison</h4>
                            <p>Inscription de votre propriété</p>
                            <div class="service-action">→ Formulaire inscription</div>
                        </button>
                        <button class="service-item clickable" onclick="window.cynthiaPortal.openInscriptionAchat()">
                            <div class="service-icon">🔍</div>
                            <h4>Acheter ma maison</h4>
                            <p>Inscription pour trouver votre propriété</p>
                            <div class="service-action">→ Formulaire inscription</div>
                        </button>
                        <button class="service-item clickable" onclick="window.cynthiaPortal.openEvaluationGratuite()">
                            <div class="service-icon">📊</div>
                            <h4>Évaluation gratuite</h4>
                            <p>Connaître la valeur de votre bien</p>
                            <div class="service-action">→ Demande d'évaluation</div>
                        </button>
                    </div>
                </div>
                
                <!-- Lien Centris (optionnel) -->
                <div class="card centris-card" id="centrisSection">
                    <!-- Sera chargé dynamiquement si activé -->
                </div>
                
            </div>
            
            <!-- Accès sécurisé au dashboard pour Cynthia (MASQUÉ par défaut) -->
            <div class="admin-access" id="adminAccess" style="display: none;">
                <button onclick="window.cynthiaPortal.accessDashboard()" class="btn-admin-access">
                    📱 Mon espace de travail
                </button>
            </div>
            
            <!-- Bouton d'authentification discret -->
            <div class="auth-trigger" style="text-align: center; margin: 20px 0;">
                <button onclick="window.cynthiaPortal.toggleAdminAccess()" class="btn-auth-trigger" style="
                    background: transparent;
                    border: 1px solid rgba(0,0,0,0.1);
                    color: #999;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🔑</button>
            </div>
        `;
        
        // Charger section Centris si configurée
        this.loadCentrisSection();
    }

    loadCentrisSection() {
        // Vérifier si lien Centris est activé (depuis config)
        const centrisEnabled = localStorage.getItem('centris_enabled') === 'true';
        const centrisURL = localStorage.getItem('centris_url') || '';
        
        if (centrisEnabled && centrisURL) {
            const centrisSection = document.getElementById('centrisSection');
            centrisSection.innerHTML = `
                <h3>🔍 Mes propriétés sur Centris</h3>
                <a href="${centrisURL}" target="_blank" class="centris-link">
                    <div class="centris-info">
                        <div class="centris-logo">📋</div>
                        <div class="centris-text">
                            <span>Voir sur Centris.ca</span>
                            <small>Plateforme officielle Québec</small>
                        </div>
                    </div>
                </a>
                <p class="centris-disclaimer">
                    <small>⚖️ Licence OACIQ : [À configurer]</small>
                </p>
            `;
        }
    }

    toggleAdminAccess() {
        console.log('🔑 Tentative authentification admin via portal...');
        
        const adminAccess = document.getElementById('adminAccess');
        
        // Si déjà affiché, le masquer
        if (adminAccess && adminAccess.style.display !== 'none') {
            adminAccess.style.display = 'none';
            console.log('🔒 Accès admin masqué (portal)');
            return;
        }
        
        // Demander authentification
        const authCode = prompt(`🔐 ACCÈS ADMINISTRATEUR CYNTHIA BERNIER

⚠️ ACCÈS RESTREINT - Lebel-sur-Quévillon uniquement

Veuillez entrer le code d'authentification :`);
        
        if (!authCode) {
            console.log('❌ Authentification annulée (portal)');
            return;
        }
        
        // Codes d'accès sécurisés
        const validCodes = [
            'CYNTHIA2024',
            'LEBEL2024', 
            'NORDQUEBEC',
            'BERNIER',
            'ADMIN2024'
        ];
        
        if (validCodes.includes(authCode.toUpperCase().trim())) {
            // Authentification réussie
            if (adminAccess) {
                adminAccess.style.display = 'block';
                console.log('✅ Authentification admin réussie (portal)');
                
                // Notification de sécurité
                setTimeout(() => {
                    alert('✅ Accès administrateur activé\n\n🔐 Mode Cynthia Bernier - Lebel-sur-Quévillon\n\nVous pouvez maintenant accéder à votre espace de travail.');
                }, 100);
                
                // Auto-masquer après 10 minutes
                setTimeout(() => {
                    adminAccess.style.display = 'none';
                    console.log('🔒 Auto-masquage sécurisé après 10 min (portal)');
                }, 600000);
            }
        } else {
            console.warn('⚠️ Tentative d\'accès admin avec code incorrect (portal):', authCode);
            alert('❌ Code d\'authentification incorrect\n\n🔐 Accès refusé\n\nSeule Cynthia Bernier de Lebel-sur-Quévillon peut accéder à cet espace.');
            
            // Log de sécurité
            console.warn('🚨 TENTATIVE D\'ACCÈS NON AUTORISÉ (PORTAL) - Code:', authCode, '- Timestamp:', new Date().toISOString());
        }
    }

    accessDashboard() {
        // Accès direct au dashboard (déjà authentifié)
        console.log('🔐 Accès dashboard (authentifié)');
        
        const dashboardUrl = '../admin/pwa-dashboard/index.html';
        const newWindow = window.open(dashboardUrl, '_blank', 'width=1400,height=900');
        
        if (!newWindow) {
            alert('⚠️ Dashboard non disponible.\n\nAssurez-vous que CYNTHIA_WEBAPP est démarré sur le port 8081.\n\n💡 Lancez bouton.bat dans le dossier CYNTHIA_WEBAPP');
        } else {
            console.log('✅ Dashboard PWA Cynthia ouvert (authentifié)');
        }
    }

    // 🏠 Services fonctionnels - Navigation intelligente
    openInscriptionVente() {
        // Ouvrir formulaire d'inscription CYNTHIA_ASSISTANT
        console.log('🏠 Ouverture formulaire vente résidentielle');
        
        const inscriptionUrl = '../../assistant/index.html';
        const newWindow = window.open(inscriptionUrl, '_blank', 'width=1200,height=800');
        
        if (!newWindow) {
            alert(`ℹ️ Formulaire d'inscription

Pour inscrire votre propriété à vendre, nous allons ouvrir le formulaire complet.

Si la popup est bloquée, naviguez vers :
${inscriptionUrl}`);
        } else {
            console.log('✅ Formulaire inscription ouvert');
        }
    }

    openInscriptionAchat() {
        // Ouvrir formulaire d'inscription pour acheteur
        console.log('🔍 Ouverture formulaire inscription acheteur');
        
        // Message explicatif avant ouverture
        const confirmation = confirm(`🏠 INSCRIPTION ACHETEUR

Le formulaire d'inscription va s'ouvrir pour collecter vos critères de recherche.

Cynthia utilisera ces informations pour vous trouver la propriété idéale.

Continuer ?`);
        
        if (confirmation) {
            const inscriptionUrl = '../assistant/index.html';
            const newWindow = window.open(inscriptionUrl, '_blank', 'width=1200,height=800');
            
            if (!newWindow) {
                alert(`ℹ️ Formulaire d'inscription acheteur

Pour vos critères de recherche, nous allons ouvrir le formulaire complet.

Si la popup est bloquée, naviguez vers :
${inscriptionUrl}`);
            } else {
                console.log('✅ Formulaire inscription acheteur ouvert');
            }
        }
    }

    openEvaluationGratuite() {
        // Contact pour évaluation gratuite avec infos de base
        console.log('📊 Demande évaluation gratuite');
        
        const evaluation = confirm(`📊 ÉVALUATION GRATUITE

Cynthia Bernier offre une évaluation gratuite de votre propriété.

Avez-vous l'adresse exacte de la propriété à évaluer ?`);
        
        if (evaluation) {
            const adresse = prompt(`📍 Adresse à évaluer :

Veuillez indiquer l'adresse complète de votre propriété à Lebel-sur-Quévillon ou dans la région :`);
            
            if (adresse && adresse.trim()) {
                const message = `Bonjour Cynthia,

Je souhaiterais obtenir une évaluation gratuite pour ma propriété :

📍 Adresse : ${adresse}

Merci de me contacter pour planifier la visite.

Cordialement`;

                const emailUrl = `mailto:cynthia@domain.com?subject=Demande d'évaluation gratuite - ${adresse}&body=${encodeURIComponent(message)}`;
                window.open(emailUrl, '_blank');
                
                alert(`✅ Demande d'évaluation envoyée !

Cynthia vous contactera rapidement pour planifier la visite de votre propriété au ${adresse}.

📞 En cas d'urgence : 418-XXX-XXXX`);
            }
        } else {
            alert(`📞 Contactez directement Cynthia :

Téléphone : 418-XXX-XXXX
Email : cynthia@domain.com

Elle vous guidera pour l'évaluation gratuite !`);
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.cynthiaPortal = new CynthiaPortal();
    console.log('✅ CynthiaPortal initialisé et disponible globalement');
});

// Gestion erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur portail:', event.error);
    
    // Fallback en cas d'erreur
    const contentContainer = document.getElementById('portalContent');
    if (contentContainer && contentContainer.innerHTML.includes('spinner')) {
        contentContainer.innerHTML = `
            <div class="card error-card">
                <h2>⚠️ Erreur de chargement</h2>
                <p>Impossible de charger le contenu. Veuillez rafraîchir la page ou contacter Cynthia directement.</p>
                <div class="contact-grid">
                    <a href="tel:418-XXX-XXXX" class="btn btn-primary">📞 Appeler Cynthia</a>
                </div>
            </div>
        `;
    }
});