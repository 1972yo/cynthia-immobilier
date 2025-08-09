// 🔒 PROTECTION IDENTITÉ SIMPLE - Anti-confusion Cynthia Bernier
// Protège contre confusion avec autre Cynthia Bernier (Montréal)

class SimpleIdentityProtection {
    constructor() {
        // NOTRE Cynthia authentique
        this.authenticCynthia = {
            ville: "Lebel-sur-Quévillon",
            region: "Nord-du-Québec", 
            telephone: "418-XXX-XXXX", // À configurer
            email: "cynthia@domain.com" // À configurer
        };
    }

    // Validation ultra-simple (1 seule fonction)
    validate(data) {
        // Check principal : ville
        if (data.ville && data.ville !== this.authenticCynthia.ville) {
            this.blockAccess(`Données pour ${data.ville} - Notre Cynthia est à ${this.authenticCynthia.ville}`);
            return false;
        }

        // Check secondaire : téléphone (si fourni)
        if (data.telephone && !data.telephone.startsWith('418')) {
            this.blockAccess("Indicatif téléphone incorrect - Notre Cynthia: 418-XXX-XXXX");
            return false;
        }

        return true;
    }

    // Blocage simple avec alerte
    blockAccess(reason) {
        console.warn('🚨 ACCÈS BLOQUÉ:', reason);
        
        // Alerte simple
        if (typeof alert !== 'undefined') {
            alert(`
🚨 ERREUR D'IDENTITÉ

${reason}

Cette application est destinée uniquement à :
Cynthia Bernier - Lebel-sur-Quévillon, Nord-du-Québec

Vérifiez vos informations.
            `);
        }

        // Log pour debug
        this.logBlockedAccess(reason);
    }

    logBlockedAccess(reason) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: 'BLOCKED_ACCESS',
            reason: reason,
            userAgent: navigator.userAgent || 'Unknown'
        };
        
        // Stockage local simple
        try {
            const logs = JSON.parse(localStorage.getItem('identity_blocks') || '[]');
            logs.push(logEntry);
            
            // Garder seulement 10 derniers logs
            if (logs.length > 10) logs.shift();
            
            localStorage.setItem('identity_blocks', JSON.stringify(logs));
        } catch (e) {
            console.warn('Cannot save identity block log');
        }
    }

    // Vérification rapide pour formulaires
    validateForm(formElement) {
        const formData = new FormData(formElement);
        const data = {
            ville: formData.get('ville') || formData.get('city'),
            telephone: formData.get('telephone') || formData.get('phone'),
            email: formData.get('email')
        };
        
        return this.validate(data);
    }
}

// Instance globale
window.IdentityProtection = new SimpleIdentityProtection();

// Auto-check au chargement page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Protection identité activée pour Cynthia Bernier - Lebel-sur-Quévillon');
});

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleIdentityProtection;
}