// 🔧 CONFIGURATION WEBAPP CYNTHIA
// Configuration spécifique pour l'API OpenAI de la WebApp

class WebAppConfig {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        // Configuration par défaut pour WebApp
        this.config = {
            // OpenAI - Configuration spécifique WEBAPP
            openai: {
                apiKey: 'CYNTHIA_WEBAPP_OPENAI_KEY_HERE',
                model: 'gpt-4',
                maxTokens: 800,
                temperature: 0.4,
                endpoint: 'https://api.openai.com/v1/chat/completions',
                service: 'webapp'
            },
            
            // Application WebApp
            app: {
                name: 'Cynthia WebApp',
                version: '1.0.0',
                environment: 'development',
                debug: true,
                type: 'webapp'
            },
            
            // Fonctionnalités WebApp
            features: {
                emailGeneration: true,
                templateManagement: true,
                aiSuggestions: true,
                marketingAutomation: true
            },
            
            // Limites WebApp
            limits: {
                maxEmailsPerDay: 50,
                maxTemplates: 20,
                maxAIRequests: 100
            }
        };

        // Charger depuis les variables d'environnement
        this.loadFromEnvironment();
        
        // Valider la configuration
        this.validateConfig();
        
        console.log('⚙️ WebApp Configuration chargée:', this.config);
    }

    loadFromEnvironment() {
        try {
            if (typeof window !== 'undefined' && window.ENV) {
                const env = window.ENV;
                
                // Clé OpenAI spécifique WebApp
                if (env.CYNTHIA_WEBAPP_OPENAI_KEY) {
                    this.config.openai.apiKey = env.CYNTHIA_WEBAPP_OPENAI_KEY;
                }
                
                if (env.WEBAPP_ENV) this.config.app.environment = env.WEBAPP_ENV;
                if (env.WEBAPP_VERSION) this.config.app.version = env.WEBAPP_VERSION;
                
                console.log('✅ Variables d\'environnement WebApp chargées');
            }
        } catch (error) {
            console.warn('⚠️ Erreur chargement variables environnement WebApp:', error);
        }
    }

    validateConfig() {
        const issues = [];
        
        // Validation OpenAI WebApp
        if (this.config.openai.apiKey.includes('HERE')) {
            issues.push('Clé OpenAI WebApp non configurée');
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Configuration WebApp incomplète:', issues);
            this.config.hasIssues = true;
            this.config.issues = issues;
        } else {
            console.log('✅ Configuration WebApp validée');
            this.config.hasIssues = false;
        }
    }

    get(path) {
        return this.getNestedValue(this.config, path);
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
    
    isProduction() {
        return this.config.app.environment === 'production';
    }
    
    isDevelopment() {
        return this.config.app.environment === 'development';
    }
    
    hasConfigurationIssues() {
        return this.config.hasIssues;
    }
    
    getConfigurationIssues() {
        return this.config.issues || [];
    }

    // Méthode pour obtenir la clé OpenAI sécurisée
    getOpenAIKey() {
        return this.config.openai.apiKey;
    }

    // Vérifier les limites
    canMakeAIRequest() {
        // Logique pour vérifier les limites (à implémenter avec un système de comptage)
        return true;
    }

    // Export pour debugging
    exportConfig() {
        const safeConfig = JSON.parse(JSON.stringify(this.config));
        
        // Masquer les informations sensibles
        if (safeConfig.openai && safeConfig.openai.apiKey) {
            safeConfig.openai.apiKey = safeConfig.openai.apiKey.substring(0, 8) + '...';
        }
        
        return safeConfig;
    }
}

// Instance globale WebApp
window.WebAppConfig = new WebAppConfig();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAppConfig;
}