// 📊 DASHBOARD CYNTHIA - JavaScript fonctionnel
// Gestion complète de l'espace de travail professionnel

class CynthiaDashboard {
    constructor() {
        this.stats = {
            totalForms: 0,
            totalVentes: 0,
            totalAchats: 0,
            totalEvaluations: 0
        };
        
        this.notifications = [];
        this.recentData = [];
        
        this.init();
    }

    async init() {
        console.log('📊 Initialisation Dashboard Cynthia...');
        
        // Chargement des données
        await this.loadDashboardData();
        
        // Mise à jour de l'interface
        this.updateStats();
        this.updateNotifications();
        this.updateDataTable();
        
        // Initialiser les contrôles ON/OFF
        this.setupSystemControls();
        
        // Auto-refresh toutes les 30 secondes
        setInterval(() => {
            this.loadDashboardData();
        }, 30000);
        
        console.log('✅ Dashboard Cynthia initialisé');
    }

    async loadDashboardData() {
        try {
            // Charger les notifications depuis localStorage
            const storedNotifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
            const storedFormData = JSON.parse(localStorage.getItem('cynthia_form_data') || '{}');
            
            // Analyser les données pour les stats
            this.analyzeStoredData(storedNotifications, storedFormData);
            
            // Charger données depuis les différentes sources
            await this.loadFromCynthiaAssistant();
            
        } catch (error) {
            console.warn('⚠️ Erreur chargement données dashboard:', error);
            this.addNotification('⚠️', 'Erreur chargement', 'Certaines données peuvent être indisponibles', 'warning');
        }
    }

    analyzeStoredData(notifications, formData) {
        // Compter les notifications par type
        let ventes = 0, achats = 0, evaluations = 0;
        
        notifications.forEach(notif => {
            if (notif.type === 'NEW_FORM') {
                this.stats.totalForms++;
                
                // Analyser le type de demande
                if (notif.data && notif.data.type) {
                    switch (notif.data.type) {
                        case 'vente':
                            ventes++;
                            break;
                        case 'achat':
                            achats++;
                            break;
                        case 'evaluation':
                            evaluations++;
                            break;
                    }
                }
            }
        });
        
        this.stats.totalVentes = ventes;
        this.stats.totalAchats = achats;
        this.stats.totalEvaluations = evaluations;
        
        // Ajouter données récentes à la table
        if (notifications.length > 0) {
            this.recentData = notifications.slice(0, 10).map(notif => ({
                date: new Date(notif.timestamp).toLocaleDateString('fr-CA'),
                type: this.getTypeLabel(notif.type),
                propriete: notif.data?.adresse || 'N/A',
                client: notif.data?.prop1Nom || 'Client anonyme',
                statut: 'Reçu'
            }));
        }
    }

    async loadFromCynthiaAssistant() {
        // Tenter de charger données depuis CYNTHIA_ASSISTANT si disponible
        try {
            const response = await fetch('http://localhost:8080/api/dashboard-data.json').catch(() => null);
            if (response && response.ok) {
                const assistantData = await response.json();
                this.mergeDashboardData(assistantData);
            }
        } catch (error) {
            console.log('ℹ️ CYNTHIA_ASSISTANT non connecté (normal)');
        }
    }

    mergeDashboardData(assistantData) {
        if (assistantData.stats) {
            this.stats.totalForms += assistantData.stats.forms || 0;
            this.stats.totalVentes += assistantData.stats.ventes || 0;
            this.stats.totalAchats += assistantData.stats.achats || 0;
            this.stats.totalEvaluations += assistantData.stats.evaluations || 0;
        }
        
        if (assistantData.recent && Array.isArray(assistantData.recent)) {
            this.recentData = [...assistantData.recent, ...this.recentData].slice(0, 10);
        }
    }

    getTypeLabel(type) {
        const labels = {
            'NEW_FORM': 'Formulaire',
            'VENTE': 'Vente',
            'ACHAT': 'Achat',
            'EVALUATION': 'Évaluation'
        };
        return labels[type] || type;
    }

    updateStats() {
        // Mettre à jour les compteurs
        document.getElementById('totalForms').textContent = this.stats.totalForms;
        document.getElementById('totalVentes').textContent = this.stats.totalVentes;
        document.getElementById('totalAchats').textContent = this.stats.totalAchats;
        document.getElementById('totalEvaluations').textContent = this.stats.totalEvaluations;
        
        console.log('📊 Stats mises à jour:', this.stats);
    }

    updateNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        
        // Garder la notification d'initialisation si c'est la première fois
        if (this.notifications.length === 0) {
            this.addNotification('✅', 'Dashboard opérationnel', 'Toutes les fonctionnalités sont disponibles', 'success');
            
            if (this.stats.totalForms > 0) {
                this.addNotification('📋', `${this.stats.totalForms} formulaire(s) détecté(s)`, 'Données chargées depuis le stockage local', 'info');
            }
        }
        
        // Générer HTML des notifications
        let notificationsHTML = '';
        this.notifications.forEach(notif => {
            const timeStr = this.getTimeString(notif.timestamp);
            notificationsHTML += `
                <div class="notification-item">
                    <div class="notification-icon">${notif.icon}</div>
                    <div class="notification-content">
                        <p><strong>${notif.title}</strong></p>
                        <small>${notif.message}</small>
                        <span class="notification-time">${timeStr}</span>
                    </div>
                </div>
            `;
        });
        
        notificationsList.innerHTML = notificationsHTML;
    }

    updateDataTable() {
        const tableBody = document.getElementById('dataTableBody');
        
        if (this.recentData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="no-data">Aucune donnée récente disponible</td></tr>';
            return;
        }
        
        let tableHTML = '';
        this.recentData.forEach(row => {
            tableHTML += `
                <tr>
                    <td>${row.date}</td>
                    <td>${row.type}</td>
                    <td>${row.propriete}</td>
                    <td>${row.client}</td>
                    <td><span class="status-badge status-received">${row.statut}</span></td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
    }

    addNotification(icon, title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            icon,
            title,
            message,
            type,
            timestamp: new Date()
        };
        
        this.notifications.unshift(notification);
        
        // Garder seulement les 20 dernières
        if (this.notifications.length > 20) {
            this.notifications = this.notifications.slice(0, 20);
        }
        
        this.updateNotifications();
    }

    getTimeString(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Maintenant';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} h`;
        return timestamp.toLocaleDateString('fr-CA');
    }

    // 🎛️ Configuration des contrôles système ON/OFF
    setupSystemControls() {
        console.log('⚙️ Initialisation contrôles système...');
        
        // Charger l'état des contrôles depuis localStorage
        const savedControls = JSON.parse(localStorage.getItem('cynthia_system_controls') || '{}');
        
        // Configuration par défaut
        const defaultControls = {
            aiAssistant: true,
            autoEmail: true,
            notifications: true,
            analytics: false,
            publicSite: false,
            autoSync: true
        };
        
        // Fusionner avec les paramètres sauvegardés
        this.systemControls = { ...defaultControls, ...savedControls };
        
        // Appliquer l'état aux switches
        Object.keys(this.systemControls).forEach(control => {
            const toggle = document.getElementById(`${control}Toggle`);
            if (toggle) {
                toggle.checked = this.systemControls[control];
                
                // Ajouter listener pour changements
                toggle.addEventListener('change', (e) => {
                    this.handleControlChange(control, e.target.checked);
                });
            }
        });
        
        console.log('✅ Contrôles système initialisés:', this.systemControls);
    }

    handleControlChange(controlName, enabled) {
        console.log(`🎛️ Contrôle ${controlName} ${enabled ? 'activé' : 'désactivé'}`);
        
        // Mettre à jour l'état local
        this.systemControls[controlName] = enabled;
        
        // Sauvegarder dans localStorage
        localStorage.setItem('cynthia_system_controls', JSON.stringify(this.systemControls));
        
        // Appliquer les changements selon le contrôle
        switch(controlName) {
            case 'aiAssistant':
                this.toggleAIAssistant(enabled);
                break;
            case 'autoEmail':
                this.toggleAutoEmail(enabled);
                break;
            case 'notifications':
                this.toggleNotifications(enabled);
                break;
            case 'analytics':
                this.toggleAnalytics(enabled);
                break;
            case 'publicSite':
                this.togglePublicSite(enabled);
                break;
            case 'autoSync':
                this.toggleAutoSync(enabled);
                break;
        }
        
        // Ajouter notification du changement
        this.addNotification(
            '⚙️', 
            `Contrôle ${controlName}`, 
            `${enabled ? 'Activé' : 'Désactivé'} avec succès`, 
            enabled ? 'success' : 'info'
        );
    }

    // Actions spécifiques pour chaque contrôle
    toggleAIAssistant(enabled) {
        if (enabled) {
            console.log('🤖 Assistant IA activé - Suggestions intelligentes disponibles');
        } else {
            console.log('🤖 Assistant IA désactivé - Mode manuel uniquement');
        }
    }

    toggleAutoEmail(enabled) {
        if (enabled) {
            console.log('📧 Emails automatiques activés - Confirmations auto');
        } else {
            console.log('📧 Emails automatiques désactivés - Envoi manuel requis');
        }
    }

    toggleNotifications(enabled) {
        if (enabled) {
            console.log('🔔 Notifications push activées');
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } else {
            console.log('🔔 Notifications push désactivées');
        }
    }

    toggleAnalytics(enabled) {
        if (enabled) {
            console.log('📊 Analytics avancées activées');
            this.addNotification('📊', 'Analytics avancées', 'Collecte de données détaillées démarrée', 'info');
        } else {
            console.log('📊 Analytics avancées désactivées');
        }
    }

    togglePublicSite(enabled) {
        if (enabled) {
            console.log('🌐 Site public activé');
            localStorage.setItem('cynthia_public_site_enabled', 'true');
        } else {
            console.log('🌐 Site public désactivé');
            localStorage.setItem('cynthia_public_site_enabled', 'false');
        }
    }

    toggleAutoSync(enabled) {
        if (enabled) {
            console.log('🔄 Synchronisation automatique activée');
        } else {
            console.log('🔄 Synchronisation automatique désactivée');
        }
    }
}

// 🚀 Fonctions globales pour les boutons

function refreshDashboard() {
    console.log('🔄 Actualisation dashboard...');
    
    // Afficher loading
    document.body.classList.add('loading');
    
    // Recharger les données
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.loadDashboardData().then(() => {
            window.cynthiaDashboard.updateStats();
            window.cynthiaDashboard.updateNotifications();
            window.cynthiaDashboard.updateDataTable();
            
            // Notification de succès
            window.cynthiaDashboard.addNotification('🔄', 'Dashboard actualisé', 'Toutes les données ont été rechargées', 'success');
            
            document.body.classList.remove('loading');
            console.log('✅ Dashboard actualisé');
        });
    }
}

function openPortal() {
    // Retourner au portail principal
    window.location.href = '../../portal/index.html';
}

function openFormulaire() {
    // Ouvrir CYNTHIA_ASSISTANT
    const formulaireUrl = 'http://localhost:8080';
    const newWindow = window.open(formulaireUrl, '_blank', 'width=1200,height=800');
    
    if (!newWindow) {
        alert('⚠️ Impossible d\'ouvrir le formulaire.\n\nAssurez-vous que CYNTHIA_ASSISTANT est démarré sur le port 8080.');
    } else {
        console.log('📝 Ouverture formulaire CYNTHIA_ASSISTANT');
        
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification('📝', 'Formulaire ouvert', 'CYNTHIA_ASSISTANT lancé dans un nouvel onglet', 'info');
        }
    }
}

function openCentris() {
    // Ouvrir Centris.ca
    const centrisUrl = 'https://www.centris.ca';
    window.open(centrisUrl, '_blank');
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🔗', 'Centris ouvert', 'Plateforme Centris.ca ouverte dans un nouvel onglet', 'info');
    }
    
    console.log('🔗 Ouverture Centris.ca');
}

function exportData() {
    console.log('📤 Export des données...');
    
    try {
        // Collecter toutes les données
        const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
        const formData = JSON.parse(localStorage.getItem('cynthia_form_data') || '{}');
        
        const exportData = {
            export_date: new Date().toISOString(),
            total_forms: window.cynthiaDashboard?.stats.totalForms || 0,
            notifications: notifications,
            recent_form: formData,
            dashboard_stats: window.cynthiaDashboard?.stats || {}
        };
        
        // Créer fichier JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Télécharger
        const a = document.createElement('a');
        a.href = url;
        a.download = `cynthia-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Notification
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification('📤', 'Export réussi', `Données exportées: ${exportData.total_forms} formulaires`, 'success');
        }
        
        console.log('✅ Export terminé');
        
    } catch (error) {
        console.error('❌ Erreur export:', error);
        alert('❌ Erreur lors de l\'export des données');
        
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification('❌', 'Erreur export', 'Impossible d\'exporter les données', 'error');
        }
    }
}

function manageClients() {
    // Gestion clients - pour l'instant afficher info
    const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
    const clientsCount = notifications.filter(n => n.type === 'NEW_FORM').length;
    
    alert(`👥 GESTION CLIENTS\n\nNombre de contacts: ${clientsCount}\n\nFonctionnalité en développement.\nPour l'instant, consultez les données dans le tableau ci-dessous.`);
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('👥', 'Gestion clients', `${clientsCount} contacts détectés`, 'info');
    }
    
    console.log('👥 Gestion clients - fonction appelée');
}

function openEmailIA() {
    // Ouvrir l'interface Email & IA
    console.log('🤖 Ouverture interface Email & IA...');
    window.location.href = 'email-ia.html';
}

function openMarketingIA() {
    // Ouvrir l'interface IA Marketing & Publication
    console.log('🌐 Ouverture interface IA Marketing & Publication...');
    window.location.href = 'marketing-ia.html';
}

// 🚀 Fonctions pour gestion des paramètres

// Navigation entre onglets de paramètres
function showSettingsTab(tabName) {
    console.log(`⚙️ Changement vers onglet: ${tabName}`);
    
    // Désactiver tous les onglets et contenus
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
    
    // Activer l'onglet sélectionné
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('⚙️', 'Paramètres', `Onglet ${tabName} ouvert`, 'info');
    }
}

// Gestion photo de profil
function changeProfilePhoto() {
    const fileInput = document.getElementById('photoUpload');
    fileInput.click();
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profilePhotoPreview').src = e.target.result;
                localStorage.setItem('cynthia_profile_photo', e.target.result);
                
                if (window.cynthiaDashboard) {
                    window.cynthiaDashboard.addNotification('📷', 'Photo mise à jour', 'Photo de profil changée avec succès', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
}

// Sauvegarder profil
function saveProfileSettings() {
    const profileData = {
        name: document.getElementById('profileName').value,
        title: document.getElementById('profileTitle').value,
        location: document.getElementById('profileLocation').value,
        phone: document.getElementById('profilePhone').value,
        email: document.getElementById('profileEmail').value,
        license: document.getElementById('profileLicense').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('cynthia_profile_data', JSON.stringify(profileData));
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('💾', 'Profil sauvegardé', 'Informations de profil mises à jour', 'success');
    }
    
    console.log('✅ Profil sauvegardé:', profileData);
}

// Gestion codes d'accès
function addNewAccessCode() {
    const newCode = prompt('Entrez le nouveau code d\'accès:');
    if (!newCode || newCode.trim().length < 4) {
        alert('⚠️ Le code doit contenir au moins 4 caractères');
        return;
    }
    
    const codesList = document.getElementById('accessCodesList');
    const newCodeElement = document.createElement('div');
    newCodeElement.className = 'code-item';
    newCodeElement.innerHTML = `
        <span class="code-value">${newCode.toUpperCase()}</span>
        <button onclick="removeAccessCode('${newCode.toUpperCase()}')" class="btn-remove-code">🗑️</button>
    `;
    
    codesList.appendChild(newCodeElement);
    
    // Sauvegarder dans localStorage
    const existingCodes = JSON.parse(localStorage.getItem('cynthia_access_codes') || '[]');
    existingCodes.push(newCode.toUpperCase());
    localStorage.setItem('cynthia_access_codes', JSON.stringify(existingCodes));
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🔑', 'Code ajouté', `Nouveau code d'accès: ${newCode.toUpperCase()}`, 'success');
    }
}

function removeAccessCode(code) {
    if (confirm(`Voulez-vous vraiment supprimer le code "${code}" ?`)) {
        const codeElement = document.querySelector(`[onclick="removeAccessCode('${code}')"]`).parentElement;
        codeElement.remove();
        
        // Supprimer du localStorage
        const existingCodes = JSON.parse(localStorage.getItem('cynthia_access_codes') || '[]');
        const updatedCodes = existingCodes.filter(c => c !== code);
        localStorage.setItem('cynthia_access_codes', JSON.stringify(updatedCodes));
        
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification('🗑️', 'Code supprimé', `Code ${code} retiré avec succès`, 'info');
        }
    }
}

// Changement mot de passe
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('⚠️ Veuillez remplir tous les champs');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('⚠️ Les nouveaux mots de passe ne correspondent pas');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('⚠️ Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // Simuler changement de mot de passe
    localStorage.setItem('cynthia_password_hash', btoa(newPassword)); // Simple base64 pour demo
    localStorage.setItem('cynthia_password_changed', new Date().toISOString());
    
    // Vider les champs
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🔐', 'Mot de passe changé', 'Mot de passe principal mis à jour avec succès', 'success');
    }
    
    alert('✅ Mot de passe changé avec succès !');
}

// 🔧 Fonctions accès technique à distance
function enableRemoteAccess() {
    const confirmed = confirm('⚠️ SÉCURITÉ\n\nVoulez-vous autoriser l\'accès technique à distance pour 30 minutes ?\n\nCeci permettra à l\'équipe technique d\'accéder temporairement à votre système pour assistance.');
    
    if (!confirmed) return;
    
    // Activer l'accès distant
    const accessStatus = document.getElementById('remoteAccessStatus');
    const statusIndicator = accessStatus.querySelector('.status-indicator');
    const statusText = accessStatus.querySelector('.status-text');
    const enableBtn = document.getElementById('enableRemoteBtn');
    const disableBtn = document.getElementById('disableRemoteBtn');
    
    // Changer l'interface
    statusIndicator.innerHTML = '🟢';
    statusIndicator.className = 'status-indicator online';
    statusText.textContent = 'Accès technique ACTIVÉ (expire dans 30 min)';
    accessStatus.classList.add('active');
    
    enableBtn.style.display = 'none';
    disableBtn.style.display = 'inline-block';
    
    // Sauvegarder l'état
    const accessData = {
        enabled: true,
        enabledAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };
    localStorage.setItem('cynthia_remote_access', JSON.stringify(accessData));
    
    // Timer de désactivation automatique
    setTimeout(() => {
        disableRemoteAccess();
        alert('⏰ L\'accès technique à distance a expiré automatiquement après 30 minutes.');
    }, 30 * 60 * 1000);
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🔧', 'Accès technique activé', 'Équipe technique autorisée pour 30 minutes', 'info');
    }
    
    console.log('🔧 Accès technique à distance activé');
}

function disableRemoteAccess() {
    // Désactiver l'accès distant
    const accessStatus = document.getElementById('remoteAccessStatus');
    const statusIndicator = accessStatus.querySelector('.status-indicator');
    const statusText = accessStatus.querySelector('.status-text');
    const enableBtn = document.getElementById('enableRemoteBtn');
    const disableBtn = document.getElementById('disableRemoteBtn');
    const supportInfo = document.getElementById('supportInfo');
    
    // Changer l'interface
    statusIndicator.innerHTML = '🔴';
    statusIndicator.className = 'status-indicator offline';
    statusText.textContent = 'Accès technique désactivé';
    accessStatus.classList.remove('active');
    
    enableBtn.style.display = 'inline-block';
    disableBtn.style.display = 'none';
    supportInfo.style.display = 'none';
    
    // Supprimer l'état sauvegardé
    localStorage.removeItem('cynthia_remote_access');
    localStorage.removeItem('cynthia_support_code');
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('❌', 'Accès technique désactivé', 'Connexion à distance fermée', 'info');
    }
    
    console.log('❌ Accès technique à distance désactivé');
}

function generateSupportCode() {
    // Générer un code de support aléatoire
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let supportCode = 'SUPPORT-';
    
    for (let i = 0; i < codeLength; i++) {
        supportCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Afficher le code
    const supportInfo = document.getElementById('supportInfo');
    const supportCodeDisplay = document.getElementById('supportCodeDisplay');
    
    supportCodeDisplay.textContent = supportCode;
    supportInfo.style.display = 'block';
    
    // Sauvegarder le code
    const codeData = {
        code: supportCode,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 heures
    };
    localStorage.setItem('cynthia_support_code', JSON.stringify(codeData));
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🔑', 'Code généré', `Code support: ${supportCode}`, 'success');
    }
    
    console.log('🔑 Code support généré:', supportCode);
}

function copySupportCode() {
    const supportCode = document.getElementById('supportCodeDisplay').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(supportCode).then(() => {
            alert('📋 Code copié dans le presse-papiers !');
            
            if (window.cynthiaDashboard) {
                window.cynthiaDashboard.addNotification('📋', 'Code copié', 'Code support copié avec succès', 'success');
            }
        });
    } else {
        // Fallback pour navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = supportCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('📋 Code copié dans le presse-papiers !');
    }
}

// Sauvegarder préférences
function savePreferences() {
    const preferences = {
        theme: document.getElementById('themeSelect').value,
        accentColor: document.querySelector('.color-option.active').dataset.color,
        emailNotifications: document.getElementById('emailNotifications').checked,
        soundNotifications: document.getElementById('soundNotifications').checked,
        desktopNotifications: document.getElementById('desktopNotifications').checked,
        serviceSectors: document.getElementById('serviceSectors').value,
        emailSignature: document.getElementById('emailSignature').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('cynthia_preferences', JSON.stringify(preferences));
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('🎨', 'Préférences sauvegardées', 'Configuration mise à jour avec succès', 'success');
    }
    
    console.log('✅ Préférences sauvegardées:', preferences);
}

// Gestion sauvegarde
function createBackup() {
    try {
        const backupData = {
            created: new Date().toISOString(),
            version: '1.0',
            profile: JSON.parse(localStorage.getItem('cynthia_profile_data') || '{}'),
            preferences: JSON.parse(localStorage.getItem('cynthia_preferences') || '{}'),
            systemControls: JSON.parse(localStorage.getItem('cynthia_system_controls') || '{}'),
            notifications: JSON.parse(localStorage.getItem('cynthia_notifications') || '[]'),
            formData: JSON.parse(localStorage.getItem('cynthia_form_data') || '{}'),
            accessCodes: JSON.parse(localStorage.getItem('cynthia_access_codes') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cynthia-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Mettre à jour l'affichage
        document.getElementById('lastBackupTime').textContent = new Date().toLocaleString('fr-CA');
        
        if (window.cynthiaDashboard) {
            window.cynthiaDashboard.addNotification('📤', 'Sauvegarde créée', 'Backup complet téléchargé avec succès', 'success');
        }
        
        alert('✅ Sauvegarde créée avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
        alert('❌ Erreur lors de la création de la sauvegarde');
    }
}

function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (confirm('⚠️ ATTENTION\n\nCeci remplacera toutes vos données actuelles par celles de la sauvegarde.\n\nContinuer ?')) {
                    // Restaurer les données
                    if (backupData.profile) localStorage.setItem('cynthia_profile_data', JSON.stringify(backupData.profile));
                    if (backupData.preferences) localStorage.setItem('cynthia_preferences', JSON.stringify(backupData.preferences));
                    if (backupData.systemControls) localStorage.setItem('cynthia_system_controls', JSON.stringify(backupData.systemControls));
                    if (backupData.notifications) localStorage.setItem('cynthia_notifications', JSON.stringify(backupData.notifications));
                    if (backupData.formData) localStorage.setItem('cynthia_form_data', JSON.stringify(backupData.formData));
                    if (backupData.accessCodes) localStorage.setItem('cynthia_access_codes', JSON.stringify(backupData.accessCodes));
                    
                    alert('✅ Sauvegarde restaurée !\n\nLa page va se recharger pour appliquer les changements.');
                    setTimeout(() => location.reload(), 1000);
                }
                
            } catch (error) {
                console.error('❌ Erreur restauration:', error);
                alert('❌ Fichier de sauvegarde invalide');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function clearAllData() {
    const confirmed = confirm('⚠️ DANGER\n\nCeci supprimera définitivement TOUTES vos données :\n• Profil et préférences\n• Historique des formulaires\n• Codes d\'accès\n• Notifications\n\nCette action est IRRÉVERSIBLE !\n\nTapez "SUPPRIMER" pour confirmer :');
    
    if (confirmed) {
        const confirmation = prompt('Tapez "SUPPRIMER" en majuscules pour confirmer :');
        if (confirmation === 'SUPPRIMER') {
            // Supprimer toutes les données Cynthia
            const keys = Object.keys(localStorage).filter(key => key.startsWith('cynthia_'));
            keys.forEach(key => localStorage.removeItem(key));
            
            alert('✅ Toutes les données ont été supprimées.\n\nLa page va se recharger.');
            setTimeout(() => location.reload(), 1000);
        } else {
            alert('❌ Suppression annulée - confirmation incorrecte');
        }
    }
}

// Calculer taille des données
function updateDataSize() {
    let totalSize = 0;
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cynthia_')) {
            totalSize += localStorage.getItem(key).length;
        }
    });
    
    const sizeKB = Math.round(totalSize / 1024 * 100) / 100;
    document.getElementById('dataSize').textContent = `${sizeKB} KB`;
}

// 🚀 Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.cynthiaDashboard = new CynthiaDashboard();
    
    // Gestion des couleurs d'accent dans les préférences
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Calculer la taille des données au chargement
    setTimeout(updateDataSize, 1000);
    
    console.log('✅ Dashboard Cynthia chargé et opérationnel');
});

// 🔄 Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur dashboard:', event.error);
    
    if (window.cynthiaDashboard) {
        window.cynthiaDashboard.addNotification('❌', 'Erreur système', 'Une erreur s\'est produite dans le dashboard', 'error');
    }
});