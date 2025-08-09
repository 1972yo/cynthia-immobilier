// 📧 SERVICE EMAIL + IA - Intégration complète
// Traite les formulaires avec analyse IA automatique

class EmailService {
    constructor() {
        this.openaiKey = 'YOUR_OPENAI_API_KEY_HERE';
        this.modelName = 'gpt-4';
        this.maxTokens = 500;
        
        this.isReady = true;
        console.log('📧 Service Email + IA initialisé');
    }
    
    async sendFormToCynthia(formData) {
        try {
            console.log('🤖 Début traitement avec IA...');
            
            // Étape 1: Analyser avec IA
            const aiAnalysis = await this.analyzeProperty(formData);
            
            // Étape 2: Formatter email enrichi
            const emailContent = this.formatEnrichedEmail(formData, aiAnalysis);
            
            // Étape 3: Envoyer (simulation)
            const emailSent = await this.sendEmail(emailContent);
            
            // Étape 4: Notifier dashboard
            this.notifyDashboard(formData, aiAnalysis);
            
            return {
                success: true,
                aiAnalysis: aiAnalysis,
                emailSent: emailSent,
                message: 'Analyse IA terminée et email envoyé'
            };
            
        } catch (error) {
            console.error('❌ Erreur service email+IA:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }
    
    async analyzeProperty(formData) {
        try {
            const prompt = this.buildAnalysisPrompt(formData);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiKey}`
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: [
                        {
                            role: 'system',
                            content: `Tu es l'assistant IA de Cynthia Bernier, courtière immobilière à Lebel-sur-Quévillon, Nord-du-Québec. 
                            Analyse les fiches de propriétés pour identifier le type de client, la priorité et des insights utiles.
                            Réponds en JSON strictement avec: type_client, priorite, budget_estime, points_interessants, recommandations`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: 0.3
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erreur OpenAI: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Parser réponse JSON
            try {
                const analysis = JSON.parse(aiResponse);
                console.log('✅ Analyse IA terminée:', analysis);
                return analysis;
            } catch (e) {
                // Fallback si JSON invalide
                return {
                    type_client: 'À analyser',
                    priorite: 'Moyenne',
                    budget_estime: 'À déterminer',
                    points_interessants: ['Analyse IA partiellement disponible'],
                    recommandations: ['Contact téléphonique recommandé']
                };
            }
            
        } catch (error) {
            console.error('❌ Erreur analyse IA:', error);
            return {
                type_client: 'Non analysé',
                priorite: 'À évaluer',
                budget_estime: 'À déterminer', 
                points_interessants: ['Analyse IA non disponible'],
                recommandations: ['Traitement manuel requis']
            };
        }
    }
    
    buildAnalysisPrompt(formData) {
        return `
Analyse cette fiche immobilière pour Cynthia Bernier à Lebel-sur-Quévillon:

PROPRIÉTÉ:
- Adresse: ${formData.adresse || 'Non spécifiée'}
- Année construction: ${formData.anneeConstruction || 'N/A'}
- Évaluation municipale: ${formData.evaluationMunicipale || 'N/A'}
- Terrain: ${formData.mesuresTerrain || 'N/A'}
- Bâtiment: ${formData.mesuresBatiment || 'N/A'}

PROPRIÉTAIRE:
- Nom: ${formData.prop1Nom || 'N/A'}
- Téléphones: ${formData.prop1Tel1 || 'N/A'} / ${formData.prop1Tel2 || 'N/A'}
- Type: ${this.getFieldValues(formData, 'prop1Type') || 'N/A'}

CARACTÉRISTIQUES:
- Fondation: ${this.getFieldValues(formData, 'fondation') || 'N/A'}
- Toiture: ${this.getFieldValues(formData, 'toiture') || 'N/A'} (${formData.anneeToiture || 'N/A'})
- Revêtement: ${this.getFieldValues(formData, 'revetementExt') || 'N/A'}
- Énergie: ${this.getFieldValues(formData, 'energie') || 'N/A'}
- Équipements: ${this.getFieldValues(formData, 'equipements') || 'N/A'}
- Piscine: ${this.getFieldValues(formData, 'piscine') || 'Aucune'}

NOTES: ${formData.notesSpeciales || 'Aucune'}

Contexte: Lebel-sur-Quévillon est une ville minière du Nord-du-Québec avec marché immobilier spécifique.

Retourne uniquement du JSON valide avec cette structure exacte:
{
  "type_client": "Vendeur urgent|Vendeur patient|Investisseur|Premier acheteur",
  "priorite": "Haute|Moyenne|Faible", 
  "budget_estime": "Estimation de prix de vente",
  "points_interessants": ["point1", "point2", "point3"],
  "recommandations": ["action1", "action2", "action3"]
}
        `.trim();
    }
    
    getFieldValues(formData, fieldName) {
        // Reconstituer valeurs checkboxes depuis formData
        const value = formData[fieldName];
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value || '';
    }
    
    formatEnrichedEmail(formData, aiAnalysis) {
        const basicInfo = this.formatBasicProperty(formData);
        const aiInsights = this.formatAIInsights(aiAnalysis);
        
        return {
            to: 'cynthia.bernier@courtiercynthia.com',
            subject: `🤖 ${aiAnalysis.type_client || 'Nouveau client'} - ${formData.adresse || 'Propriété'} [Priorité: ${aiAnalysis.priorite || 'Moyenne'}]`,
            content: `
🏠 NOUVELLE FICHE AVEC ANALYSE IA

${aiInsights}

📋 DÉTAILS PROPRIÉTÉ
${basicInfo}

---
🤖 Traité par Assistant IA Cynthia
🕐 ${new Date().toLocaleString('fr-CA')}
📱 Dashboard mis à jour automatiquement
            `.trim()
        };
    }
    
    formatBasicProperty(data) {
        return `
📍 LOCALISATION
• Adresse: ${data.adresse || 'N/A'}
• Lot: ${data.numLot || 'N/A'} | JLR: ${data.jlr || 'N/A'}

👥 CONTACT PRINCIPAL
• Nom: ${data.prop1Nom || 'N/A'}
• Téléphone: ${data.prop1Tel1 || 'N/A'}

🏗️ CARACTÉRISTIQUES
• Construction: ${data.anneeConstruction || 'N/A'}
• Évaluation: ${data.evaluationMunicipale || 'N/A'}
• Terrain: ${data.mesuresTerrain || 'N/A'}

📝 NOTES: ${data.notesSpeciales || 'Aucune note particulière'}
        `.trim();
    }
    
    formatAIInsights(analysis) {
        if (!analysis) return '❌ Analyse IA non disponible';
        
        return `
🤖 ANALYSE IA COMPLÈTE

⭐ TYPE CLIENT: ${analysis.type_client || 'À déterminer'}
🎯 PRIORITÉ: ${analysis.priorite || 'Moyenne'}
💰 BUDGET ESTIMÉ: ${analysis.budget_estime || 'À évaluer'}

💡 POINTS D'INTÉRÊT:
${(analysis.points_interessants || []).map(point => `• ${point}`).join('\n')}

📋 RECOMMANDATIONS:
${(analysis.recommandations || []).map(rec => `• ${rec}`).join('\n')}
        `.trim();
    }
    
    async sendEmail(emailContent) {
        // Simulation envoi email
        console.log('📧 Email enrichi IA prêt:', emailContent.subject);
        
        // En production: intégration EmailJS ou SMTP
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('✅ Email avec analyse IA envoyé à Cynthia');
                resolve(true);
            }, 800);
        });
    }
    
    notifyDashboard(formData, aiAnalysis) {
        try {
            const notification = {
                type: 'NEW_PROPERTY_WITH_AI',
                data: {
                    id: 'prop_' + Date.now(),
                    adresse: formData.adresse,
                    proprietaire: formData.prop1Nom,
                    telephone: formData.prop1Tel1,
                    ai_analysis: aiAnalysis,
                    priority: aiAnalysis.priorite || 'Moyenne',
                    type_client: aiAnalysis.type_client || 'À analyser',
                    created: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            };
            
            // Stocker pour dashboard
            const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
            notifications.unshift(notification);
            
            // Limite 50 notifications
            if (notifications.length > 50) notifications.pop();
            
            localStorage.setItem('cynthia_notifications', JSON.stringify(notifications));
            
            console.log('📡 Dashboard notifié avec analyse IA');
            
        } catch (error) {
            console.warn('⚠️ Erreur notification dashboard:', error);
        }
    }
    
    // Test de connexion IA
    async testConnection() {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.openaiKey}`
                }
            });
            
            if (response.ok) {
                console.log('✅ Connexion OpenAI OK');
                return true;
            } else {
                console.error('❌ Erreur connexion OpenAI:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Test connexion IA échoué:', error);
            return false;
        }
    }
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
    window.EmailService = EmailService;
}

// Export Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}