# 🚀 GUIDE DE CONFIGURATION - CYNTHIA ASSISTANT

## ⚡ Configuration rapide (5 minutes)

### 1. Configuration EmailJS

1. **Créer compte EmailJS** : [https://emailjs.com](https://emailjs.com)
2. **Ajouter service email** :
   - Aller dans "Email Services" → "Add New Service"
   - Choisir Gmail, Outlook ou autre
   - Suivre les instructions de connexion
   - Noter le **Service ID** (ex: `service_abc123`)

3. **Créer template email** :
   - Aller dans "Email Templates" → "Create New Template"
   - Copier le contenu de `emailjs-template.html` 
   - Personnaliser si nécessaire
   - Noter le **Template ID** (ex: `template_xyz789`)

4. **Récupérer clé publique** :
   - Aller dans "Account" → "General"
   - Copier la **Public Key** (ex: `user_abc123def`)

### 2. Mise à jour du fichier .env

Modifier le fichier `.env` avec vos vraies valeurs :

```env
# EmailJS Configuration - REMPLACER PAR VOS VALEURS
EMAILJS_SERVICE_ID=service_abc123        # Votre Service ID
EMAILJS_TEMPLATE_ID=template_xyz789      # Votre Template ID  
EMAILJS_PUBLIC_KEY=user_abc123def        # Votre Public Key

# Email de destination - REMPLACER
CYNTHIA_EMAIL=votre.email@gmail.com      # Email de Cynthia
CYNTHIA_NAME=Cynthia Bernier             # Nom de Cynthia
```

### 3. Variables d'environnement pour le navigateur

Créer un fichier `env.js` pour injecter les variables :

```javascript
// env.js - À créer
window.ENV = {
    EMAILJS_SERVICE_ID: 'service_abc123',
    EMAILJS_TEMPLATE_ID: 'template_xyz789', 
    EMAILJS_PUBLIC_KEY: 'user_abc123def',
    CYNTHIA_EMAIL: 'votre.email@gmail.com',
    CYNTHIA_NAME: 'Cynthia Bernier',
    OPENAI_API_KEY: 'sk-proj-71NX...' // Déjà configuré
};
```

Puis ajouter dans `index.html` **AVANT** les autres scripts :
```html
<script src="env.js"></script>
```

### 4. Test de l'application

1. Ouvrir `index.html` dans un navigateur
2. Remplir le formulaire de test
3. Vérifier la console pour les messages de debug
4. Tester l'envoi d'email

## 🔧 Configuration avancée (optionnel)

### Sécurisation côté serveur

Pour la production, créer un backend Node.js :

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint proxy pour OpenAI (sécurisé)
app.post('/api/analyze', async (req, res) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000);
```

### Base de données (optionnel)

Pour sauvegarder les soumissions :

```javascript
// Ajouter MongoDB ou PostgreSQL
const mongoose = require('mongoose');

const ficheSchema = new mongoose.Schema({
    adresse: String,
    proprietaire: String,
    telephone: String,
    aiAnalysis: Object,
    timestamp: { type: Date, default: Date.now }
});

const Fiche = mongoose.model('Fiche', ficheSchema);
```

## 📊 Vérification du fonctionnement

### Console du navigateur doit afficher :
- ✅ `⚙️ Configuration chargée`
- ✅ `📧 EmailJS initialisé`
- ✅ `🎨 Cynthia Assistant initialisé`

### En cas de problème :
- ⚠️ `Configuration incomplète` → Vérifier les clés EmailJS
- ❌ `EmailJS error` → Vérifier service et template
- ❌ `OpenAI error` → Clé API invalide

## 🎯 Résultat attendu

Après configuration, l'application doit :
1. ✅ Charger sans erreurs
2. ✅ Permettre navigation dans le formulaire
3. ✅ Sauvegarder automatiquement les données
4. ✅ Analyser les fiches avec OpenAI
5. ✅ Envoyer emails formatés à Cynthia
6. ✅ Afficher confirmation de succès

**Application 100% fonctionnelle ! 🚀**