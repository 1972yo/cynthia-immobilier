// 👥 CLIENT MANAGER - Système de gestion clients automatique
// Workflow: Formulaire → Log Client → Classification → Notifications croisées IA

class ClientManager {
    constructor() {
        this.clients = [];
        this.pendingAuthorizations = [];
        this.clientCategories = {
            vendeur: 'Propriétaire souhaitant vendre',
            acheteur: 'Client cherchant à acheter',
            evaluation: 'Demande d\'évaluation de propriété',
            information: 'Demande d\'information générale'
        };
        
        this.init();
    }

    async init() {
        console.log('👥 Initialisation Client Manager...');
        
        // Charger clients existants
        await this.loadClients();
        
        // Démarrer surveillance formulaires
        this.startFormWatcher();
        
        // Initialiser système notifications
        this.initializeNotificationSystem();
        
        console.log('✅ Client Manager initialisé');
    }

    async loadClients() {
        try {
            const savedClients = localStorage.getItem('cynthia_clients_database');
            if (savedClients) {
                this.clients = JSON.parse(savedClients);
            }
            
            const savedAuthorizations = localStorage.getItem('cynthia_pending_authorizations');
            if (savedAuthorizations) {
                this.pendingAuthorizations = JSON.parse(savedAuthorizations);
            }
            
        } catch (error) {
            console.warn('⚠️ Erreur chargement clients:', error);
            this.clients = [];
            this.pendingAuthorizations = [];
        }
    }

    // 📋 Surveillance automatique des nouveaux formulaires
    startFormWatcher() {
        // Surveiller localStorage pour nouveaux formulaires
        setInterval(() => {
            this.checkForNewFormSubmissions();
        }, 5000); // Vérifier toutes les 5 secondes
        
        console.log('👁️ Surveillance formulaires activée');
    }

    checkForNewFormSubmissions() {
        try {
            // Charger notifications existantes (venant de CYNTHIA_ASSISTANT)
            const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
            const formData = JSON.parse(localStorage.getItem('cynthia_form_data') || '{}');
            
            // Chercher nouvelles soumissions non traitées
            const newFormNotifications = notifications.filter(notif => 
                notif.type === 'NEW_FORM' && 
                !notif.processed && 
                notif.timestamp > (Date.now() - 30000) // Dernières 30 secondes
            );
            
            // Traiter chaque nouveau formulaire
            newFormNotifications.forEach(notification => {
                this.processNewFormSubmission(notification, formData);
            });
            
        } catch (error) {
            console.warn('⚠️ Erreur surveillance formulaires:', error);
        }
    }

    // 🔄 Traitement automatique nouveau formulaire
    processNewFormSubmission(notification, formData) {
        console.log('📋 Nouveau formulaire détecté:', notification);
        
        // Extraire données du formulaire
        const clientData = this.extractClientDataFromForm(notification, formData);
        
        // Créer log client automatiquement
        const clientRecord = this.createClientRecord(clientData);
        
        // Classification automatique
        const category = this.classifyClient(clientData);
        clientRecord.category = category;
        
        // Sauvegarder client
        this.clients.push(clientRecord);
        this.saveClients();
        
        // Notifications croisées vers les 2 IA
        this.sendCrossNotifications(clientRecord);
        
        // Marquer notification comme traitée
        this.markNotificationAsProcessed(notification);
        
        console.log('✅ Client créé et notifié:', clientRecord);
    }

    extractClientDataFromForm(notification, formData) {
        return {
            nom: formData.prop1Nom || 'Client Anonyme',
            prenom: formData.prop1Prenom || '',
            telephone: formData.prop1Tel || '',
            email: formData.prop1Email || '',
            adresse: formData.adresse || '',
            ville: formData.ville || 'Lebel-sur-Quévillon',
            codePostal: formData.codePostal || '',
            serviceType: this.determineServiceType(notification, formData),
            message: formData.message || formData.commentaires || '',
            source: 'formulaire_web',
            timestamp: notification.timestamp || Date.now()
        };
    }

    determineServiceType(notification, formData) {
        const message = (formData.message || formData.commentaires || '').toLowerCase();
        const titre = (formData.titre || '').toLowerCase();
        
        if (message.includes('vendre') || message.includes('vente') || titre.includes('vente')) {
            return 'vente';
        } else if (message.includes('acheter') || message.includes('achat') || titre.includes('achat')) {
            return 'achat';
        } else if (message.includes('évaluation') || message.includes('evaluer') || titre.includes('evaluation')) {
            return 'evaluation';
        } else {
            return 'information';
        }
    }

    createClientRecord(clientData) {
        return {
            id: this.generateClientId(),
            ...clientData,
            statut: 'nouveau_prospect',
            priorite: this.calculateClientPriority(clientData),
            dateCreation: new Date(),
            derniereActivite: new Date(),
            interactions: [],
            tags: this.generateClientTags(clientData),
            potentielCommission: this.estimateCommissionPotential(clientData)
        };
    }

    generateClientId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `CLI_${timestamp}_${random}`.toUpperCase();
    }

    classifyClient(clientData) {
        const serviceType = clientData.serviceType;
        const message = (clientData.message || '').toLowerCase();
        
        // Classification intelligente
        if (serviceType === 'vente' || message.includes('vendre ma maison') || message.includes('mettre en vente')) {
            return 'vendeur';
        } else if (serviceType === 'achat' || message.includes('cherche maison') || message.includes('acheter')) {
            return 'acheteur';
        } else if (serviceType === 'evaluation' || message.includes('valeur') || message.includes('évaluer')) {
            return 'evaluation';
        } else {
            return 'information';
        }
    }

    calculateClientPriority(clientData) {
        let priority = 1; // Base
        
        // Priorité élevée pour vendeurs (commission potentielle)
        if (clientData.serviceType === 'vente') priority += 3;
        
        // Priorité moyenne pour acheteurs
        if (clientData.serviceType === 'achat') priority += 2;
        
        // Info complète = priorité plus élevée
        if (clientData.telephone && clientData.email) priority += 1;
        
        // Message détaillé = client sérieux
        if (clientData.message && clientData.message.length > 50) priority += 1;
        
        return Math.min(priority, 5); // Max 5
    }

    generateClientTags(clientData) {
        const tags = [];
        
        tags.push(clientData.serviceType);
        tags.push(clientData.ville || 'Lebel-sur-Quévillon');
        
        const message = (clientData.message || '').toLowerCase();
        if (message.includes('urgent')) tags.push('urgent');
        if (message.includes('budget')) tags.push('budget_défini');
        if (message.includes('première')) tags.push('premier_achat');
        
        return tags;
    }

    estimateCommissionPotential(clientData) {
        // Estimation basée sur le marché de Lebel-sur-Quévillon
        const averagePrice = 235000;
        const commissionRate = 0.05; // 5%
        
        if (clientData.serviceType === 'vente') {
            return averagePrice * commissionRate; // ~11,750$
        } else if (clientData.serviceType === 'achat') {
            return averagePrice * commissionRate * 0.5; // Côté acheteur
        }
        
        return 0;
    }

    // 🔔 Système de notifications croisées entre les 2 IA
    sendCrossNotifications(clientRecord) {
        console.log('🔔 Envoi notifications croisées pour:', clientRecord.nom);
        
        // Notification vers IA Email (email-ia.js)
        this.notifyEmailIA(clientRecord);
        
        // Notification vers IA Marketing (marketing-ia.js)
        this.notifyMarketingIA(clientRecord);
        
        // Notification Dashboard principal
        this.notifyDashboard(clientRecord);
    }

    notifyEmailIA(clientRecord) {
        const emailNotification = {
            type: 'nouveau_client_email',
            clientId: clientRecord.id,
            clientNom: clientRecord.nom,
            clientEmail: clientRecord.email,
            serviceType: clientRecord.serviceType,
            action: 'préparer_email_bienvenue',
            priorite: clientRecord.priorite,
            message: `Nouveau ${clientRecord.category} détecté: ${clientRecord.nom}. Email de bienvenue requis.`,
            timestamp: new Date()
        };
        
        // Ajouter à la queue de notifications IA Email
        const emailNotifications = JSON.parse(localStorage.getItem('cynthia_email_ia_notifications') || '[]');
        emailNotifications.unshift(emailNotification);
        localStorage.setItem('cynthia_email_ia_notifications', JSON.stringify(emailNotifications.slice(0, 50)));
        
        console.log('📧 IA Email notifiée:', emailNotification);
    }

    notifyMarketingIA(clientRecord) {
        const marketingNotification = {
            type: 'nouveau_prospect_marketing',
            clientId: clientRecord.id,
            clientNom: clientRecord.nom,
            clientAdresse: clientRecord.adresse,
            serviceType: clientRecord.serviceType,
            category: clientRecord.category,
            priorite: clientRecord.priorite,
            potentielCommission: clientRecord.potentielCommission,
            timestamp: new Date()
        };
        
        // Si c'est un vendeur, demander autorisation pour créer fiche
        if (clientRecord.category === 'vendeur') {
            marketingNotification.action = 'demander_autorisation_fiche';
            marketingNotification.message = `Nouveau vendeur détecté: ${clientRecord.nom} (${clientRecord.adresse}). Créer fiche immobilière ?`;
            
            // Créer demande d'autorisation
            this.createAuthorizationRequest(clientRecord);
        } else {
            marketingNotification.action = 'analyser_prospect';
            marketingNotification.message = `Nouveau prospect ${clientRecord.category}: ${clientRecord.nom}. Analyser pour campagne marketing.`;
        }
        
        // Ajouter à la queue de notifications IA Marketing
        const marketingNotifications = JSON.parse(localStorage.getItem('cynthia_marketing_ia_notifications') || '[]');
        marketingNotifications.unshift(marketingNotification);
        localStorage.setItem('cynthia_marketing_ia_notifications', JSON.stringify(marketingNotifications.slice(0, 50)));
        
        console.log('🌐 IA Marketing notifiée:', marketingNotification);
    }

    notifyDashboard(clientRecord) {
        // Utiliser le système de notifications existant du dashboard
        if (window.cynthiaDashboard) {
            const icon = clientRecord.category === 'vendeur' ? '🏠' : 
                        clientRecord.category === 'acheteur' ? '🔍' : 
                        clientRecord.category === 'evaluation' ? '📊' : 'ℹ️';
            
            window.cynthiaDashboard.addNotification(
                icon,
                `Nouveau client: ${clientRecord.nom}`,
                `${clientRecord.category} - ${clientRecord.ville} (Priorité: ${clientRecord.priorite}/5)`,
                'info'
            );
        }
    }

    // ✅ Système d'autorisation pour publication fiches
    createAuthorizationRequest(clientRecord) {
        const authRequest = {
            id: this.generateAuthorizationId(),
            type: 'demande_autorisation_publication',
            clientId: clientRecord.id,
            clientNom: clientRecord.nom,
            clientAdresse: clientRecord.adresse,
            clientTelephone: clientRecord.telephone,
            clientEmail: clientRecord.email,
            titre: 'Autorisation Publication Fiche Immobilière',
            message: `Nouveau vendeur détecté:\n\n👤 ${clientRecord.nom}\n📍 ${clientRecord.adresse}\n📞 ${clientRecord.telephone}\n\nAutoriser l'IA Marketing à créer et publier la fiche immobilière ?`,
            actions: [
                { id: 'autoriser', label: '✅ Autoriser Publication', style: 'success' },
                { id: 'reporter', label: '⏰ Reporter à plus tard', style: 'warning' },
                { id: 'refuser', label: '❌ Refuser', style: 'danger' }
            ],
            statut: 'pending',
            dateCreation: new Date(),
            priorite: clientRecord.priorite
        };
        
        this.pendingAuthorizations.push(authRequest);
        this.savePendingAuthorizations();
        
        // Afficher immédiatement dans le dashboard si disponible
        this.displayAuthorizationInDashboard(authRequest);
        
        console.log('✅ Demande d\'autorisation créée:', authRequest);
    }

    generateAuthorizationId() {
        return `AUTH_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    }

    displayAuthorizationInDashboard(authRequest) {
        // Créer notification spéciale dans le dashboard
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification(
                '⚠️',
                'AUTORISATION REQUISE',
                `IA Marketing demande autorisation pour publier fiche de ${authRequest.clientNom}`,
                'warning'
            );
            
            // Ajouter à une zone d'autorisation spéciale (à implémenter)
            this.addAuthorizationToUI(authRequest);
        }
    }

    addAuthorizationToUI(authRequest) {
        // Créer élément UI pour l'autorisation (sera ajouté au dashboard)
        const authElement = document.createElement('div');
        authElement.className = 'authorization-request';
        authElement.innerHTML = `
            <div class="auth-header">
                <h4>⚠️ ${authRequest.titre}</h4>
                <span class="auth-priority">Priorité: ${authRequest.priorite}/5</span>
            </div>
            <div class="auth-content">
                <p>${authRequest.message}</p>
            </div>
            <div class="auth-actions">
                ${authRequest.actions.map(action => `
                    <button onclick="handleAuthorization('${authRequest.id}', '${action.id}')" 
                            class="btn-auth btn-${action.style}">
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        `;
        
        // Ajouter au container d'autorisations (à créer dans le dashboard)
        const authContainer = document.getElementById('authorizationsContainer');
        if (authContainer) {
            authContainer.appendChild(authElement);
        }
    }

    // 🎯 Gestion des réponses d'autorisation
    handleAuthorizationResponse(authId, response) {
        const authRequest = this.pendingAuthorizations.find(auth => auth.id === authId);
        if (!authRequest) return;
        
        authRequest.statut = response;
        authRequest.dateReponse = new Date();
        
        const client = this.clients.find(c => c.id === authRequest.clientId);
        
        switch (response) {
            case 'autoriser':
                this.processAuthorizedPublication(authRequest, client);
                break;
            case 'reporter':
                this.scheduleAuthorizationReminder(authRequest);
                break;
            case 'refuser':
                this.logRefusedAuthorization(authRequest);
                break;
        }
        
        this.savePendingAuthorizations();
        this.removeAuthorizationFromUI(authId);
        
        console.log(`✅ Autorisation ${response} pour:`, authRequest.clientNom);
    }

    processAuthorizedPublication(authRequest, client) {
        // Notifier IA Marketing de procéder à la publication
        const marketingCommand = {
            type: 'autorisation_accordee',
            action: 'creer_fiche_immobiliere',
            clientId: client.id,
            clientData: client,
            authorizationId: authRequest.id,
            autoPublish: true,
            timestamp: new Date()
        };
        
        // Ajouter commande à la queue IA Marketing
        const marketingCommands = JSON.parse(localStorage.getItem('cynthia_marketing_ia_commands') || '[]');
        marketingCommands.unshift(marketingCommand);
        localStorage.setItem('cynthia_marketing_ia_commands', JSON.stringify(marketingCommands));
        
        // Notification dashboard
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification(
                '✅',
                'Publication Autorisée',
                `IA Marketing va créer la fiche pour ${client.nom}`,
                'success'
            );
        }
    }

    scheduleAuthorizationReminder(authRequest) {
        // Programmer rappel dans 24h
        setTimeout(() => {
            this.displayAuthorizationInDashboard(authRequest);
        }, 24 * 60 * 60 * 1000); // 24 heures
    }

    removeAuthorizationFromUI(authId) {
        const authElement = document.querySelector(`[data-auth-id="${authId}"]`);
        if (authElement) {
            authElement.remove();
        }
    }

    // 💾 Sauvegarde données
    saveClients() {
        localStorage.setItem('cynthia_clients_database', JSON.stringify(this.clients));
    }

    savePendingAuthorizations() {
        localStorage.setItem('cynthia_pending_authorizations', JSON.stringify(this.pendingAuthorizations));
    }

    markNotificationAsProcessed(notification) {
        // Marquer notification comme traitée
        const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
        const notifIndex = notifications.findIndex(n => n.timestamp === notification.timestamp);
        if (notifIndex >= 0) {
            notifications[notifIndex].processed = true;
            localStorage.setItem('cynthia_notifications', JSON.stringify(notifications));
        }
    }

    // 🔍 Système de recherche et filtrage clients
    searchClients(query) {
        return this.clients.filter(client => 
            client.nom.toLowerCase().includes(query.toLowerCase()) ||
            client.adresse.toLowerCase().includes(query.toLowerCase()) ||
            client.email.toLowerCase().includes(query.toLowerCase())
        );
    }

    getClientsByCategory(category) {
        return this.clients.filter(client => client.category === category);
    }

    getHighPriorityClients() {
        return this.clients.filter(client => client.priorite >= 4);
    }

    // 📊 Analytics clients
    getClientStats() {
        const stats = {
            total: this.clients.length,
            vendeurs: this.getClientsByCategory('vendeur').length,
            acheteurs: this.getClientsByCategory('acheteur').length,
            evaluations: this.getClientsByCategory('evaluation').length,
            highPriority: this.getHighPriorityClients().length,
            potentielCommissionTotal: this.clients.reduce((sum, client) => sum + client.potentielCommission, 0)
        };
        
        return stats;
    }

    initializeNotificationSystem() {
        // Vérifier les notifications en attente au démarrage
        this.processPendingNotifications();
    }

    processPendingNotifications() {
        // Traiter notifications IA Email en attente
        const emailNotifications = JSON.parse(localStorage.getItem('cynthia_email_ia_notifications') || '[]');
        if (emailNotifications.length > 0 && window.emailIAManager) {
            console.log(`📧 ${emailNotifications.length} notifications pour IA Email`);
        }
        
        // Traiter notifications IA Marketing en attente  
        const marketingNotifications = JSON.parse(localStorage.getItem('cynthia_marketing_ia_notifications') || '[]');
        if (marketingNotifications.length > 0 && window.marketingIAManager) {
            console.log(`🌐 ${marketingNotifications.length} notifications pour IA Marketing`);
        }
        
        // Traiter commandes IA Marketing en attente
        const marketingCommands = JSON.parse(localStorage.getItem('cynthia_marketing_ia_commands') || '[]');
        if (marketingCommands.length > 0 && window.marketingIAManager) {
            console.log(`🎯 ${marketingCommands.length} commandes pour IA Marketing`);
        }
    }
}

// 🎯 Fonction globale pour gérer les autorisations
function handleAuthorization(authId, response) {
    if (window.clientManager) {
        window.clientManager.handleAuthorizationResponse(authId, response);
    }
}

// 🚀 Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser seulement dans le dashboard principal
    if (document.querySelector('.dashboard-page')) {
        window.clientManager = new ClientManager();
        console.log('✅ Client Manager démarré et opérationnel');
    }
});

// Export pour utilisation dans autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClientManager;
}