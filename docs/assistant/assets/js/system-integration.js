// 🔗 INTÉGRATION SYSTÈME COMPLET - APIs connectées
// Coordonne CYNTHIA_ASSISTANT + CYNTHIA_WEBAPP

class SystemIntegration {
    constructor() {
        this.apis = {
            assistant: this.getAssistantStatus(),
            webapp: this.getWebappStatus()
        };
        
        this.init();
    }
    
    init() {
        console.log('🔗 Initialisation intégration système...');
        
        // Écouter changements configuration
        this.setupConfigSync();
        
        // Écouter notifications cross-API
        this.setupCrossAPIComm();
        
        // Synchroniser état initial
        this.syncInitialState();
    }
    
    getAssistantStatus() {
        try {
            return window.FeaturesControl ? window.FeaturesControl.getStatus() : null;
        } catch (e) {
            return null;
        }
    }
    
    getWebappStatus() {
        try {
            // Vérifier si WEBAPP est accessible
            const webappConfig = localStorage.getItem('webapp_status');
            return webappConfig ? JSON.parse(webappConfig) : { available: false };
        } catch (e) {
            return { available: false };
        }
    }
    
    setupConfigSync() {
        // Synchroniser changements de configuration entre APIs
        window.addEventListener('features-config-changed', (event) => {
            console.log('⚙️ Configuration changée:', event.detail);
            this.syncConfigToWebapp(event.detail);
        });
        
        // Écouter changements depuis WEBAPP
        window.addEventListener('api2-status-change', (event) => {
            console.log('📡 WEBAPP status changé:', event.detail);
            this.handleWebappChange(event.detail);
        });
    }
    
    syncConfigToWebapp(config) {
        try {
            // Préparer message pour WEBAPP
            const syncData = {
                timestamp: new Date().toISOString(),
                source: 'CYNTHIA_ASSISTANT',
                config: {
                    public_site: config.api2_status?.public_website || false,
                    auto_advertising: config.api2_status?.auto_advertising || false,
                    analytics_enabled: config.api2_status?.analytics_tracking || false
                }
            };
            
            // Stocker pour WEBAPP
            localStorage.setItem('webapp_sync_data', JSON.stringify(syncData));
            
            // Trigger event pour WEBAPP si présent
            window.dispatchEvent(new CustomEvent('assistant-config-sync', {
                detail: syncData
            }));
            
            console.log('📡 Configuration synchronisée vers WEBAPP');
            
        } catch (error) {
            console.error('❌ Erreur sync WEBAPP:', error);
        }
    }
    
    handleWebappChange(change) {
        // Réagir aux changements depuis WEBAPP
        if (change.component === 'website' && window.FeaturesControl) {
            // Synchroniser état site web
            if (change.enabled) {
                window.FeaturesControl.enable('public_website');
            } else {
                window.FeaturesControl.disable('public_website');
            }
            
            console.log(`🌐 Site web ${change.enabled ? 'activé' : 'désactivé'} depuis WEBAPP`);
        }
    }
    
    setupCrossAPIComm() {
        // Communication bidirectionnelle entre APIs
        
        // Nouvelle fiche créée → Notifier WEBAPP
        document.addEventListener('new-form-submitted', (event) => {
            this.notifyWebappNewContent(event.detail);
        });
        
        // État urgence → Propager partout
        document.addEventListener('emergency-mode-activated', (event) => {
            this.propagateEmergencyMode();
        });
    }
    
    notifyWebappNewContent(formData) {
        try {
            const notification = {
                type: 'NEW_PROPERTY_AVAILABLE',
                data: {
                    id: this.generateUniqueId(),
                    adresse: formData.adresse,
                    proprietaire: formData.prop1Nom,
                    telephone: formData.prop1Tel1,
                    analysisReady: window.FeaturesControl?.isEnabled('ia_analysis') || false,
                    photos: formData.photos || [],
                    created: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            };
            
            // Stocker pour WEBAPP
            const webappNotifications = JSON.parse(
                localStorage.getItem('webapp_notifications') || '[]'
            );
            webappNotifications.unshift(notification);
            
            // Limite 100 notifications
            if (webappNotifications.length > 100) {
                webappNotifications.pop();
            }
            
            localStorage.setItem('webapp_notifications', JSON.stringify(webappNotifications));
            
            console.log('📢 WEBAPP notifiée du nouveau contenu');
            
        } catch (error) {
            console.error('❌ Erreur notification WEBAPP:', error);
        }
    }
    
    propagateEmergencyMode() {
        try {
            const emergencyData = {
                activated: true,
                timestamp: new Date().toISOString(),
                source: 'CYNTHIA_ASSISTANT',
                actions_taken: [
                    'Toutes automations désactivées',
                    'Mode manuel seul actif',
                    'Notifications urgence envoyées'
                ]
            };
            
            // Notifier WEBAPP
            localStorage.setItem('emergency_mode_status', JSON.stringify(emergencyData));
            
            // Event global
            window.dispatchEvent(new CustomEvent('system-emergency-activated', {
                detail: emergencyData
            }));
            
            console.log('🚨 Mode urgence propagé à tout le système');
            
        } catch (error) {
            console.error('❌ Erreur propagation urgence:', error);
        }
    }
    
    syncInitialState() {
        // Synchronisation initiale entre APIs
        const assistantConfig = this.getAssistantStatus();
        
        if (assistantConfig) {
            this.syncConfigToWebapp(assistantConfig);
            console.log('🔄 État initial synchronisé');
        }
    }
    
    generateUniqueId() {
        return 'property_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // API publique pour tests
    getSystemStatus() {
        return {
            assistant: this.apis.assistant,
            webapp: this.apis.webapp,
            integration_active: true,
            last_sync: new Date().toISOString()
        };
    }
    
    testConnection() {
        console.log('🧪 Test connexion système...');
        
        // Test événement
        this.notifyWebappNewContent({
            adresse: 'Test - 123 Rue Test',
            prop1Nom: 'Test Client',
            prop1Tel1: '418-123-4567'
        });
        
        console.log('✅ Test terminé - Vérifiez localStorage');
        return true;
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.SystemIntegration = new SystemIntegration();
    console.log('🔗 Intégration système prête');
});

// Export pour tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystemIntegration;
}