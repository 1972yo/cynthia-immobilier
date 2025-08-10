/**
 * 🤖📋 FICHE ASSISTANT AI - CYNTHIA IMMOBILIER  
 * Intelligence artificielle pour création et modification de fiches
 * Interface conversationnelle naturelle pour Cynthia
 */

class FicheAssistantAI {
    constructor(ficheManagementService) {
        this.ficheService = ficheManagementService;
        this.initialized = true;
        console.log('🤖 Fiche Assistant AI initialized for Cynthia');
        
        // Patterns de reconnaissance IA
        this.intentPatterns = this.initializeIntentPatterns();
        
        // Contexte conversation
        this.conversationContext = {
            currentFiche: null,
            lastAction: null,
            userPreferences: {},
            sessionHistory: []
        };
        
        // Réponses prédéfinies
        this.responseTemplates = this.initializeResponses();
    }
    
    /**
     * Patterns pour reconnaissance d'intentions
     */
    initializeIntentPatterns() {
        return {
            create_fiche: {
                patterns: [
                    'crée', 'créer', 'nouvelle fiche', 'nouveau formulaire', 
                    'faire une fiche', 'générer', 'démarre'
                ],
                entities: ['vendeur', 'acheteur', 'évaluation', 'contrat'],
                confidence: 0.8
            },
            
            modify_design: {
                patterns: [
                    'change', 'modifie', 'couleur', 'design', 'style', 
                    'plus beau', 'moderne', 'professionnel'
                ],
                entities: ['rouge', 'bleu', 'vert', 'jaune', 'couleur'],
                confidence: 0.85
            },
            
            add_element: {
                patterns: [
                    'ajoute', 'ajouter', 'mettre', 'insérer', 'inclure', 'rajouter'
                ],
                entities: ['logo', 'champ', 'signature', 'image', 'tableau', 'section'],
                confidence: 0.9
            },
            
            modify_content: {
                patterns: [
                    'écrit', 'texte', 'contenu', 'remplace', 'corrige', 'titre'
                ],
                entities: ['titre', 'paragraphe', 'instruction', 'label'],
                confidence: 0.75
            },
            
            format_request: {
                patterns: [
                    'format', 'mise en page', 'alignement', 'taille', 'police',
                    'espacement', 'marge', 'centré', 'droite', 'gauche'
                ],
                entities: ['grand', 'petit', 'centrer', 'aligner'],
                confidence: 0.8
            },
            
            export_request: {
                patterns: [
                    'exporte', 'sauvegarde', 'pdf', 'imprimer', 'télécharger',
                    'génère le document', 'finalise'
                ],
                entities: ['pdf', 'word', 'impression'],
                confidence: 0.95
            },
            
            help_request: {
                patterns: [
                    'aide', 'comment', 'peux-tu', 'help', 'que faire',
                    'je sais pas', 'explique'
                ],
                entities: [],
                confidence: 0.7
            }
        };
    }
    
    /**
     * Templates de réponses
     */
    initializeResponses() {
        return {
            greeting: [
                "Bonjour Cynthia ! Je suis là pour vous aider avec vos fiches immobilières. Que souhaitez-vous faire ?",
                "Salut ! Prête à créer de superbes fiches pour vos clients ? Dites-moi ce que vous voulez !",
                "Hello Cynthia ! Votre assistant fiches est à votre service. Comment puis-je vous aider ?"
            ],
            
            fiche_created: [
                "Parfait ! J'ai créé votre fiche {type}. Elle est prête à être personnalisée !",
                "Excellente idée ! Votre nouvelle fiche {type} est générée. Voulez-vous l'ajuster ?",
                "C'est fait ! Fiche {type} créée avec succès. Que voulez-vous modifier ?"
            ],
            
            design_changed: [
                "Super ! J'ai appliqué vos changements de design. Ça rend beaucoup mieux !",
                "Changements appliqués ! Votre fiche a maintenant un look plus professionnel.",
                "Perfect ! Le nouveau design est en place. Ça va impressionner vos clients !"
            ],
            
            element_added: [
                "Élément ajouté avec succès ! J'ai placé votre {element} à l'endroit idéal.",
                "C'est fait ! Le {element} est maintenant intégré à votre fiche.",
                "Parfait ! Votre {element} a été ajouté. Besoin d'autres modifications ?"
            ],
            
            error_response: [
                "Oups ! Je n'ai pas bien compris. Pouvez-vous reformuler différemment ?",
                "Hmm, je ne suis pas sûr de comprendre. Essayez autre chose ?",
                "Désolé Cynthia, pouvez-vous être plus spécifique ?"
            ],
            
            help_response: [
                "Je peux vous aider à :\n• Créer des fiches (vendeur, acheteur, évaluation)\n• Changer les couleurs et le design\n• Ajouter des éléments (logo, champs, signatures)\n• Exporter en PDF\n\nQue voulez-vous faire ?",
                "Voici ce que je sais faire :\n✨ Créer des fiches personnalisées\n🎨 Modifier le design et les couleurs\n➕ Ajouter des éléments\n📄 Générer des PDF\n\nDites-moi simplement ce que vous voulez !"
            ]
        };
    }
    
    /**
     * Interface principale - traitement message Cynthia
     */
    async processMessage(message, context = {}) {
        try {
            // Nettoyer et analyser le message
            const cleanMessage = message.trim().toLowerCase();
            
            // Mettre à jour contexte
            this.updateConversationContext(message, context);
            
            // Analyser intention
            const intent = await this.analyzeIntent(cleanMessage);
            
            // Traiter selon intention
            const response = await this.processIntent(intent, message, context);
            
            // Sauvegarder dans historique
            this.addToHistory(message, response);
            
            return {
                success: true,
                response: response.text,
                action: response.action,
                data: response.data || null,
                confidence: intent.confidence,
                suggestions: response.suggestions || []
            };
            
        } catch (error) {
            console.error('❌ AI processing error:', error);
            return {
                success: false,
                response: this.getRandomResponse('error_response'),
                error: error.message
            };
        }
    }
    
    /**
     * Analyser intention du message
     */
    async analyzeIntent(message) {
        let bestMatch = { intent: 'unknown', confidence: 0, entities: [] };
        
        // Scanner chaque pattern d'intention
        for (const [intentName, intentConfig] of Object.entries(this.intentPatterns)) {
            let confidence = 0;
            const foundEntities = [];
            
            // Vérifier patterns principaux
            for (const pattern of intentConfig.patterns) {
                if (message.includes(pattern)) {
                    confidence += 0.3;
                }
            }
            
            // Vérifier entités
            for (const entity of intentConfig.entities) {
                if (message.includes(entity)) {
                    confidence += 0.2;
                    foundEntities.push(entity);
                }
            }
            
            // Bonus contexte
            if (this.conversationContext.currentFiche && intentName === 'modify_design') {
                confidence += 0.1;
            }
            
            // Mettre à jour si meilleur match
            if (confidence > bestMatch.confidence) {
                bestMatch = {
                    intent: intentName,
                    confidence: Math.min(confidence, 1),
                    entities: foundEntities
                };
            }
        }
        
        return bestMatch;
    }
    
    /**
     * Traiter intention reconnue
     */
    async processIntent(intent, originalMessage, context) {
        switch (intent.intent) {
            case 'create_fiche':
                return await this.handleCreateFiche(intent, originalMessage);
                
            case 'modify_design':
                return await this.handleModifyDesign(intent, originalMessage);
                
            case 'add_element':
                return await this.handleAddElement(intent, originalMessage);
                
            case 'modify_content':
                return await this.handleModifyContent(intent, originalMessage);
                
            case 'format_request':
                return await this.handleFormatRequest(intent, originalMessage);
                
            case 'export_request':
                return await this.handleExportRequest(intent, originalMessage);
                
            case 'help_request':
                return this.handleHelpRequest();
                
            default:
                return await this.handleUnknownIntent(originalMessage);
        }
    }
    
    /**
     * Créer nouvelle fiche
     */
    async handleCreateFiche(intent, message) {
        // Déterminer type de fiche
        let ficheType = 'vendeur'; // défaut
        if (intent.entities.includes('acheteur')) ficheType = 'acheteur';
        else if (intent.entities.includes('évaluation')) ficheType = 'evaluation';
        else if (intent.entities.includes('contrat')) ficheType = 'contrat';
        
        // Créer fiche
        const result = await this.ficheService.createFicheFromTemplate(ficheType, {
            aiGenerated: true,
            requestMessage: message
        });
        
        if (result.success) {
            this.conversationContext.currentFiche = result.ficheId;
            
            return {
                text: this.getRandomResponse('fiche_created').replace('{type}', ficheType),
                action: 'fiche_created',
                data: {
                    ficheId: result.ficheId,
                    type: ficheType,
                    previewUrl: result.previewUrl
                },
                suggestions: [
                    "Changer les couleurs",
                    "Ajouter un logo", 
                    "Modifier le titre",
                    "Voir l'aperçu"
                ]
            };
        } else {
            return {
                text: "Désolé, impossible de créer la fiche. " + result.error,
                action: 'error'
            };
        }
    }
    
    /**
     * Modifier design
     */
    async handleModifyDesign(intent, message) {
        if (!this.conversationContext.currentFiche) {
            return {
                text: "Il faut d'abord créer ou sélectionner une fiche à modifier !",
                action: 'need_fiche',
                suggestions: ["Créer une fiche vendeur", "Créer une fiche acheteur"]
            };
        }
        
        // Extraire modification design
        const modifications = this.extractDesignModifications(intent, message);
        
        // Appliquer avec l'API fiche
        const result = await this.ficheService.modifyFicheWithAI(
            this.conversationContext.currentFiche, 
            message
        );
        
        if (result.success) {
            return {
                text: this.getRandomResponse('design_changed'),
                action: 'design_modified',
                data: {
                    modifications: result.modifications,
                    newVersion: result.newVersion
                },
                suggestions: [
                    "Ajouter d'autres éléments",
                    "Changer autre chose",
                    "Exporter en PDF"
                ]
            };
        } else {
            return {
                text: "Problème lors de la modification : " + result.error,
                action: 'error'
            };
        }
    }
    
    /**
     * Ajouter élément
     */
    async handleAddElement(intent, message) {
        if (!this.conversationContext.currentFiche) {
            return {
                text: "Créez d'abord une fiche pour y ajouter des éléments !",
                action: 'need_fiche'
            };
        }
        
        // Déterminer élément à ajouter
        let elementType = 'text'; // défaut
        if (intent.entities.includes('logo')) elementType = 'image';
        else if (intent.entities.includes('signature')) elementType = 'signature';
        else if (intent.entities.includes('champ')) elementType = 'form_field';
        else if (intent.entities.includes('tableau')) elementType = 'table';
        
        // Appliquer ajout
        const result = await this.ficheService.modifyFicheWithAI(
            this.conversationContext.currentFiche,
            `Ajouter ${elementType}: ${message}`
        );
        
        if (result.success) {
            return {
                text: this.getRandomResponse('element_added').replace('{element}', elementType),
                action: 'element_added',
                data: {
                    elementType: elementType,
                    ficheId: this.conversationContext.currentFiche
                },
                suggestions: [
                    "Ajouter autre chose",
                    "Changer les couleurs", 
                    "Finaliser la fiche"
                ]
            };
        } else {
            return {
                text: "Erreur lors de l'ajout : " + result.error,
                action: 'error'
            };
        }
    }
    
    /**
     * Demande d'aide
     */
    handleHelpRequest() {
        return {
            text: this.getRandomResponse('help_response'),
            action: 'help_provided',
            suggestions: [
                "Créer une fiche vendeur",
                "Créer une fiche acheteur", 
                "Changer les couleurs",
                "Ajouter un logo"
            ]
        };
    }
    
    /**
     * Intention non reconnue - essayer de deviner
     */
    async handleUnknownIntent(message) {
        // Tentatives intelligentes
        const smartGuesses = [
            {
                condition: message.includes('fiche') && (message.includes('nouveau') || message.includes('créer')),
                response: "Voulez-vous créer une nouvelle fiche ? Dites-moi : vendeur, acheteur ou évaluation ?",
                suggestions: ["Fiche vendeur", "Fiche acheteur", "Fiche évaluation"]
            },
            {
                condition: message.includes('couleur') || message.includes('design'),
                response: "Pour changer les couleurs, dites-moi quelque chose comme 'change pour du bleu' ou 'rend plus professionnel'",
                suggestions: ["Couleurs bleues", "Style professionnel", "Plus moderne"]
            },
            {
                condition: message.includes('logo') || message.includes('image'),
                response: "Pour ajouter un logo, dites 'ajoute un logo en haut' ou 'met une image'",
                suggestions: ["Ajouter logo", "Insérer image", "Logo en haut"]
            }
        ];
        
        for (const guess of smartGuesses) {
            if (guess.condition) {
                return {
                    text: guess.response,
                    action: 'clarification',
                    suggestions: guess.suggestions
                };
            }
        }
        
        // Réponse générique
        return {
            text: this.getRandomResponse('error_response'),
            action: 'unknown',
            suggestions: [
                "Créer une fiche",
                "Modifier design",
                "Ajouter élément",
                "Aide"
            ]
        };
    }
    
    /**
     * Extraire modifications design du message
     */
    extractDesignModifications(intent, message) {
        const modifications = [];
        
        // Couleurs
        const colorMap = {
            'rouge': '#c53030', 'bleu': '#2b6cb0', 'vert': '#38a169',
            'jaune': '#d69e2e', 'orange': '#ed8936', 'violet': '#805ad5'
        };
        
        for (const [colorName, colorValue] of Object.entries(colorMap)) {
            if (message.includes(colorName)) {
                modifications.push({
                    type: 'color',
                    color: colorValue,
                    name: colorName
                });
            }
        }
        
        // Styles
        if (message.includes('professionnel') || message.includes('sérieux')) {
            modifications.push({ type: 'style', theme: 'professional' });
        }
        if (message.includes('moderne') || message.includes('contemporain')) {
            modifications.push({ type: 'style', theme: 'modern' });
        }
        if (message.includes('élégant') || message.includes('luxe')) {
            modifications.push({ type: 'style', theme: 'luxury' });
        }
        
        return modifications;
    }
    
    /**
     * Utilitaires
     */
    getRandomResponse(category) {
        const responses = this.responseTemplates[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    updateConversationContext(message, context) {
        this.conversationContext.lastMessage = message;
        this.conversationContext.timestamp = Date.now();
        
        if (context.ficheId) {
            this.conversationContext.currentFiche = context.ficheId;
        }
    }
    
    addToHistory(message, response) {
        this.conversationContext.sessionHistory.push({
            timestamp: Date.now(),
            userMessage: message,
            aiResponse: response.text,
            action: response.action
        });
        
        // Garder seulement les 20 derniers échanges
        if (this.conversationContext.sessionHistory.length > 20) {
            this.conversationContext.sessionHistory.shift();
        }
    }
    
    /**
     * Interface rapide pour suggestions
     */
    getQuickSuggestions() {
        return [
            { text: "Créer fiche vendeur", action: "Crée moi une fiche vendeur" },
            { text: "Créer fiche acheteur", action: "Nouvelle fiche acheteur" },
            { text: "Changer couleurs", action: "Change les couleurs pour du bleu" },
            { text: "Ajouter logo", action: "Ajoute un logo en haut à droite" },
            { text: "Style professionnel", action: "Rend la fiche plus professionnelle" },
            { text: "Aide", action: "Comment ça marche ?" }
        ];
    }
    
    /**
     * Reset contexte pour nouvelle session
     */
    resetConversation() {
        this.conversationContext = {
            currentFiche: null,
            lastAction: null,
            userPreferences: {},
            sessionHistory: []
        };
    }
    
    /**
     * Status du service
     */
    getStatus() {
        return {
            service: 'FICHE ASSISTANT AI',
            initialized: this.initialized,
            currentFiche: this.conversationContext.currentFiche,
            historyLength: this.conversationContext.sessionHistory.length,
            availableIntents: Object.keys(this.intentPatterns).length,
            capabilities: [
                'natural-language-processing',
                'intent-recognition',
                'fiche-generation',
                'design-modification',
                'conversational-interface',
                'smart-suggestions'
            ]
        };
    }
}

module.exports = FicheAssistantAI;