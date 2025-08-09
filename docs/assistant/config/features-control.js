// ⚙️ CONTRÔLE FONCTIONNALITÉS - Cynthia décide ce qui est ON/OFF
// Chaque API peut être activée/désactivée indépendamment

class FeaturesControl {
    constructor() {
        // État par défaut : TOUT OFF (mode manuel)
        this.defaultConfig = {
            // API #1 - CYNTHIA_ASSISTANT
            ia_analysis: false,           // IA analyse fiches
            auto_email: false,            // Emails automatiques  
            photo_optimization: false,    // Optimisation photos auto
            form_processing: true,        // Traitement formulaires (toujours ON)
            
            // API #2 - CYNTHIA_WEBAPP  
            public_website: false,        // Site web public
            auto_advertising: false,      // Publicités automatiques
            social_posting: false,        // Posts réseaux sociaux auto
            analytics_tracking: false,   // Suivi analytics
            
            // Fonctions de base (toujours disponibles)
            manual_mode: true,            // Mode manuel
            contact_forms: true,          // Formulaires contact
            data_storage: true,           // Sauvegarde données
            
            // Métadonnées
            last_updated: new Date().toISOString(),
            configured_by: "Cynthia Bernier - Lebel-sur-Quévillon"
        };
        
        this.loadConfig();
    }
    
    loadConfig() {
        try {
            // Charger config depuis stockage local
            const saved = localStorage.getItem('cynthia_features_config');
            this.config = saved ? JSON.parse(saved) : { ...this.defaultConfig };
            
            console.log('⚙️ Configuration fonctionnalités chargée:', this.config);
        } catch (error) {
            console.warn('⚠️ Erreur chargement config, utilisation par défaut');
            this.config = { ...this.defaultConfig };
        }
    }
    
    saveConfig() {
        try {
            this.config.last_updated = new Date().toISOString();
            localStorage.setItem('cynthia_features_config', JSON.stringify(this.config));
            console.log('✅ Configuration sauvegardée');
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde config:', error);
            return false;
        }
    }
    
    // Vérifier si fonctionnalité est activée
    isEnabled(feature) {
        return this.config[feature] === true;
    }
    
    // Activer/désactiver fonctionnalité
    toggle(feature) {
        if (this.config.hasOwnProperty(feature)) {
            this.config[feature] = !this.config[feature];
            this.saveConfig();
            
            console.log(`🎛️ ${feature} ${this.config[feature] ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
            return true;
        }
        return false;
    }
    
    // Activer fonctionnalité
    enable(feature) {
        if (this.config.hasOwnProperty(feature)) {
            this.config[feature] = true;
            this.saveConfig();
            console.log(`✅ ${feature} ACTIVÉ`);
            return true;
        }
        return false;
    }
    
    // Désactiver fonctionnalité  
    disable(feature) {
        if (this.config.hasOwnProperty(feature)) {
            this.config[feature] = false;
            this.saveConfig();
            console.log(`🔴 ${feature} DÉSACTIVÉ`);
            return true;
        }
        return false;
    }
    
    // Obtenir état complet
    getStatus() {
        return {
            api1_status: {
                ia_analysis: this.config.ia_analysis,
                auto_email: this.config.auto_email,
                photo_optimization: this.config.photo_optimization,
                form_processing: this.config.form_processing
            },
            api2_status: {
                public_website: this.config.public_website,
                auto_advertising: this.config.auto_advertising,
                social_posting: this.config.social_posting,
                analytics_tracking: this.config.analytics_tracking
            },
            manual_mode: this.config.manual_mode,
            last_updated: this.config.last_updated
        };
    }
    
    // Mode d'urgence : tout désactiver sauf essentiel
    emergencyMode() {
        const essentials = ['form_processing', 'contact_forms', 'data_storage', 'manual_mode'];
        
        Object.keys(this.config).forEach(feature => {
            if (!essentials.includes(feature) && typeof this.config[feature] === 'boolean') {
                this.config[feature] = false;
            }
        });
        
        this.saveConfig();
        console.log('🚨 MODE URGENCE ACTIVÉ - Seules fonctions essentielles actives');
        
        return this.getStatus();
    }
    
    // Restaurer configuration par défaut
    resetToDefault() {
        const confirm = window.confirm(`
⚠️ RESTAURER CONFIGURATION PAR DÉFAUT

Ceci va remettre toutes les fonctionnalités en mode OFF.
Vous pourrez les réactiver une par une selon vos besoins.

Continuer ?
        `);
        
        if (confirm) {
            this.config = { ...this.defaultConfig };
            this.saveConfig();
            console.log('🔄 Configuration restaurée par défaut');
            return true;
        }
        
        return false;
    }
}

// Instance globale
window.FeaturesControl = new FeaturesControl();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeaturesControl;
}