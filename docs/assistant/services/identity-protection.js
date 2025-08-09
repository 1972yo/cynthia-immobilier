// 🛡️ PROTECTION IDENTITÉ - Anti-confusion Cynthia Bernier
// Empêche les données de partir vers la mauvaise Cynthia Bernier

class IdentityProtection {
    constructor() {
        this.authenticCynthia = {
            nom: 'Cynthia Bernier',
            ville: 'Lebel-sur-Quévillon',
            region: 'Nord-du-Québec',
            license_oaciq: true,
            territory: ['Lebel-sur-Quévillon', 'Matagami', 'Chibougamau', 'Chapais']
        };
        
        this.restrictions = {
            blocked_cities: ['Montréal', 'Laval', 'Longueuil', 'Québec City'],
            suspicious_patterns: ['montreal', 'laval', 'longueuil', 'quebec'],
            max_distance_km: 500 // Distance max depuis Lebel-sur-Quévillon
        };
        
        console.log('🛡️ Protection identité activée pour Cynthia - Lebel-sur-Quévillon');
    }
    
    validate(formData) {
        try {
            console.log('🔍 Validation identité en cours...');
            
            // Vérification 1: Ville suspecte
            if (this.checkSuspiciousLocation(formData)) {
                return false;
            }
            
            // Vérification 2: Patterns suspects dans les données
            if (this.checkSuspiciousPatterns(formData)) {
                return false;
            }
            
            // Vérification 3: Territoire de service
            if (this.checkServiceTerritory(formData)) {
                return false;
            }
            
            console.log('✅ Validation identité: APPROUVÉE');
            return true;
            
        } catch (error) {
            console.error('❌ Erreur validation identité:', error);
            // En cas d'erreur, on bloque par sécurité
            this.blockAccess('Erreur technique de validation');
            return false;
        }
    }
    
    checkSuspiciousLocation(data) {
        const adresse = (data.adresse || '').toLowerCase();
        
        for (let city of this.restrictions.blocked_cities) {
            if (adresse.includes(city.toLowerCase())) {
                this.blockAccess(`Propriété détectée à ${city} - Redirection requise vers courtier local`);
                return true;
            }
        }
        
        return false;
    }
    
    checkSuspiciousPatterns(data) {
        const allText = Object.values(data).join(' ').toLowerCase();
        
        for (let pattern of this.restrictions.suspicious_patterns) {
            if (allText.includes(pattern)) {
                console.warn(`⚠️ Pattern suspect détecté: ${pattern}`);
                // Log mais ne bloque pas automatiquement
                this.logSuspiciousActivity(pattern, data);
                return false; // Pour l'instant on ne bloque pas sur les patterns
            }
        }
        
        return false;
    }
    
    checkServiceTerritory(data) {
        // Vérification basique - peut être améliorée avec géolocalisation
        const adresse = (data.adresse || '').toLowerCase();
        
        // Accepter explicitement notre territoire
        const inTerritory = this.authenticCynthia.territory.some(city => 
            adresse.includes(city.toLowerCase())
        );
        
        if (inTerritory) {
            console.log('✅ Propriété dans territoire de service confirmé');
            return false; // OK, ne pas bloquer
        }
        
        // Si pas dans territoire explicite, vérifier distances
        // Pour l'instant on accepte (à améliorer avec vraie API géo)
        console.log('⚠️ Propriété hors territoire explicite - Validation manuelle requise');
        return false;
    }
    
    blockAccess(reason) {
        console.error('🚫 ACCÈS BLOQUÉ:', reason);
        
        // Afficher message à l'utilisateur
        this.showBlockMessage(reason);
        
        // Logger l'incident
        this.logBlockedAttempt(reason);
        
        // Effacer données sensibles
        this.clearSensitiveData();
    }
    
    showBlockMessage(reason) {
        // Créer popup d'avertissement
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #dc3545; margin-bottom: 20px;">🛡️ Protection Identité</h2>
                <p style="margin-bottom: 20px; line-height: 1.5;">
                    <strong>Cynthia Bernier</strong><br>
                    Courtière immobilière résidentiel<br>
                    <em>Lebel-sur-Quévillon, Nord-du-Québec</em>
                </p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <strong>Raison du blocage:</strong><br>
                    ${reason}
                </div>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                    Si vous cherchez une autre Cynthia Bernier courtière (ex: région de Montréal), 
                    veuillez contacter directement cette personne.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Compris
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    logBlockedAttempt(reason) {
        try {
            const incident = {
                timestamp: new Date().toISOString(),
                type: 'IDENTITY_PROTECTION_BLOCK',
                reason: reason,
                user_agent: navigator.userAgent,
                url: window.location.href,
                form_data_cleared: true
            };
            
            // Stocker dans localStorage pour review
            const incidents = JSON.parse(localStorage.getItem('identity_incidents') || '[]');
            incidents.unshift(incident);
            
            // Garder seulement 100 derniers incidents
            if (incidents.length > 100) incidents.pop();
            
            localStorage.setItem('identity_incidents', JSON.stringify(incidents));
            
            console.log('📝 Incident identité loggé');
            
        } catch (error) {
            console.warn('⚠️ Erreur logging incident:', error);
        }
    }
    
    logSuspiciousActivity(pattern, data) {
        try {
            const activity = {
                timestamp: new Date().toISOString(),
                type: 'SUSPICIOUS_PATTERN',
                pattern: pattern,
                data_snippet: (data.adresse || '').substring(0, 50) + '...',
                action: 'LOGGED_ONLY'
            };
            
            const activities = JSON.parse(localStorage.getItem('suspicious_activities') || '[]');
            activities.unshift(activity);
            
            if (activities.length > 50) activities.pop();
            
            localStorage.setItem('suspicious_activities', JSON.stringify(activities));
            
        } catch (error) {
            console.warn('⚠️ Erreur logging activité suspecte:', error);
        }
    }
    
    clearSensitiveData() {
        try {
            // Effacer données formulaire
            localStorage.removeItem('cynthia_form_data');
            
            // Effacer champs formulaire
            const form = document.getElementById('inscriptionForm');
            if (form) {
                form.reset();
            }
            
            console.log('🗑️ Données sensibles effacées');
            
        } catch (error) {
            console.warn('⚠️ Erreur effacement données:', error);
        }
    }
    
    // API publique pour dashboard
    getProtectionStatus() {
        return {
            active: true,
            authentic_realtor: this.authenticCynthia,
            blocked_attempts: this.getBlockedAttempts(),
            suspicious_activities: this.getSuspiciousActivities()
        };
    }
    
    getBlockedAttempts() {
        try {
            return JSON.parse(localStorage.getItem('identity_incidents') || '[]');
        } catch {
            return [];
        }
    }
    
    getSuspiciousActivities() {
        try {
            return JSON.parse(localStorage.getItem('suspicious_activities') || '[]');
        } catch {
            return [];
        }
    }
    
    // Test de la protection
    testProtection() {
        console.log('🧪 Test protection identité...');
        
        const testData = {
            adresse: '123 Rue Test, Montréal, QC',
            prop1Nom: 'Client Test'
        };
        
        const result = this.validate(testData);
        console.log('Test result (doit être false):', result);
        
        return !result; // Succès si bloqué
    }
}

// Initialisation globale
if (typeof window !== 'undefined') {
    window.IdentityProtection = new IdentityProtection();
    console.log('🛡️ Protection identité prête');
}

// Export Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IdentityProtection;
}