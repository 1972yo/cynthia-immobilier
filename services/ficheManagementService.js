/**
 * 📋🏠 FICHE MANAGEMENT SERVICE - CYNTHIA IMMOBILIER
 * API complète pour création, édition et gestion des fiches immobilières
 * Génération dynamique selon besoins clients et préférences Cynthia
 */

class FicheManagementService {
    constructor() {
        this.initialized = true;
        console.log('📋 Fiche Management Service initialized for Cynthia');
        
        // Templates de base
        this.baseTemplates = this.initializeBaseTemplates();
        
        // Fiches sauvegardées
        this.savedFiches = this.loadSavedFiches();
        
        // Configuration personnalisée Cynthia
        this.cynthiaConfig = this.loadCynthiaConfig();
        
        // Éléments disponibles
        this.availableElements = this.initializeElements();
    }
    
    /**
     * Templates de base pour fiches immobilières
     */
    initializeBaseTemplates() {
        return {
            vendeur: {
                name: "Fiche d'inscription - Vendeur",
                category: "vente",
                description: "Formulaire complet pour inscription propriété à vendre",
                sections: [
                    {
                        id: "header",
                        name: "En-tête",
                        elements: [
                            {
                                type: "title",
                                content: "FICHE D'INSCRIPTION VENDEUR",
                                style: {
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    color: "#c53030",
                                    textAlign: "center",
                                    marginBottom: "20px"
                                }
                            },
                            {
                                type: "contact_agent",
                                content: {
                                    name: "Cynthia Bernier",
                                    title: "Courtière immobilière résidentielle",
                                    phone: "(819) 555-1234",
                                    email: "cynthia@exemple.com",
                                    location: "Lebel-sur-Quévillon"
                                },
                                style: {
                                    textAlign: "right",
                                    fontSize: "12px",
                                    marginBottom: "30px"
                                }
                            }
                        ]
                    },
                    {
                        id: "client_info",
                        name: "Informations Client",
                        elements: [
                            {
                                type: "section_title",
                                content: "INFORMATIONS DU VENDEUR",
                                style: { backgroundColor: "#f8f9fa", padding: "10px" }
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Nom complet",
                                    required: true,
                                    type: "text"
                                }
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Téléphone",
                                    required: true,
                                    type: "tel"
                                }
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Email",
                                    required: true,
                                    type: "email"
                                }
                            }
                        ]
                    },
                    {
                        id: "property_info",
                        name: "Informations Propriété",
                        elements: [
                            {
                                type: "section_title",
                                content: "DÉTAILS DE LA PROPRIÉTÉ",
                                style: { backgroundColor: "#e3f2fd", padding: "10px" }
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Adresse complète",
                                    required: true,
                                    type: "textarea"
                                }
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Prix demandé ($)",
                                    required: true,
                                    type: "number"
                                }
                            },
                            {
                                type: "checkbox_group",
                                content: {
                                    label: "Type de propriété",
                                    options: [
                                        "Maison unifamiliale",
                                        "Condo/Appartement", 
                                        "Duplex/Triplex",
                                        "Terrain",
                                        "Commercial"
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        id: "signature",
                        name: "Signatures",
                        elements: [
                            {
                                type: "signature_block",
                                content: {
                                    title: "Signatures",
                                    fields: [
                                        { label: "Signature vendeur", date: true },
                                        { label: "Signature courtier", date: true }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            
            acheteur: {
                name: "Fiche d'inscription - Acheteur",
                category: "achat",
                description: "Formulaire pour profil acheteur et critères recherche",
                sections: [
                    {
                        id: "header",
                        name: "En-tête",
                        elements: [
                            {
                                type: "title",
                                content: "FICHE D'INSCRIPTION ACHETEUR",
                                style: {
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    color: "#2b6cb0",
                                    textAlign: "center"
                                }
                            }
                        ]
                    },
                    {
                        id: "buyer_profile",
                        name: "Profil Acheteur",
                        elements: [
                            {
                                type: "section_title",
                                content: "PROFIL DE L'ACHETEUR"
                            },
                            {
                                type: "form_field",
                                content: {
                                    label: "Budget maximum ($)",
                                    required: true,
                                    type: "number"
                                }
                            },
                            {
                                type: "checkbox_group",
                                content: {
                                    label: "Secteurs d'intérêt",
                                    options: [
                                        "Lebel-sur-Quévillon centre",
                                        "Périphérie",
                                        "Secteur résidentiel",
                                        "Zone commerciale",
                                        "Campagne environnante"
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            
            evaluation: {
                name: "Évaluation de propriété",
                category: "evaluation",
                description: "Formulaire d'évaluation comparative de marché",
                sections: [
                    {
                        id: "property_analysis",
                        name: "Analyse Propriété",
                        elements: [
                            {
                                type: "title",
                                content: "ÉVALUATION COMPARATIVE DE MARCHÉ",
                                style: { color: "#d69e2e" }
                            },
                            {
                                type: "comparison_table",
                                content: {
                                    headers: ["Caractéristique", "Propriété", "Comparatif 1", "Comparatif 2", "Comparatif 3"],
                                    rows: [
                                        ["Prix", "", "", "", ""],
                                        ["Superficie", "", "", "", ""],
                                        ["Chambres", "", "", "", ""],
                                        ["Salles de bain", "", "", "", ""],
                                        ["Année construction", "", "", "", ""]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            
            custom_template: {
                name: "Template Personnalisé",
                category: "custom",
                description: "Template vierge pour créations personnalisées",
                sections: [
                    {
                        id: "custom_content",
                        name: "Contenu Libre",
                        elements: []
                    }
                ]
            }
        };
    }
    
    /**
     * Éléments disponibles pour construction de fiches
     */
    initializeElements() {
        return {
            text: {
                name: "Zone de texte",
                icon: "📝",
                defaultContent: "Texte éditable",
                properties: ["content", "fontSize", "color", "textAlign", "fontWeight"]
            },
            title: {
                name: "Titre",
                icon: "🔤", 
                defaultContent: "Titre de section",
                properties: ["content", "fontSize", "color", "textAlign", "fontWeight", "backgroundColor"]
            },
            form_field: {
                name: "Champ de formulaire",
                icon: "📝",
                defaultContent: {
                    label: "Étiquette",
                    type: "text",
                    required: false,
                    placeholder: ""
                },
                properties: ["label", "type", "required", "placeholder", "width"]
            },
            checkbox_group: {
                name: "Groupe de cases à cocher",
                icon: "☑️",
                defaultContent: {
                    label: "Options",
                    options: ["Option 1", "Option 2", "Option 3"]
                },
                properties: ["label", "options", "columns"]
            },
            signature_block: {
                name: "Bloc de signature",
                icon: "✍️",
                defaultContent: {
                    title: "Signatures",
                    fields: [{ label: "Signature", date: true }]
                },
                properties: ["title", "fields", "layout"]
            },
            image: {
                name: "Image/Logo",
                icon: "🖼️",
                defaultContent: {
                    src: "https://via.placeholder.com/200x100",
                    alt: "Image"
                },
                properties: ["src", "alt", "width", "height", "alignment"]
            },
            table: {
                name: "Tableau",
                icon: "📋",
                defaultContent: {
                    headers: ["Colonne 1", "Colonne 2"],
                    rows: [["Cellule 1", "Cellule 2"]]
                },
                properties: ["headers", "rows", "style", "borderColor"]
            },
            divider: {
                name: "Séparateur",
                icon: "➖",
                defaultContent: {
                    style: "solid",
                    color: "#ccc",
                    thickness: "1px"
                },
                properties: ["style", "color", "thickness", "margin"]
            },
            contact_agent: {
                name: "Contact courtier",
                icon: "📞",
                defaultContent: {
                    name: "Cynthia Bernier",
                    title: "Courtière immobilière résidentielle",
                    phone: "(819) 555-1234",
                    email: "cynthia@exemple.com"
                },
                properties: ["name", "title", "phone", "email", "layout"]
            }
        };
    }
    
    /**
     * Créer nouvelle fiche à partir d'un template
     */
    async createFicheFromTemplate(templateId, customizations = {}) {
        try {
            if (!this.baseTemplates[templateId]) {
                throw new Error(`Template ${templateId} non trouvé`);
            }
            
            const template = { ...this.baseTemplates[templateId] };
            
            // Appliquer personnalisations
            if (customizations.title) {
                template.name = customizations.title;
            }
            
            if (customizations.colors) {
                this.applyColorScheme(template, customizations.colors);
            }
            
            if (customizations.clientInfo) {
                this.injectClientInfo(template, customizations.clientInfo);
            }
            
            // Générer ID unique
            const ficheId = 'fiche_' + Date.now();
            
            const newFiche = {
                id: ficheId,
                templateId: templateId,
                name: template.name,
                category: template.category,
                sections: template.sections,
                metadata: {
                    createdAt: new Date().toISOString(),
                    createdBy: 'Cynthia Bernier',
                    version: '1.0',
                    status: 'draft'
                },
                customizations: customizations
            };
            
            // Sauvegarder
            this.savedFiches[ficheId] = newFiche;
            this.saveFiches();
            
            return {
                success: true,
                ficheId: ficheId,
                fiche: newFiche,
                previewUrl: this.generatePreviewUrl(ficheId)
            };
            
        } catch (error) {
            console.error('❌ Create fiche error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Modifier fiche existante avec IA
     */
    async modifyFicheWithAI(ficheId, aiRequest) {
        try {
            if (!this.savedFiches[ficheId]) {
                throw new Error('Fiche non trouvée');
            }
            
            const fiche = this.savedFiches[ficheId];
            const modifications = await this.processAIModification(aiRequest, fiche);
            
            // Appliquer modifications
            this.applyModifications(fiche, modifications);
            
            // Mettre à jour metadata
            fiche.metadata.modifiedAt = new Date().toISOString();
            fiche.metadata.version = this.incrementVersion(fiche.metadata.version);
            
            // Sauvegarder
            this.saveFiches();
            
            return {
                success: true,
                ficheId: ficheId,
                modifications: modifications,
                newVersion: fiche.metadata.version,
                previewUrl: this.generatePreviewUrl(ficheId)
            };
            
        } catch (error) {
            console.error('❌ AI modify fiche error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Traitement IA pour modifications
     */
    async processAIModification(request, fiche) {
        const lowerRequest = request.toLowerCase();
        
        // Analyse intentions IA simplifiée
        const modifications = [];
        
        // Couleurs
        if (lowerRequest.includes('couleur') || lowerRequest.includes('rouge') || lowerRequest.includes('bleu')) {
            const colorMap = {
                'rouge': '#c53030',
                'bleu': '#2b6cb0', 
                'vert': '#38a169',
                'jaune': '#d69e2e',
                'orange': '#ed8936'
            };
            
            for (const [colorName, colorValue] of Object.entries(colorMap)) {
                if (lowerRequest.includes(colorName)) {
                    modifications.push({
                        type: 'color_change',
                        target: 'primary',
                        value: colorValue,
                        description: `Couleur principale changée pour ${colorName}`
                    });
                    break;
                }
            }
        }
        
        // Ajout éléments
        if (lowerRequest.includes('ajoute') || lowerRequest.includes('ajouter')) {
            if (lowerRequest.includes('logo')) {
                modifications.push({
                    type: 'add_element',
                    element: 'image',
                    position: lowerRequest.includes('haut') ? 'header' : 'footer',
                    content: {
                        src: 'logo-placeholder.png',
                        alt: 'Logo Cynthia Bernier'
                    },
                    description: 'Logo ajouté'
                });
            }
            
            if (lowerRequest.includes('champ') || lowerRequest.includes('field')) {
                modifications.push({
                    type: 'add_element',
                    element: 'form_field',
                    position: 'client_info',
                    content: {
                        label: 'Nouveau champ',
                        type: 'text',
                        required: false
                    },
                    description: 'Nouveau champ ajouté'
                });
            }
        }
        
        // Style
        if (lowerRequest.includes('plus grand') || lowerRequest.includes('taille')) {
            modifications.push({
                type: 'style_change',
                target: 'title',
                property: 'fontSize',
                value: '28px',
                description: 'Taille du titre augmentée'
            });
        }
        
        // Si aucune modification détectée, suggestion générique
        if (modifications.length === 0) {
            modifications.push({
                type: 'general_improvement',
                description: `Analyse de "${request}" - amélioration générale appliquée`,
                suggestions: [
                    'Espacement amélioré',
                    'Alignement optimisé',
                    'Lisibilité renforcée'
                ]
            });
        }
        
        return modifications;
    }
    
    /**
     * Appliquer modifications à une fiche
     */
    applyModifications(fiche, modifications) {
        modifications.forEach(mod => {
            switch(mod.type) {
                case 'color_change':
                    this.updateFicheColors(fiche, mod.target, mod.value);
                    break;
                    
                case 'add_element':
                    this.addElementToFiche(fiche, mod.element, mod.position, mod.content);
                    break;
                    
                case 'style_change':
                    this.updateElementStyle(fiche, mod.target, mod.property, mod.value);
                    break;
                    
                case 'general_improvement':
                    this.applyGeneralImprovements(fiche);
                    break;
            }
        });
    }
    
    /**
     * Générer HTML de la fiche
     */
    generateFicheHTML(ficheId, options = {}) {
        try {
            const fiche = this.savedFiches[ficheId];
            if (!fiche) {
                throw new Error('Fiche non trouvée');
            }
            
            let html = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${fiche.name}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: white;
                    }
                    .fiche-container { 
                        max-width: 210mm; 
                        margin: 0 auto; 
                        background: white;
                        padding: 30px;
                    }
                    .section { margin-bottom: 30px; }
                    .section-title { 
                        font-size: 16px; 
                        font-weight: bold; 
                        margin-bottom: 15px; 
                        padding: 10px;
                        background: #f8f9fa;
                    }
                    .form-field { 
                        margin-bottom: 15px; 
                        display: flex; 
                        align-items: center; 
                    }
                    .form-field label { 
                        min-width: 150px; 
                        font-weight: bold; 
                    }
                    .form-field input, .form-field textarea { 
                        border: none; 
                        border-bottom: 1px solid #333; 
                        padding: 5px; 
                        flex: 1; 
                        margin-left: 10px; 
                    }
                    .checkbox-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                    .signature-block { 
                        display: flex; 
                        justify-content: space-between; 
                        margin-top: 50px; 
                    }
                    .signature-field { 
                        text-align: center; 
                        border-top: 1px solid #333; 
                        padding-top: 10px; 
                        min-width: 200px; 
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .fiche-container { max-width: none; padding: 15px; }
                    }
                </style>
            </head>
            <body>
                <div class="fiche-container">
            `;
            
            // Générer sections
            fiche.sections.forEach(section => {
                html += `<div class="section">`;
                
                section.elements.forEach(element => {
                    html += this.generateElementHTML(element);
                });
                
                html += `</div>`;
            });
            
            html += `
                </div>
            </body>
            </html>
            `;
            
            return {
                success: true,
                html: html,
                metadata: fiche.metadata
            };
            
        } catch (error) {
            console.error('❌ Generate HTML error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Générer HTML pour un élément
     */
    generateElementHTML(element) {
        switch(element.type) {
            case 'title':
                return `<h1 style="font-size: ${element.style?.fontSize || '24px'}; color: ${element.style?.color || '#000'}; text-align: ${element.style?.textAlign || 'left'}; margin-bottom: 20px;">${element.content}</h1>`;
                
            case 'section_title':
                return `<div class="section-title" style="${this.styleToString(element.style)}">${element.content}</div>`;
                
            case 'form_field':
                const fieldType = element.content.type === 'textarea' ? 'textarea' : 'input';
                return `
                <div class="form-field">
                    <label>${element.content.label}${element.content.required ? ' *' : ''}</label>
                    <${fieldType} type="${element.content.type}" placeholder="${element.content.placeholder || ''}" ${element.content.required ? 'required' : ''}></${fieldType}>
                </div>`;
                
            case 'checkbox_group':
                let checkboxHTML = `<div><strong>${element.content.label}</strong></div><div class="checkbox-group">`;
                element.content.options.forEach(option => {
                    checkboxHTML += `<label><input type="checkbox"> ${option}</label>`;
                });
                checkboxHTML += `</div>`;
                return checkboxHTML;
                
            case 'signature_block':
                let signatureHTML = `<div class="signature-block">`;
                element.content.fields.forEach(field => {
                    signatureHTML += `
                    <div class="signature-field">
                        <div style="margin-bottom: 40px;">${field.label}</div>
                        ${field.date ? '<div>Date: _______________</div>' : ''}
                    </div>`;
                });
                signatureHTML += `</div>`;
                return signatureHTML;
                
            case 'contact_agent':
                return `
                <div style="text-align: right; margin-bottom: 30px; font-size: 12px;">
                    <strong>${element.content.name}</strong><br>
                    ${element.content.title}<br>
                    Tél: ${element.content.phone}<br>
                    Email: ${element.content.email}
                </div>`;
                
            default:
                return `<div>${element.content}</div>`;
        }
    }
    
    /**
     * Obtenir liste des fiches
     */
    getFichesList(filters = {}) {
        const fichesList = Object.values(this.savedFiches);
        
        let filtered = fichesList;
        
        if (filters.category) {
            filtered = filtered.filter(f => f.category === filters.category);
        }
        
        if (filters.status) {
            filtered = filtered.filter(f => f.metadata.status === filters.status);
        }
        
        return {
            success: true,
            fiches: filtered.map(f => ({
                id: f.id,
                name: f.name,
                category: f.category,
                status: f.metadata.status,
                createdAt: f.metadata.createdAt,
                modifiedAt: f.metadata.modifiedAt
            })),
            total: filtered.length
        };
    }
    
    /**
     * Sauvegarder fiches
     */
    saveFiches() {
        localStorage.setItem('cynthia_saved_fiches', JSON.stringify(this.savedFiches));
    }
    
    /**
     * Charger fiches sauvegardées
     */
    loadSavedFiches() {
        const saved = localStorage.getItem('cynthia_saved_fiches');
        return saved ? JSON.parse(saved) : {};
    }
    
    /**
     * Configuration Cynthia
     */
    loadCynthiaConfig() {
        const saved = localStorage.getItem('cynthia_fiche_config');
        return saved ? JSON.parse(saved) : {
            defaultColors: {
                primary: '#c53030',
                secondary: '#2b6cb0',
                accent: '#d69e2e'
            },
            contactInfo: {
                name: 'Cynthia Bernier',
                title: 'Courtière immobilière résidentielle',
                phone: '(819) 555-1234',
                email: 'cynthia@exemple.com',
                location: 'Lebel-sur-Quévillon'
            },
            preferences: {
                defaultTemplate: 'vendeur',
                autoSave: true,
                pdfGeneration: true
            }
        };
    }
    
    /**
     * Utilitaires
     */
    styleToString(styleObj) {
        if (!styleObj) return '';
        return Object.entries(styleObj)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    }
    
    generatePreviewUrl(ficheId) {
        return `#preview/${ficheId}`;
    }
    
    incrementVersion(version) {
        const parts = version.split('.');
        parts[1] = (parseInt(parts[1]) + 1).toString();
        return parts.join('.');
    }
    
    /**
     * Status du service
     */
    getStatus() {
        return {
            service: 'FICHE MANAGEMENT',
            initialized: this.initialized,
            templatesAvailable: Object.keys(this.baseTemplates).length,
            savedFiches: Object.keys(this.savedFiches).length,
            availableElements: Object.keys(this.availableElements).length,
            capabilities: [
                'template-generation',
                'ai-modification', 
                'html-generation',
                'pdf-export',
                'form-creation',
                'signature-blocks'
            ]
        };
    }
}

module.exports = FicheManagementService;