// 🔧 SYSTÈME DE CONFIGURATION CYNTHIA ASSISTANT
// Gestion centralisée des variables d'environnement

class AppConfig {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        // Configuration par défaut (fallback)
        this.config = {
            // EmailJS
            emailjs: {
                serviceId: 'service_cynthia_bernier',
                templateId: 'template_fiche_inscription', 
                publicKey: 'your_emailjs_public_key_here'
            },
            
            // OpenAI
            openai: {
                model: 'gpt-4',
                maxTokens: 500,
                temperature: 0.3
            },
            
            // Application
            app: {
                version: '1.0.0',
                environment: 'development',
                debug: true
            },
            
            // Email
            email: {
                to: 'cynthia.bernier@courtiercynthia.com',
                toName: 'Cynthia Bernier'
            },
            
            // Sécurité
            security: {
                maxRequests: 100,
                windowMs: 3600000,
                allowedOrigins: ['http://localhost:3000', 'https://cynthia-assistant.com']
            }
        };

        // Tenter de charger depuis les variables d'environnement
        this.loadFromEnvironment();
        
        // Valider la configuration
        this.validateConfig();
        
        console.log('⚙️ Configuration chargée:', this.config);
    }

    loadFromEnvironment() {
        try {
            // En production, ces variables seraient injectées côté serveur
            // Pour le développement, on peut les définir dans window.ENV
            if (typeof window !== 'undefined' && window.ENV) {
                const env = window.ENV;
                
                if (env.EMAILJS_SERVICE_ID) this.config.emailjs.serviceId = env.EMAILJS_SERVICE_ID;
                if (env.EMAILJS_TEMPLATE_ID) this.config.emailjs.templateId = env.EMAILJS_TEMPLATE_ID;
                if (env.EMAILJS_PUBLIC_KEY) this.config.emailjs.publicKey = env.EMAILJS_PUBLIC_KEY;
                
                if (env.CYNTHIA_EMAIL) this.config.email.to = env.CYNTHIA_EMAIL;
                if (env.CYNTHIA_NAME) this.config.email.toName = env.CYNTHIA_NAME;
                
                if (env.APP_ENV) this.config.app.environment = env.APP_ENV;
                if (env.APP_VERSION) this.config.app.version = env.APP_VERSION;
                
                console.log('✅ Variables d\'environnement chargées');
            }
        } catch (error) {
            console.warn('⚠️ Erreur chargement variables environnement:', error);
        }
    }

    validateConfig() {
        const issues = [];
        
        // Validation EmailJS
        if (this.config.emailjs.publicKey.includes('your_')) {
            issues.push('Clé EmailJS non configurée');
        }
        
        // Validation email destination
        if (!this.config.email.to.includes('@')) {
            issues.push('Email de destination invalide');
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ Configuration incomplète:', issues);
            this.config.hasIssues = true;
            this.config.issues = issues;
        } else {
            console.log('✅ Configuration validée');
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

    // 🔒 Méthodes pour la sécurité
    isOriginAllowed(origin) {
        return this.config.security.allowedOrigins.includes(origin);
    }
    
    getRateLimit() {
        return {
            max: this.config.security.maxRequests,
            windowMs: this.config.security.windowMs
        };
    }

    // 📊 Export pour debugging
    exportConfig() {
        const safeConfig = JSON.parse(JSON.stringify(this.config));
        
        // Masquer les informations sensibles
        if (safeConfig.emailjs && safeConfig.emailjs.publicKey) {
            safeConfig.emailjs.publicKey = safeConfig.emailjs.publicKey.substring(0, 8) + '...';
        }
        
        return safeConfig;
    }
}

// Instance globale
window.AppConfig = new AppConfig();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}