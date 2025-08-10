/**
 * 🤖📧📋 UNIFIED ASSISTANT API - CYNTHIA IMMOBILIER
 * Gestion complète emails + fiches en un seul service
 * Intelligence artificielle pour traitement automatique complet
 */

const FicheManagementService = require('./ficheManagementService');
const FicheAssistantAI = require('./ficheAssistantAI');

class UnifiedAssistantAPI {
    constructor() {
        this.initialized = false;
        this.initializeServices();
        console.log('🤖 Unified Assistant API initializing...');
        
        // Services intégrés
        this.ficheService = null;
        this.aiService = null;
        
        // Email processing
        this.emailQueue = [];
        this.processingQueue = false;
        
        // Auto-classification IA
        this.emailClassifier = this.initializeEmailClassifier();
        
        // Templates extraction
        this.documentParser = this.initializeDocumentParser();
        
        // Montage automatique
        this.automaticAssembly = this.initializeAssemblyEngine();
        
        this.initialized = true;
        console.log('✅ Unified Assistant API ready for Cynthia');
    }
    
    /**
     * Initialiser services
     */
    async initializeServices() {
        this.ficheService = new FicheManagementService();
        this.aiService = new FicheAssistantAI(this.ficheService);
    }
    
    /**
     * Classificateur d'emails IA
     */
    initializeEmailClassifier() {
        return {
            patterns: {
                vendeur_inscription: {
                    keywords: ['vendre', 'vente', 'propriété à vendre', 'inscrire', 'mise en marché'],
                    attachments: ['photos', 'images', 'jpg', 'png'],
                    required_info: ['adresse', 'prix', 'contact'],
                    confidence_threshold: 0.8
                },
                
                acheteur_profil: {
                    keywords: ['acheter', 'achat', 'recherche', 'budget', 'critères'],
                    attachments: ['document', 'preapprobation', 'pdf'],
                    required_info: ['nom', 'budget', 'critères'],
                    confidence_threshold: 0.75
                },
                
                evaluation_demande: {
                    keywords: ['évaluation', 'estimation', 'valeur', 'prix marché'],
                    attachments: ['photos propriété'],
                    required_info: ['adresse'],
                    confidence_threshold: 0.85
                },
                
                document_complementaire: {
                    keywords: ['complémentaire', 'additionnel', 'mise à jour'],
                    attachments: ['any'],
                    required_info: ['référence fiche'],
                    confidence_threshold: 0.7
                }
            }
        };
    }
    
    /**
     * Parser de documents
     */
    initializeDocumentParser() {
        return {
            image_processing: {
                supported_formats: ['jpg', 'jpeg', 'png', 'webp'],
                auto_resize: { max_width: 800, max_height: 600 },
                quality_optimization: 0.85,
                watermark_cynthia: true
            },
            
            pdf_processing: {
                extract_text: true,
                extract_images: true,
                parse_forms: true
            },
            
            text_extraction: {
                contact_info: /(\d{3}[-.]?\d{3}[-.]?\d{4})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                address: /\d+\s+[A-Za-z\s,.-]+(?:rue|avenue|boulevard|chemin|place)/gi,
                price: /\$?\s*[\d,]+\.?\d*\s*\$?/g
            }
        };
    }
    
    /**
     * Moteur assemblage automatique
     */
    initializeAssemblyEngine() {
        return {
            photo_layout: {
                vendeur: {
                    hero_photo: { position: 'top', size: '100%x300px' },
                    gallery: { position: 'middle', grid: '2x2', size: '200x150px' },
                    max_photos: 8
                },
                acheteur: {
                    profile_photo: { position: 'header-right', size: '150x150px' },
                    preference_images: { position: 'criteria', grid: '3x1' },
                    max_photos: 4
                }
            },
            
            text_optimization: {
                auto_format_address: true,
                format_price: 'canadian_currency',
                capitalize_names: true,
                validate_phone: 'canadian_format'
            },
            
            branding: {
                apply_cynthia_colors: true,
                add_logo: 'header-right',
                contact_footer: true,
                professional_styling: true
            }
        };
    }
    
    /**
     * INTERFACE PRINCIPALE - Traiter email entrant
     */
    async processIncomingEmail(emailData) {
        try {
            console.log('📧 Processing incoming email...');
            
            // Ajouter à la queue
            const emailId = 'email_' + Date.now();
            const processedEmail = {
                id: emailId,
                ...emailData,
                received_at: new Date().toISOString(),
                status: 'processing'
            };
            
            this.emailQueue.push(processedEmail);
            
            // Traitement immédiat si possible
            if (!this.processingQueue) {
                this.processEmailQueue();
            }
            
            return {
                success: true,
                emailId: emailId,
                message: "Email reçu et en cours de traitement",
                estimated_time: "2-3 minutes"
            };
            
        } catch (error) {
            console.error('❌ Email processing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Traiter queue emails
     */
    async processEmailQueue() {
        if (this.processingQueue || this.emailQueue.length === 0) return;
        
        this.processingQueue = true;
        console.log('🔄 Processing email queue...');
        
        while (this.emailQueue.length > 0) {
            const email = this.emailQueue.shift();
            await this.processSingleEmail(email);
        }
        
        this.processingQueue = false;
        console.log('✅ Email queue processed');
    }
    
    /**
     * Traiter un email individuel
     */
    async processSingleEmail(email) {
        try {
            // 1. Classifier le type d'email
            const classification = await this.classifyEmail(email);
            
            // 2. Extraire données et documents
            const extractedData = await this.extractEmailData(email);
            
            // 3. Traiter photos/documents
            const processedAssets = await this.processAttachments(email.attachments || []);
            
            // 4. Créer/modifier fiche selon classification
            const ficheResult = await this.createOrUpdateFiche(
                classification, 
                extractedData, 
                processedAssets
            );
            
            // 5. Montage final automatique
            const finalFiche = await this.assembleFinaleAssembly(
                ficheResult.ficheId,
                processedAssets,
                extractedData
            );
            
            // 6. Notifier Cynthia
            await this.notifyCynthia({
                emailId: email.id,
                classification: classification,
                ficheId: finalFiche.ficheId,
                status: 'completed',
                summary: this.generateProcessingSummary(classification, extractedData, processedAssets)
            });
            
            return {
                success: true,
                processed: true
            };
            
        } catch (error) {
            console.error('❌ Single email processing error:', error);
            
            // Notifier erreur
            await this.notifyCynthia({
                emailId: email.id,
                status: 'error',
                error: error.message
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Classifier email avec IA
     */
    async classifyEmail(email) {
        const subject = (email.subject || '').toLowerCase();
        const body = (email.body || '').toLowerCase();
        const attachmentCount = (email.attachments || []).length;
        
        let bestMatch = { type: 'unknown', confidence: 0 };
        
        // Analyser chaque pattern
        for (const [type, config] of Object.entries(this.emailClassifier.patterns)) {
            let confidence = 0;
            
            // Vérifier keywords
            config.keywords.forEach(keyword => {
                if (subject.includes(keyword) || body.includes(keyword)) {
                    confidence += 0.3;
                }
            });
            
            // Vérifier attachments
            if (attachmentCount > 0 && config.attachments.length > 0) {
                confidence += 0.2;
            }
            
            // Vérifier informations requises
            config.required_info.forEach(info => {
                if (this.extractInfoFromText(body, info)) {
                    confidence += 0.15;
                }
            });
            
            // Mettre à jour meilleur match
            if (confidence > bestMatch.confidence && confidence >= config.confidence_threshold) {
                bestMatch = {
                    type: type,
                    confidence: confidence,
                    config: config
                };
            }
        }
        
        return bestMatch;
    }
    
    /**
     * Extraire données de l'email
     */
    async extractEmailData(email) {
        const body = email.body || '';
        const subject = email.subject || '';
        
        return {
            contact: {
                email: email.from,
                name: this.extractName(email.from, body),
                phone: this.extractPhone(body)
            },
            property: {
                address: this.extractAddress(body),
                price: this.extractPrice(body),
                description: this.extractDescription(body)
            },
            preferences: this.extractPreferences(body),
            raw_text: body,
            subject: subject
        };
    }
    
    /**
     * Traiter attachments (photos/documents)
     */
    async processAttachments(attachments) {
        const processed = {
            images: [],
            documents: [],
            total_processed: 0,
            errors: []
        };
        
        for (const attachment of attachments) {
            try {
                if (this.isImage(attachment)) {
                    const processedImage = await this.processImage(attachment);
                    processed.images.push(processedImage);
                } else if (this.isDocument(attachment)) {
                    const processedDoc = await this.processDocument(attachment);
                    processed.documents.push(processedDoc);
                }
                processed.total_processed++;
            } catch (error) {
                processed.errors.push({
                    file: attachment.name,
                    error: error.message
                });
            }
        }
        
        return processed;
    }
    
    /**
     * Créer ou mettre à jour fiche selon classification
     */
    async createOrUpdateFiche(classification, data, assets) {
        const ficheType = this.mapClassificationToFicheType(classification.type);
        
        // Préparer customizations
        const customizations = {
            aiGenerated: true,
            emailSource: true,
            clientInfo: data.contact,
            propertyInfo: data.property,
            assets: assets,
            classification: classification
        };
        
        // Créer fiche
        const result = await this.ficheService.createFicheFromTemplate(ficheType, customizations);
        
        if (result.success) {
            // Peupler avec données extraites
            await this.populateFicheWithData(result.ficheId, data, assets);
        }
        
        return result;
    }
    
    /**
     * Assemblage final automatique
     */
    async assembleFinaleAssembly(ficheId, assets, data) {
        try {
            // Appliquer layout photos optimisé
            await this.applyPhotoLayout(ficheId, assets.images);
            
            // Optimiser texte et formatting
            await this.optimizeTextFormatting(ficheId, data);
            
            // Appliquer branding Cynthia
            await this.applyBranding(ficheId);
            
            // Générer PDF final
            const pdfResult = await this.generateFinalPDF(ficheId);
            
            return {
                success: true,
                ficheId: ficheId,
                pdfUrl: pdfResult.url,
                ready: true
            };
            
        } catch (error) {
            console.error('❌ Final assembly error:', error);
            return {
                success: false,
                ficheId: ficheId,
                error: error.message
            };
        }
    }
    
    /**
     * Interface pour Cynthia - obtenir status
     */
    async getProcessingStatus() {
        return {
            queue_length: this.emailQueue.length,
            currently_processing: this.processingQueue,
            recent_activity: this.getRecentActivity(),
            statistics: this.getProcessingStatistics()
        };
    }
    
    /**
     * Interface pour Cynthia - commandes manuelles
     */
    async processManualCommand(command, data) {
        try {
            switch (command) {
                case 'create_fiche':
                    return await this.createManualFiche(data);
                    
                case 'modify_fiche':
                    return await this.modifyExistingFiche(data.ficheId, data.modifications);
                    
                case 'reprocess_email':
                    return await this.reprocessEmail(data.emailId);
                    
                case 'generate_pdf':
                    return await this.generateFinalPDF(data.ficheId);
                    
                case 'ai_chat':
                    return await this.aiService.processMessage(data.message, data.context);
                    
                default:
                    throw new Error('Commande non reconnue');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Utilitaires extraction
     */
    extractName(email, body) {
        // Logique extraction nom depuis email/body
        const emailName = email.split('@')[0].replace(/[._]/g, ' ');
        return this.titleCase(emailName);
    }
    
    extractPhone(text) {
        const phoneMatch = text.match(this.documentParser.text_extraction.contact_info);
        return phoneMatch ? phoneMatch.find(m => m.includes('(') || m.length >= 10) : null;
    }
    
    extractAddress(text) {
        const addressMatch = text.match(this.documentParser.text_extraction.address);
        return addressMatch ? addressMatch[0] : null;
    }
    
    extractPrice(text) {
        const priceMatch = text.match(this.documentParser.text_extraction.price);
        return priceMatch ? priceMatch[0].replace(/[^\d]/g, '') : null;
    }
    
    mapClassificationToFicheType(classificationType) {
        const mapping = {
            'vendeur_inscription': 'vendeur',
            'acheteur_profil': 'acheteur', 
            'evaluation_demande': 'evaluation',
            'document_complementaire': 'vendeur' // défaut
        };
        return mapping[classificationType] || 'vendeur';
    }
    
    /**
     * Notifier Cynthia des résultats
     */
    async notifyCynthia(notification) {
        console.log('📱 Notifying Cynthia:', notification);
        
        // Ici on pourrait intégrer email, SMS, dashboard notification
        // Pour l'instant, log et sauvegarde dans système
        
        const savedNotification = {
            ...notification,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Sauvegarder notification
        const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
        notifications.unshift(savedNotification);
        
        // Garder seulement 50 dernières
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        localStorage.setItem('cynthia_notifications', JSON.stringify(notifications));
        
        return {
            success: true,
            notification_id: savedNotification.id
        };
    }
    
    /**
     * Status du service unifié
     */
    getStatus() {
        return {
            service: 'UNIFIED ASSISTANT API',
            initialized: this.initialized,
            queue_status: {
                emails_pending: this.emailQueue.length,
                currently_processing: this.processingQueue
            },
            capabilities: [
                'email-processing',
                'document-parsing', 
                'photo-optimization',
                'fiche-generation',
                'ai-classification',
                'automatic-assembly',
                'pdf-generation',
                'cynthia-notifications'
            ],
            sub_services: [
                this.ficheService?.getStatus(),
                this.aiService?.getStatus()
            ]
        };
    }
}

module.exports = UnifiedAssistantAPI;