// 📱 DASHBOARD CYNTHIA - Gestion intelligente avec ON/OFF
// Interface simple pour contrôler toutes les fonctionnalités

class CynthiaDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.featuresControl = window.FeaturesControl;
        this.properties = [];
        this.contacts = [];
        
        this.init();
    }
    
    async init() {
        console.log('📱 Initialisation Dashboard Cynthia...');
        
        // Protection identité
        if (!this.validateAccess()) return;
        
        // Charger données
        await this.loadData();
        
        // Initialiser interface
        this.initializeInterface();
        
        // Mettre à jour affichage
        this.updateDisplay();
        
        console.log('✅ Dashboard prêt !');
    }
    
    validateAccess() {
        // Protection simple - vérifier que c'est bien Cynthia
        const userConfirmed = sessionStorage.getItem('cynthia_dashboard_access');
        const permanentSession = localStorage.getItem('cynthia_admin_permanent');
        
        // Si session permanente existe, pas besoin de re-vérifier
        if (permanentSession === 'true') {
            sessionStorage.setItem('cynthia_dashboard_access', 'true');
            console.log('🔓 Session permanente détectée - Accès automatique accordé');
            return true;
        }
        
        if (!userConfirmed) {
            const isAuthentic = confirm(`
🔐 ACCÈS DASHBOARD

Confirmez-vous être Cynthia Bernier de Lebel-sur-Quévillon ?

Cette vérification protège vos données confidentielles.
            `);
            
            if (!isAuthentic) {
                alert('❌ Accès refusé. Restez sur la page d\'accueil.');
                // Mode admin : ne pas rediriger, rester sur place
                return false;
            }
            
            // Session permanente pour Cynthia (pas besoin de re-login)
            sessionStorage.setItem('cynthia_dashboard_access', 'true');
            localStorage.setItem('cynthia_admin_permanent', 'true');
            
            console.log('🔒 Session admin permanente activée pour Cynthia');
        }
        
        return true;
    }
    
    async loadData() {
        try {
            // Charger propriétés sauvegardées
            const savedProperties = localStorage.getItem('cynthia_properties');
            this.properties = savedProperties ? JSON.parse(savedProperties) : [];
            
            // Charger contacts
            const savedContacts = localStorage.getItem('cynthia_contacts');
            this.contacts = savedContacts ? JSON.parse(savedContacts) : [];
            
            console.log(`📊 Données chargées: ${this.properties.length} propriétés, ${this.contacts.length} contacts`);
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
        }
    }
    
    initializeInterface() {
        // Synchroniser état des toggles avec configuration
        const config = this.featuresControl.getStatus();
        
        // API #1 toggles
        this.updateToggle('ia_analysis', config.api1_status.ia_analysis);
        this.updateToggle('auto_email', config.api1_status.auto_email);
        this.updateToggle('photo_optimization', config.api1_status.photo_optimization);
        
        // API #2 toggles  
        this.updateToggle('public_website', config.api2_status.public_website);
        this.updateToggle('auto_advertising', config.api2_status.auto_advertising);
        this.updateToggle('analytics_tracking', config.api2_status.analytics_tracking);
        
        // Afficher section par défaut
        this.showSection('overview');
    }
    
    updateToggle(featureId, enabled) {
        const toggle = document.getElementById(featureId);
        if (toggle) {
            toggle.checked = enabled;
        }
    }
    
    updateDisplay() {
        // Mettre à jour statistiques
        document.getElementById('totalProperties').textContent = this.properties.length;
        document.getElementById('totalContacts').textContent = this.contacts.length;
        
        // Compter fonctionnalités actives
        const config = this.featuresControl.getStatus();
        const activeCount = Object.values({...config.api1_status, ...config.api2_status})
            .filter(Boolean).length;
        document.getElementById('activeFeatures').textContent = activeCount;
        
        // Mettre à jour vue d'ensemble fonctionnalités
        this.updateFeaturesOverview();
    }
    
    updateFeaturesOverview() {
        const container = document.getElementById('featuresOverview');
        const config = this.featuresControl.getStatus();
        
        const features = [
            { key: 'ia_analysis', label: '🤖 IA', status: config.api1_status.ia_analysis },
            { key: 'auto_email', label: '📧 Emails', status: config.api1_status.auto_email },
            { key: 'photo_optimization', label: '📷 Photos', status: config.api1_status.photo_optimization },
            { key: 'public_website', label: '🌐 Site', status: config.api2_status.public_website },
            { key: 'auto_advertising', label: '📱 Pubs', status: config.api2_status.auto_advertising },
            { key: 'analytics_tracking', label: '📊 Stats', status: config.api2_status.analytics_tracking }
        ];
        
        container.innerHTML = features.map(feature => `
            <span class="feature-status ${feature.status ? 'active' : 'inactive'}">
                ${feature.label} ${feature.status ? '✅' : '⭕'}
            </span>
        `).join('');
    }
    
    // Navigation entre sections
    showSection(sectionName) {
        // Cacher toutes sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Désactiver tous boutons nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Afficher section demandée
        const targetSection = document.getElementById(`${sectionName}Section`);
        const targetBtn = document.getElementById(`${sectionName}Btn`);
        
        if (targetSection) targetSection.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');
        
        this.currentSection = sectionName;
        
        // Actions spécifiques par section
        if (sectionName === 'properties') {
            this.loadPropertiesSection();
        } else if (sectionName === 'contacts') {
            this.loadContactsSection();
        }
    }
    
    // Toggle fonctionnalité
    toggleFeature(featureName) {
        const wasEnabled = this.featuresControl.isEnabled(featureName);
        const success = this.featuresControl.toggle(featureName);
        
        if (success) {
            const isNowEnabled = this.featuresControl.isEnabled(featureName);
            
            // Feedback visuel
            this.showFeatureToggleToast(featureName, isNowEnabled);
            
            // Mettre à jour affichage
            this.updateDisplay();
            
            // Actions spécifiques selon fonctionnalité
            this.handleFeatureToggle(featureName, isNowEnabled);
        }
    }
    
    showFeatureToggleToast(featureName, enabled) {
        const messages = {
            'ia_analysis': enabled ? '🤖 IA activée ! Vos fiches seront analysées automatiquement.' : '🤖 IA désactivée. Mode manuel actif.',
            'auto_email': enabled ? '📧 Emails automatiques activés !' : '📧 Emails automatiques désactivés.',
            'photo_optimization': enabled ? '📷 Optimisation photos activée !' : '📷 Optimisation photos désactivée.',
            'public_website': enabled ? '🌐 Site web public activé ! Visible par tous.' : '🌐 Site web désactivé. Mode privé.',
            'auto_advertising': enabled ? '📱 Publicités automatiques activées !' : '📱 Publicités désactivées.',
            'analytics_tracking': enabled ? '📊 Analytics activés !' : '📊 Analytics désactivés.'
        };
        
        const message = messages[featureName] || `${featureName} ${enabled ? 'activé' : 'désactivé'}`;
        
        // Toast simple
        this.showToast(message, enabled ? 'success' : 'info');
    }
    
    handleFeatureToggle(featureName, enabled) {
        // Actions spécifiques selon fonctionnalité activée/désactivée
        switch(featureName) {
            case 'public_website':
                // Notifier API #2 du changement
                this.notifyAPI2StatusChange('website', enabled);
                break;
                
            case 'auto_advertising':
                if (enabled) {
                    this.showToast('⚠️ Publicités automatiques nécessitent configuration Facebook/Google Ads', 'warning');
                }
                break;
                
            case 'ia_analysis':
                if (enabled) {
                    this.showToast('🤖 Prochaines fiches seront analysées par IA', 'info');
                }
                break;
        }
    }
    
    // Mode urgence
    emergencyMode() {
        const confirm = window.confirm(`
🚨 MODE URGENCE

Ceci va IMMÉDIATEMENT désactiver toutes les fonctionnalités automatiques :
• Site web public
• Publicités 
• IA
• Emails automatiques

Seules les fonctions de base resteront actives.

ACTIVER MODE URGENCE ?
        `);
        
        if (confirm) {
            this.featuresControl.emergencyMode();
            this.initializeInterface(); // Re-sync toggles
            this.updateDisplay();
            
            this.showToast('🚨 MODE URGENCE ACTIVÉ - Toutes automations désactivées', 'warning');
        }
    }
    
    // Reset configuration
    resetToDefault() {
        if (this.featuresControl.resetToDefault()) {
            this.initializeInterface(); // Re-sync toggles
            this.updateDisplay();
            
            this.showToast('🔄 Configuration remise par défaut', 'info');
        }
    }
    
    // Notifications simples
    showToast(message, type = 'info') {
        // Toast simple sans librairie externe
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#fd7e14' : '#007bff'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Animation entrée
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // Suppression automatique
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    
    // Placeholder fonctions (à développer)
    loadPropertiesSection() {
        console.log('📊 Chargement section propriétés...');
        // TODO: Afficher liste propriétés
    }
    
    loadContactsSection() {
        console.log('👥 Chargement section contacts...');
        // TODO: Afficher liste contacts
    }
    
    createNewProperty() {
        this.showToast('🏠 Fonction création fiche en développement', 'info');
        // TODO: Ouvrir interface création propriété
    }
    
    viewContacts() {
        this.showSection('contacts');
    }
    
    // Communication avec API #2
    notifyAPI2StatusChange(component, enabled) {
        try {
            // Notifier API #2 du changement d'état
            const event = new CustomEvent('api2-status-change', {
                detail: { component, enabled, timestamp: new Date() }
            });
            window.dispatchEvent(event);
            
            console.log(`📡 API #2 notifiée: ${component} = ${enabled}`);
        } catch (error) {
            console.error('❌ Erreur notification API #2:', error);
        }
    }
}

// Fonctions globales pour les boutons
window.showSection = (section) => window.cynthiaDashboard.showSection(section);
window.toggleFeature = (feature) => window.cynthiaDashboard.toggleFeature(feature);
window.emergencyMode = () => window.cynthiaDashboard.emergencyMode();
window.resetToDefault = () => window.cynthiaDashboard.resetToDefault();
window.createNewProperty = () => window.cynthiaDashboard.createNewProperty();
window.viewContacts = () => window.cynthiaDashboard.viewContacts();

window.toggleEmergencyMode = () => {
    // Toggle bouton urgence visuel
    const btn = document.getElementById('emergencyBtn');
    if (btn.textContent.includes('Urgence')) {
        window.cynthiaDashboard.emergencyMode();
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.cynthiaDashboard = new CynthiaDashboard();
});

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('📱 PWA Service Worker registered'))
            .catch(error => console.log('❌ SW registration failed:', error));
    });
}