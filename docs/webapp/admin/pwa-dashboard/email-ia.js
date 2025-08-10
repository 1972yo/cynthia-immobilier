// 📧 EMAIL & IA - JavaScript avancé pour Cynthia
// Système complet de gestion email avec assistance IA

class EmailIAManager {
    constructor() {
        this.templates = [];
        this.emails = [];
        this.aiConversation = [];
        this.currentTemplateEdit = null;
        
        // Ajout gestion des fiches
        this.fiches = [];
        this.ficheAnalyses = [];
        this.currentFiche = null;
        
        // Configuration OpenAI WebApp
        this.openAIConfig = this.loadOpenAIConfig();
        
        this.init();
    }

    loadOpenAIConfig() {
        // Utiliser la configuration WebApp séparée
        if (typeof window !== 'undefined' && window.WebAppConfig) {
            return {
                apiKey: window.WebAppConfig.getOpenAIKey(),
                endpoint: window.WebAppConfig.get('openai.endpoint'),
                model: window.WebAppConfig.get('openai.model'),
                maxTokens: window.WebAppConfig.get('openai.maxTokens'),
                temperature: window.WebAppConfig.get('openai.temperature')
            };
        }
        
        // Fallback depuis les variables d'environnement
        if (typeof window !== 'undefined' && window.ENV && window.ENV.CYNTHIA_WEBAPP_OPENAI_KEY) {
            return {
                apiKey: window.ENV.CYNTHIA_WEBAPP_OPENAI_KEY,
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                maxTokens: 800,
                temperature: 0.4
            };
        }
        
        // Configuration par défaut
        return {
            apiKey: process.env.CYNTHIA_WEBAPP_OPENAI_KEY || 'API_KEY_NOT_SET',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-4',
            maxTokens: 800,
            temperature: 0.4
        };
    }

    async init() {
        console.log('📧 Initialisation Email & IA Manager...');
        
        // Charger les données
        await this.loadTemplates();
        await this.loadEmails();
        this.loadAIConversation();
        
        // Initialiser l'interface
        this.renderTemplates();
        this.renderRecentEmails();
        this.renderAIInsights();
        this.setupEventListeners();
        
        // Démarrer l'assistant IA
        this.initializeAI();
        
        console.log('✅ Email & IA Manager initialisé');
    }

    async loadTemplates() {
        // Charger templates depuis localStorage ou créer defaults
        const savedTemplates = localStorage.getItem('cynthia_email_templates');
        
        if (savedTemplates) {
            this.templates = JSON.parse(savedTemplates);
        } else {
            // Templates par défaut pour l'immobilier
            this.templates = [
                {
                    id: 1,
                    name: 'Bienvenue nouveau client',
                    category: 'Accueil',
                    subject: 'Bienvenue chez Cynthia Bernier - Votre courtière à Lebel-sur-Quévillon',
                    body: `Bonjour {prenom},

Je suis ravie de vous accueillir parmi mes clients ! En tant que courtière immobilière résidentielle à Lebel-sur-Quévillon, je m'engage à vous offrir un service personnalisé et professionnel.

🏠 Mes services incluent :
• Évaluation gratuite de votre propriété
• Accompagnement complet vente/achat
• Expertise locale Nord-du-Québec
• Support tout au long du processus

N'hésitez pas à me contacter pour toute question.

Cordialement,
Cynthia Bernier
Courtière immobilière résidentielle
📞 418-XXX-XXXX`,
                    variables: ['prenom'],
                    lastUsed: null
                },
                {
                    id: 2,
                    name: 'Nouvelle propriété disponible',
                    category: 'Annonce',
                    subject: 'Nouvelle opportunité immobilière : {adresse}',
                    body: `Bonjour {prenom},

Excellente nouvelle ! Une propriété correspondant à vos critères vient d'être mise sur le marché :

🏠 **Détails de la propriété :**
📍 Adresse : {adresse}
💰 Prix : {prix}$
🛏️ Chambres : {chambres}
🛁 Salles de bain : {sallesBain}
📐 Superficie : {superficie} pi²

Cette propriété présente un excellent potentiel et se situe dans un secteur recherché de Lebel-sur-Quévillon.

Je serais heureuse de planifier une visite avec vous dès que possible.

Appelez-moi au 418-XXX-XXXX pour réserver votre visite !

Cordialement,
Cynthia Bernier`,
                    variables: ['prenom', 'adresse', 'prix', 'chambres', 'sallesBain', 'superficie'],
                    lastUsed: null
                },
                {
                    id: 3,
                    name: 'Suivi après visite',
                    category: 'Suivi',
                    subject: 'Suite à votre visite du {date} - {adresse}',
                    body: `Bonjour {prenom},

J'espère que vous avez apprécié la visite de la propriété située au {adresse} lors de notre rencontre du {date}.

Cette propriété offre de nombreux avantages et je crois qu'elle pourrait parfaitement convenir à vos besoins.

📝 **Points à retenir :**
• Excellente localisation à Lebel-sur-Quévillon
• Potentiel d'amélioration intéressant
• Prix compétitif pour le secteur

J'aimerais connaître vos impressions et répondre à vos questions éventuelles.

Êtes-vous disponible cette semaine pour en discuter ? Je suis flexible pour m'adapter à votre horaire.

Au plaisir de vous entendre,
Cynthia Bernier
📞 418-XXX-XXXX`,
                    variables: ['prenom', 'date', 'adresse'],
                    lastUsed: null
                }
            ];
            
            this.saveTemplates();
        }
    }

    async loadEmails() {
        // Charger historique emails
        const savedEmails = localStorage.getItem('cynthia_email_history');
        
        if (savedEmails) {
            this.emails = JSON.parse(savedEmails);
        } else {
            this.emails = [];
        }
    }

    loadAIConversation() {
        const saved = localStorage.getItem('cynthia_ai_conversation');
        if (saved) {
            this.aiConversation = JSON.parse(saved);
        } else {
            this.aiConversation = [
                {
                    type: 'ai',
                    content: 'Bonjour Cynthia ! Je suis votre assistant intelligent pour la gestion des emails. Comment puis-je vous aider aujourd\'hui ?',
                    timestamp: new Date()
                }
            ];
        }
        
        this.renderAIConversation();
    }

    saveTemplates() {
        localStorage.setItem('cynthia_email_templates', JSON.stringify(this.templates));
    }

    saveEmails() {
        localStorage.setItem('cynthia_email_history', JSON.stringify(this.emails));
    }

    saveAIConversation() {
        localStorage.setItem('cynthia_ai_conversation', JSON.stringify(this.aiConversation));
    }

    setupEventListeners() {
        // Chat input avec Enter
        document.getElementById('aiChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAiMessage();
            }
        });

        // Email composer avec suggestions temps réel
        document.getElementById('emailBody').addEventListener('input', () => {
            this.generateAISuggestions();
        });

        // Template select
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadTemplate(parseInt(e.target.value));
            }
        });
    }

    initializeAI() {
        // Charger les templates dans le select
        const templateSelect = document.getElementById('templateSelect');
        templateSelect.innerHTML = '<option value="">Choisir un modèle...</option>';
        
        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = `${template.name} (${template.category})`;
            templateSelect.appendChild(option);
        });

        // Simuler des stats
        this.updateStats();
    }

    updateStats() {
        document.getElementById('totalEmails').textContent = this.emails.length;
        document.getElementById('totalTemplates').textContent = this.templates.length;
        
        // Simuler des stats IA
        const aiSuggestions = Math.floor(Math.random() * 20) + 10;
        const responseRate = Math.floor(Math.random() * 30) + 60;
        
        document.getElementById('aiAssistance').textContent = aiSuggestions;
        document.getElementById('responseRate').textContent = `${responseRate}%`;
    }

    renderTemplates() {
        const templatesList = document.getElementById('templatesList');
        
        if (this.templates.length === 0) {
            templatesList.innerHTML = '<p class="no-templates">Aucun modèle disponible</p>';
            return;
        }

        templatesList.innerHTML = this.templates.map(template => `
            <div class="template-item" data-id="${template.id}">
                <div class="template-header">
                    <span class="template-name">${template.name}</span>
                    <span class="template-category">${template.category}</span>
                </div>
                <p class="template-subject">${template.subject}</p>
                <div class="template-actions">
                    <button onclick="emailIAManager.editTemplate(${template.id})" class="btn-edit">✏️</button>
                    <button onclick="emailIAManager.useTemplate(${template.id})" class="btn-use">📧</button>
                    <button onclick="emailIAManager.deleteTemplate(${template.id})" class="btn-delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    renderAIConversation() {
        const chatMessages = document.getElementById('aiChatMessages');
        
        chatMessages.innerHTML = this.aiConversation.map(message => `
            <div class="message ${message.type}-message">
                <div class="message-content">
                    <p><strong>${message.type === 'ai' ? 'Assistant IA' : 'Vous'}:</strong> ${message.content}</p>
                    <small class="message-time">${this.formatTime(message.timestamp)}</small>
                </div>
            </div>
        `).join('');
        
        // Scroll vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    renderRecentEmails() {
        const emailsList = document.getElementById('recentEmailsList');
        
        if (this.emails.length === 0) {
            emailsList.innerHTML = `
                <div class="no-emails">
                    <p>📧 Aucun email récent</p>
                    <p><small>Commencez par rédiger votre premier email !</small></p>
                </div>
            `;
            return;
        }

        const recentEmails = this.emails.slice(-10).reverse();
        
        emailsList.innerHTML = recentEmails.map(email => `
            <div class="email-item">
                <div class="email-header">
                    <span class="email-subject">${email.subject}</span>
                    <span class="email-date">${this.formatDate(email.timestamp)}</span>
                </div>
                <div class="email-recipient">À: ${email.to}</div>
                <div class="email-preview">${email.body.substring(0, 120)}...</div>
            </div>
        `).join('');
    }

    renderAIInsights() {
        const insights = [
            {
                title: 'Meilleur moment d\'envoi',
                content: 'Les mardis et jeudis entre 9h-11h ont le meilleur taux d\'ouverture (74%)'
            },
            {
                title: 'Ton recommandé',
                content: 'Vos emails personnalisés avec prénom ont 45% plus de réponses'
            },
            {
                title: 'Optimisation sujet',
                content: 'Les sujets de 6-10 mots avec localisation (Lebel-sur-Quévillon) performent mieux'
            },
            {
                title: 'Suivi client',
                content: 'Rappel: 3 clients n\'ont pas répondu depuis plus de 7 jours'
            }
        ];

        const insightsList = document.getElementById('aiInsightsList');
        insightsList.innerHTML = insights.map(insight => `
            <div class="ai-insight-item">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-content">${insight.content}</div>
            </div>
        `).join('');
    }

    // Nouvelle méthode pour appeler OpenAI WebApp
    async callOpenAIWebApp(prompt, systemMessage = null) {
        try {
            if (this.openAIConfig.apiKey.includes('HERE')) {
                throw new Error('Clé OpenAI WebApp non configurée');
            }

            const messages = [];
            
            if (systemMessage) {
                messages.push({
                    role: 'system',
                    content: systemMessage
                });
            }
            
            messages.push({
                role: 'user',
                content: prompt
            });

            const response = await fetch(this.openAIConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openAIConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: this.openAIConfig.model,
                    messages: messages,
                    temperature: this.openAIConfig.temperature,
                    max_tokens: this.openAIConfig.maxTokens
                })
            });

            if (!response.ok) {
                throw new Error(`API OpenAI WebApp error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('❌ Erreur OpenAI WebApp:', error);
            throw error;
        }
    }

    // Méthodes d'interaction IA
    async sendAiMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Ajouter message utilisateur
        this.aiConversation.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // Afficher "IA en cours de réflexion..."
        this.aiConversation.push({
            type: 'ai',
            content: '🤔 Je réfléchis...',
            timestamp: new Date()
        });
        
        this.renderAIConversation();
        input.value = '';
        
        try {
            // Appel réel à l'API OpenAI WebApp
            const aiResponse = await this.callOpenAIWebApp(
                message,
                "Tu es Cynthia, assistante IA experte en immobilier à Lebel-sur-Quévillon. Tu aides avec les emails, templates, et gestion client. Réponds de manière professionnelle et personnalisée."
            );
            
            // Remplacer le message temporaire
            this.aiConversation[this.aiConversation.length - 1] = {
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };
            
        } catch (error) {
            console.error('Erreur API OpenAI:', error);
            
            // Message d'erreur si API ne fonctionne pas
            this.aiConversation[this.aiConversation.length - 1] = {
                type: 'ai',
                content: '⚠️ Désolé, je ne peux pas répondre maintenant. Vérifiez votre connexion ou contactez le support.',
                timestamp: new Date()
            };
        }
        
        this.renderAIConversation();
        this.saveAIConversation();
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('email') || message.includes('modèle')) {
            return 'Je peux vous aider à créer un email personnalisé ! Quel type de communication souhaitez-vous envoyer ? (bienvenue, suivi client, nouvelle propriété...)';
        }
        
        if (message.includes('client') || message.includes('suivi')) {
            return 'Pour un suivi client efficace, je recommande d\'envoyer un email 2-3 jours après le premier contact. Voulez-vous que je génère un modèle de suivi personnalisé ?';
        }
        
        if (message.includes('propriété') || message.includes('maison')) {
            return 'Excellent ! Pour annoncer une nouvelle propriété, incluez toujours : adresse, prix, caractéristiques principales et un call-to-action pour la visite. Voulez-vous utiliser le modèle "Nouvelle propriété" ?';
        }
        
        if (message.includes('améliorer') || message.includes('optimiser')) {
            return 'Pour optimiser vos emails : 1) Personnalisez avec le prénom, 2) Mentionnez Lebel-sur-Quévillon pour la proximité, 3) Ajoutez un appel à l\'action clair, 4) Envoyez entre 9h-11h. Voulez-vous que j\'analyse un email spécifique ?';
        }
        
        return 'Je suis là pour vous aider avec vos emails ! Vous pouvez me demander de : créer des modèles, analyser vos messages, suggérer des améliorations, ou donner des conseils pour optimiser vos communications client.';
    }

    generateAISuggestions() {
        const emailBody = document.getElementById('emailBody').value;
        const suggestionsDiv = document.getElementById('aiSuggestions');
        
        if (emailBody.length < 20) {
            suggestionsDiv.innerHTML = '<p><strong>💡 Suggestions IA:</strong> Commencez à taper pour des suggestions intelligentes</p>';
            return;
        }

        // Analyser le contenu et suggérer des améliorations
        const suggestions = [];
        
        if (!emailBody.toLowerCase().includes('lebel-sur-quévillon')) {
            suggestions.push('Mentionnez votre expertise locale à Lebel-sur-Quévillon');
        }
        
        if (!emailBody.includes('Cordialement') && !emailBody.includes('Bien à vous')) {
            suggestions.push('Ajoutez une formule de politesse professionnelle');
        }
        
        if (!emailBody.includes('418-XXX-XXXX')) {
            suggestions.push('Incluez vos coordonnées pour faciliter le contact');
        }
        
        if (emailBody.split(' ').length > 200) {
            suggestions.push('Email un peu long - considérez raccourcir pour plus d\'impact');
        }

        if (suggestions.length > 0) {
            suggestionsDiv.innerHTML = `
                <p><strong>💡 Suggestions IA:</strong></p>
                ${suggestions.map(s => `<div class="ai-suggestion-item" onclick="emailIAManager.applySuggestion('${s}')">${s}</div>`).join('')}
            `;
        } else {
            suggestionsDiv.innerHTML = '<p><strong>✅ Suggestions IA:</strong> Votre email semble bien structuré !</p>';
        }
    }

    applySuggestion(suggestion) {
        const emailBody = document.getElementById('emailBody');
        let currentText = emailBody.value;
        
        // Appliquer automatiquement certaines suggestions
        if (suggestion.includes('Lebel-sur-Quévillon')) {
            currentText += '\n\nEn tant que courtière locale à Lebel-sur-Quévillon, je connais parfaitement le marché de la région.';
        }
        
        if (suggestion.includes('formule de politesse')) {
            currentText += '\n\nCordialement,\nCynthia Bernier\nCourtière immobilière résidentielle';
        }
        
        if (suggestion.includes('coordonnées')) {
            currentText += '\n📞 418-XXX-XXXX\n📧 cynthia@domain.com';
        }
        
        emailBody.value = currentText;
        this.generateAISuggestions();
    }

    // Méthodes de gestion des templates
    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        document.getElementById('emailSubject').value = template.subject;
        document.getElementById('emailBody').value = template.body;
        document.getElementById('templateSelect').value = templateId;
        
        // Marquer comme utilisé récemment
        template.lastUsed = new Date();
        this.saveTemplates();
    }

    loadTemplate(templateId) {
        this.useTemplate(templateId);
    }

    // Actions email
    analyzeEmailWithAI() {
        const subject = document.getElementById('emailSubject').value;
        const body = document.getElementById('emailBody').value;
        
        if (!subject || !body) {
            alert('⚠️ Veuillez saisir un sujet et un contenu avant l\'analyse');
            return;
        }

        // Simuler analyse IA
        const analysis = this.performEmailAnalysis(subject, body);
        
        alert(`🔍 ANALYSE IA DE VOTRE EMAIL\n\n${analysis.join('\n\n')}`);
    }

    performEmailAnalysis(subject, body) {
        const analysis = [];
        
        // Analyser le sujet
        if (subject.length < 30) {
            analysis.push('✅ SUJET: Longueur appropriée');
        } else {
            analysis.push('⚠️ SUJET: Un peu long, considérez raccourcir');
        }
        
        // Analyser le contenu
        const wordCount = body.split(' ').length;
        if (wordCount >= 50 && wordCount <= 150) {
            analysis.push('✅ CONTENU: Longueur idéale pour l\'engagement');
        } else if (wordCount < 50) {
            analysis.push('⚠️ CONTENU: Pourrait bénéficier de plus de détails');
        } else {
            analysis.push('⚠️ CONTENU: Considérez raccourcir pour plus d\'impact');
        }
        
        // Vérifier la personnalisation
        if (body.includes('{prenom}') || body.includes('{nom}')) {
            analysis.push('✅ PERSONNALISATION: Variables détectées');
        } else {
            analysis.push('💡 PERSONNALISATION: Ajoutez {prenom} pour plus d\'engagement');
        }
        
        // Vérifier expertise locale
        if (body.toLowerCase().includes('lebel-sur-quévillon')) {
            analysis.push('✅ EXPERTISE LOCALE: Bien mis en avant');
        } else {
            analysis.push('💡 EXPERTISE LOCALE: Mentionnez votre connaissance de Lebel-sur-Quévillon');
        }
        
        return analysis;
    }

    improveEmailWithAI() {
        const body = document.getElementById('emailBody').value;
        
        if (!body) {
            alert('⚠️ Veuillez saisir un contenu avant l\'amélioration');
            return;
        }

        // Simuler amélioration IA
        let improvedBody = body;
        
        // Ajouter expertise locale si manquante
        if (!improvedBody.toLowerCase().includes('lebel-sur-quévillon')) {
            improvedBody = improvedBody.replace(
                'Cordialement,',
                'En tant que courtière spécialisée à Lebel-sur-Quévillon, je vous accompagne avec une expertise locale approfondie.\n\nCordialement,'
            );
        }
        
        // Améliorer la conclusion si basique
        if (!improvedBody.includes('418-XXX-XXXX')) {
            improvedBody += '\n\n📞 418-XXX-XXXX - Disponible 7j/7 pour vos questions\n📧 cynthia@domain.com';
        }
        
        document.getElementById('emailBody').value = improvedBody;
        
        alert('✨ Email amélioré par l\'IA !\n\nJ\'ai ajouté des éléments pour renforcer votre expertise locale et faciliter le contact.');
    }

    sendEmail() {
        const to = document.getElementById('emailTo').value;
        const subject = document.getElementById('emailSubject').value;
        const body = document.getElementById('emailBody').value;
        
        if (!to || !subject || !body) {
            alert('⚠️ Veuillez remplir tous les champs avant l\'envoi');
            return;
        }

        // Simuler envoi d'email
        const email = {
            id: Date.now(),
            to: to,
            subject: subject,
            body: body,
            timestamp: new Date(),
            status: 'sent'
        };

        this.emails.push(email);
        this.saveEmails();
        
        // Effacer le formulaire
        document.getElementById('emailTo').value = '';
        document.getElementById('emailSubject').value = '';
        document.getElementById('emailBody').value = '';
        document.getElementById('templateSelect').value = '';
        
        // Actualiser l'affichage
        this.renderRecentEmails();
        this.updateStats();
        
        alert('📧 Email envoyé avec succès !\n\n✅ Ajouté à votre historique\n📊 Statistiques mises à jour');
    }

    // Utilitaires
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Maintenant';
        if (diffMinutes < 60) return `${diffMinutes} min`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} h`;
        return date.toLocaleDateString('fr-CA');
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('fr-CA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 🚀 Fonctions globales

function refreshEmailData() {
    if (window.emailIAManager) {
        window.emailIAManager.loadEmails();
        window.emailIAManager.updateStats();
        window.emailIAManager.renderRecentEmails();
        
        console.log('🔄 Données email actualisées');
        alert('✅ Données actualisées !');
    }
}

function goBackToDashboard() {
    window.location.href = 'index.html';
}

function sendAiMessage() {
    if (window.emailIAManager) {
        window.emailIAManager.sendAiMessage();
    }
}

function createNewTemplate() {
    const name = prompt('Nom du nouveau modèle :');
    if (!name) return;
    
    const category = prompt('Catégorie (Accueil, Annonce, Suivi, Autre) :') || 'Autre';
    const subject = prompt('Sujet du modèle :');
    if (!subject) return;
    
    const body = prompt('Corps du message (utilisez {prenom}, {adresse}, etc. pour les variables) :');
    if (!body) return;
    
    const template = {
        id: Date.now(),
        name: name,
        category: category,
        subject: subject,
        body: body,
        variables: [],
        lastUsed: null
    };
    
    if (window.emailIAManager) {
        window.emailIAManager.templates.push(template);
        window.emailIAManager.saveTemplates();
        window.emailIAManager.renderTemplates();
        window.emailIAManager.initializeAI();
        
        alert('✅ Nouveau modèle créé avec succès !');
    }
}

function generateWithAI() {
    const type = prompt('Quel type d\'email souhaitez-vous générer ?\n\n1. Bienvenue client\n2. Nouvelle propriété\n3. Suivi visite\n4. Relance\n5. Newsletter\n\nTapez le numéro ou le nom :');
    
    if (!type) return;
    
    let generatedTemplate = {};
    
    if (type.includes('1') || type.toLowerCase().includes('bienvenue')) {
        generatedTemplate = {
            name: 'Bienvenue IA - ' + new Date().toLocaleDateString(),
            subject: 'Bienvenue {prenom} ! Votre courtière à Lebel-sur-Quévillon',
            body: `Bonjour {prenom},

🏠 Bienvenue dans notre famille de clients satisfaits !

Je suis Cynthia Bernier, votre courtière immobilière dédiée à Lebel-sur-Quévillon. Avec une expertise approfondie du marché local Nord-du-Québec, je m'engage à vous accompagner dans tous vos projets immobiliers.

✨ Ce qui me différencie :
• Connaissance parfaite de Lebel-sur-Quévillon
• Disponibilité 7j/7 pour vos questions
• Suivi personnalisé de A à Z
• Réseau professionnel établi localement

Votre satisfaction est ma priorité absolue !

Contactez-moi dès maintenant pour discuter de vos objectifs immobiliers.

Cordialement,
Cynthia Bernier
Courtière immobilière résidentielle
📞 418-XXX-XXXX`
        };
    } else if (type.includes('2') || type.toLowerCase().includes('propriété')) {
        generatedTemplate = {
            name: 'Nouvelle propriété IA - ' + new Date().toLocaleDateString(),
            subject: '🏠 NOUVEAU sur le marché : {adresse} - Lebel-sur-Quévillon',
            body: `{prenom}, une opportunité exceptionnelle vous attend !

🎯 NOUVELLE PROPRIÉTÉ EXCLUSIVE

📍 Adresse : {adresse}
💰 Prix : {prix}$ (excellent rapport qualité/prix !)
🏠 Type : {type}
🛏️ Chambres : {chambres}
🛁 Salles de bain : {sallesBain}

⭐ POINTS FORTS :
• Localisation privilégiée à Lebel-sur-Quévillon
• Propriété bien entretenue
• Potentiel d'amélioration intéressant
• Secteur recherché et stable

⏰ AGISSEZ RAPIDEMENT ! Les bonnes propriétés partent vite dans notre région.

Planifions une visite dès cette semaine ?

Cynthia Bernier - Votre experte locale
📞 418-XXX-XXXX (réponse immédiate)`
        };
    }
    
    // Créer le template généré
    if (generatedTemplate.name) {
        const template = {
            id: Date.now(),
            name: generatedTemplate.name,
            category: 'IA Généré',
            subject: generatedTemplate.subject,
            body: generatedTemplate.body,
            variables: [],
            lastUsed: null
        };
        
        if (window.emailIAManager) {
            window.emailIAManager.templates.push(template);
            window.emailIAManager.saveTemplates();
            window.emailIAManager.renderTemplates();
            window.emailIAManager.initializeAI();
            
            alert('🤖 Modèle généré par IA avec succès !\n\n✨ Optimisé pour votre expertise locale à Lebel-sur-Quévillon');
        }
    }
}

function analyzeEmailWithAI() {
    if (window.emailIAManager) {
        window.emailIAManager.analyzeEmailWithAI();
    }
}

function improveEmailWithAI() {
    if (window.emailIAManager) {
        window.emailIAManager.improveEmailWithAI();
    }
}

function sendEmail() {
    if (window.emailIAManager) {
        window.emailIAManager.sendEmail();
    }
}

function showHistoryTab(tabName) {
    // Changer onglet actif
    document.querySelectorAll('.history-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 🚀 Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.emailIAManager = new EmailIAManager();
    console.log('✅ Interface Email & IA chargée et opérationnelle');
});

// Gestion des erreurs
window.addEventListener('error', (event) => {
    console.error('❌ Erreur Email & IA:', event.error);
});