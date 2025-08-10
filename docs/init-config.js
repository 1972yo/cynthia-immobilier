// 🚀 SCRIPT D'INITIALISATION DES CONFIGURATIONS CYNTHIA
// Charge les configurations séparées pour Assistant et WebApp

(function() {
    console.log('🔧 Initialisation des configurations Cynthia...');

    // Simuler le chargement des variables d'environnement
    // En production, ces valeurs viendraient du serveur
    window.ENV = {
        // Clés OpenAI séparées
        CYNTHIA_ASSISTANT_OPENAI_KEY: 'CYNTHIA_ASSISTANT_OPENAI_KEY_HERE',
        CYNTHIA_WEBAPP_OPENAI_KEY: 'CYNTHIA_WEBAPP_OPENAI_KEY_HERE',
        
        // Configuration EmailJS
        EMAILJS_SERVICE_ID: 'service_cynthia_bernier',
        EMAILJS_TEMPLATE_ID: 'template_fiche_inscription', 
        EMAILJS_PUBLIC_KEY: 'your_emailjs_public_key_here',
        
        // Informations Cynthia
        CYNTHIA_EMAIL: 'cynthia.bernier@courtiercynthia.com',
        CYNTHIA_NAME: 'Cynthia Bernier',
        
        // Environnements
        APP_ENV: 'development',
        APP_VERSION: '1.0.0',
        WEBAPP_ENV: 'development',
        WEBAPP_VERSION: '1.0.0'
    };

    // Fonction pour vérifier la séparation des APIs
    window.checkAPIsSeparation = function() {
        console.log('🔍 Vérification de la séparation des APIs...');
        
        const results = {
            assistantConfigured: false,
            webappConfigured: false,
            keysSeparated: false,
            status: 'error'
        };

        try {
            // Vérifier Assistant Config
            if (window.AppConfig && window.AppConfig.get('openai.apiKey')) {
                const assistantKey = window.AppConfig.get('openai.apiKey');
                results.assistantConfigured = !assistantKey.includes('HERE');
                console.log('📋 Assistant API Key:', assistantKey.substring(0, 20) + '...');
            }

            // Vérifier WebApp Config  
            if (window.WebAppConfig && window.WebAppConfig.getOpenAIKey()) {
                const webappKey = window.WebAppConfig.getOpenAIKey();
                results.webappConfigured = !webappKey.includes('HERE');
                console.log('🌐 WebApp API Key:', webappKey.substring(0, 20) + '...');
            }

            // Vérifier que les clés sont différentes
            if (results.assistantConfigured && results.webappConfigured) {
                const assistantKey = window.AppConfig.get('openai.apiKey');
                const webappKey = window.WebAppConfig.getOpenAIKey();
                results.keysSeparated = assistantKey !== webappKey;
            }

            if (results.assistantConfigured && results.webappConfigured && results.keysSeparated) {
                results.status = 'success';
                console.log('✅ APIs correctement séparées !');
            } else {
                results.status = 'partial';
                console.log('⚠️ Configuration incomplète - APIs partiellement séparées');
            }

        } catch (error) {
            console.error('❌ Erreur lors de la vérification:', error);
            results.status = 'error';
        }

        return results;
    };

    // Fonction pour afficher le statut des configurations
    window.showConfigStatus = function() {
        const status = window.checkAPIsSeparation();
        
        let message = '🔧 STATUT DES CONFIGURATIONS CYNTHIA\\n\\n';
        
        message += `Assistant API: ${status.assistantConfigured ? '✅ Configuré' : '❌ Non configuré'}\\n`;
        message += `WebApp API: ${status.webappConfigured ? '✅ Configuré' : '❌ Non configuré'}\\n`;
        message += `Clés séparées: ${status.keysSeparated ? '✅ Oui' : '❌ Non'}\\n\\n`;
        
        switch (status.status) {
            case 'success':
                message += '🎉 EXCELLENT ! Les deux APIs sont correctement configurées avec des clés séparées.';
                break;
            case 'partial':
                message += '⚠️ ATTENTION ! Configuration incomplète. Vérifiez vos clés OpenAI.';
                break;
            case 'error':
                message += '❌ ERREUR ! Problème dans la configuration des APIs.';
                break;
        }

        alert(message);
        return status;
    };

    // Fonction pour configurer rapidement les clés (développement uniquement)
    window.quickConfigureKeys = function(assistantKey, webappKey) {
        if (assistantKey) {
            window.ENV.CYNTHIA_ASSISTANT_OPENAI_KEY = assistantKey;
        }
        if (webappKey) {
            window.ENV.CYNTHIA_WEBAPP_OPENAI_KEY = webappKey;
        }
        
        // Recharger les configurations
        if (window.AppConfig) {
            window.AppConfig.loadConfig();
        }
        if (window.WebAppConfig) {
            window.WebAppConfig.loadConfig();
        }
        
        console.log('🔄 Clés mises à jour, configurations rechargées');
        return window.checkAPIsSeparation();
    };

    // Fonction d'aide pour les développeurs
    window.helpConfigureCynthia = function() {
        console.log(`
🚀 AIDE CONFIGURATION CYNTHIA BERNIER

1. SÉPARER LES CLÉS OPENAI :
   - Assistant : pour analyse des fiches immobilières
   - WebApp : pour génération d'emails et templates

2. CONFIGURER EN DÉVELOPPEMENT :
   window.quickConfigureKeys('sk-assistant-...', 'sk-webapp-...');

3. VÉRIFIER LA CONFIGURATION :
   window.showConfigStatus();

4. EN PRODUCTION :
   - Configurez les variables d'environnement
   - Utilisez des clés OpenAI distinctes
   - Sécurisez les clés côté serveur

5. STRUCTURE DES FICHIERS :
   - docs/assistant/ : Configuration Assistant API
   - docs/webapp/ : Configuration WebApp API
   - docs/.env.example : Modèle de variables
        `);
    };

    console.log('✅ Script d\'initialisation chargé');
    console.log('💡 Tapez window.helpConfigureCynthia() pour obtenir de l\'aide');

})();