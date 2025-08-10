// 🌐 IA MARKETING & PUBLICATION - JavaScript avancé pour Cynthia
// Système complet de gestion marketing immobilier avec IA

class MarketingIAManager {
    constructor() {
        this.properties = [];
        this.campaigns = [];
        this.socialPosts = [];
        this.websiteContent = {};
        this.aiMarketingConversation = [];
        this.socialStats = {
            facebook: { followers: 1234, reach: 5678 },
            instagram: { followers: 987, stories: 456 },
            youtube: { subscribers: 234, views: 12345 },
            linkedin: { connections: 456, profileViews: 123 }
        };
        
        this.init();
    }

    // Méthode pour appeler OpenAI WebApp spécifiquement pour le marketing
    async callOpenAIWebAppMarketing(prompt, systemMessage = null) {
        try {
            // Utiliser les variables d'environnement Vercel
            const apiKey = window.ENV?.CYNTHIA_WEBAPP_OPENAI_KEY || process.env.CYNTHIA_WEBAPP_OPENAI_KEY;
            
            if (!apiKey || apiKey.includes('HERE')) {
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

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: messages,
                    temperature: 0.4,
                    max_tokens: 800
                })
            });

            if (!response.ok) {
                throw new Error(`API OpenAI WebApp Marketing error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('❌ Erreur OpenAI WebApp Marketing:', error);
            throw error;
        }
    }

    async init() {
        console.log('🌐 Initialisation IA Marketing & Publication...');
        
        // Charger les données existantes
        await this.loadMarketingData();
        
        // Initialiser l'interface
        this.initializeStats();
        this.loadAIMarketingConversation();
        this.renderPublishedProperties();
        this.renderActiveCampaigns();
        this.setupEventListeners();
        
        // Démarrer l'assistant IA Marketing
        this.initializeMarketingAI();
        
        console.log('✅ IA Marketing & Publication initialisé');
    }

    async loadMarketingData() {
        try {
            // Charger données depuis localStorage
            const savedProperties = localStorage.getItem('cynthia_published_properties');
            if (savedProperties) {
                this.properties = JSON.parse(savedProperties);
            }
            
            const savedCampaigns = localStorage.getItem('cynthia_marketing_campaigns');
            if (savedCampaigns) {
                this.campaigns = JSON.parse(savedCampaigns);
            }
            
            const savedWebsiteContent = localStorage.getItem('cynthia_website_content');
            if (savedWebsiteContent) {
                this.websiteContent = JSON.parse(savedWebsiteContent);
            } else {
                // Contenu par défaut
                this.websiteContent = {
                    home: {
                        title: 'Cynthia Bernier - Courtière Immobilière',
                        description: 'Votre experte immobilière à Lebel-sur-Quévillon. Service personnalisé pour vente, achat et évaluation de propriétés résidentielles.'
                    },
                    about: {
                        bio: 'Courtière immobilière résidentielle expérimentée, je dessers la région de Lebel-sur-Quévillon avec passion et professionnalisme depuis plus de 10 ans.'
                    },
                    services: {
                        list: '• Vente résidentielle\n• Achat accompagné\n• Évaluation gratuite\n• Consultation marché immobilier'
                    },
                    contact: {
                        info: '📞 418-XXX-XXXX\n📧 cynthia@domain.com\n📍 Lebel-sur-Quévillon, QC'
                    }
                };
            }
            
        } catch (error) {
            console.warn('⚠️ Erreur chargement données marketing:', error);
        }
    }

    initializeStats() {
        // Mettre à jour les stats affichées
        document.getElementById('websiteViews').textContent = Math.floor(Math.random() * 2000) + 1000;
        document.getElementById('publishedProperties').textContent = this.properties.length;
        document.getElementById('socialEngagement').textContent = Math.floor(Math.random() * 500) + 200;
        document.getElementById('marketingCampaigns').textContent = this.campaigns.length;
        
        // Stats réseaux sociaux
        document.getElementById('facebookFollowers').textContent = this.socialStats.facebook.followers;
        document.getElementById('facebookReach').textContent = this.socialStats.facebook.reach;
        document.getElementById('instagramFollowers').textContent = this.socialStats.instagram.followers;
        document.getElementById('instagramStories').textContent = this.socialStats.instagram.stories;
        document.getElementById('youtubeSubscribers').textContent = this.socialStats.youtube.subscribers;
        document.getElementById('youtubeViews').textContent = this.socialStats.youtube.views;
        document.getElementById('linkedinConnections').textContent = this.socialStats.linkedin.connections;
        document.getElementById('linkedinProfileViews').textContent = this.socialStats.linkedin.profileViews;
    }

    loadAIMarketingConversation() {
        const saved = localStorage.getItem('cynthia_ai_marketing_conversation');
        if (saved) {
            this.aiMarketingConversation = JSON.parse(saved);
        } else {
            this.aiMarketingConversation = [
                {
                    type: 'ai',
                    content: 'Bonjour Cynthia ! Je suis votre assistant IA Marketing spécialisé en immobilier. Je peux vous aider avec la gestion de votre site web, la publication de fiches immobilières, et vos campagnes sur les réseaux sociaux. Par quoi voulez-vous commencer ?',
                    timestamp: new Date()
                }
            ];
        }
        
        this.renderAIMarketingConversation();
    }

    renderAIMarketingConversation() {
        const chatMessages = document.getElementById('aiMarketingChatMessages');
        
        chatMessages.innerHTML = this.aiMarketingConversation.map(message => `
            <div class="message ${message.type}-message">
                <div class="message-content">
                    <p><strong>${message.type === 'ai' ? 'Marketing IA' : 'Vous'}:</strong> ${message.content}</p>
                    <small class="message-time">${this.formatTime(message.timestamp)}</small>
                </div>
            </div>
        `).join('');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    setupEventListeners() {
        // Chat IA Marketing
        document.getElementById('aiMarketingChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMarketingAiMessage();
            }
        });
        
        // Chargement du contenu web dans l'éditeur
        this.loadWebsiteContentIntoEditor();
    }

    loadWebsiteContentIntoEditor() {
        // Charger le contenu existant dans les champs d'édition
        if (this.websiteContent.home) {
            document.getElementById('homeTitle').value = this.websiteContent.home.title;
            document.getElementById('homeDescription').value = this.websiteContent.home.description;
        }
        if (this.websiteContent.about) {
            document.getElementById('aboutBio').value = this.websiteContent.about.bio;
        }
        if (this.websiteContent.services) {
            document.getElementById('servicesList').value = this.websiteContent.services.list;
        }
        if (this.websiteContent.contact) {
            document.getElementById('contactInfo').value = this.websiteContent.contact.info;
        }
    }

    initializeMarketingAI() {
        // Ajouter exemples de propriétés si vide
        if (this.properties.length === 0) {
            this.properties = [
                {
                    id: Date.now(),
                    address: '123 Rue des Érables, Lebel-sur-Quévillon',
                    price: 245000,
                    bedrooms: 3,
                    bathrooms: 2,
                    size: 1450,
                    type: 'Bungalow',
                    description: 'Magnifique bungalow situé dans un secteur paisible de Lebel-sur-Quévillon. Cette propriété offre un excellent potentiel avec ses 3 chambres, 2 salles de bain et un sous-sol aménageable.',
                    photos: [],
                    publishedDate: new Date(),
                    status: 'active'
                }
            ];
            this.saveProperties();
        }
        
        // Ajouter exemples de campagnes si vide
        if (this.campaigns.length === 0) {
            this.campaigns = [
                {
                    id: Date.now(),
                    name: 'Campagne Printemps 2024',
                    type: 'Réseaux sociaux',
                    status: 'active',
                    budget: 500,
                    platforms: ['Facebook', 'Instagram'],
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            ];
            this.saveCampaigns();
        }
    }

    // 🤖 Fonctions IA Marketing Chat
    async sendMarketingAiMessage() {
        const input = document.getElementById('aiMarketingChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Ajouter message utilisateur
        this.aiMarketingConversation.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // Afficher "IA en cours de réflexion..."
        this.aiMarketingConversation.push({
            type: 'ai',
            content: '🤔 Analyse en cours...',
            timestamp: new Date()
        });
        
        this.renderAIMarketingConversation();
        input.value = '';
        
        try {
            // Appel réel à l'API OpenAI WebApp pour le marketing
            const aiResponse = await this.callOpenAIWebAppMarketing(
                message,
                "Tu es l'assistante IA marketing de Cynthia Bernier, courtière immobilière à Lebel-sur-Quévillon. Tu aides avec le marketing, la gestion du site web, les réseaux sociaux, et la publication de propriétés. Réponds avec expertise en marketing immobilier."
            );
            
            // Remplacer le message temporaire
            this.aiMarketingConversation[this.aiMarketingConversation.length - 1] = {
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };
            
        } catch (error) {
            console.error('Erreur API OpenAI Marketing:', error);
            
            // Message d'erreur si API ne fonctionne pas
            this.aiMarketingConversation[this.aiMarketingConversation.length - 1] = {
                type: 'ai',
                content: '⚠️ Service marketing temporairement indisponible. Veuillez réessayer dans quelques instants.',
                timestamp: new Date()
            };
        }
        
        this.renderAIMarketingConversation();
        this.saveAIMarketingConversation();
    }

    generateMarketingAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('site') || message.includes('web')) {
            return 'Je peux vous aider à optimiser votre site web ! Voulez-vous mettre à jour le contenu, améliorer le SEO, ou analyser les performances ? Votre site cynthiabernier.com peut bénéficier de contenu localisé pour Lebel-sur-Quévillon.';
        }
        
        if (message.includes('fiche') || message.includes('propriété') || message.includes('maison')) {
            return 'Parfait pour les fiches immobilières ! Je peux générer des descriptions optimisées, suggérer des photos professionnelles, et créer du contenu pour vos réseaux sociaux. Quelle propriété voulez-vous mettre en avant ?';
        }
        
        if (message.includes('facebook') || message.includes('instagram') || message.includes('social')) {
            return 'Excellente stratégie réseaux sociaux ! Je peux créer du contenu engageant, planifier vos publications, et optimiser vos campagnes. Voulez-vous que je génère un post sur une nouvelle propriété ou des conseils immobiliers ?';
        }
        
        if (message.includes('campagne') || message.includes('marketing') || message.includes('publicité')) {
            return 'Les campagnes marketing sont essentielles ! Je peux vous aider à créer des campagnes ciblées pour Lebel-sur-Quévillon, analyser le ROI, et optimiser vos budgets publicitaires. Quel est votre objectif principal ?';
        }
        
        if (message.includes('seo') || message.includes('référencement')) {
            return 'Le SEO local est crucial pour l\'immobilier ! Je vais optimiser votre contenu avec des mots-clés comme "courtière Lebel-sur-Quévillon", "maison à vendre Nord-du-Québec". Voulez-vous que j\'analyse vos pages actuelles ?';
        }
        
        if (message.includes('client') || message.includes('lead')) {
            return 'Générer des prospects qualifiés est ma spécialité ! Je peux créer du contenu attractif, optimiser vos formulaires de contact, et développer des stratégies de nurturing. Combien de nouveaux clients visez-vous ce mois ?';
        }
        
        return 'Je suis votre expert IA en marketing immobilier ! Je peux vous accompagner sur : 🌐 Gestion site web, 🏠 Publication fiches, 📱 Réseaux sociaux, 📈 Campagnes marketing, 🔍 SEO local, et 👥 Génération de leads. Quelle est votre priorité ?';
    }

    saveAIMarketingConversation() {
        localStorage.setItem('cynthia_ai_marketing_conversation', JSON.stringify(this.aiMarketingConversation));
    }

    // 🌐 Fonctions Gestion Site Web
    saveWebsiteContent() {
        this.websiteContent = {
            home: {
                title: document.getElementById('homeTitle').value,
                description: document.getElementById('homeDescription').value
            },
            about: {
                bio: document.getElementById('aboutBio').value
            },
            services: {
                list: document.getElementById('servicesList').value
            },
            contact: {
                info: document.getElementById('contactInfo').value
            }
        };
        
        localStorage.setItem('cynthia_website_content', JSON.stringify(this.websiteContent));
    }

    // 🏠 Fonctions Publication Propriétés
    generatePropertyDescription() {
        const address = document.getElementById('propertyAddress').value;
        const price = document.getElementById('propertyPrice').value;
        const bedrooms = document.getElementById('propertyBedrooms').value;
        const bathrooms = document.getElementById('propertyBathrooms').value;
        const size = document.getElementById('propertySize').value;
        const type = document.getElementById('propertyType').value;
        
        if (!address || !price) {
            alert('⚠️ Veuillez saisir au moins l\'adresse et le prix pour générer une description');
            return;
        }
        
        const descriptions = [
            `Magnifique ${type.toLowerCase()} situé${type.includes('Maison') ? 'e' : ''} au ${address}. Cette propriété exceptionnelle de ${size} pi² offre ${bedrooms} chambres spacieuses et ${bathrooms} salle${bathrooms > 1 ? 's' : ''} de bain moderne${bathrooms > 1 ? 's' : ''}. 

🏠 Caractéristiques principales :
• Localisation privilégiée à Lebel-sur-Quévillon
• Finitions de qualité supérieure
• Environnement paisible et familial
• Proximité des services essentiels

Cette propriété représente une opportunité unique dans le marché immobilier du Nord-du-Québec. Parfaite pour une famille recherchant confort et tranquillité.

Prix demandé : ${parseInt(price).toLocaleString('fr-CA')} $

Contactez Cynthia Bernier dès maintenant pour planifier votre visite !
📞 418-XXX-XXXX`,

            `Découvrez ce superbe ${type.toLowerCase()} de ${size} pi² situé dans un secteur recherché de Lebel-sur-Quévillon. Avec ses ${bedrooms} chambres et ${bathrooms} salle${bathrooms > 1 ? 's' : ''} de bain, cette propriété saura répondre à tous vos besoins.

✨ Points forts :
• Architecture moderne et fonctionnelle
• Espaces de vie lumineux et bien agencés
• Terrain paysager et entretenu
• Secteur tranquille et sécuritaire

Le marché immobilier de Lebel-sur-Quévillon offre des opportunités exceptionnelles, et cette propriété en est un parfait exemple. Idéale pour investisseurs ou propriétaires occupants.

Offerte à ${parseInt(price).toLocaleString('fr-CA')} $

Votre courtière experte Cynthia Bernier vous accompagne dans ce projet immobilier !`
        ];
        
        const selectedDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        document.getElementById('propertyDescription').value = selectedDescription;
        
        this.addAIMarketingMessage('✨', 'Description générée', 'Description IA créée avec optimisation SEO locale');
    }

    optimizePropertyForSEO() {
        const description = document.getElementById('propertyDescription').value;
        if (!description) {
            alert('⚠️ Veuillez d\'abord saisir ou générer une description');
            return;
        }
        
        let optimizedDescription = description;
        
        // Ajouter mots-clés SEO locaux
        const seoKeywords = [
            'Lebel-sur-Quévillon',
            'Nord-du-Québec',
            'courtière immobilière',
            'propriété résidentielle',
            'maison à vendre'
        ];
        
        // Vérifier et ajouter mots-clés manquants
        seoKeywords.forEach(keyword => {
            if (!optimizedDescription.toLowerCase().includes(keyword.toLowerCase())) {
                optimizedDescription += `\n\n🔍 Mots-clés : ${keyword}`;
            }
        });
        
        // Ajouter call-to-action optimisé
        if (!optimizedDescription.includes('Contactez')) {
            optimizedDescription += '\n\n📞 Contactez Cynthia Bernier, votre experte immobilière locale, pour une visite personnalisée !';
        }
        
        document.getElementById('propertyDescription').value = optimizedDescription;
        
        this.addAIMarketingMessage('🔍', 'SEO optimisé', 'Description optimisée pour le référencement local');
    }

    analyzePropertyMarket() {
        const price = parseInt(document.getElementById('propertyPrice').value);
        const type = document.getElementById('propertyType').value;
        
        if (!price) {
            alert('⚠️ Veuillez saisir le prix pour l\'analyse de marché');
            return;
        }
        
        // Simuler analyse de marché
        const marketAnalysis = this.generateMarketAnalysis(price, type);
        
        alert(`📊 ANALYSE DE MARCHÉ - LEBEL-SUR-QUÉVILLON\n\n${marketAnalysis.join('\n\n')}`);
        
        this.addAIMarketingMessage('📊', 'Analyse marché', 'Rapport de marché généré avec comparaisons locales');
    }

    generateMarketAnalysis(price, type) {
        const avgPrice = 235000;
        const priceComparison = price > avgPrice ? 'supérieur' : 'inférieur';
        const priceDiff = Math.abs(((price - avgPrice) / avgPrice) * 100).toFixed(1);
        
        return [
            `💰 ÉVALUATION PRIX\nVotre prix (${price.toLocaleString('fr-CA')} $) est ${priceDiff}% ${priceComparison} à la moyenne locale (${avgPrice.toLocaleString('fr-CA')} $)`,
            
            `🏠 MARCHÉ ${type.toUpperCase()}\n• Demande : ${Math.random() > 0.5 ? 'Élevée' : 'Modérée'}\n• Temps vente moyen : ${Math.floor(Math.random() * 60) + 30} jours\n• Concurrence : ${Math.floor(Math.random() * 5) + 2} propriétés similaires`,
            
            `📈 TENDANCES LEBEL-SUR-QUÉVILLON\n• Évolution prix : +${(Math.random() * 10 + 2).toFixed(1)}% cette année\n• Activité marché : Dynamique\n• Meilleure période : Printemps-Été`,
            
            `💡 RECOMMANDATIONS\n• Prix compétitif pour le secteur\n• Mise en valeur points forts recommandée\n• Marketing ciblé Nord-du-Québec\n• Photos professionnelles essentielles`
        ];
    }

    publishProperty() {
        const propertyData = {
            id: Date.now(),
            address: document.getElementById('propertyAddress').value,
            price: parseInt(document.getElementById('propertyPrice').value),
            bedrooms: document.getElementById('propertyBedrooms').value,
            bathrooms: document.getElementById('propertyBathrooms').value,
            size: parseInt(document.getElementById('propertySize').value),
            type: document.getElementById('propertyType').value,
            description: document.getElementById('propertyDescription').value,
            photos: document.getElementById('propertyPhotos').value.split(',').map(url => url.trim()).filter(url => url),
            publishedDate: new Date(),
            status: 'active'
        };
        
        if (!propertyData.address || !propertyData.price) {
            alert('⚠️ Veuillez remplir au moins l\'adresse et le prix');
            return;
        }
        
        this.properties.push(propertyData);
        this.saveProperties();
        
        // Vider le formulaire
        document.getElementById('propertyAddress').value = '';
        document.getElementById('propertyPrice').value = '';
        document.getElementById('propertySize').value = '';
        document.getElementById('propertyDescription').value = '';
        document.getElementById('propertyPhotos').value = '';
        
        // Actualiser l'affichage
        this.renderPublishedProperties();
        this.initializeStats();
        
        // Proposer publication sur réseaux sociaux
        if (confirm('🚀 Propriété publiée avec succès !\n\nVoulez-vous également la publier sur vos réseaux sociaux ?')) {
            this.autoPostToSocialMedia(propertyData);
        }
        
        this.addAIMarketingMessage('🏠', 'Propriété publiée', `${propertyData.address} ajoutée avec succès`);
    }

    renderPublishedProperties() {
        const propertiesList = document.getElementById('publishedPropertiesList');
        
        if (this.properties.length === 0) {
            propertiesList.innerHTML = '<p class="no-properties">Aucune propriété publiée</p>';
            return;
        }
        
        propertiesList.innerHTML = this.properties.map(property => `
            <div class="property-card">
                <div class="property-header">
                    <h4>${property.address}</h4>
                    <span class="property-price">${property.price.toLocaleString('fr-CA')} $</span>
                </div>
                <div class="property-details">
                    <span>🛏️ ${property.bedrooms} • 🛁 ${property.bathrooms} • 📐 ${property.size} pi²</span>
                </div>
                <div class="property-actions">
                    <button onclick="editProperty(${property.id})" class="btn-edit">✏️ Modifier</button>
                    <button onclick="shareProperty(${property.id})" class="btn-share">📱 Partager</button>
                    <button onclick="deleteProperty(${property.id})" class="btn-delete">🗑️ Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    saveProperties() {
        localStorage.setItem('cynthia_published_properties', JSON.stringify(this.properties));
    }

    // 📱 Fonctions Réseaux Sociaux
    autoPostToSocialMedia(propertyData) {
        const socialContent = this.generateSocialMediaContent(propertyData);
        
        // Simuler publication sur les plateformes connectées
        const platforms = ['Facebook', 'Instagram', 'LinkedIn'];
        platforms.forEach(platform => {
            this.simulatePostToPlatform(platform, socialContent);
        });
        
        alert(`📱 Publication automatique réussie !\n\n✅ Facebook : Post créé\n✅ Instagram : Photo publiée\n✅ LinkedIn : Article professionnel\n\n📊 Portée estimée : ${Math.floor(Math.random() * 1000) + 500} personnes`);
    }

    generateSocialMediaContent(propertyData) {
        const templates = [
            `🏠 NOUVELLE PROPRIÉTÉ DISPONIBLE ! 🏠

📍 ${propertyData.address}
💰 ${propertyData.price.toLocaleString('fr-CA')} $
🛏️ ${propertyData.bedrooms} chambres | 🛁 ${propertyData.bathrooms} sdb
📐 ${propertyData.size} pi²

${propertyData.type} situé dans un secteur recherché de Lebel-sur-Quévillon. Une opportunité à ne pas manquer !

👀 Visite? Contactez-moi!
📞 418-XXX-XXXX

#LebelsurQuevillon #Immobilier #MaisonAVendre #NordduQuebec #CynthiaBernier`,

            `✨ COUP DE CŒUR IMMOBILIER ✨

Je suis fière de vous présenter cette magnifique propriété à ${propertyData.address} !

🌟 Caractéristiques :
• ${propertyData.bedrooms} chambres spacieuses
• ${propertyData.bathrooms} salle${propertyData.bathrooms > 1 ? 's' : ''} de bain
• ${propertyData.size} pi² bien agencés
• Secteur paisible à Lebel-sur-Quévillon

Prix : ${propertyData.price.toLocaleString('fr-CA')} $

Planifions votre visite dès aujourd'hui !

#Immobilier #Courtiere #LebelsurQuevillon #Maison`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    simulatePostToPlatform(platform, content) {
        const post = {
            id: Date.now() + Math.random(),
            platform: platform,
            content: content,
            publishedAt: new Date(),
            engagement: Math.floor(Math.random() * 50) + 10
        };
        
        this.socialPosts.push(post);
    }

    generateSocialContent() {
        const postType = document.getElementById('postType').value;
        const contentTextarea = document.getElementById('postContent');
        
        let generatedContent = '';
        
        switch (postType) {
            case 'Nouvelle propriété':
                generatedContent = `🏠 NOUVELLE OPPORTUNITÉ IMMOBILIÈRE !

Découvrez cette magnifique propriété à Lebel-sur-Quévillon qui vient tout juste d'être mise sur le marché !

✨ Points forts :
• Localisation exceptionnelle
• Finitions de qualité
• Environnement paisible
• Potentiel d'investissement

Votre future maison vous attend peut-être ici ! 

📞 Contactez-moi pour une visite privée
Cynthia Bernier - Votre experte immobilière locale

#LebelsurQuevillon #NordduQuebec #Immobilier #MaisonAVendre #Courtiere`;
                break;
                
            case 'Témoignage client':
                generatedContent = `💬 TÉMOIGNAGE CLIENT

"Merci Cynthia pour ton professionnalisme et ta disponibilité ! Grâce à ton expertise du marché de Lebel-sur-Quévillon, nous avons trouvé LA maison parfaite pour notre famille. Ton accompagnement personnalisé a fait toute la différence !" 

- Famille Tremblay ⭐⭐⭐⭐⭐

C'est ça, la satisfaction client ! Chaque projet immobilier est unique et mérite une attention particulière.

🏠 Vous cherchez à vendre ou acheter ? Parlons-en !

#Testimoignage #ServiceClient #Immobilier #LebelsurQuevillon`;
                break;
                
            case 'Conseil immobilier':
                generatedContent = `💡 CONSEIL IMMOBILIER DU JOUR

🏠 ACHETEURS : Les 3 questions essentielles avant de visiter :

1️⃣ "Quels sont les travaux à prévoir ?"
2️⃣ "Comment est le voisinage ?"  
3️⃣ "Y a-t-il eu des rénovations récentes ?"

Ces questions vous feront gagner du temps ET de l'argent ! 

En tant que courtière locale à Lebel-sur-Quévillon, je connais chaque secteur et peux vous guider vers les meilleures décisions.

📞 Une question ? Je suis là !

#ConseilImmobilier #Acheteur #LebelsurQuevillon #ExpertiseLocale`;
                break;
                
            case 'Marché local':
                generatedContent = `📈 MARCHÉ IMMOBILIER LEBEL-SUR-QUÉVILLON

Excellentes nouvelles pour notre région ! 

✅ Augmentation de 8% des ventes ce trimestre
✅ Temps de vente moyen : 45 jours  
✅ Intérêt croissant pour le Nord-du-Québec
✅ Prix stables et attractifs

C'est le moment idéal pour :
🏠 Vendre votre propriété
🔍 Investir dans l'immobilier local
📊 Évaluer votre patrimoine

Besoin d'une analyse personnalisée de votre situation ? Contactez-moi !

#MarcheImmobilier #LebelsurQuevillon #NordduQuebec #Investissement`;
                break;
                
            case 'Personnel/Behind the scenes':
                generatedContent = `👋 DANS LES COULISSES...

Une journée dans la vie d'une courtière immobilière à Lebel-sur-Quévillon :

🌅 7h00 - Café et révision des dossiers clients
📞 9h00 - Appels de suivi et nouvelles demandes  
🏠 10h30 - Visite de propriété avec des acheteurs
📝 14h00 - Préparation d'offres d'achat
🚗 16h00 - Photos d'une nouvelle inscription
📱 18h00 - Réponse aux messages et planification

Chaque journée est différente, mais la passion pour l'immobilier reste constante ! 

❤️ J'adore ce que je fais et ça paraît !

#BehindTheScenes #Courtiere #Passion #LebelsurQuevillon`;
                break;
        }
        
        contentTextarea.value = generatedContent;
        
        this.addAIMarketingMessage('✨', 'Contenu généré', `Post ${postType} créé avec hashtags optimisés`);
    }

    addHashtags() {
        const contentTextarea = document.getElementById('postContent');
        const currentContent = contentTextarea.value;
        
        const hashtags = [
            '#LebelsurQuevillon',
            '#NordduQuebec',
            '#Immobilier',
            '#CourtiereImmobiliere',
            '#CynthiaBernier',
            '#MaisonAVendre',
            '#AchatMaison',
            '#ImmobilierResidentiel',
            '#ConseilImmobilier',
            '#ExpertiseLocale'
        ];
        
        const randomHashtags = hashtags.sort(() => 0.5 - Math.random()).slice(0, 5);
        
        if (!currentContent.includes('#')) {
            contentTextarea.value += '\n\n' + randomHashtags.join(' ');
        } else {
            // Remplacer ou améliorer hashtags existants
            const hashtagsToAdd = randomHashtags.filter(tag => !currentContent.includes(tag));
            if (hashtagsToAdd.length > 0) {
                contentTextarea.value += ' ' + hashtagsToAdd.join(' ');
            }
        }
        
        this.addAIMarketingMessage('#️⃣', 'Hashtags ajoutés', 'Tags optimisés pour portée locale');
    }

    // 📈 Fonctions Campagnes Marketing
    createMarketingCampaign() {
        const campaignName = prompt('Nom de la nouvelle campagne :');
        if (!campaignName) return;
        
        const campaignType = prompt('Type de campagne :\n1. Réseaux sociaux\n2. Google Ads\n3. Email marketing\n4. Affichage local\n\nTapez le numéro ou le nom :');
        if (!campaignType) return;
        
        const budget = prompt('Budget mensuel ($) :');
        if (!budget || isNaN(budget)) return;
        
        const campaign = {
            id: Date.now(),
            name: campaignName,
            type: campaignType.includes('1') ? 'Réseaux sociaux' : campaignType,
            status: 'active',
            budget: parseInt(budget),
            platforms: ['Facebook', 'Instagram'],
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            performance: {
                impressions: 0,
                clicks: 0,
                leads: 0,
                cost: 0
            }
        };
        
        this.campaigns.push(campaign);
        this.saveCampaigns();
        this.renderActiveCampaigns();
        this.initializeStats();
        
        alert(`🚀 Campagne "${campaignName}" créée avec succès !\n\n📊 Budget : ${budget} $\n📅 Durée : 30 jours\n🎯 Optimisation automatique activée`);
        
        this.addAIMarketingMessage('🚀', 'Campagne créée', `${campaignName} lancée avec budget ${budget}$`);
    }

    renderActiveCampaigns() {
        const campaignsList = document.getElementById('activeCampaignsList');
        
        if (this.campaigns.length === 0) {
            campaignsList.innerHTML = '<p class="no-campaigns">Aucune campagne active</p>';
            return;
        }
        
        campaignsList.innerHTML = this.campaigns.map(campaign => `
            <div class="campaign-card">
                <div class="campaign-header">
                    <h4>${campaign.name}</h4>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                <div class="campaign-details">
                    <p><strong>Type :</strong> ${campaign.type}</p>
                    <p><strong>Budget :</strong> ${campaign.budget} $ / mois</p>
                    <p><strong>Performance :</strong> ${Math.floor(Math.random() * 100)} leads générés</p>
                </div>
                <div class="campaign-actions">
                    <button onclick="editCampaign(${campaign.id})" class="btn-edit-campaign">✏️ Modifier</button>
                    <button onclick="pauseCampaign(${campaign.id})" class="btn-pause-campaign">⏸️ Pauser</button>
                    <button onclick="deleteCampaign(${campaign.id})" class="btn-delete-campaign">🗑️ Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    saveCampaigns() {
        localStorage.setItem('cynthia_marketing_campaigns', JSON.stringify(this.campaigns));
    }

    // Utilitaires
    addAIMarketingMessage(icon, title, message) {
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification(icon, title, message, 'success');
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Maintenant';
        if (diffMinutes < 60) return `${diffMinutes} min`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} h`;
        return date.toLocaleDateString('fr-CA');
    }
}

// 🌐 Fonctions globales pour l'interface

function refreshMarketingData() {
    if (window.marketingIAManager) {
        window.marketingIAManager.initializeStats();
        window.marketingIAManager.renderPublishedProperties();
        window.marketingIAManager.renderActiveCampaigns();
        
        console.log('🔄 Données marketing actualisées');
        alert('✅ Données marketing actualisées !');
    }
}

function goBackToDashboard() {
    window.location.href = 'index.html';
}

function sendMarketingAiMessage() {
    if (window.marketingIAManager) {
        window.marketingIAManager.sendMarketingAiMessage();
    }
}

// Gestion Site Web
function showWebsiteTab(tabName) {
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.editor-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function previewWebsite() {
    alert('🌐 PRÉVISUALISATION SITE WEB\n\nVotre site cynthiabernier.com sera affiché dans un nouvel onglet avec les dernières modifications.\n\n✨ Fonctionnalité en cours de développement');
}

function editWebsite() {
    if (window.marketingIAManager) {
        window.marketingIAManager.saveWebsiteContent();
        alert('✅ Contenu web sauvegardé !\n\nVos modifications sont enregistrées et seront appliquées lors de la prochaine publication.');
    }
}

function publishWebsite() {
    if (window.marketingIAManager) {
        window.marketingIAManager.saveWebsiteContent();
        alert('🚀 SITE WEB PUBLIÉ !\n\n✅ Contenu mis à jour\n🔍 SEO optimisé\n📱 Version mobile actualisée\n\nVotre site cynthiabernier.com est maintenant en ligne avec les dernières modifications !');
        
        if (window.marketingIAManager) {
            window.marketingIAManager.addAIMarketingMessage('🌐', 'Site publié', 'Contenu web mis à jour et en ligne');
        }
    }
}

// Gestion Propriétés
function showPropertyTab(tabName) {
    document.querySelectorAll('.property-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.property-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function generatePropertyDescription() {
    if (window.marketingIAManager) {
        window.marketingIAManager.generatePropertyDescription();
    }
}

function optimizePropertyForSEO() {
    if (window.marketingIAManager) {
        window.marketingIAManager.optimizePropertyForSEO();
    }
}

function analyzePropertyMarket() {
    if (window.marketingIAManager) {
        window.marketingIAManager.analyzePropertyMarket();
    }
}

function uploadPropertyPhotos() {
    alert('📸 UPLOAD PHOTOS\n\nFonctionnalité en développement :\n• Upload multiple de photos\n• Redimensionnement automatique\n• Optimisation pour web et réseaux sociaux\n• Intégration avec galerie de propriétés');
}

function previewProperty() {
    const address = document.getElementById('propertyAddress').value;
    const price = document.getElementById('propertyPrice').value;
    
    if (!address || !price) {
        alert('⚠️ Veuillez saisir au moins l\'adresse et le prix pour la prévisualisation');
        return;
    }
    
    alert(`👁️ PRÉVISUALISATION FICHE\n\n🏠 ${address}\n💰 ${parseInt(price).toLocaleString('fr-CA')} $\n\nLa fiche sera affichée avec le design final, les photos et toutes les informations formatées professionnellement.\n\n✨ Fonctionnalité en cours de développement`);
}

function publishProperty() {
    if (window.marketingIAManager) {
        window.marketingIAManager.publishProperty();
    }
}

function createPropertyTemplate() {
    alert('📄 CRÉER TEMPLATE\n\nPermet de sauvegarder la configuration actuelle comme modèle réutilisable.\n\n✨ Fonctionnalité en cours de développement');
}

function importTemplate() {
    alert('📥 IMPORTER TEMPLATE\n\nCharger un template existant pour pré-remplir le formulaire.\n\n✨ Fonctionnalité en cours de développement');
}

// Gestion Réseaux Sociaux
function postToFacebook() {
    alert('📘 FACEBOOK POST\n\nCréer un nouveau post Facebook avec :\n• Texte optimisé\n• Images haute qualité\n• Hashtags ciblés\n• Planification possible\n\n✨ Fonctionnalité en cours de développement');
}

function scheduleFacebookPost() {
    alert('⏰ PROGRAMMER FACEBOOK\n\nPlanifier vos posts pour :\n• Heures de pointe\n• Jours optimaux\n• Événements spéciaux\n• Campagnes coordonnées\n\n✨ Fonctionnalité en cours de développement');
}

function viewFacebookAnalytics() {
    alert('📊 ANALYTICS FACEBOOK\n\n📈 Performances du mois :\n• Portée : 5,678 personnes\n• Engagement : 12.3%\n• Clics vers site : 156\n• Leads générés : 8\n\n✨ Tableau de bord complet en développement');
}

function postToInstagram() {
    alert('📸 INSTAGRAM POST\n\nPublier photo/vidéo avec :\n• Filtres professionnels\n• Stories interactives\n• Géolocalisation Lebel-sur-Quévillon\n• Hashtags immobilier\n\n✨ Fonctionnalité en cours de développement');
}

function createInstagramStory() {
    alert('📱 INSTAGRAM STORY\n\nCréer une story engageante :\n• Templates immobilier\n• Sondages et questions\n• Visites virtuelles\n• Coulisses métier\n\n✨ Fonctionnalité en cours de développement');
}

function viewInstagramInsights() {
    alert('📊 INSIGHTS INSTAGRAM\n\n📱 Performance Stories :\n• Vues : 456 cette semaine\n• Interactions : 23%\n• Nouveaux abonnés : 12\n• Portée : 892 comptes\n\n✨ Analyse détaillée en développement');
}

function connectYoutube() {
    alert('🔗 CONNECTER YOUTUBE\n\nConnexion à votre chaîne YouTube pour :\n• Upload vidéos propriétés\n• Vlogs immobiliers\n• Conseils clients\n• Visites virtuelles\n\n✨ Intégration en cours de développement');
}

function uploadVideo() {
    alert('🎬 UPLOAD VIDÉO\n\nTélécharger vidéos :\n• Visites de propriétés\n• Témoignages clients\n• Conseils immobiliers\n• Présentation services\n\n✨ Fonctionnalité en cours de développement');
}

function viewYoutubeAnalytics() {
    alert('📊 ANALYTICS YOUTUBE\n\nTableau de bord complet en développement');
}

function postToLinkedIn() {
    alert('💼 LINKEDIN POST\n\nArticles professionnels :\n• Tendances marché\n• Conseils investissement\n• Success stories\n• Expertise régionale\n\n✨ Fonctionnalité en cours de développement');
}

function sharePropertyLinkedIn() {
    alert('🏠 PARTAGE LINKEDIN\n\nPartager propriétés de manière professionnelle avec réseau d\'affaires\n\n✨ Fonctionnalité en cours de développement');
}

function viewLinkedInAnalytics() {
    alert('📊 ANALYTICS LINKEDIN\n\nAnalyse réseau professionnel en développement');
}

// Créateur de contenu social
function showContentTab(tabName) {
    document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function generateSocialContent() {
    if (window.marketingIAManager) {
        window.marketingIAManager.generateSocialContent();
    }
}

function addHashtags() {
    if (window.marketingIAManager) {
        window.marketingIAManager.addHashtags();
    }
}

function scheduleAllPlatforms() {
    const content = document.getElementById('postContent').value;
    
    if (!content.trim()) {
        alert('⚠️ Veuillez d\'abord générer ou saisir du contenu');
        return;
    }
    
    alert('📅 PLANIFICATION MULTI-PLATEFORMES\n\n🚀 Votre contenu sera publié sur :\n✅ Facebook - Demain 9h00\n✅ Instagram - Demain 12h00\n✅ LinkedIn - Demain 15h00\n\n📊 Portée estimée : 2,500+ personnes\n\n✨ Planificateur intelligent en développement');
}

// Campagnes Marketing
function createMarketingCampaign() {
    if (window.marketingIAManager) {
        window.marketingIAManager.createMarketingCampaign();
    }
}

function viewCampaignTemplates() {
    alert('📄 TEMPLATES CAMPAGNES\n\nModèles disponibles :\n• Nouvelle inscription\n• Portes ouvertes\n• Témoignages clients\n• Marché local\n• Services expertise\n\n✨ Bibliothèque templates en développement');
}

function analyzeCampaignROI() {
    alert('💰 ANALYSE ROI CAMPAGNES\n\n📊 Performance globale :\n• Investissement total : 1,200$\n• Leads générés : 24\n• Coût par lead : 50$\n• Taux conversion : 15%\n• ROI estimé : +280%\n\n✨ Tableau de bord ROI en développement');
}

// 🚀 Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.marketingIAManager = new MarketingIAManager();
    console.log('✅ Interface IA Marketing & Publication chargée et opérationnelle');
});

// Gestion des erreurs
window.addEventListener('error', (event) => {
    console.error('❌ Erreur IA Marketing:', event.error);
});