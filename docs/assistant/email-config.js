// 📧 Configuration EmailJS pour CYNTHIA ASSISTANT
// Intégration email automatique + API OpenAI

class EmailService {
    constructor() {
        // Utiliser la configuration centralisée
        this.config = window.AppConfig;
        
        this.serviceID = this.config.get('emailjs.serviceId');
        this.templateID = this.config.get('emailjs.templateId');
        this.publicKey = this.config.get('emailjs.publicKey');
        
        this.openAIKey = this.loadOpenAIKey(); // Clé depuis .env
        this.openAIEndpoint = 'https://api.openai.com/v1/chat/completions';
        
        this.init();
    }
    
    loadOpenAIKey() {
        // Charger la clé OpenAI spécifique pour l'Assistant
        if (typeof window !== 'undefined' && window.AppConfig) {
            const assistantKey = window.AppConfig.get('openai.apiKey');
            if (assistantKey && !assistantKey.includes('HERE')) {
                return assistantKey;
            }
        }
        
        // Fallback depuis les variables d'environnement
        if (typeof window !== 'undefined' && window.ENV && window.ENV.CYNTHIA_ASSISTANT_OPENAI_KEY) {
            return window.ENV.CYNTHIA_ASSISTANT_OPENAI_KEY;
        }
        
        // Fallback par défaut
        return 'CYNTHIA_ASSISTANT_OPENAI_KEY_HERE';
    }

    init() {
        // Initialiser EmailJS si disponible
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            console.log('📧 EmailJS initialisé');
        } else {
            console.warn('⚠️ EmailJS non chargé - mode simulation');
        }
    }

    async sendFormToCynthia(formData) {
        try {
            console.log('📤 Envoi de la fiche à Cynthia...');
            
            // 1. Analyser avec OpenAI
            const aiAnalysis = await this.analyzeWithOpenAI(formData);
            
            // 2. Préparer l'email enrichi
            const emailData = this.prepareEnrichedEmail(formData, aiAnalysis);
            
            // 3. Envoyer via EmailJS
            const emailResult = await this.sendEmail(emailData);
            
            // 4. Log pour suivi
            this.logTransaction(formData, aiAnalysis, emailResult);
            
            return {
                success: true,
                aiAnalysis,
                emailSent: emailResult
            };
            
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async analyzeWithOpenAI(formData) {
        try {
            const prompt = this.createAnalysisPrompt(formData);
            
            const response = await fetch(this.openAIEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openAIKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{
                        role: 'system',
                        content: 'Tu es un assistant spécialisé en immobilier résidentiel québécois. Analyse les fiches d\'inscription pour Cynthia Bernier, courtière immobilière.'
                    }, {
                        role: 'user',
                        content: prompt
                    }],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API OpenAI error: ${response.status}`);
            }

            const data = await response.json();
            const analysis = data.choices[0].message.content;
            
            return this.parseAIAnalysis(analysis);
            
        } catch (error) {
            console.error('❌ Erreur OpenAI:', error);
            
            // Fallback: analyse basique sans IA
            return this.basicAnalysis(formData);
        }
    }

    createAnalysisPrompt(formData) {
        return `
Analyse cette fiche d'inscription immobilière et fournis:

1. TYPE_CLIENT: (VENDEUR/ACHETEUR/PROSPECT)
2. PRIORITE: (HAUTE/MOYENNE/BASSE) 
3. BUDGET_ESTIME: estimation basée sur évaluation municipale
4. POINTS_ATTENTION: éléments à vérifier (fissures, âge toiture, etc.)
5. RECOMMANDATIONS: 3 actions prioritaires pour Cynthia

DONNÉES:
Adresse: ${formData.adresse || 'N/A'}
Propriétaire 1: ${formData.prop1Nom || 'N/A'}
Téléphones: ${formData.prop1Tel1 || 'N/A'}, ${formData.prop1Tel2 || 'N/A'}
Année construction: ${formData.anneeConstruction || 'N/A'}
Évaluation municipale: ${formData.evaluationMunicipale || 'N/A'}
Fondation: ${this.getSelectedValues(formData, 'fondation')}
Toiture: ${this.getSelectedValues(formData, 'toiture')} (${formData.anneeToiture || 'N/A'})
Équipements: ${this.getSelectedValues(formData, 'equipements')}
Notes: ${formData.notesSpeciales || 'Aucune'}

Réponds au format JSON:
{
  "type_client": "",
  "priorite": "",
  "budget_estime": "",
  "points_attention": [],
  "recommandations": [],
  "score_qualite": 0-10
}
        `;
    }

    parseAIAnalysis(analysis) {
        try {
            // Extraire le JSON de la réponse
            const jsonMatch = analysis.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('⚠️ Erreur parsing AI analysis');
        }
        
        return this.basicAnalysis();
    }

    basicAnalysis(formData = {}) {
        // Analyse de base sans IA
        let priorite = 'MOYENNE';
        let points_attention = [];
        
        // Logique de base
        if (formData.evaluationMunicipale) {
            const eval_num = parseInt(formData.evaluationMunicipale.replace(/\D/g, ''));
            if (eval_num > 500000) priorite = 'HAUTE';
            if (eval_num < 200000) priorite = 'BASSE';
        }

        // Points d'attention basiques
        if (formData.anneeConstruction && parseInt(formData.anneeConstruction) < 1980) {
            points_attention.push('Propriété ancienne - vérifier rénovations');
        }
        
        if (this.getSelectedValues(formData, 'fondation').includes('fissures')) {
            points_attention.push('Fissures fondation déclarées');
        }

        return {
            type_client: 'PROSPECT',
            priorite,
            budget_estime: formData.evaluationMunicipale || 'À évaluer',
            points_attention,
            recommandations: [
                'Planifier visite de la propriété',
                'Vérifier documents essentiels',
                'Évaluer potentiel de marché'
            ],
            score_qualite: 7
        };
    }

    prepareEnrichedEmail(formData, aiAnalysis) {
        const timestamp = new Date().toLocaleString('fr-CA');
        
        return {
            service_id: this.serviceID,
            template_id: this.templateID,
            template_params: {
                to_name: this.config.get('email.toName'),
                to_email: this.config.get('email.to'),
                
                // Données formulaire
                adresse: formData.adresse || 'N/A',
                proprietaire_1: formData.prop1Nom || 'N/A',
                telephone_1: formData.prop1Tel1 || 'N/A',
                telephone_2: formData.prop1Tel2 || 'N/A',
                annee_construction: formData.anneeConstruction || 'N/A',
                evaluation_municipale: formData.evaluationMunicipale || 'N/A',
                
                // Caractéristiques techniques
                fondation: this.getSelectedValues(formData, 'fondation'),
                toiture: this.getSelectedValues(formData, 'toiture'),
                revetement_ext: this.getSelectedValues(formData, 'revetementExt'),
                equipements: this.getSelectedValues(formData, 'equipements'),
                
                // Analyse IA
                ai_type_client: aiAnalysis.type_client || 'PROSPECT',
                ai_priorite: aiAnalysis.priorite || 'MOYENNE',
                ai_budget: aiAnalysis.budget_estime || 'À évaluer',
                ai_points_attention: (aiAnalysis.points_attention || []).join('\n• '),
                ai_recommandations: (aiAnalysis.recommandations || []).join('\n• '),
                ai_score: aiAnalysis.score_qualite || 'N/A',
                
                // Métadonnées
                timestamp,
                device_info: formData._metadata?.deviceInfo?.device || 'Inconnu'
            }
        };
    }

    async sendEmail(emailData) {
        try {
            if (typeof emailjs !== 'undefined') {
                // Envoi réel via EmailJS
                const response = await emailjs.send(
                    emailData.service_id,
                    emailData.template_id,
                    emailData.template_params
                );
                
                console.log('✅ Email envoyé via EmailJS:', response);
                return { success: true, response };
                
            } else {
                // Simulation pour développement
                console.log('📧 SIMULATION EMAIL:', emailData);
                return { success: true, simulated: true };
            }
            
        } catch (error) {
            console.error('❌ Erreur EmailJS:', error);
            throw error;
        }
    }

    logTransaction(formData, aiAnalysis, emailResult) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            adresse: formData.adresse,
            proprietaire: formData.prop1Nom,
            ai_analysis: aiAnalysis,
            email_sent: emailResult.success,
            device: formData._metadata?.deviceInfo?.device
        };
        
        // Log local (en production, envoyer à un service de logging)
        console.log('📊 Transaction logged:', logEntry);
        
        try {
            const logs = JSON.parse(localStorage.getItem('cynthia_logs') || '[]');
            logs.push(logEntry);
            
            // Garder seulement les 50 derniers logs
            if (logs.length > 50) logs.shift();
            
            localStorage.setItem('cynthia_logs', JSON.stringify(logs));
        } catch (e) {
            console.warn('⚠️ Erreur sauvegarde logs');
        }
    }

    getSelectedValues(formData, fieldName) {
        if (!formData || !formData[fieldName]) return 'N/A';
        
        if (Array.isArray(formData[fieldName])) {
            return formData[fieldName].join(', ');
        }
        
        return formData[fieldName];
    }

    // 📊 Méthodes utilitaires pour Cynthia
    async getStats() {
        try {
            const logs = JSON.parse(localStorage.getItem('cynthia_logs') || '[]');
            
            return {
                total_submissions: logs.length,
                this_week: logs.filter(log => 
                    new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length,
                high_priority: logs.filter(log => 
                    log.ai_analysis?.priorite === 'HAUTE'
                ).length,
                devices: [...new Set(logs.map(log => log.device))]
            };
        } catch (e) {
            return { error: 'Erreur récupération stats' };
        }
    }

    clearLogs() {
        try {
            localStorage.removeItem('cynthia_logs');
            console.log('🗑️ Logs effacés');
        } catch (e) {
            console.warn('⚠️ Erreur effacement logs');
        }
    }
}

// Export global
window.EmailService = EmailService;