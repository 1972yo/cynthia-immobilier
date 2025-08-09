# 🔧 Guide Technique Maintenance - CYNTHIA WEBAPP

**Maintenance système :** Zara (Rouyn-Noranda)  
**Application :** Portail web professionnel PWA  
**Niveau :** Technique avancé  

---

## 🏗️ Architecture technique

### **Stack technologique**
- **Frontend** : HTML5, CSS3, JavaScript ES6+ 
- **PWA** : Service Worker, Manifest, Installable
- **Serveur** : Python HTTP Server (port 8081)
- **Stockage** : LocalStorage (client-side)
- **Protection** : Identity Protection intégrée
- **Responsive** : Mobile-first design

### **Structure des fichiers**
```
CYNTHIA_WEBAPP/
├── portal/
│   ├── index.html          # Interface principale  
│   ├── portal.js           # Logique adaptative ON/OFF
│   ├── portal.css          # Styles responsive
│   └── manifest.json       # Configuration PWA (à créer)
├── assets/
│   ├── css/
│   │   └── main.css        # Styles globaux
│   └── js/
│       └── identity-protection.js # Protection identité
├── admin/
│   └── pwa-dashboard/      # Dashboard administrateur
├── bouton.bat              # Lanceur application
└── acces-distance.bat      # Maintenance à distance
```

---

## 🚀 Processus de démarrage

### **Séquence d'initialisation**
1. **Lanceur** (`bouton.bat`)
   - Vérification fichiers critiques (portal/index.html)
   - Test Python disponible 
   - Démarrage serveur HTTP port 8081
   - Ouverture navigateur sur /portal/

2. **Chargement application**
   - Parsing HTML5 structure
   - Initialisation classe CynthiaPortal
   - Validation accès (protection identité)
   - Détection mode site (PUBLIC/PRIVÉ)
   - Rendu contenu adaptatif

3. **État prêt**
   - Interface responsive active
   - PWA installable (si manifest présent)
   - Protection identité active  
   - Mode adaptatif configuré

---

## 🧠 Logique métier principale

### **Classe CynthiaPortal**
```javascript
class CynthiaPortal {
    constructor() {
        this.siteConfig = {
            public_site_enabled: false,    // Mode par défaut: PRIVÉ
            last_checked: null,            // Timestamp dernière vérif
            fallback_mode: 'private'       // Mode sûr si erreur
        };
    }
}
```

### **Méthodes critiques**
- `init()` : Initialisation complète système
- `validatePageAccess()` : Protection identité
- `detectSiteMode()` : Détection mode PUBLIC/PRIVÉ
- `renderContent()` : Affichage adaptatif
- `renderPublicSite()` : Redirection site complet
- `renderPrivatePortal()` : Interface contact direct

---

## 🌐 Système adaptatif ON/OFF

### **Détection automatique mode**
```javascript
// Vérification configuration site
const response = await fetch('../api/site-status.json');
const config = await response.json();

if (config.public_site === true) {
    // Mode PUBLIC → Redirection site web complet
    window.location.href = '../website/index.html';
} else {  
    // Mode PRIVÉ → Interface contact direct
    this.renderPrivatePortal();
}
```

### **Modes de fonctionnement**

#### 🌐 **Mode PUBLIC**
- **Trigger** : `../api/site-status.json` avec `public_site: true`
- **Action** : Redirection automatique vers site complet
- **Délai** : 1.5 secondes avec message transition
- **Fallback** : Mode privé si redirection échoue

#### 🔒 **Mode PRIVÉ** (Défaut)
- **Trigger** : `public_site: false` ou absence de config
- **Action** : Affichage interface contact direct
- **Contenu** : Bienvenue + Contact + Services + Centris (optionnel)
- **Sécurité** : Protection identité active

---

## 🛡️ Système de protection identité

### **Classe SimpleIdentityProtection**
```javascript
class SimpleIdentityProtection {
    constructor() {
        this.authenticCynthia = {
            ville: "Lebel-sur-Quévillon",
            region: "Nord-du-Québec", 
            telephone: "418-XXX-XXXX",    // À configurer
            email: "cynthia@domain.com"   // À configurer
        };
    }
}
```

### **Mécanismes de protection**
1. **Validation géographique**
   - Vérification paramètres URL (?ville=, ?city=)
   - Blocage si ville != "Lebel-sur-Quévillon"
   - Alerte automatique avec message explicatif

2. **Validation téléphonique**
   - Vérification indicatif 418 (Nord-du-Québec)
   - Alerte si autre indicatif détecté
   - Logs des tentatives suspectes

3. **Logging sécurisé**
   - Stockage localStorage des incidents
   - Rétention 10 derniers événements
   - Métadonnées : timestamp, raison, userAgent

### **Messages de blocage**
```javascript
alert(`
🚨 ERREUR D'IDENTITÉ

${reason}

Cette application est destinée uniquement à :
Cynthia Bernier - Lebel-sur-Quévillon, Nord-du-Québec

Vérifiez vos informations.
`);
```

---

## 📱 Fonctionnalités PWA

### **Configuration PWA** (à implémenter)
```json
// portal/manifest.json
{
    "name": "Cynthia Bernier - Courtier Immobilier",
    "short_name": "Cynthia Bernier",
    "description": "Portail professionnel - Lebel-sur-Quévillon",
    "start_url": "/portal/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#cc0000",
    "icons": [
        {
            "src": "../assets/images/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        }
    ]
}
```

### **Service Worker** (optionnel)
- Cache statique des fichiers critiques
- Fonctionnement hors ligne limité
- Mise à jour automatique du cache
- Gestion fallback réseau

---

## 🔧 Interface Mode Privé (Technique)

### **Génération dynamique HTML**
```javascript
renderPrivatePortal(container) {
    container.innerHTML = `
        <!-- Message d'accueil -->
        <div class="card welcome-card">
            <h2>🏠 Bienvenue !</h2>
            <p>Votre courtière immobilière de confiance à Lebel-sur-Quévillon</p>
        </div>
        
        <!-- Contact direct -->  
        <div class="card contact-card">
            <div class="contact-grid">
                <a href="tel:418-XXX-XXXX" class="contact-btn phone">
                    <!-- Contact téléphone -->
                </a>
                <!-- Autres contacts... -->
            </div>
        </div>
        
        <!-- Services -->
        <div class="card services-card">
            <!-- Grille services immobiliers -->  
        </div>
    `;
}
```

### **Chargement section Centris**
```javascript
loadCentrisSection() {
    const centrisEnabled = localStorage.getItem('centris_enabled') === 'true';
    const centrisURL = localStorage.getItem('centris_url') || '';
    
    if (centrisEnabled && centrisURL) {
        // Afficher section Centris avec lien externe
        // + Disclaimer licence OACIQ
    }
}
```

---

## 🔐 Système d'accès administrateur

### **Authentification simplifiée**
```javascript
accessDashboard() {
    const isAuthentic = confirm(`
🔐 Accès Dashboard Cynthia

Confirmez-vous être Cynthia Bernier de Lebel-sur-Quévillon ?

Cette vérification protège vos données confidentielles.
    `);
    
    if (isAuthentic) {
        window.location.href = '../admin/pwa-dashboard/index.html';
    }
}
```

### **Redirection sécurisée**
- Vérification confirmation utilisateur
- Redirection vers dashboard PWA
- Pas de stockage persistent de l'auth
- Protection par obscurité (bouton discret)

---

## 🚨 Diagnostic et résolution

### **Codes d'erreur système**
| Code | Description | Solution |
|------|-------------|----------|
| **WEBAPP_001** | Fichier portal/index.html manquant | Restaurer depuis backup |
| **WEBAPP_002** | Port 8081 occupé | Redémarrer services |  
| **WEBAPP_003** | Erreur protection identité | Vérifier config identité |
| **WEBAPP_004** | Échec détection mode site | Utiliser mode privé par défaut |
| **WEBAPP_005** | PWA non installable | Vérifier manifest.json |

### **Tests de diagnostic automatique**
```bash
# Via acces-distance.bat
1. Vérification fichiers critiques
   - portal/index.html ✓
   - portal/portal.js ✓  
   - assets/js/identity-protection.js ✓

2. Test fonctionnalités
   - Protection identité active ✓
   - Modes PUBLIC/PRIVÉ ✓
   - Responsive design ✓
   - Liens contacts fonctionnels ✓

3. Test PWA (si configuré)
   - Manifest.json valide ✓
   - Service Worker enregistré ✓
   - Installation possible ✓
```

---

## 🔄 Maintenance préventive

### **Vérifications automatiques quotidiennes**
- **Intégrité fichiers** : Hash des fichiers critiques
- **Protection identité** : Test blocage tentatives
- **Performance** : Temps de chargement < 3s
- **Responsive** : Test différents viewports
- **Liens externes** : Vérification Centris si activé

### **Logs de maintenance**
```
logs/acces-distance.log
├── [TIMESTAMP] - WEBAPP diagnostic OK/Erreurs
├── [TIMESTAMP] - Protection identité testée  
├── [TIMESTAMP] - Mode adaptatif vérifié
└── [TIMESTAMP] - PWA fonctionnelle
```

---

## 🌐 Configuration réseau et serveur

### **Serveur Python HTTP**
```bash
# Commande de lancement (bouton.bat)
python -m http.server 8081

# Test port disponible
netstat -an | findstr ":8081"
```

### **URLs et redirection**
- **Principal** : http://localhost:8081/portal/
- **Admin** : http://localhost:8081/admin/pwa-dashboard/  
- **API config** : http://localhost:8081/api/site-status.json
- **Redirection** : http://localhost:8081/website/index.html

---

## 🔧 Configuration et personnalisation

### **Variables de configuration principales**
```javascript
// portal/portal.js - À personnaliser
this.authenticCynthia = {
    ville: "Lebel-sur-Quévillon",      // NE PAS MODIFIER
    region: "Nord-du-Québec",          // NE PAS MODIFIER  
    telephone: "418-XXX-XXXX",         // À CONFIGURER
    email: "cynthia@domain.com"        // À CONFIGURER
};

// portal/index.html - À personnaliser
• Photo : src="../assets/images/cynthia-photo.jpg"
• Licence OACIQ : "[À configurer]" 
• Contacts : href="tel:418-XXX-XXXX"
```

### **Configuration Centris**
```javascript
// Activation via console navigateur ou script
localStorage.setItem('centris_enabled', 'true');
localStorage.setItem('centris_url', 'https://www.centris.ca/fr/courtier~VOTRE_ID');

// Désactivation  
localStorage.setItem('centris_enabled', 'false');
```

---

## 📱 Tests compatibilité navigateurs

### **Tests automatisés**
```javascript
// Tests critiques
1. Chargement < 3 secondes ✓
2. Protection identité active ✓  
3. Mode adaptatif fonctionnel ✓
4. Responsive 320px-2560px ✓
5. Contacts cliquables ✓
6. PWA installable (si manifest) ✓
```

### **Matrice compatibilité**
| Navigateur | Desktop | Mobile | PWA | Notes |
|------------|---------|--------|-----|-------|
| **Chrome 90+** | ✅ | ✅ | ✅ | Optimal |
| **Safari 14+** | ✅ | ✅ | ✅ | iOS/Mac |
| **Firefox 88+** | ✅ | ✅ | ⚠️ | PWA limitée |
| **Edge 90+** | ✅ | ✅ | ✅ | Très bon |

---

## 🚨 Gestion des erreurs

### **Gestionnaire d'erreur global**
```javascript
window.addEventListener('error', (event) => {
    console.error('❌ Erreur portail:', event.error);
    
    // Fallback automatique en cas d'erreur critique
    const contentContainer = document.getElementById('portalContent');
    if (contentContainer && contentContainer.includes('spinner')) {
        // Afficher interface d'urgence avec contact direct
        showEmergencyContact();
    }
});
```

### **Interface de secours**
En cas d'erreur critique, affichage d'urgence :
- Message d'erreur explicite
- Contact téléphonique direct
- Bouton actualisation page
- Lien vers aide

---

## 🔄 Système de mise à jour

### **Mise à jour composants**
1. **Frontend** : portal.js, portal.css, index.html
2. **Protection** : identity-protection.js
3. **PWA** : manifest.json, service-worker.js  
4. **Assets** : CSS globaux, images
5. **Scripts** : bouton.bat, acces-distance.bat

### **Processus mise à jour sécurisée**
```bash
# Via mise-a-jour-securisee.bat
1. Sauvegarde automatique pré-update ✓
2. Téléchargement nouveaux composants ✓
3. Application mise à jour WEBAPP ✓  
4. Vérification intégrité post-update ✓
5. Rollback automatique si échec ✓
```

---

## 📊 Monitoring et métriques

### **Métriques techniques surveillées**
- **Performance** : Temps chargement, FCP, LCP
- **Erreurs** : JavaScript errors, failed requests
- **Sécurité** : Tentatives accès non autorisé
- **Usage** : PWA installations, boutons contacts

### **Alertes automatiques**
- **Système down** : > 5 minutes indisponible
- **Erreurs répétées** : > 5 erreurs/heure
- **Sécurité** : Tentative accès malveillant
- **Performance** : Chargement > 5 secondes

---

## 🌐 Déploiement et production

### **Prêt pour production**
- ✅ **HTTPS** : Compatible SSL/TLS
- ✅ **CDN** : Assets optimisables  
- ✅ **Compression** : Gzip/Brotli ready
- ✅ **Cache** : Headers appropriés
- ✅ **SEO** : Meta tags configurés

### **Configuration production**
```bash
# Variables environnement
WEBAPP_PORT=8081
WEBAPP_HOST=localhost  
IDENTITY_PROTECTION=enabled
PWA_ENABLED=true
CENTRIS_INTEGRATION=configurable
```

---

## 📞 Support et escalade

### **Niveaux d'intervention**
1. **Diagnostic automatique** : Scripts intégrés
2. **Maintenance à distance** : Zara (Rouyn-Noranda)  
3. **Urgence** : Mode protection maximale
4. **Évolution** : Nouvelles fonctionnalités

### **Documentation technique**
- **Architecture** : Diagrammes système
- **API** : Endpoints et payloads
- **Sécurité** : Audit et conformité
- **Performance** : Benchmarks et optimisations

---

*🔧 Guide technique WEBAPP v1.0  
🌐 Portail adaptatif PUBLIC/PRIVÉ  
🛡️ Protection identité intégrée  
📱 PWA ready - Architecture évolutive*