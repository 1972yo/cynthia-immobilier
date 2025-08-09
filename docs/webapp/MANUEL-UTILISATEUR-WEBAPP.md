# 🌐 Manuel d'utilisation - CYNTHIA WEBAPP

## 🏠 Portail Web Professionnel

**Pour :** Cynthia Bernier - Courtier immobilier résidentiel  
**Territoire :** Lebel-sur-Quévillon, Nord-du-Québec  
**Type :** Progressive Web App (PWA) - Installable  
**Version :** 1.0  

---

## 🚀 Accès au portail

### 1. URLs d'accès
- **URL locale :** http://localhost:8081/portal/
- **Compatible :** PC, tablettes, smartphones
- **Installation :** App mobile possible (PWA)

### 2. Démarrage
1. Double-cliquez sur `bouton.bat`
2. Attendez l'ouverture du navigateur
3. Le portail se charge automatiquement

---

## 🎯 Fonctionnement intelligent

### Mode adaptatif automatique

Le portail détecte automatiquement deux modes :

#### 🌐 **Mode PUBLIC** (Site web activé)
- **Redirection automatique** vers site web complet
- **Durée transition :** 1.5 secondes
- **Contenu :** Interface publique complète

#### 🔒 **Mode PRIVÉ** (Par défaut)
- **Interface simplifiée** pour contacts directs
- **Accès rapide** aux services essentiels
- **Protection identité** active

---

## 📱 Interface Mode Privé (Principal)

### 🏠 **Carte de bienvenue**
- Message d'accueil personnalisé
- Localisation : Lebel-sur-Quévillon
- Territoire : Nord-du-Québec et Abitibi-Témiscamingue

### 💬 **Contact direct**
Interface de contact optimisée :

| Bouton | Action | Utilisation |
|--------|--------|-------------|
| **📞 APPELER** | Appel direct | Contact immédiat |
| **📧 EMAIL** | Email automatique | Questions détaillées |
| **💬 TEXTO** | SMS rapide | Message express |

### 🏠 **Services présentés**
- **🏠 Vente résidentielle** : Évaluation et vente
- **🔍 Achat personnalisé** : Recherche propriétés
- **📊 Évaluation gratuite** : Valeur de votre bien

### 🔍 **Section Centris** (optionnelle)
- Lien vers propriétés sur Centris.ca
- Plateforme officielle Québec
- Licence OACIQ affichée

---

## 🔐 Protection identité intégrée

### Sécurité automatique
- **Vérification géographique** : Lebel-sur-Quévillon uniquement
- **Validation téléphone** : Indicatif 418 requis
- **Blocage automatique** : Accès non autorisé refusé

### Messages de protection
En cas de tentative d'accès incorrect :
```
🚨 ERREUR D'IDENTITÉ

Cette application est destinée uniquement à :
Cynthia Bernier - Lebel-sur-Quévillon, Nord-du-Québec

Vérifiez vos informations.
```

---

## 📱 Installation mobile (PWA)

### Fonctionnalités PWA
- **Installable** : Comme une app native
- **Icône d'accueil** : Sur votre écran principal  
- **Mode hors ligne** : Fonctions de base disponibles
- **Notifications** : Alertes possibles

### Installation
1. **Chrome/Safari** : "Ajouter à l'écran d'accueil"
2. **Firefox** : "Installer cette application" 
3. **Edge** : "Applications → Installer ce site"

---

## 🎛️ Accès dashboard (Admin)

### 📱 **Espace de travail Cynthia**
- **Bouton discret** : "📱 Mon espace de travail"
- **Authentification** : Vérification identité
- **Accès** : Dashboard complet administrateur

### Processus d'accès
1. Clic sur bouton admin
2. Confirmation identité Cynthia
3. Redirection vers dashboard PWA

---

## 🔧 Utilisation quotidienne

### Pour vos clients
- **Contact facile** : Boutons d'action directe
- **Information claire** : Services et territoire
- **Professionnel** : Interface soignée et épurée

### Pour vous (Cynthia)
- **Accès rapide** : Dashboard en un clic
- **Contact visible** : Informations toujours accessibles
- **Protection** : Identité sécurisée automatiquement

---

## 🌐 Modes de fonctionnement

### Configuration automatique
Le système détecte automatiquement :
- **Site web actif** → Mode public avec redirection
- **Site web inactif** → Mode portail privé (par défaut)

### Paramètres Centris
- **Activation** : Via localStorage ou config
- **URL personnalisée** : Lien vers vos annonces
- **Désactivation** : Section cachée automatiquement

---

## 📞 Actions rapides disponibles

### Contacts clients
- **📞 Appel** : tel:418-XXX-XXXX
- **📧 Email** : mailto:cynthia@domain.com  
- **💬 SMS** : sms:418-XXX-XXXX

### Navigation interne
- **🏠 Accueil** : Retour page principale
- **📱 Dashboard** : Espace administrateur
- **🔍 Centris** : Redirection externe (si activé)

---

## 🔧 Personnalisation

### Éléments personnalisables
- **Photo professionnelle** : Dans le header
- **Numéros téléphone** : Remplacer 418-XXX-XXXX
- **Email** : Remplacer cynthia@domain.com
- **Licence OACIQ** : Numéro réel à configurer

### Couleurs et style
- **Thème rouge** : Couleur signature (#D00)
- **Responsive** : S'adapte à tous écrans
- **Moderne** : Design épuré et professionnel

---

## ⚠️ Points importants

### ✅ **Bonnes pratiques**
- Vérifier numéros téléphone configurés
- Tester tous les boutons de contact
- S'assurer que l'email fonctionne
- Valider l'affichage mobile régulièrement

### ❌ **À éviter**
- Ne pas modifier la protection identité
- Ne pas désactiver la sécurité
- Ne pas oublier de configurer les vrais contacts
- Ne pas négliger la mise à jour des informations

---

## 🚨 En cas de problème

### Problèmes fréquents

#### **Le portail ne s'affiche pas**
1. Vérifier que `bouton.bat` a démarré
2. Essayer l'URL : http://localhost:8081/portal/
3. Vérifier que le port 8081 est libre
4. Redémarrer via `bouton.bat`

#### **Message d'erreur identité**
1. Vérifier que vous êtes bien à Lebel-sur-Quévillon
2. Pas d'autre Cynthia Bernier sur le même réseau
3. Contactez Zara si problème persiste

#### **Boutons de contact ne fonctionnent pas**
1. Vérifier configuration email/téléphone
2. Tester avec un autre navigateur
3. Vérifier permissions navigateur (appels/emails)

#### **Mode PWA ne s'installe pas**
1. Utiliser un navigateur compatible (Chrome, Safari, Edge)
2. Vérifier connexion HTTPS (en production)
3. Actualiser la page et réessayer

---

## 📱 Optimisation mobile

### Interface tactile
- **Boutons larges** : Optimisés pour les doigts
- **Espacement généreux** : Évite les erreurs de clic
- **Text lisible** : Taille adaptée petit écran

### Performance mobile
- **Chargement rapide** : < 3 secondes
- **Données minimales** : Optimisé 3G/4G
- **Cache intelligent** : Moins de rechargements

---

## 🔒 Confidentialité et sécurité

### Protection automatique
- **Données locales** : Stockées sur l'appareil uniquement
- **Pas de tracking** : Aucun suivi externe
- **Protection identité** : Vérification automatique
- **Logs sécurisés** : Historique des blocages

### Conformité légale
- **RGPD/PIPEDA** : Respect vie privée
- **OACIQ** : Conformité réglementaire courtage
- **Confidentialité** : Informations clients protégées

---

## 📊 Informations techniques

### Navigateurs supportés
- **Chrome** 90+ ✅ (Recommandé)
- **Safari** 14+ ✅ (iOS/Mac)
- **Firefox** 88+ ✅ (Bureau)
- **Edge** 90+ ✅ (Windows)

### Technologies
- **HTML5** : Structure moderne
- **CSS3** : Design responsive
- **JavaScript** : Interactions fluides
- **PWA** : Installation mobile possible
- **LocalStorage** : Sauvegarde locale

---

## 📞 Support

### Pour assistance technique
**Zara** (Rouyn-Noranda)
- Maintenance à distance possible
- Diagnostic automatique intégré
- Réparation sans déplacement

### Pour configuration métier
**Cynthia Bernier**
- Personnalisation services affichés
- Configuration contacts et liens
- Adaptation besoins spécifiques

---

## 🔄 Évolutions et mises à jour

### Fonctionnalités prévues
- **Calendrier RDV** : Prise de RDV en ligne
- **Chat intégré** : Messagerie instantanée
- **Cartes interactives** : Localisation propriétés
- **Notifications push** : Alertes personnalisées

### Mises à jour automatiques
- **Sécurité** : Correctifs automatiques
- **Fonctionnalités** : Nouvelles options ajoutées
- **Performance** : Optimisations continues
- **Compatibilité** : Support nouveaux navigateurs

---

*🌐 Manuel utilisateur WEBAPP v1.0  
📱 PWA compatible - Installable sur mobile  
🔒 Protection identité intégrée  
🏠 Conçu pour courtage immobilier professionnel*