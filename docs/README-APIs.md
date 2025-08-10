# 🏠 PROJET CYNTHIA BERNIER - APIs SÉPARÉES

## 🔑 Configuration des APIs OpenAI

Le projet utilise maintenant **deux clés OpenAI distinctes** pour séparer les fonctionnalités :

### 1. **API ASSISTANT** (`/assistant/`)
- **Usage** : Analyse des fiches immobilières et recommandations
- **Clé** : `CYNTHIA_ASSISTANT_OPENAI_KEY`
- **Modèle** : GPT-4 (température 0.3, tokens 500)
- **Fonctionnalités** :
  - ✅ Analyse automatique des fiches d'inscription
  - ✅ Génération de recommandations pour Cynthia
  - ✅ Évaluation de priorité client (HAUTE/MOYENNE/BASSE)
  - ✅ Identification des points d'attention

### 2. **API WEBAPP** (`/webapp/`)  
- **Usage** : Gestion intelligente des emails et templates
- **Clé** : `CYNTHIA_WEBAPP_OPENAI_KEY`
- **Modèle** : GPT-4 (température 0.4, tokens 800)
- **Fonctionnalités** :
  - ✅ Amélioration automatique d'emails
  - ✅ Suggestions de contenu en temps réel
  - ✅ Génération de templates personnalisés
  - ✅ Analyse de performance des emails

## 🚀 Installation et Configuration

### 1. Variables d'environnement
Copiez le fichier `.env.example` en `.env` et configurez vos clés :

```bash
cp .env.example .env
```

```env
# Clés OpenAI séparées
CYNTHIA_ASSISTANT_OPENAI_KEY=sk-assistant-your-key-here
CYNTHIA_WEBAPP_OPENAI_KEY=sk-webapp-your-key-here

# Configuration EmailJS
EMAILJS_SERVICE_ID=service_cynthia_bernier
EMAILJS_TEMPLATE_ID=template_fiche_inscription
EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here

# Informations Cynthia
CYNTHIA_EMAIL=cynthia.bernier@courtiercynthia.com
CYNTHIA_NAME=Cynthia Bernier
```

### 2. Configuration rapide (développement)
Utilisez la console du navigateur pour tester :

```javascript
// Configurer les clés rapidement
window.quickConfigureKeys('sk-assistant-...', 'sk-webapp-...');

// Vérifier la configuration
window.showConfigStatus();

// Obtenir de l'aide
window.helpConfigureCynthia();
```

## 📁 Structure des fichiers

```
docs/
├── init-config.js          # Script d'initialisation commun
├── .env.example            # Modèle de variables d'environnement
├── assistant/              # API Assistant
│   ├── config.js           # Configuration Assistant
│   ├── email-config.js     # Service email Assistant
│   └── index.html          # Interface Assistant
├── webapp/                 # API WebApp
│   ├── webapp-config.js    # Configuration WebApp
│   └── admin/
│       └── pwa-dashboard/
│           ├── email-ia.js # Service IA WebApp
│           └── email-ia.html # Interface WebApp
└── README-APIs.md         # Ce fichier
```

## 🔧 Scripts de diagnostic

### Vérifier la séparation des APIs
```javascript
const status = window.checkAPIsSeparation();
console.log(status);
// {
//   assistantConfigured: true,
//   webappConfigured: true, 
//   keysSeparated: true,
//   status: 'success'
// }
```

### Afficher le statut complet
```javascript
window.showConfigStatus();
// Affiche une popup avec le statut détaillé
```

## 🎯 Points clés de la séparation

### ✅ Avantages
- **Sécurité** : Isolation des accès par fonction
- **Monitoring** : Suivi séparé des usages
- **Coûts** : Contrôle granulaire par API
- **Performance** : Optimisation par cas d'usage

### 🔐 Sécurité
- Clés distinctes par service
- Validation automatique des configurations
- Fallbacks sécurisés en cas d'erreur

### 📊 Monitoring
- Logs séparés par API
- Métriques d'usage distinctes
- Alertes configurables

## 🚨 Dépannage

### Problème : APIs non configurées
```javascript
// Vérifier les clés
console.log('Assistant Key:', window.AppConfig?.get('openai.apiKey'));
console.log('WebApp Key:', window.WebAppConfig?.getOpenAIKey());

// Reconfigurer si nécessaire
window.quickConfigureKeys('sk-assistant-...', 'sk-webapp-...');
```

### Problème : Clés identiques
```javascript
// Les clés doivent être différentes
const assistantKey = window.AppConfig.get('openai.apiKey');
const webappKey = window.WebAppConfig.getOpenAIKey();
console.log('Keys are different:', assistantKey !== webappKey);
```

### Erreur lors des appels API
1. Vérifiez la validité des clés OpenAI
2. Contrôlez les quotas et limites
3. Examinez la console pour les erreurs

## 📞 Support

Pour toute question ou problème :
1. Consultez la console du navigateur
2. Utilisez `window.helpConfigureCynthia()` 
3. Vérifiez la configuration avec `window.showConfigStatus()`

---

**🏠 Cynthia Bernier - Courtière immobilière résidentielle - Lebel-sur-Quévillon**