// ========== GESTION COMPLÈTE DES FICHES IA ==========
// Système intégré à email-ia.html pour la gestion complète des fiches clients

class FichesIAManager {
    constructor(emailManager) {
        this.emailManager = emailManager;
        this.fiches = [];
        this.ficheAnalyses = [];
        this.currentFiche = null;
        
        this.init();
    }
    
    async init() {
        await this.loadFiches();
        this.setupEventListeners();
        console.log('📋 Gestionnaire de Fiches IA initialisé');
    }
    
    setupEventListeners() {
        // Écouteurs pour les filtres et recherche
        const ficheFilter = document.getElementById('ficheFilter');
        const ficheSearch = document.getElementById('ficheSearch');
        
        if (ficheFilter) {
            ficheFilter.addEventListener('change', () => this.filterFiches());
        }
        
        if (ficheSearch) {
            ficheSearch.addEventListener('input', () => this.searchFiches());
        }
    }
    
    async loadFiches() {
        try {
            // Charger depuis localStorage et notifications Cynthia
            const savedFiches = JSON.parse(localStorage.getItem('cynthia_form_data') || '{}');
            const notifications = JSON.parse(localStorage.getItem('cynthia_notifications') || '[]');
            
            // Combiner les sources
            this.fiches = [];
            
            // Ajouter fiches depuis notifications
            notifications.forEach(notif => {
                if (notif.type === 'NEW_FORM' && notif.data) {
                    this.fiches.push({
                        id: this.generateFicheId(),
                        source: 'notification',
                        data: notif.data,
                        timestamp: notif.timestamp,
                        analyzed: false,
                        priority: 'normal',
                        status: 'new'
                    });
                }
            });
            
            // Ajouter fiche courante si elle existe
            if (savedFiches.adresse) {
                this.fiches.push({
                    id: this.generateFicheId(),
                    source: 'current_form',
                    data: savedFiches,
                    timestamp: savedFiches._metadata?.lastSaved || new Date().toISOString(),
                    analyzed: false,
                    priority: 'high',
                    status: 'current'
                });
            }
            
            // Charger analyses existantes
            const savedAnalyses = JSON.parse(localStorage.getItem('cynthia_fiche_analyses') || '[]');
            this.ficheAnalyses = savedAnalyses;
            
            // Associer analyses aux fiches
            this.fiches.forEach(fiche => {
                const analysis = this.ficheAnalyses.find(a => a.ficheId === fiche.id);
                if (analysis) {
                    fiche.analyzed = true;
                    fiche.analysis = analysis.content;
                    fiche.analyzedAt = analysis.timestamp;
                }
            });
            
            console.log(`📋 ${this.fiches.length} fiches chargées`);
            this.updateFichesStats();
            this.renderFichesList();
            
        } catch (error) {
            console.error('Erreur chargement fiches:', error);
        }
    }
    
    generateFicheId() {
        return 'fiche_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    updateFichesStats() {
        const totalFiches = this.fiches.length;
        const fichesProcessees = this.fiches.filter(f => f.analyzed).length;
        const proprietesActives = this.fiches.filter(f => f.data.adresse && f.status !== 'sold').length;
        
        // Calculer score CANAFE moyen
        let scoreMoyen = 0;
        const fichesAvecScore = this.fiches.filter(f => f.data.scoreCanafe);
        if (fichesAvecScore.length > 0) {
            const totalScore = fichesAvecScore.reduce((sum, f) => sum + parseInt(f.data.scoreCanafe || 0), 0);
            scoreMoyen = Math.round(totalScore / fichesAvecScore.length);
        }
        
        // Mettre à jour l'interface
        const elements = {
            'totalFiches': totalFiches,
            'fichesProcessees': fichesProcessees,
            'proprietesActives': proprietesActives,
            'scoreMoyen': scoreMoyen
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    renderFichesList() {
        const container = document.getElementById('fichesList');
        if (!container) return;
        
        if (this.fiches.length === 0) {
            container.innerHTML = `
                <div class="no-fiches">
                    <div class="no-fiches-icon">📋</div>
                    <h3>Aucune fiche disponible</h3>
                    <p>Utilisez le formulaire d'inscription pour créer des fiches.</p>
                    <button onclick="openFormulaire()" class="btn-create-first-fiche">📝 Créer une fiche</button>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.fiches.forEach(fiche => {
            const data = fiche.data;
            const dateStr = new Date(fiche.timestamp).toLocaleString('fr-CA');
            const priorityClass = fiche.priority === 'high' ? 'high-priority' : '';
            const analyzedClass = fiche.analyzed ? 'analyzed' : 'pending-analysis';
            const statusClass = `status-${fiche.status}`;
            
            html += `
                <div class="fiche-item ${priorityClass} ${analyzedClass} ${statusClass}" data-fiche-id="${fiche.id}">
                    <div class="fiche-header">
                        <h4>${data.adresse || 'Adresse non spécifiée'}</h4>
                        <div class="fiche-status">
                            ${fiche.analyzed ? 
                                '<span class="status-analyzed">✅ Analysé</span>' : 
                                '<span class="status-pending">⏳ En attente</span>'
                            }
                            ${fiche.priority === 'high' ? '<span class="priority-high">🔥 Priorité</span>' : ''}
                        </div>
                    </div>
                    <div class="fiche-details">
                        <p><strong>Client:</strong> ${data.prop1Nom || 'Non spécifié'}</p>
                        <p><strong>Téléphone:</strong> ${data.prop1Tel1 || 'Non spécifié'}</p>
                        <p><strong>Email:</strong> ${data.prop1Email || 'Non spécifié'}</p>
                        <p><strong>Score CANAFE:</strong> ${data.scoreCanafe || 'Non évalué'}/10</p>
                        <p><strong>Évaluation:</strong> ${data.evaluationMunicipale || 'N/A'}</p>
                        <p><strong>Date:</strong> ${dateStr}</p>
                    </div>
                    <div class="fiche-actions">
                        <button onclick="window.fichesManager.analyzeFiche('${fiche.id}')" class="btn-analyze-fiche ${fiche.analyzed ? 'analyzed' : ''}" title="Analyser avec IA">
                            ${fiche.analyzed ? '🔄 Re-analyser' : '🤖 Analyser'}
                        </button>
                        <button onclick="window.fichesManager.viewFicheDetails('${fiche.id}')" class="btn-view-fiche" title="Voir détails">
                            👁️ Détails
                        </button>
                        <button onclick="window.fichesManager.generateEmail('${fiche.id}')" class="btn-email-fiche" title="Générer email">
                            📧 Email
                        </button>
                        <button onclick="window.fichesManager.selectFiche('${fiche.id}')" class="btn-select-fiche" title="Sélectionner">
                            ✅ Sélectionner
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    async analyzeFiche(ficheId) {
        const fiche = this.fiches.find(f => f.id === ficheId);
        if (!fiche) return;
        
        try {
            // Afficher analyse en cours
            const analysisContainer = document.getElementById('aiAnalysisContent');
            if (analysisContainer) {
                analysisContainer.innerHTML = '<div class="analysis-loading">🤖 Analyse en cours...</div>';
            }
            
            // Préparer les données pour l'IA
            const ficheData = fiche.data;
            const prompt = `Analysez cette fiche immobilière de manière professionnelle pour Cynthia Bernier, courtière à Lebel-sur-Quévillon:
            
📍 PROPRIÉTÉ:
- Adresse: ${ficheData.adresse || 'N/A'}
- Évaluation municipale: ${ficheData.evaluationMunicipale || 'N/A'}
- Année construction: ${ficheData.anneeConstruction || 'N/A'}
- Terrain: ${ficheData.longueurTerrain || '?'}x${ficheData.largeurTerrain || '?'} pieds
- JLR: ${ficheData.jlr || 'N/A'}
- CM: ${ficheData.cm || 'N/A'}

👥 PROPRIÉTAIRE:
- Nom: ${ficheData.prop1Nom || 'N/A'}
- Téléphone: ${ficheData.prop1Tel1 || 'N/A'}
- Email: ${ficheData.prop1Email || 'N/A'}
- Score CANAFE: ${ficheData.scoreCanafe || 'N/A'}/10

🏠 CARACTÉRISTIQUES:
- Fondation: ${ficheData.fondation || 'N/A'}
- Toiture: ${ficheData.toiture || 'N/A'} (${ficheData.anneeToiture || 'N/A'})
- Chauffage: ${ficheData.chauffage || 'N/A'}
- Sous-sol: ${ficheData.sousSol || 'N/A'} (${ficheData.sousSolAmenage || 'N/A'})
- Salles de bains: ${ficheData.nombreSallesBains || 'N/A'}

🏊 ÉQUIPEMENTS:
- Piscine: ${ficheData.piscine || 'Aucune'}
- Équipements spéciaux: ${ficheData.equipements || 'N/A'}

⚠️ PROBLÈMES:
${ficheData.problemes || 'Aucun problème signalé'}
${ficheData.detailsProblemes ? '- Détails: ' + ficheData.detailsProblemes : ''}

📝 NOTES:
${ficheData.notesSpeciales || 'Aucune note spéciale'}

Fournissez une analyse structurée avec:

🎯 **POTENTIEL DE VENTE** (1-10/10)
💰 **PRIX SUGGÉRÉ** (fourchette réaliste)
✨ **POINTS FORTS** (3-5 points)
⚠️ **POINTS À AMÉLIORER** (2-4 points) 
📈 **STRATÉGIE MARKETING** (recommandations)
🏃 **PRIORITÉ D'ACTION** (Élevée/Moyenne/Faible)
📞 **PROCHAINES ÉTAPES** (actions concrètes)

Soyez précis, professionnel et adapté au marché de Lebel-sur-Quévillon, Nord-du-Québec.`;

            // Appel à l'IA via le système email existant
            const analysis = await this.emailManager.callOpenAIWebApp(prompt, "Tu es un expert immobilier IA spécialisé dans le marché du Nord-du-Québec. Analyse les propriétés avec expertise et donne des recommandations concrètes adaptées à la région de Lebel-sur-Quévillon.");
            
            // Sauvegarder l'analyse
            const analysisData = {
                ficheId: fiche.id,
                content: analysis,
                timestamp: new Date().toISOString(),
                propertyAddress: ficheData.adresse
            };
            
            fiche.analyzed = true;
            fiche.analysis = analysis;
            fiche.analyzedAt = new Date().toISOString();
            
            // Sauvegarder dans localStorage
            this.ficheAnalyses = this.ficheAnalyses.filter(a => a.ficheId !== fiche.id);
            this.ficheAnalyses.push(analysisData);
            localStorage.setItem('cynthia_fiche_analyses', JSON.stringify(this.ficheAnalyses));
            
            // Afficher l'analyse
            if (analysisContainer) {
                analysisContainer.innerHTML = `
                    <div class="fiche-analysis">
                        <div class="analysis-header">
                            <h4>🏠 ${ficheData.adresse}</h4>
                            <div class="analysis-meta">
                                <span class="analysis-date">Analysé le ${new Date().toLocaleString('fr-CA')}</span>
                                <button onclick="window.fichesManager.exportAnalysis('${fiche.id}')" class="btn-export-analysis">📄 Exporter</button>
                            </div>
                        </div>
                        <div class="analysis-content">
                            ${analysis.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                `;
            }
            
            // Mettre à jour les stats et la liste
            this.updateFichesStats();
            this.renderFichesList();
            
            console.log(`✅ Fiche ${ficheData.adresse} analysée avec succès`);
            
        } catch (error) {
            console.error('Erreur analyse fiche:', error);
            const analysisContainer = document.getElementById('aiAnalysisContent');
            if (analysisContainer) {
                analysisContainer.innerHTML = '<div class="analysis-error">❌ Erreur lors de l\'analyse. Vérifiez votre connexion et réessayez.</div>';
            }
        }
    }
    
    async analyzeAllFiches() {
        const unanalyzedFiches = this.fiches.filter(f => !f.analyzed);
        if (unanalyzedFiches.length === 0) {
            alert('✅ Toutes les fiches sont déjà analysées !');
            return;
        }
        
        const confirm = window.confirm(`🤖 Analyser ${unanalyzedFiches.length} fiche(s) avec l'IA ?\n\nCela peut prendre quelques minutes.\n\nCoût estimé: ${unanalyzedFiches.length} appels API OpenAI.`);
        if (!confirm) return;
        
        // Affichage progression
        const progressContainer = document.createElement('div');
        progressContainer.className = 'analysis-progress';
        progressContainer.innerHTML = `
            <div class="progress-header">
                <h4>🤖 Analyse en cours...</h4>
                <div class="progress-counter">0 / ${unanalyzedFiches.length}</div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" id="analysisProgressBar"></div>
            </div>
            <div class="progress-status" id="analysisProgressStatus">Préparation...</div>
        `;
        
        const analysisContainer = document.getElementById('aiAnalysisContent');
        if (analysisContainer) {
            analysisContainer.appendChild(progressContainer);
        }
        
        for (let i = 0; i < unanalyzedFiches.length; i++) {
            const fiche = unanalyzedFiches[i];
            const progress = Math.round(((i + 1) / unanalyzedFiches.length) * 100);
            
            // Mettre à jour la progression
            const progressBar = document.getElementById('analysisProgressBar');
            const progressStatus = document.getElementById('analysisProgressStatus');
            const progressCounter = document.querySelector('.progress-counter');
            
            if (progressStatus) {
                progressStatus.textContent = `Analyse: ${fiche.data.adresse || 'Fiche ' + (i + 1)}`;
            }
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (progressCounter) {
                progressCounter.textContent = `${i + 1} / ${unanalyzedFiches.length}`;
            }
            
            console.log(`Analyse fiche ${i + 1}/${unanalyzedFiches.length}: ${fiche.data.adresse}`);
            await this.analyzeFiche(fiche.id);
            
            // Pause entre analyses pour éviter rate limiting
            if (i < unanalyzedFiches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        // Masquer la progression et afficher le résultat
        if (progressContainer) {
            progressContainer.remove();
        }
        
        alert(`✅ Analyse terminée ! ${unanalyzedFiches.length} fiche(s) analysée(s) avec succès.`);
        this.generateReport();
    }
    
    selectFiche(ficheId) {
        const fiche = this.fiches.find(f => f.id === ficheId);
        if (!fiche) return;
        
        this.currentFiche = fiche;
        
        // Mettre à jour sélection visuelle
        document.querySelectorAll('.fiche-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const ficheElement = document.querySelector(`[data-fiche-id="${ficheId}"]`);
        if (ficheElement) {
            ficheElement.classList.add('selected');
        }
        
        // Afficher l'analyse si disponible
        if (fiche.analyzed && fiche.analysis) {
            const analysisContainer = document.getElementById('aiAnalysisContent');
            if (analysisContainer) {
                analysisContainer.innerHTML = `
                    <div class="fiche-analysis selected">
                        <div class="analysis-header">
                            <h4>🏠 ${fiche.data.adresse}</h4>
                            <div class="analysis-meta">
                                <span class="analysis-date">Analysé le ${new Date(fiche.analyzedAt).toLocaleString('fr-CA')}</span>
                                <button onclick="window.fichesManager.exportAnalysis('${fiche.id}')" class="btn-export-analysis">📄 Exporter</button>
                            </div>
                        </div>
                        <div class="analysis-content">
                            ${fiche.analysis.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                `;
            }
        }
        
        console.log('Fiche sélectionnée:', fiche.data.adresse);
    }
    
    viewFicheDetails(ficheId) {
        const fiche = this.fiches.find(f => f.id === ficheId);
        if (!fiche) return;
        
        const data = fiche.data;
        
        // Créer modal détaillé
        const modal = document.createElement('div');
        modal.className = 'fiche-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📋 Détails Complets - ${data.adresse}</h3>
                    <button onclick="this.parentElement.parentElement.remove()" class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="details-section">
                            <h4>📍 Propriété</h4>
                            <p><strong>Adresse:</strong> ${data.adresse || 'N/A'}</p>
                            <p><strong>Lot:</strong> ${data.numLot || 'N/A'}</p>
                            <p><strong>JLR:</strong> ${data.jlr || 'N/A'}</p>
                            <p><strong>CM:</strong> ${data.cm || 'N/A'}</p>
                            <p><strong>Construction:</strong> ${data.anneeConstruction || 'N/A'}</p>
                            <p><strong>Évaluation:</strong> ${data.evaluationMunicipale || 'N/A'}</p>
                            <p><strong>Terrain:</strong> ${data.longueurTerrain || '?'} x ${data.largeurTerrain || '?'} pieds</p>
                            <p><strong>CENTRIS:</strong> ${data.centrisId || 'Non inscrit'}</p>
                        </div>
                        
                        <div class="details-section">
                            <h4>👤 Propriétaire Principal</h4>
                            <p><strong>Nom:</strong> ${data.prop1Nom || 'N/A'}</p>
                            <p><strong>Tél 1:</strong> ${data.prop1Tel1 || 'N/A'}</p>
                            <p><strong>Tél 2:</strong> ${data.prop1Tel2 || 'N/A'}</p>
                            <p><strong>Email:</strong> ${data.prop1Email || 'N/A'}</p>
                            <p><strong>Score CANAFE:</strong> ${data.scoreCanafe || 'N/A'}/10</p>
                        </div>
                        
                        <div class="details-section">
                            <h4>🏠 Caractéristiques</h4>
                            <p><strong>Fondation:</strong> ${data.fondation || 'N/A'}</p>
                            <p><strong>Toiture:</strong> ${data.toiture || 'N/A'} (${data.anneeToiture || 'N/A'})</p>
                            <p><strong>Chauffage:</strong> ${data.chauffage || 'N/A'}</p>
                            <p><strong>Sous-sol:</strong> ${data.sousSol || 'N/A'}</p>
                            <p><strong>Salles bains:</strong> ${data.nombreSallesBains || 'N/A'}</p>
                            <p><strong>Cuisine rénovée:</strong> ${data.anneeRenoCuisine || 'N/A'}</p>
                        </div>
                        
                        <div class="details-section">
                            <h4>🏊 Équipements</h4>
                            <p><strong>Piscine:</strong> ${data.piscine || 'Aucune'}</p>
                            <p><strong>Équipements:</strong> ${data.equipements || 'N/A'}</p>
                            <p><strong>Laveuse/sécheuse:</strong> ${data.laveuse || 'N/A'}</p>
                        </div>
                        
                        ${data.problemes ? `
                        <div class="details-section problems">
                            <h4>⚠️ Problèmes Signalés</h4>
                            <p><strong>Types:</strong> ${data.problemes}</p>
                            ${data.detailsProblemes ? `<p><strong>Détails:</strong> ${data.detailsProblemes}</p>` : ''}
                        </div>
                        ` : ''}
                        
                        ${data.notesSpeciales ? `
                        <div class="details-section notes">
                            <h4>📝 Notes Spéciales</h4>
                            <p>${data.notesSpeciales}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="window.fichesManager.analyzeFiche('${ficheId}')" class="btn-modal-analyze">🤖 ${fiche.analyzed ? 'Re-analyser' : 'Analyser'}</button>
                    <button onclick="window.fichesManager.generateEmail('${ficheId}')" class="btn-modal-email">📧 Générer Email</button>
                    <button onclick="window.fichesManager.exportFiche('${ficheId}')" class="btn-modal-export">📄 Exporter PDF</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    async generateEmail(ficheId) {
        const fiche = this.fiches.find(f => f.id === ficheId);
        if (!fiche) return;
        
        const data = fiche.data;
        
        try {
            // Générer email personnalisé avec IA
            const prompt = `Générez un email professionnel pour Cynthia Bernier, courtière immobilière à Lebel-sur-Quévillon, destiné au client ${data.prop1Nom} concernant sa propriété au ${data.adresse}.
            
INFORMATIONS CLIENT:
- Nom: ${data.prop1Nom}
- Email: ${data.prop1Email}
- Téléphone: ${data.prop1Tel1}

PROPRIÉTÉ:
- Adresse: ${data.adresse}
- Évaluation: ${data.evaluationMunicipale}
- Score CANAFE: ${data.scoreCanafe}/10

${fiche.analyzed ? `ANALYSE IA:
${fiche.analysis}` : ''}

Générez un email qui:
1. Remercie pour la soumission du formulaire
2. Confirme les informations reçues
3. ${fiche.analyzed ? 'Présente les points forts identifiés par l\'IA' : 'Annonce qu\'une analyse détaillée va suivre'}
4. Propose les prochaines étapes
5. Invite à un rendez-vous ou appel

Ton: Professionnel, chaleureux, adapté au Nord-du-Québec
Signature: Cynthia Bernier, Courtier immobilier résidentiel, Lebel-sur-Quévillon`;

            const emailContent = await this.emailManager.callOpenAIWebApp(prompt, "Tu es Cynthia Bernier, courtière immobilière professionnelle et bienveillante à Lebel-sur-Quévillon. Rédige des emails personnalisés qui rassurent et engagent tes clients.");
            
            // Pré-remplir le compositeur d'email
            const emailTo = document.getElementById('emailTo');
            const emailSubject = document.getElementById('emailSubject');
            const emailBody = document.getElementById('emailBody');
            
            if (emailTo) emailTo.value = data.prop1Email || '';
            if (emailSubject) emailSubject.value = `Votre propriété ${data.adresse} - Prochaines étapes`;
            if (emailBody) emailBody.value = emailContent;
            
            // Scroller vers le compositeur
            document.querySelector('.email-composer-card').scrollIntoView({ behavior: 'smooth' });
            
            console.log('📧 Email généré pour:', data.adresse);
            
        } catch (error) {
            console.error('Erreur génération email:', error);
            alert('❌ Impossible de générer l\'email. Vérifiez votre connexion.');
        }
    }
    
    exportAnalysis(ficheId) {
        const fiche = this.fiches.find(f => f.id === ficheId);
        if (!fiche || !fiche.analyzed) return;
        
        const data = fiche.data;
        const analysis = fiche.analysis;
        
        // Créer contenu exportable
        const exportContent = `
ANALYSE IMMOBILIÈRE COMPLÈTE - CYNTHIA BERNIER
=====================================

Propriété: ${data.adresse}
Client: ${data.prop1Nom}
Date d'analyse: ${new Date(fiche.analyzedAt).toLocaleString('fr-CA')}

INFORMATIONS PROPRIÉTÉ
---------------------
Adresse: ${data.adresse || 'N/A'}
Évaluation municipale: ${data.evaluationMunicipale || 'N/A'}
Année construction: ${data.anneeConstruction || 'N/A'}
Score CANAFE: ${data.scoreCanafe || 'N/A'}/10

ANALYSE IA DÉTAILLÉE
-------------------
${analysis}

CONTACT CLIENT
--------------
Nom: ${data.prop1Nom || 'N/A'}
Téléphone: ${data.prop1Tel1 || 'N/A'}
Email: ${data.prop1Email || 'N/A'}

---
Généré par le système IA de Cynthia Bernier
Courtier immobilier résidentiel - Lebel-sur-Quévillon, Nord-du-Québec
        `;
        
        // Télécharger comme fichier texte
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analyse_${data.adresse?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('📄 Analyse exportée:', data.adresse);
    }
    
    async generateReport() {
        const analyzedFiches = this.fiches.filter(f => f.analyzed);
        
        if (analyzedFiches.length === 0) {
            alert('❌ Aucune fiche analysée disponible pour générer un rapport.');
            return;
        }
        
        try {
            // Calculer statistiques
            const newFichesCount = this.fiches.filter(f => {
                const ficheDate = new Date(f.timestamp);
                const thisMonth = new Date();
                thisMonth.setDate(1);
                return ficheDate >= thisMonth;
            }).length;
            
            const completedAnalysesCount = analyzedFiches.length;
            const soldPropertiesCount = this.fiches.filter(f => f.status === 'sold').length;
            const conversionRate = this.fiches.length > 0 ? Math.round((soldPropertiesCount / this.fiches.length) * 100) : 0;
            
            // Mettre à jour l'onglet rapport
            const reportElements = {
                'newFichesCount': newFichesCount,
                'completedAnalysesCount': completedAnalysesCount,
                'soldPropertiesCount': soldPropertiesCount,
                'conversionRate': conversionRate + '%'
            };
            
            Object.entries(reportElements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            });
            
            // Générer recommandations IA
            await this.generateAIRecommendations(analyzedFiches);
            
            // Basculer vers l'onglet rapport
            showHistoryTab('fiches-report');
            
            console.log('📊 Rapport généré avec succès');
            
        } catch (error) {
            console.error('Erreur génération rapport:', error);
        }
    }
    
    async generateAIRecommendations(analyzedFiches) {
        try {
            const summaryData = analyzedFiches.map(f => ({
                adresse: f.data.adresse,
                score: f.data.scoreCanafe,
                evaluation: f.data.evaluationMunicipale,
                analysis: f.analysis?.substring(0, 200) + '...'
            }));
            
            const prompt = `Basé sur l'analyse de ${analyzedFiches.length} fiches immobilières à Lebel-sur-Quévillon, Nord-du-Québec, générez 5 recommandations stratégiques pour Cynthia Bernier:
            
RÉSUMÉ DES FICHES:
${summaryData.map((f, i) => `${i+1}. ${f.adresse} - Score CANAFE: ${f.score}/10 - Éval: ${f.evaluation}`).join('\n')}

Générez des recommandations pour:

🎯 **PRIORISATION** - Quelles fiches traiter en premier
💰 **STRATÉGIE PRIX** - Ajustements tarifaires recommandés  
📈 **MARKETING** - Approches marketing par type de propriété
🏃 **ACTIONS URGENTES** - Ce qui doit être fait cette semaine
🔮 **OPPORTUNITÉS** - Tendances du marché Nord-du-Québec

Soyez précis et actionnable pour le marché de Lebel-sur-Quévillon.`;

            const recommendations = await this.emailManager.callOpenAIWebApp(prompt, "Tu es un consultant immobilier IA expert du marché du Nord-du-Québec. Fournis des recommandations stratégiques concrètes et actionnables.");
            
            const recommendationsContainer = document.getElementById('aiRecommendations');
            if (recommendationsContainer) {
                recommendationsContainer.innerHTML = `
                    <div class="recommendations-content">
                        ${recommendations.replace(/\n/g, '<br>')}
                    </div>
                    <div class="recommendations-meta">
                        <small>Généré le ${new Date().toLocaleString('fr-CA')} - ${analyzedFiches.length} fiches analysées</small>
                        <button onclick="window.fichesManager.exportRecommendations()" class="btn-export-recommendations">📄 Exporter</button>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Erreur génération recommandations:', error);
            const recommendationsContainer = document.getElementById('aiRecommendations');
            if (recommendationsContainer) {
                recommendationsContainer.innerHTML = '<p>❌ Impossible de générer les recommandations IA.</p>';
            }
        }
    }
    
    filterFiches() {
        const filter = document.getElementById('ficheFilter').value;
        let filteredFiches = [...this.fiches];
        
        switch (filter) {
            case 'analyzed':
                filteredFiches = this.fiches.filter(f => f.analyzed);
                break;
            case 'pending':
                filteredFiches = this.fiches.filter(f => !f.analyzed);
                break;
            case 'high-priority':
                filteredFiches = this.fiches.filter(f => f.priority === 'high');
                break;
            case 'low-score':
                filteredFiches = this.fiches.filter(f => parseInt(f.data.scoreCanafe || 0) < 5);
                break;
            default:
                // 'all' - pas de filtre
                break;
        }
        
        this.renderFilteredFiches(filteredFiches);
    }
    
    searchFiches() {
        const searchTerm = document.getElementById('ficheSearch').value.toLowerCase();
        if (!searchTerm) {
            this.renderFichesList();
            return;
        }
        
        const filteredFiches = this.fiches.filter(f => {
            const data = f.data;
            return (
                data.adresse?.toLowerCase().includes(searchTerm) ||
                data.prop1Nom?.toLowerCase().includes(searchTerm) ||
                data.prop1Tel1?.includes(searchTerm) ||
                data.prop1Email?.toLowerCase().includes(searchTerm)
            );
        });
        
        this.renderFilteredFiches(filteredFiches);
    }
    
    renderFilteredFiches(filteredFiches) {
        // Temporairement remplacer this.fiches pour le rendu
        const originalFiches = this.fiches;
        this.fiches = filteredFiches;
        this.renderFichesList();
        this.fiches = originalFiches;
    }
}

// Fonctions globales pour les événements onclick
function openFormulaire() {
    const formulaireUrl = '/docs/assistant/index.html';
    const newWindow = window.open(formulaireUrl, '_blank', 'width=1200,height=800');
    
    if (!newWindow) {
        alert('⚠️ Popup bloquée.\n\nLe formulaire va s\'ouvrir dans un nouvel onglet.');
        window.open(formulaireUrl, '_blank');
    } else {
        console.log('📝 Formulaire d\'inscription ouvert');
    }
}

function analyzeAllFiches() {
    if (window.fichesManager) {
        window.fichesManager.analyzeAllFiches();
    }
}

function generateReport() {
    if (window.fichesManager) {
        window.fichesManager.generateReport();
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que EmailIAManager soit initialisé
    setTimeout(() => {
        if (window.emailIAManager) {
            window.fichesManager = new FichesIAManager(window.emailIAManager);
            console.log('📋 Gestionnaire de Fiches IA connecté');
        }
    }, 1000);
});