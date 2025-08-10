/**
 * 🎨🏠 VISUAL CUSTOMIZATION SERVICE - CYNTHIA IMMOBILIER
 * API pour personnalisation complète du site immobilier
 * Couleurs, images, design adaptatif pour l'immobilier résidentiel
 */

class VisualCustomizationService {
    constructor() {
        this.initialized = true;
        console.log('🎨 Visual Customization Service initialized for Cynthia');
        
        // Thèmes immobilier prédéfinis
        this.realEstateThemes = this.initializeRealEstateThemes();
        
        // Configuration visuelle actuelle
        this.currentConfig = this.loadCurrentConfiguration();
        
        // Base de données des propriétés
        this.properties = [];
    }
    
    /**
     * Thèmes immobilier professionnels
     */
    initializeRealEstateThemes() {
        return {
            classic_luxury: {
                name: "Luxe Classique",
                description: "Élégance intemporelle pour propriétés haut de gamme",
                colors: {
                    primary: "#1a365d",      // Bleu marine profond
                    secondary: "#d4af37",    // Or élégant
                    accent: "#8b4513",       // Brun chaud
                    background: "#f8f9fa",   // Blanc cassé
                    text: "#2d3748",         // Gris foncé
                    highlight: "#e53e3e"     // Rouge accent
                },
                fonts: {
                    heading: "Playfair Display, serif",
                    body: "Lato, sans-serif"
                },
                layout: "grid_classic"
            },
            
            modern_clean: {
                name: "Moderne Épuré",
                description: "Design contemporain pour jeunes propriétaires",
                colors: {
                    primary: "#2b6cb0",      // Bleu moderne
                    secondary: "#38b2ac",    // Turquoise
                    accent: "#ed8936",       // Orange chaleureux
                    background: "#ffffff",   // Blanc pur
                    text: "#1a202c",         // Noir doux
                    highlight: "#e53e3e"     // Rouge accent
                },
                fonts: {
                    heading: "Montserrat, sans-serif",
                    body: "Open Sans, sans-serif"
                },
                layout: "grid_modern"
            },
            
            rustic_warm: {
                name: "Rustique Chaleureux",
                description: "Ambiance chaleureuse pour propriétés rurales",
                colors: {
                    primary: "#744210",      // Brun terre
                    secondary: "#c53030",    // Rouge brique
                    accent: "#d69e2e",       // Jaune doré
                    background: "#faf5f0",   // Crème chaleureux
                    text: "#2d3748",         // Gris foncé
                    highlight: "#e53e3e"     // Rouge accent
                },
                fonts: {
                    heading: "Merriweather, serif",
                    body: "Source Sans Pro, sans-serif"
                },
                layout: "grid_rustic"
            },
            
            custom: {
                name: "Personnalisé Cynthia",
                description: "Configuration sur mesure pour Cynthia Bernier",
                colors: {
                    primary: "#c53030",      // Rouge signature (modifiable)
                    secondary: "#2b6cb0",    // Bleu (modifiable)
                    accent: "#d69e2e",       // Accent (modifiable)
                    background: "#ffffff",   // Fond (modifiable)
                    text: "#1a202c",         // Texte (modifiable)
                    highlight: "#e53e3e"     // Surligné (modifiable)
                },
                fonts: {
                    heading: "Poppins, sans-serif",
                    body: "Inter, sans-serif"
                },
                layout: "grid_flexible"
            }
        };
    }
    
    /**
     * Charger configuration actuelle
     */
    loadCurrentConfiguration() {
        const saved = localStorage.getItem('cynthia_visual_config');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Configuration par défaut
        return {
            activeTheme: 'custom',
            customColors: this.realEstateThemes.custom.colors,
            backgroundImages: {
                hero: '/images/hero-default.jpg',
                about: '/images/about-bg.jpg',
                properties: '/images/properties-bg.jpg'
            },
            logo: '/images/logo-cynthia.png',
            companyName: 'Cynthia Bernier',
            tagline: 'Courtière immobilière résidentielle - Lebel-sur-Quévillon'
        };
    }
    
    /**
     * Appliquer nouveau thème
     */
    async applyTheme(themeId) {
        try {
            if (!this.realEstateThemes[themeId]) {
                throw new Error('Thème non trouvé');
            }
            
            const theme = this.realEstateThemes[themeId];
            
            // Mettre à jour configuration
            this.currentConfig.activeTheme = themeId;
            this.currentConfig.customColors = { ...theme.colors };
            
            // Appliquer CSS dynamiquement
            await this.applyCSSVariables(theme.colors);
            await this.applyFontStyles(theme.fonts);
            
            // Sauvegarder
            this.saveConfiguration();
            
            return {
                success: true,
                theme: themeId,
                applied: theme.name,
                colors: theme.colors
            };
            
        } catch (error) {
            console.error('❌ Theme application error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Personnaliser couleur spécifique
     */
    async customizeColor(colorType, hexColor) {
        try {
            // Valider couleur hex
            if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
                throw new Error('Format couleur invalide');
            }
            
            // Mettre à jour configuration
            this.currentConfig.customColors[colorType] = hexColor;
            this.currentConfig.activeTheme = 'custom';
            
            // Appliquer changement
            await this.applySingleColor(colorType, hexColor);
            
            // Sauvegarder
            this.saveConfiguration();
            
            return {
                success: true,
                colorType: colorType,
                newColor: hexColor,
                preview: this.generateColorPreview()
            };
            
        } catch (error) {
            console.error('❌ Color customization error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Changer image de fond
     */
    async changeBackgroundImage(section, imageFile) {
        try {
            let imageUrl;
            
            if (imageFile instanceof File) {
                // Upload et traitement de l'image
                imageUrl = await this.processAndUploadImage(imageFile);
            } else if (typeof imageFile === 'string') {
                // URL directe
                imageUrl = imageFile;
            } else {
                throw new Error('Format image invalide');
            }
            
            // Optimiser image pour l'immobilier
            const optimizedUrl = await this.optimizeRealEstateImage(imageUrl);
            
            // Mettre à jour configuration
            this.currentConfig.backgroundImages[section] = optimizedUrl;
            
            // Appliquer changement
            await this.applyBackgroundImage(section, optimizedUrl);
            
            // Sauvegarder
            this.saveConfiguration();
            
            return {
                success: true,
                section: section,
                imageUrl: optimizedUrl,
                optimized: true
            };
            
        } catch (error) {
            console.error('❌ Background image change error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Ajouter propriété à vendre avec photos
     */
    async addProperty(propertyData) {
        try {
            const {
                address,
                price,
                bedrooms,
                bathrooms,
                squareFeet,
                description,
                photos,
                status = 'À vendre',
                priority = 'normal'
            } = propertyData;
            
            // Traiter et optimiser photos
            const processedPhotos = [];
            for (const photo of photos) {
                const optimized = await this.optimizePropertyPhoto(photo);
                processedPhotos.push(optimized);
            }
            
            // Sélectionner meilleure photo pour héro
            const heroPhoto = this.selectBestHeroPhoto(processedPhotos);
            
            // Créer fiche propriété
            const property = {
                id: 'prop_' + Date.now(),
                address: address,
                price: price,
                details: {
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    squareFeet: squareFeet
                },
                description: description,
                photos: processedPhotos,
                heroPhoto: heroPhoto,
                status: status,
                priority: priority,
                dateAdded: new Date().toISOString(),
                agent: 'Cynthia Bernier'
            };
            
            // Ajouter à la base
            this.properties.push(property);
            
            // Si prioritaire, mettre en fond d'écran
            if (priority === 'high' && heroPhoto) {
                await this.changeBackgroundImage('hero', heroPhoto);
            }
            
            // Sauvegarder
            this.saveProperties();
            
            return {
                success: true,
                property: property,
                heroPhotoSet: priority === 'high',
                totalProperties: this.properties.length
            };
            
        } catch (error) {
            console.error('❌ Add property error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Obtenir propriétés à vendre
     */
    getPropertiesForSale(filters = {}) {
        let filtered = [...this.properties];
        
        // Filtres
        if (filters.status) {
            filtered = filtered.filter(p => p.status === filters.status);
        }
        if (filters.minPrice) {
            filtered = filtered.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }
        
        // Trier par priorité puis date
        filtered.sort((a, b) => {
            if (a.priority !== b.priority) {
                const priorityOrder = { high: 3, normal: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        });
        
        return {
            success: true,
            properties: filtered,
            total: filtered.length,
            filters: filters
        };
    }
    
    /**
     * Générer page galerie HTML
     */
    generatePropertiesGalleryHTML() {
        const properties = this.getPropertiesForSale().properties;
        const colors = this.currentConfig.customColors;
        
        let html = `
        <div class="properties-gallery" style="
            background: ${colors.background};
            color: ${colors.text};
            padding: 2rem;
            font-family: Inter, sans-serif;
        ">
            <h1 style="
                color: ${colors.primary};
                text-align: center;
                margin-bottom: 2rem;
                font-size: 2.5rem;
            ">Propriétés à Vendre</h1>
            
            <div class="properties-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                max-width: 1200px;
                margin: 0 auto;
            ">
        `;
        
        properties.forEach(property => {
            html += `
            <div class="property-card" style="
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                transition: transform 0.3s;
                border: 2px solid ${colors.secondary}22;
            ">
                <img src="${property.heroPhoto}" alt="${property.address}" style="
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                ">
                <div style="padding: 1.5rem;">
                    <h3 style="
                        color: ${colors.primary};
                        margin-bottom: 1rem;
                        font-size: 1.3rem;
                    ">${property.address}</h3>
                    
                    <div style="
                        color: ${colors.secondary};
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                    ">${this.formatPrice(property.price)}</div>
                    
                    <div style="
                        display: flex;
                        gap: 1rem;
                        margin-bottom: 1rem;
                        color: ${colors.text};
                    ">
                        <span>🛏️ ${property.details.bedrooms}</span>
                        <span>🚿 ${property.details.bathrooms}</span>
                        <span>📐 ${property.details.squareFeet} pi²</span>
                    </div>
                    
                    <p style="
                        color: ${colors.text};
                        line-height: 1.6;
                        margin-bottom: 1rem;
                    ">${property.description}</p>
                    
                    <button style="
                        background: ${colors.primary};
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                    ">Planifier une visite</button>
                </div>
            </div>
            `;
        });
        
        html += `
            </div>
            
            <div style="
                text-align: center;
                margin-top: 3rem;
                padding: 2rem;
                background: ${colors.primary};
                color: white;
                border-radius: 12px;
            ">
                <h2>Prêt à vendre ou acheter ?</h2>
                <p style="margin: 1rem 0;">Contactez Cynthia Bernier pour un service personnalisé</p>
                <button style="
                    background: ${colors.secondary};
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    cursor: pointer;
                ">Contactez-moi</button>
            </div>
        </div>
        `;
        
        return html;
    }
    
    /**
     * Interface de customisation pour Cynthia
     */
    generateCustomizationInterface() {
        const colors = this.currentConfig.customColors;
        const themes = Object.keys(this.realEstateThemes);
        
        return `
        <div class="customization-panel" style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 2rem auto;
        ">
            <h2 style="color: ${colors.primary}; margin-bottom: 2rem;">
                🎨 Personnalisation de votre site
            </h2>
            
            <!-- Sélection thème -->
            <div class="theme-selector" style="margin-bottom: 2rem;">
                <h3>Choisir un thème prédéfini :</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                    ${themes.map(themeId => `
                        <button onclick="applyTheme('${themeId}')" style="
                            padding: 1rem;
                            border: 2px solid ${this.currentConfig.activeTheme === themeId ? colors.primary : '#ddd'};
                            border-radius: 8px;
                            background: ${this.currentConfig.activeTheme === themeId ? colors.primary + '11' : 'white'};
                            cursor: pointer;
                        ">
                            <strong>${this.realEstateThemes[themeId].name}</strong>
                            <br><small>${this.realEstateThemes[themeId].description}</small>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Personnalisation couleurs -->
            <div class="color-customization" style="margin-bottom: 2rem;">
                <h3>Personnaliser les couleurs :</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    ${Object.entries(colors).map(([colorType, colorValue]) => `
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <label style="flex: 1; text-transform: capitalize;">${colorType.replace('_', ' ')} :</label>
                            <input type="color" value="${colorValue}" 
                                   onchange="customizeColor('${colorType}', this.value)"
                                   style="width: 50px; height: 40px; border: none; border-radius: 6px; cursor: pointer;">
                            <span style="font-family: monospace; font-size: 0.9rem;">${colorValue}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Upload images -->
            <div class="image-upload" style="margin-bottom: 2rem;">
                <h3>Changer les images de fond :</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div>
                        <label>Image d'accueil :</label>
                        <input type="file" accept="image/*" onchange="changeBackgroundImage('hero', this.files[0])"
                               style="width: 100%; margin-top: 0.5rem;">
                    </div>
                    <div>
                        <label>Image section À propos :</label>
                        <input type="file" accept="image/*" onchange="changeBackgroundImage('about', this.files[0])"
                               style="width: 100%; margin-top: 0.5rem;">
                    </div>
                    <div>
                        <label>Image galerie propriétés :</label>
                        <input type="file" accept="image/*" onchange="changeBackgroundImage('properties', this.files[0])"
                               style="width: 100%; margin-top: 0.5rem;">
                    </div>
                </div>
            </div>
            
            <!-- Aperçu -->
            <div class="preview-section">
                <h3>Aperçu des changements :</h3>
                <div id="preview-area" style="
                    border: 2px dashed ${colors.primary};
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                    margin: 1rem 0;
                    background: ${colors.background};
                ">
                    <div style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem;">
                        Cynthia Bernier Immobilier
                    </div>
                    <div style="color: ${colors.secondary};">
                        Aperçu avec les couleurs actuelles
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="saveCustomization()" style="
                        background: ${colors.primary};
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 6px;
                        cursor: pointer;
                    ">💾 Sauvegarder</button>
                    
                    <button onclick="resetToDefault()" style="
                        background: ${colors.accent};
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 6px;
                        cursor: pointer;
                    ">🔄 Réinitialiser</button>
                </div>
            </div>
        </div>
        
        <script>
            // Fonctions JavaScript pour l'interface
            async function applyTheme(themeId) {
                const result = await visualCustomizationService.applyTheme(themeId);
                if (result.success) {
                    location.reload(); // Recharger pour voir les changements
                }
            }
            
            async function customizeColor(colorType, hexColor) {
                const result = await visualCustomizationService.customizeColor(colorType, hexColor);
                if (result.success) {
                    updatePreview();
                }
            }
            
            async function changeBackgroundImage(section, file) {
                const result = await visualCustomizationService.changeBackgroundImage(section, file);
                if (result.success) {
                    alert('Image mise à jour avec succès !');
                }
            }
            
            function updatePreview() {
                // Mettre à jour l'aperçu en temps réel
                const previewArea = document.getElementById('preview-area');
                const colors = visualCustomizationService.currentConfig.customColors;
                previewArea.style.background = colors.background;
                previewArea.style.borderColor = colors.primary;
                // Etc...
            }
        </script>
        `;
    }
    
    /**
     * Appliquer variables CSS
     */
    async applyCSSVariables(colors) {
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key.replace('_', '-')}`, value);
        });
    }
    
    /**
     * Formater prix
     */
    formatPrice(price) {
        return new Intl.NumberFormat('fr-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(price);
    }
    
    /**
     * Sauvegarder configuration
     */
    saveConfiguration() {
        localStorage.setItem('cynthia_visual_config', JSON.stringify(this.currentConfig));
    }
    
    /**
     * Sauvegarder propriétés
     */
    saveProperties() {
        localStorage.setItem('cynthia_properties', JSON.stringify(this.properties));
    }
    
    /**
     * Status du service
     */
    getStatus() {
        return {
            service: 'VISUAL CUSTOMIZATION',
            initialized: this.initialized,
            currentTheme: this.currentConfig.activeTheme,
            propertiesCount: this.properties.length,
            capabilities: [
                'theme-switching',
                'color-customization',
                'background-images',
                'property-gallery',
                'real-estate-optimization'
            ]
        };
    }
}

module.exports = VisualCustomizationService;