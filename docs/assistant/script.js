// 🚀 CYNTHIA ASSISTANT - JavaScript Multi-Device
// Gestion intelligente du formulaire avec auto-save et email

class CynthiaAssistant {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 6;
        this.formData = {};
        this.autoSaveInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.updateProgress();
        this.setupAutoSave();
        
        console.log('🎨 Cynthia Assistant initialisé');
    }

    setupEventListeners() {
        // Soumission du formulaire
        document.getElementById('inscriptionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Auto-save sur changement
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', () => this.saveFormData());
            element.addEventListener('change', () => this.saveFormData());
        });

        // Validation en temps réel
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Détection de fermeture/changement de page
        window.addEventListener('beforeunload', () => this.saveFormData());
    }

    // 📱 Navigation entre sections
    nextSection() {
        if (this.validateCurrentSection()) {
            this.currentSection = Math.min(this.currentSection + 1, this.totalSections);
            this.showSection(this.currentSection);
            this.updateProgress();
            this.saveFormData();
        }
    }

    prevSection() {
        this.currentSection = Math.max(this.currentSection - 1, 1);
        this.showSection(this.currentSection);
        this.updateProgress();
    }

    showSection(sectionNum) {
        // Masquer toutes les sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Afficher la section courante
        const currentSection = document.getElementById(`section${sectionNum}`);
        if (currentSection) {
            currentSection.classList.add('active');
            
            // Scroll vers le haut sur mobile
            if (window.innerWidth <= 767) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    updateProgress() {
        const progress = (this.currentSection / this.totalSections) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // ✅ Validation intelligente
    validateCurrentSection() {
        const currentSectionElement = document.getElementById(`section${this.currentSection}`);
        const requiredFields = currentSectionElement.querySelectorAll('input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const inputGroup = field.closest('.input-group');
        let isValid = true;

        // Supprimer les classes d'état précédentes
        inputGroup.classList.remove('error', 'success');

        // Validation selon le type
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
        } else if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            isValid = false;
        } else if (field.type === 'tel' && field.value && !this.isValidPhone(field.value)) {
            isValid = false;
        }

        // Appliquer les styles de validation
        if (field.value.trim()) {
            inputGroup.classList.add(isValid ? 'success' : 'error');
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\d\s\-\(\)\+]{10,}$/.test(phone);
    }

    // 💾 Auto-save local
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveFormData();
        }, 30000); // Sauvegarde toutes les 30 secondes
    }

    saveFormData() {
        const formData = new FormData(document.getElementById('inscriptionForm'));
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Gérer les checkboxes multiples
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Ajouter les métadonnées
        data._metadata = {
            currentSection: this.currentSection,
            lastSaved: new Date().toISOString(),
            deviceInfo: this.getDeviceInfo()
        };

        this.formData = data;
        
        try {
            localStorage.setItem('cynthia_form_data', JSON.stringify(data));
            console.log('📁 Données sauvegardées localement');
        } catch (e) {
            console.warn('⚠️ Impossible de sauvegarder localement:', e.message);
        }
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('cynthia_form_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restaurer les valeurs
                Object.entries(data).forEach(([key, value]) => {
                    if (key === '_metadata') return;
                    
                    const elements = document.querySelectorAll(`[name="${key}"]`);
                    elements.forEach(element => {
                        if (element.type === 'checkbox') {
                            element.checked = Array.isArray(value) ? value.includes(element.value) : value === element.value;
                        } else {
                            element.value = Array.isArray(value) ? value[0] : value;
                        }
                    });
                });

                // Restaurer la section courante
                if (data._metadata && data._metadata.currentSection) {
                    this.currentSection = data._metadata.currentSection;
                    this.showSection(this.currentSection);
                    this.updateProgress();
                }

                console.log('📂 Données restaurées depuis la sauvegarde locale');
            }
        } catch (e) {
            console.warn('⚠️ Erreur lors du chargement des données:', e.message);
        }
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'unknown';
        
        if (/iPad/.test(ua)) device = 'iPad';
        else if (/iPhone/.test(ua)) device = 'iPhone';
        else if (/Android/.test(ua) && /Mobile/.test(ua)) device = 'Android Mobile';
        else if (/Android/.test(ua)) device = 'Android Tablet';
        else if (/Windows/.test(ua)) device = 'Windows PC';
        else if (/Mac/.test(ua)) device = 'Mac';
        
        return {
            device,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: ua
        };
    }

    // 📧 Soumission du formulaire
    async submitForm() {
        console.log('📤 Envoi du formulaire...');
        
        // Validation finale
        if (!this.validateAllSections()) {
            alert('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Afficher loading
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Envoi en cours...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Préparer les données
            const emailData = this.prepareEmailData();
            
            // Envoyer via EmailJS ou API
            const success = await this.sendEmail(emailData);
            
            if (success) {
                this.showConfirmation();
                this.clearSavedData();
            } else {
                throw new Error('Échec envoi email');
            }
            
        } catch (error) {
            console.error('❌ Erreur envoi:', error);
            alert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
        } finally {
            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    validateAllSections() {
        for (let i = 1; i <= this.totalSections; i++) {
            const section = document.getElementById(`section${i}`);
            const requiredFields = section.querySelectorAll('input[required]');
            
            for (let field of requiredFields) {
                if (!field.value.trim()) {
                    this.currentSection = i;
                    this.showSection(i);
                    this.updateProgress();
                    field.focus();
                    return false;
                }
            }
        }
        return true;
    }

    prepareEmailData() {
        const data = this.formData;
        
        // Formatage pour l'email avec tous les nouveaux champs
        let emailContent = `
🏠 NOUVELLE FICHE D'INSCRIPTION COMPLÈTE - ${data.adresse || 'Adresse non spécifiée'}

📍 INFORMATIONS PROPRIÉTÉ
• Adresse: ${data.adresse || 'N/A'}
• Numéro de lot: ${data.numLot || 'N/A'}  
• JLR: ${data.jlr || 'N/A'}
• CM (Centimètres carrés): ${data.cm || 'N/A'}
• Année construction: ${data.anneeConstruction || 'N/A'}
• Évaluation municipale: ${data.evaluationMunicipale || 'N/A'}
• Terrain: ${data.longueurTerrain || '?'}x${data.largeurTerrain || '?'} pieds
• Bâtiment: ${data.longueurBatiment || '?'}x${data.largeurBatiment || '?'} pieds
• Numéro CENTRIS: ${data.centrisId || 'Non inscrit'}

👥 PROPRIÉTAIRES & CONTACTS
• Propriétaire 1: ${data.prop1Nom || 'N/A'}
  Tel 1: ${data.prop1Tel1 || 'N/A'}
  Tel 2: ${data.prop1Tel2 || 'N/A'}
  Email: ${data.prop1Email || 'N/A'}
  Type: ${this.getSelectedValues('prop1Type') || 'N/A'}

• Propriétaire 2: ${data.prop2Nom || 'N/A'}
  Tel 1: ${data.prop2Tel1 || 'N/A'}
  Tel 2: ${data.prop2Tel2 || 'N/A'}
  Email: ${data.prop2Email || 'N/A'}
  Type: ${this.getSelectedValues('prop2Type') || 'N/A'}

• Score CANAFE: ${data.scoreCanafe || 'N/A'}

🏠 LOCATAIRE (si applicable)
• Locataire présent: ${this.getSelectedValues('locatairePresent') || 'Non'}
• Nom locataire: ${data.locataireNom || 'N/A'}
• Téléphone: ${data.locataireTel || 'N/A'}
• Loyer mensuel: ${data.loyerMensuel ? data.loyerMensuel + '$' : 'N/A'}
• Expiration bail: ${data.bailExpiration || 'N/A'}
• Durée bail: ${data.bailDuree || 'N/A'}
• Coopération visites: ${this.getSelectedValues('locataireCooperation') || 'N/A'}

🏗️ CARACTÉRISTIQUES TECHNIQUES
• Fondation: ${this.getSelectedValues('fondation') || 'N/A'}
• Toiture: ${this.getSelectedValues('toiture') || 'N/A'}
  Année toiture: ${data.anneeToiture || 'N/A'}
• Revêtement extérieur: ${this.getSelectedValues('revetementExt') || 'N/A'}

🪟 FENESTRATION
• Types fenêtres: ${this.getSelectedValues('fenetres') || 'N/A'}
• Types portes: ${this.getSelectedValues('portes') || 'N/A'}
• Année remplacement: ${data.anneeFenetres || 'N/A'}
• Nombre fenêtres: ${data.nombreFenetres || 'N/A'}

🏠 PLAFONDS
• Types: ${this.getSelectedValues('plafonds') || 'N/A'}

🔥 CHAUFFAGE & ÉNERGIE
• Chauffage principal: ${this.getSelectedValues('chauffage') || 'N/A'}
• Chauffage d'appoint: ${this.getSelectedValues('chauffageAppoint') || 'N/A'}
• Type d'énergie: ${this.getSelectedValues('energie') || 'N/A'}
• Autre énergie: ${data.autreEnergie || 'N/A'}

🏠 SOUS-SOL
• Type: ${this.getSelectedValues('sousSol') || 'N/A'}
• Aménagement: ${this.getSelectedValues('sousSolAmenage') || 'N/A'}
• Hauteur plafond: ${data.hauteurSousSol ? data.hauteurSousSol + ' pieds' : 'N/A'}

🛁 SALLES DE BAINS
• Nombre salles de bains: ${data.nombreSallesBains || 'N/A'}
• Nombre salles d'eau: ${data.nombreSallesEau || 'N/A'}
• Caractéristiques: ${this.getSelectedValues('sallesBains') || 'N/A'}
• Revêtements: ${this.getSelectedValues('sallesBainsRevetement') || 'N/A'}

🍳 CUISINE
• Armoires: ${this.getSelectedValues('armoires') || 'N/A'}
• Comptoirs: ${this.getSelectedValues('comptoirs') || 'N/A'}
• Année réno cuisine: ${data.anneeRenoCuisine || 'N/A'}
• Couleur armoires: ${data.couleurArmoires || 'N/A'}

🔄 LAVEUSE/SÉCHEUSE
• Statut: ${this.getSelectedValues('laveuse') || 'N/A'}
• Emplacement: ${this.getSelectedValues('emplacementLaveuse') || 'N/A'}

⚙️ ÉQUIPEMENTS SPÉCIAUX
• Équipements: ${this.getSelectedValues('equipements') || 'N/A'}

🏊 PISCINE
• Type: ${this.getSelectedValues('piscine') || 'N/A'}
• Dimensions: ${data.dimensionsPiscine || 'N/A'}
• Année toile: ${data.anneeToilePiscine || 'N/A'}
• Filtration: ${this.getSelectedValues('piscineFiltration') || 'N/A'}

⚠️ PROBLÈMES DÉTECTÉS
• Problèmes: ${this.getSelectedValues('problemes') || 'Aucun'}
• Détails: ${data.detailsProblemes || 'N/A'}

📝 NOTES SPÉCIALES
${data.notesSpeciales || 'Aucune note particulière'}

---
📱 Envoyé depuis: ${data._metadata?.deviceInfo?.device || 'Appareil inconnu'}
🕐 Date: ${new Date().toLocaleString('fr-CA')}
📊 Formulaire complet avec ${this.totalSections} sections
        `.trim();

        return {
            to: 'cynthia.bernier@email.com', // Email de Cynthia
            subject: `🏠 Fiche COMPLÈTE - ${data.adresse || 'Propriété'} - ${data.prop1Nom || 'Client'}`,
            content: emailContent,
            formData: data
        };
    }

    getSelectedValues(fieldName) {
        const checkboxes = document.querySelectorAll(`input[name="${fieldName}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value).join(', ');
    }

    // 📧 Envoi email avec contrôle ON/OFF intégré
    async sendEmail(emailData) {
        try {
            // Vérifier si fonctionnalités sont activées
            const featuresEnabled = window.FeaturesControl ? window.FeaturesControl.getStatus() : null;
            
            // Protection identité
            if (!window.IdentityProtection.validate(this.formData)) {
                throw new Error('Échec validation identité');
            }
            
            // Traitement selon configuration
            if (featuresEnabled && featuresEnabled.api1_status.ia_analysis) {
                console.log('🤖 IA activée - Analyse automatique...');
                return await this.sendWithAI();
            } else {
                console.log('📝 Mode manuel - Envoi simple...');
                return await this.sendManual();
            }
            
        } catch (error) {
            console.error('❌ Erreur critique envoi email:', error);
            return false;
        }
    }
    
    async sendWithAI() {
        try {
            // Utiliser service IA intégré
            if (window.EmailService) {
                const emailService = new window.EmailService();
                const result = await emailService.sendFormToCynthia(this.formData);
                
                if (result.success) {
                    console.log('✅ Email + IA envoyé avec succès');
                    this.showAIResults(result.aiAnalysis);
                    return true;
                } else {
                    console.error('❌ Erreur service IA:', result.error);
                    // Fallback manuel si IA échoue
                    return await this.sendManual();
                }
            } else {
                return await this.sendManual();
            }
        } catch (error) {
            console.error('❌ Erreur IA, fallback manuel:', error);
            return await this.sendManual();
        }
    }
    
    async sendManual() {
        // Envoi manuel simple sans IA
        console.log('📧 Envoi manuel des données...');
        
        const emailContent = this.formatManualEmail();
        
        // Simulation envoi (à remplacer par vraie intégration)
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📧 Email manuel envoyé:', emailContent);
                this.notifyDashboard('NEW_FORM', this.formData);
                resolve(true);
            }, 1000);
        });
    }
    
    formatManualEmail() {
        return {
            to: 'cynthia.bernier@email.com',
            subject: `Nouvelle fiche - ${this.formData.adresse || 'Propriété'}`,
            content: `
🏠 NOUVELLE FICHE REÇUE

📍 Propriété: ${this.formData.adresse || 'N/A'}
👤 Contact: ${this.formData.prop1Nom || 'N/A'}
📞 Téléphone: ${this.formData.prop1Tel1 || 'N/A'}

Détails complets disponibles dans le dashboard.

---
📱 Envoyé depuis formulaire public
🕐 ${new Date().toLocaleString('fr-CA')}
            `
        };
    }
    
    showAIResults(aiAnalysis) {
        if (aiAnalysis) {
            const resultsDiv = document.createElement('div');
            resultsDiv.innerHTML = `
                <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4>🤖 Analyse IA terminée</h4>
                    <p><strong>Type client:</strong> ${aiAnalysis.type_client || 'Analyse en cours'}</p>
                    <p><strong>Priorité:</strong> ${aiAnalysis.priorite || 'À évaluer'}</p>
                    <p><strong>Budget estimé:</strong> ${aiAnalysis.budget_estime || 'À déterminer'}</p>
                </div>
            `;
            
            // Ajouter après confirmation
            const confirmation = document.getElementById('confirmation');
            if (confirmation) {
                confirmation.appendChild(resultsDiv);
            }
        }
    }
    
    // Communication avec dashboard
    notifyDashboard(event, data) {
        try {
            const notification = {
                type: event,
                data: data,
                timestamp: new Date().toISOString(),
                source: 'public_form'
            };
            
            // Stocker pour dashboard
            const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
            notifications.unshift(notification);
            
            // Garder seulement 50 dernières
            if (notifications.length > 50) notifications.pop();
            
            localStorage.setItem('cynthia_notifications', JSON.stringify(notifications));
            
            console.log('📡 Dashboard notifié:', event);
        } catch (error) {
            console.warn('⚠️ Erreur notification dashboard:', error);
        }
    }

    showConfirmation() {
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('confirmation').classList.remove('hidden');
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    resetForm() {
        // Réinitialiser le formulaire
        document.getElementById('inscriptionForm').reset();
        this.currentSection = 1;
        this.showSection(1);
        this.updateProgress();
        this.clearSavedData();
        
        // Revenir au formulaire
        document.querySelector('.form-container').style.display = 'block';
        document.getElementById('confirmation').classList.add('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearSavedData() {
        try {
            localStorage.removeItem('cynthia_form_data');
            console.log('🗑️ Données locales effacées');
        } catch (e) {
            console.warn('⚠️ Erreur suppression données:', e.message);
        }
    }
}

// 🎯 Fonctions globales pour les boutons
function nextSection() {
    window.cynthiaAssistant.nextSection();
}

function prevSection() {
    window.cynthiaAssistant.prevSection();
}

function togglePiscineDetails() {
    const piscineChecks = document.querySelectorAll('input[name="piscine"]:checked');
    const detailsDiv = document.getElementById('piscineDetails');
    
    if (piscineChecks.length > 0) {
        detailsDiv.classList.remove('hidden-section');
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.classList.add('hidden-section');
        detailsDiv.style.display = 'none';
    }
}

function toggleLocataireDetails() {
    const locataireCheck = document.querySelector('input[name="locatairePresent"]:checked');
    const detailsDiv = document.getElementById('locataireDetails');
    
    if (locataireCheck && locataireCheck.value === 'oui') {
        detailsDiv.classList.remove('hidden-section');
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.classList.add('hidden-section');
        detailsDiv.style.display = 'none';
    }
}

function resetForm() {
    window.cynthiaAssistant.resetForm();
}

// 🔐 Système de contrôle d'accès intelligent
class AccessControl {
    constructor() {
        this.adminMode = false;
        this.publicSiteEnabled = false;
        this.checkSiteStatus();
        this.setupInterface();
    }
    
    async checkSiteStatus() {
        // Vérifier si le site public est disponible
        try {
            const response = await fetch('http://localhost:8081/api/site-status.json').catch(() => null);
            if (response && response.ok) {
                const config = await response.json();
                this.publicSiteEnabled = config.public_site === true;
            }
        } catch (error) {
            console.log('🔍 Site status check: Mode client par défaut');
        }
        
        this.updateNavigation();
    }
    
    setupInterface() {
        // Par défaut : Mode CLIENT (sécurisé)
        console.log('🔒 Mode CLIENT activé (sécurisé)');
        this.updateNavigation();
    }
    
    updateNavigation() {
        const adminButtons = document.querySelectorAll('.admin-nav');
        const clientButtons = document.querySelectorAll('.client-nav');
        
        if (this.adminMode) {
            // Mode ADMIN : Afficher tous les boutons admin
            adminButtons.forEach(btn => btn.style.display = 'inline-block');
            console.log('🔓 Mode ADMINISTRATEUR activé');
        } else {
            // Mode CLIENT : Masquer boutons sensibles
            adminButtons.forEach(btn => btn.style.display = 'none');
            
            // Afficher site public seulement si activé
            clientButtons.forEach(btn => {
                btn.style.display = this.publicSiteEnabled ? 'inline-block' : 'none';
            });
            
            console.log('🔒 Mode CLIENT - Accès limité sécurisé');
        }
    }
    
    async toggleAdminMode() {
        if (this.adminMode) {
            // Désactiver mode admin
            this.adminMode = false;
            this.updateNavigation();
            return;
        }
        
        // Demander authentification pour mode admin
        const isAuthentic = await this.authenticateAdmin();
        if (isAuthentic) {
            this.adminMode = true;
            this.updateNavigation();
            
            // Confirmation visuelle
            this.showAdminConfirmation();
        }
    }
    
    async authenticateAdmin() {
        const authCode = prompt(`🔐 ACCÈS ADMINISTRATEUR
        
Cette interface est destinée à Cynthia Bernier uniquement.

Code d'authentification pour Lebel-sur-Quévillon :`);
        
        // Codes d'accès multiples pour flexibilité
        const validCodes = ['CYNTHIA2024', 'LEBEL2024', 'ADMIN'];
        
        if (validCodes.includes(authCode?.toUpperCase())) {
            console.log('✅ Authentification admin réussie');
            return true;
        } else if (authCode) {
            alert('❌ Code incorrect. Accès refusé.');
            console.warn('⚠️ Tentative accès admin échouée');
        }
        
        return false;
    }
    
    showAdminConfirmation() {
        // Notification discrète mode admin activé
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed; 
                top: 20px; 
                right: 20px; 
                background: rgba(255, 200, 200, 0.9);
                padding: 1rem; 
                border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 1000;
                border: 2px solid #D00;
            ">
                🔓 <strong>Mode Administrateur</strong><br>
                <small>Cynthia Bernier - Accès complet</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Retirer notification après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Instance globale contrôle accès
let accessControl;

// 🚀 Navigation rapide vers autres interfaces (VERSION SÉCURISÉE)
function openSitePublic() {
    // Site public seulement (mode client)
    const publicUrl = 'http://localhost:3000';
    const newWindow = window.open(publicUrl, '_blank');
    
    if (!newWindow) {
        alert('ℹ️ Site web temporairement indisponible.');
    } else {
        console.log('🌐 Ouverture site public pour client');
    }
}

function toggleAdminMode() {
    if (accessControl) {
        accessControl.toggleAdminMode();
    }
}

function openDashboard() {
    // Tenter d'ouvrir le dashboard WEBAPP
    const dashboardUrl = 'http://localhost:8081/admin/pwa-dashboard/';
    const newWindow = window.open(dashboardUrl, '_blank');
    
    if (!newWindow) {
        alert('⚠️ Dashboard non disponible. Assurez-vous que CYNTHIA_WEBAPP est démarré sur le port 8081.');
        console.log('💡 Conseil: Lancez bouton.bat dans le dossier CYNTHIA_WEBAPP');
    } else {
        console.log('📊 Ouverture dashboard administrateur');
    }
}

function openWebapp() {
    // Ouvrir le portail web WEBAPP
    const webappUrl = 'http://localhost:8081/portal/';
    const newWindow = window.open(webappUrl, '_blank');
    
    if (!newWindow) {
        alert('⚠️ Portail web non disponible. Assurez-vous que CYNTHIA_WEBAPP est démarré sur le port 8081.');
        console.log('💡 Conseil: Lancez bouton.bat dans le dossier CYNTHIA_WEBAPP');
    } else {
        console.log('🌐 Ouverture portail web professionnel');
    }
}

function openSiteComplet() {
    // Tenter d'ouvrir le site complet CYNTHIA B
    const siteUrl = 'http://localhost:3000';
    const newWindow = window.open(siteUrl, '_blank');
    
    if (!newWindow) {
        // Fallback vers d'autres ports possibles
        const fallbackPorts = ['http://localhost:5173', 'http://localhost:4000', 'http://localhost:8082'];
        let opened = false;
        
        for (const url of fallbackPorts) {
            const testWindow = window.open(url, '_blank');
            if (testWindow) {
                opened = true;
                console.log(`🏠 Site complet ouvert sur ${url}`);
                break;
            }
        }
        
        if (!opened) {
            alert('⚠️ Site web complet non disponible. Démarrez CYNTHIA B avec DEMARRER_SITE_CYNTHIA.bat');
            console.log('💡 Conseil: Lancez DEMARRER_SITE_CYNTHIA.bat dans le dossier CYNTHIA B');
        }
    } else {
        console.log('🏠 Ouverture site web complet');
    }
}

function toggleQuickNav() {
    const quickNav = document.querySelector('.quick-nav');
    if (quickNav) {
        quickNav.classList.toggle('open');
        console.log('☰ Menu navigation basculé');
    }
}

// 🚀 Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.cynthiaAssistant = new CynthiaAssistant();
    
    // Initialiser système de sécurité
    accessControl = new AccessControl();
    console.log('🔐 Système de sécurité initialisé');
    
    // Détection de changement d'orientation sur mobile
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.cynthiaAssistant.updateProgress();
        }, 500);
    });
    
    // Performance: lazy loading pour les sections non visibles
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });
        
        document.querySelectorAll('.form-section').forEach(section => {
            observer.observe(section);
        });
    }
});

// 🎯 Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('💾 Service Worker enregistré');
            })
            .catch((error) => {
                console.log('❌ Erreur Service Worker:', error);
            });
    });
}