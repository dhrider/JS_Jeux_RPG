// Constantes de mouvements
var haut = 8;
var bas = 2;
var gauche = 4;
var droite = 6;

// variables concernant les objets du jeu
var nbObstables = 15;
var elementsDeJeu = [];
var obstacles = [];
var armes = [];
var joueurs = [];
var zoneNonContactJoueur = [];

// Tailles des cases
var caseHauteur = 60;
var caseLargeur = 60;

// Variables concernant la carte de jeu
var carteHauteur = 10;
var carteLargeur = 10;
var carteTotalCases = carteHauteur * carteLargeur;
var carte = "";
var calque = "";
var grille = [];

// variables en cours de jeu
var nbTours = 0;
var errDeplacement = false;
var affiche = "";
var joueurActif = "";
var joueurSuivant = "";

// objet Arme
var Arme = {
    // initialisation de l'arme avec en paramêtre le nom et les dégats
    initArme: function(nom, degats)
    {        
        this.nom = nom;
        this.degats = degats;
        this.indexGrille = 0;
    },
    
    // update de l'objet
    update: function(nouvellesDonnees)
    {
        this.nom = nouvellesDonnees.nom;
        this.degats = nouvellesDonnees.degats;
        this.indexGrille = nouvellesDonnees.indexGrille;
    }
};

// objet Joueur
var Joueur = {
     // initialisation du personnage avec son nom et son arme en paramêtres
    initJoueur: function(nom)
    {        
        this.nom = nom;
        this.arme = "";
        this.armeTrouvee = "";
        this.armeDeposee = "";
        this.armeChangee = false;
        this.pointsDeVie = 100;
        this.indexGrille = 0;
        this.row = 0;
        this.col = 0;
        this.zoneCombat = [];
        this.seDefend = false;
    },
    
    // déplacement
    seDeplacer: function(direction, distance, grille, calque, armes)
    {
        var ancienIndexJoueur = this.indexGrille;
        
        switch(direction)
        { // on switche on fonction de la direction
            case haut: 
                this.indexGrille -= distance * 10; // on change l'indexGrille actuel par celui de destination
                this.row -= distance; // idem pour la ligne                   
                break;
            case bas:
                this.indexGrille += distance * 10;
                this.row += distance;
                break;
            case gauche:
                this.indexGrille -= distance ;
                this.col -= distance;
                break;
            case droite:
                this.indexGrille += distance;
                this.col += distance;
                break;
        }
        
        updateZoneCombatJoueur(this,this.indexGrille); // mise à jour de la zone de combat
        this.arme.indexGrille = this.indexGrille; // on change également l'index de l'arme portée
        
        // on boucle dans le tableau des armes pour chercher si arrive sur une arme
        for (var element in armes) 
        {
            // à condition que l'on a le même index et que le nom n'est pas identique sinon la condition serait toujours vrai)
            if (armes[element].indexGrille == this.indexGrille && armes[element].nom != this.arme.nom) {
                this.armeTrouvee = armes[element]; // on stocke l'arme trouvée
                //armes[element] = this.arme; // on change l'arme dans son tableau
                break;
            }
        }
        
        // si une arme a été trouvée
        if (this.armeTrouvee)
        {
            // on efface l'ancienne position dans la grille de jeu
            grille[ancienIndexJoueur].contenu.setName('vide');
            grille[ancienIndexJoueur].contenu.setText("");
            
            // on change l'affichage de la case où l'on est arrivée
            grille[this.indexGrille].contenu.setName('joueur');
            grille[this.indexGrille].contenu.setText(this.nom + "\n" + this.armeTrouvee.nom + "\n" + "-------" + "\n" + this.arme.nom);
            
            this.armeDeposee = this.arme; // on stocke l'arme déposée
            this.arme = this.armeTrouvee; // l'arme trouvée devient l'arme du joueur
            this.armeChangee = true; // booléen à true : qui servira lorsque l'on quiterra la case
            
            affiche.innerHTML += "\n" + this.nom + " a trouvé " + this.armeTrouvee.nom + " et a laissé " + this.armeDeposee.nom + "\n";
            
            this.armeTrouvee = ""; // on efface l'arme trouvée du joueur pour le tour suivant
        }
        else
        { // si on a pas trouvée d'arme
            if (this.armeDeposee && this.armeChangee)
            { // et si le joueur possède une nouvelle arme c'est que l'on quitte la case arme
                // la case arme que l'on quitte est réaffichée avec l'arme déposée
                grille[ancienIndexJoueur].contenu.setName('arme');
                grille[ancienIndexJoueur].contenu.setText(this.armeDeposee.nom);
                
                // on change l'index de l'arme déposée
                switch (this.armeDeposee.nom)
                {
                    case "baton":
                        baton.indexGrille = ancienIndexJoueur;
                        break;
                    case "couteau":
                        couteau.indexGrille = ancienIndexJoueur;
                        break;
                    case "dague":
                        dague.indexGrille = ancienIndexJoueur;
                        break;
                    case "epee":
                        epee.indexGrille = ancienIndexJoueur;
                        break;
                    case "massue":
                        massue.indexGrille = ancienIndexJoueur;
                        break;
                    case "lance":
                        lance.indexGrille = ancienIndexJoueur;
                        break;
                }
                
                // la nouvelle case destination est affichée avec le joueur et sa nouvelle arme
                grille[this.indexGrille].contenu.setText(this.nom + "\n" + this.arme.nom);
                grille[this.indexGrille].contenu.setName('joueur');
                
                // on réinitialise les paramêtres du joueur en vue du prochain changement d'arme
                this.armeDeposee = "";
                this.armeChangee = false;
            }
            else 
            { // ou si le joueur n'a pas changé d'arme au dernier tour
                grille[ancienIndexJoueur].contenu.setName('vide');
                grille[ancienIndexJoueur].contenu.setText("");
                
                grille[this.indexGrille].contenu.setText(this.nom + "\n" + this.arme.nom);
                grille[this.indexGrille].contenu.setName('joueur')
            }
        }
        
            
        calque.draw(); // réaffichage du calque
    },
    
    // update 
    update: function(nouvellesDonnees)
    {
        this.nom = nouvellesDonnees.nom;
        this.arme = nouvellesDonnees.arme;
        this.armeTrouvee = nouvellesDonnees.armeTrouvee;
        this.armeDeposee = nouvellesDonnees.armeDeposee;
        this.armeChangee = nouvellesDonnees.armeChangee;
        this.pointsDeVie = nouvellesDonnees.pointsDeVie;
        this.indexGrille = nouvellesDonnees.indexGrille;
        this.row = nouvellesDonnees.row;
        this.col = nouvellesDonnees.col;
        this.zoneCombat = nouvellesDonnees.zoneCombat;
        this.seDefend = nouvellesDonnees.seDefend;
    }
};

// fonction d'initialisation de la grille de jeu
function initGrille(calque)
{
    var colonnes = carteLargeur;
    var lignes = carteHauteur;
    var obj = "";
    var cont = "";
    
    // création de la grille
    for (var l = 0; l < lignes; l++) // on boucle chaque ligne
    {
        for (var c = 0; c < colonnes; c++) { // on boucle chaque colonne
            // création d'une cellule de la grille
            cellule = {
                "row": l, // ligne
                "col": c, // colonne
                "dessin": obj = new Kinetic.Rect({ //contient le dessin de la case vide
                    x: c * caseLargeur,
                    y: l * caseHauteur,
                    name: 'case',
                    width: caseLargeur,
                    height: caseHauteur,
                    stroke: "black",
                    strokeWidth: 3
                }),
                "contenu": cont = new Kinetic.Text({ // contient le texte affiché : initialisé vide
                    x: c * caseLargeur,
                    y: l * caseHauteur,
                    width: caseLargeur,
                    height: caseHauteur,
                    name: "vide",
                    text: "",
                    fontSize: 14,
                    fontFamily: 'Calibri',
                    align: 'center',
                    fill: 'black'
                })
            };

            calque.add(obj);
            calque.add(cont);
            grille.push(cellule);
        }
    }
    
    return grille;
}

// fonction d'initialisation des obstacles
function initObstacles(calque, grille)
{
    // on boucle en fonction du nombre d'obstacles choisit
    for (var nb = 0; nb < nbObstables; nb++)
    {
        var initOk = false;
        var index = randomCase(carteTotalCases); // placement aléatoire
        
        // tant que l'on a pas un index libre
        while(!initOk)
        {
            if (elementsDeJeu.indexOf(index) == -1)
            { // si index absent du tableau éléments de jeu donc libre
                grille[index].dessin.setFill('black'); // la case est noirci
                grille[index].dessin.setName('obstacle'); // on change son attribut "name"
                initOk = true;
                elementsDeJeu.push(index);
                obstacles.push(index);
            }
            else // si déjà existant on refait un tirage
                index = randomCase(carteTotalCases);
        }
    }
    calque.draw();
    
    return obstacles;
}

// fonction d'initialisation des armes
function initArmes(calque, grille, arme)
{
    var initOk = false;
    var index = 0;
    
    // tant que l'on a pas un index libre
    while (!initOk)
    {
        index = randomCase(carteTotalCases);
        
        if (elementsDeJeu.indexOf(index) == -1)
        { // si libre on ajoute l'arme sur la grille
            grille[index].contenu.setName('arme');
            grille[index].contenu.setText(arme.nom);
            initOk = true;
            elementsDeJeu.push(index);
            armes.push(arme);
            arme.indexGrille = index;
        }
    }
    
    calque.draw(); // on met à jour le calque 
    
    return armes;
}

// fonction d'initialisation des joueurs
function initJoueurs(calque, grille, joueur, arme)
{
    var initOk = false;
    var index = 0;
    joueur.arme = arme; // on affecte une arme au joueur
    
    // tant que l'on a pas un index libre
    while (!initOk)
    {
        index = randomCase(carteTotalCases);
        // si pas dans l'index des éléments et que les joueurs ne sont pas sur des cases adjacentes et que le joueur n'est pas entouré d'obstacles
        if (elementsDeJeu.indexOf(index) == -1 && zoneNonContactJoueur.indexOf(index) == -1 && initJoueurSansObstacles(index,grille))
        {
            // ajout du joueur à la grille
            grille[index].contenu.setName('joueur');
            grille[index].contenu.setText(joueur.nom + "\n" + arme.nom);
            
            initOk = true;
            
            arme.indexGrille = index; // on affecte l'index du joueur à l'arme qu'il possède
            
            // on affecte la position au joueur
            joueur.indexGrille = index;
            joueur.row = grille[index].row;
            joueur.col = grille[index].col;
            
            // on crée sa zone de nom contact pour que l'autre joueur ne soit pas positionné à un niveau adjacent (horizontalement et verticalement)
            zoneNonContactJoueur.push(index,index-1,index+1,index-10,index+10,index-11,index+11,index-9,index+9); // tableau délimitant la zone vide autour du joueur
            
            updateZoneCombatJoueur(joueur,index); // on crée sa zone de combat
            
            // on remplit les tableaux
            elementsDeJeu.push(index);
            armes.push(arme);
            joueurs.push(joueur);
        }
    }
    
    calque.draw(); // on met à jour le calque 
    
    return joueurs;
}

// fonction empèchant le position initial d'un joueur entre 4 obstacle (l'empèchant ainsi de bouger)
function initJoueurSansObstacles(index, grille)
{
    // on vérifie qu'il n'y a pas d'obstacles ni à gauche, ni à droite, ni en haut, ni en bas
    if (grille[index+1].dessin.getName() == 'obstacle' && grille[index-1].dessin.getName() == 'obstacle' &&
        grille[index+10].dessin.getName() == 'obstacle' && grille[index-10].dessin.getName() == 'obstacle')
        return false; // s'il y en a, on retourne false pour empêcher le positionnement du jouer
    else
        return true;
}

// création des armes (objets)
var baton = Object.create(Arme);
var couteau = Object.create(Arme);
var dague = Object.create(Arme);
var epee = Object.create(Arme);
var massue = Object.create(Arme);
var lance = Object.create(Arme);

// initialisation des armes
baton.initArme("baton",5);
couteau.initArme("couteau",10);
dague.initArme("dague",10);
epee.initArme("epee",15);
massue.initArme("massue",20);
lance.initArme("lance",25);

// création des joueurs (objets)
var chevalier = Object.create(Joueur);
var gobelin = Object.create(Joueur);

// initialisation des joueurs
chevalier.initJoueur("chevalier");
gobelin.initJoueur("gobelin");

// affichage de la page
window.onload = function()
{
    // on crée la carte de jeu
    carte = new Kinetic.Stage({
        container: "kinetic",
        width: caseLargeur * carteLargeur,
        height: caseHauteur * carteHauteur
    });

    // calque de jeu
    calque = new Kinetic.Layer();

    // initialisation de la grille de jeu
    initGrille(calque);
    
    // si localStorage contient un enregistrement
    if (localStorage.length != 0)
    {
        // on demande si on veut jouer avec la partie sauvagardée
        var ok = confirm("Voulez vous jouer avec la partie sauvegardée ?");
        
        if (ok)
        { // si oui on update les objets
            // on update les armes avec la sauvegarde
            baton.update(JSON.parse(localStorage.getItem("baton")));
            couteau.update(JSON.parse(localStorage.getItem("couteau")));
            dague.update(JSON.parse(localStorage.getItem("dague")));
            epee.update(JSON.parse(localStorage.getItem("epee")));
            massue.update(JSON.parse(localStorage.getItem("massue")));
            lance.update(JSON.parse(localStorage.getItem("lance")));

            // on update les joueurs avec la sauvegarde
            chevalier.update(JSON.parse(localStorage.getItem("chevalier")));
            gobelin.update(JSON.parse(localStorage.getItem("gobelin")));
        }
        else // sinon on efface la sauvegarde
            localStorage.clear();
    }
    
    // S'il n'y a pas de sauvegarde dans localStorage
    if (localStorage.length == 0)
    {
        // initialisation des obstacles
        initObstacles(calque,grille);

        // initialisation des armes affichées sur la grille
        initArmes(calque,grille,baton);
        initArmes(calque,grille,epee);
        initArmes(calque,grille,massue);
        initArmes(calque,grille,lance);

        // initialisation des joueurs affichés sur la grille avec leur arme respective
        initJoueurs(calque,grille,chevalier,couteau);
        initJoueurs(calque,grille,gobelin,dague);
    }
    // si une sauvegarde est existante
    else
    {
        // placement des obstacles
        var tabObstacles = localStorage.getItem("obstaclesIndex").split(","); // on récupère le tableau des obstales
        obstacles = tabObstacles;
        
        // on boucle le tableau pour dessiner les obstacles
        for (var o in tabObstacles)
        {
            grille[parseInt(tabObstacles[o])].dessin.setFill('black');
            grille[parseInt(tabObstacles[o])].dessin.setName('obstacle');
        }
        
        // placement des armes
        // on redéfinit le tableau des armes
        armes = [];
        armes.push(baton);
        armes.push(couteau);
        armes.push(dague);
        armes.push(epee);
        armes.push(massue);
        armes.push(lance);
        
        // on dessine les armes sur la grille
        grille[baton.indexGrille].contenu.setName('arme');
        grille[baton.indexGrille].contenu.setText(baton.nom);
        
        grille[couteau.indexGrille].contenu.setName('arme');
        grille[couteau.indexGrille].contenu.setText(couteau.nom);
        
        grille[dague.indexGrille].contenu.setName('arme');
        grille[dague.indexGrille].contenu.setText(dague.nom);
        
        grille[epee.indexGrille].contenu.setName('arme');
        grille[epee.indexGrille].contenu.setText(epee.nom);
        
        grille[massue.indexGrille].contenu.setName('arme');
        grille[massue.indexGrille].contenu.setText(massue.nom);
        
        grille[lance.indexGrille].contenu.setName('arme');
        grille[lance.indexGrille].contenu.setText(lance.nom);
        
        // placemnt des joueurs
        // on redéfinit le tableau des joueurs
        joueurs = [];
        joueurs.push(chevalier);
        joueurs.push(gobelin);
        
        // on dessine les joueurs sur la grille
        grille[chevalier.indexGrille].contenu.setName('joueur');
        grille[chevalier.indexGrille].contenu.setText(chevalier.nom + "\n" + chevalier.arme.nom);
        
        grille[gobelin.indexGrille].contenu.setName('joueur');
        grille[gobelin.indexGrille].contenu.setText(gobelin.nom + "\n" + gobelin.arme.nom);
        
        // on remet à jour la zone de combat de chaque joueur
        updateZoneCombatJoueur(chevalier,chevalier.indexGrille);
        updateZoneCombatJoueur(gobelin,gobelin.indexGrille);
        
        calque.draw();
    }

    // on ajoute les calques à la carte
    carte.add(calque);
    
    // on affiche le lancement du jeu
    affiche = document.getElementById('affichage');
    affiche.innerHTML = "Le tour 1 va commencer :" + "\n\n" + chevalier.nom + " choisissez votre déplacement !" + "\n";
};

// sauvegarde ou non avant de quitter la page
window.onbeforeunload = function()
{
    // on récupère l'état des boutons radios
    var choix = document.querySelectorAll("input[name=save]:checked");
    var c = parseInt(choix[0].value);
    
    // si on a cliqué sur sauvegarde
    if (c == 1){
        // on sauvegarde
        localStorage.setItem("obstaclesIndex",obstacles);
        
        localStorage.setItem("baton", JSON.stringify(baton)); // utilisation de stringify pour convertitr l'objet en string
        localStorage.setItem("couteau", JSON.stringify(couteau));
        localStorage.setItem("dague", JSON.stringify(dague));
        localStorage.setItem("epee", JSON.stringify(epee));
        localStorage.setItem("massue", JSON.stringify(massue));
        localStorage.setItem("lance", JSON.stringify(lance));
        
        localStorage.setItem("chevalier", JSON.stringify(chevalier));
        localStorage.setItem("gobelin", JSON.stringify(gobelin));
        
        return "La partie va être sauvegardée pour la prochaine ouverture de la page !";
    }
    // si pas de sauvagarde
    else
        localStorage.clear(); // on efface les données sauvegardées précedemment
};

// fonction de jeu
function joue()
{
    // jeu
    nbTours++; // incrémentation du nombre de tours
    
    // on vide l'affichage
    affiche.innerHTML = "";

    // variable permettant de vérifier si le déplacement est possible
    var deplaceOk = false;
    
    // variables récupérant le choix du joueur
    var direction = document.querySelectorAll("input[name=dir]:checked");
    var distance = document.querySelectorAll("input[name=dist]:checked");

    // si le numéro du tour est :
    if (nbTours%2 == 1)
    {
        joueurActif = chevalier; // impair = joueur 1 actif
        joueurSuivant = gobelin;
    }
    else
    {
        joueurActif = gobelin; // pair = jouer 2 actif
        joueurSuivant = chevalier;
    }    
    
    if (!errDeplacement)
        affiche.innerHTML = "\n" + joueurActif.nom + " le tour " + nbTours + " va commencer!" + "\n";

    var joueDirection = parseInt(direction[0].value);     
    var joueDistance = parseInt(distance[0].value);
   
    // on teste s'il n'y a pas d'obstacles sur le parcours du déplacement
    if (deplacementPossible(joueurActif,joueDirection,joueDistance,grille))
    {
        // si déplacement possible
        affiche.innerHTML += "\n" + "Déplacement possible." + "\n";
        
        joueurActif.seDeplacer(joueDirection,joueDistance,grille,calque, armes); // on déplace le joueur
        
        affiche.innerHTML += "\n" + "Le joueur " + joueurActif.nom + " s'est déplacé de " + joueDistance + " case(s) vers le(la) " + direction[0].id + "\n" +
                             "\n" + joueurSuivant.nom + " a vous de jouer maintenant !";
        
        // si on arrive dans la zone de combat du joueur suivant
        if (joueurActif.zoneCombat.indexOf(joueurSuivant.indexGrille) != -1)
        {
            // on affiche les boutons attaque et défendre
            document.getElementById("attaquer").style.visibility = "visible";
            document.getElementById("defendre").style.visibility = "visible";
            document.getElementById("jouer").style.visibility = "hidden"; // on cache le bouton jouer pour empêcher les déplacements
            
            affiche.innerHTML = "Le combat entre " + joueurActif.nom + " et " + joueurSuivant.nom + " va commencer !" + "\n\n" +
                                joueurActif.nom + " a " + joueurActif.pointsDeVie + " points de vie." + "\n" + 
                                joueurSuivant.nom + " a " + joueurSuivant.pointsDeVie + " points de vie." + "\n" +
                                joueurActif.nom + " va attaquer !";
            
            nbTours = 0;
        }
        errDeplacement = false;
    }
    else
    { // si déplacement impossible
        nbTours--; // on décrémente le nombre de tour comme on reste dans le tour actuel
        errDeplacement = true;
        affiche.innerHTML += "\n" + "déplacement impossible !" + "\n" + joueurActif.nom + " réessayez un autre déplacement !" + "\n";
    } 
}

// fonction random
function randomCase(nbCasesCarte)
{
    return Math.floor((Math.random() * nbCasesCarte-1) + 1);
}



// function de vérification du déplacement : pas d'obstacles au passage, ni arrivée en dehors de la carte
function deplacementPossible(joueur, direction, distance, grille)
{
    var casesDeplacement = [];
    var indexJoueur = joueur.indexGrille;
    var JoueurRowArrivee = 0;
    var JoueurColArrivee = 0;
    var trouveObstacle = false;
    
    // en fonction de la direction choisie on stocke les index que le joueur va passer ainsi que les lignes et colonnes d'arrivée
    switch (direction)
    {
        case haut:
            casesDeplacement.push(indexJoueur - 10, indexJoueur - 20, indexJoueur - 30);
            JoueurRowArrivee = joueur.row - distance;
            break;
        case bas:
            casesDeplacement.push(indexJoueur + 10, indexJoueur + 20, indexJoueur + 30);
            JoueurRowArrivee = joueur.row + distance;
            break;
        case gauche:
            casesDeplacement.push(indexJoueur - 1, indexJoueur - 2, indexJoueur - 3);
            JoueurColArrivee = joueur.col - distance;
            break;
        case droite:
            casesDeplacement.push(indexJoueur + 1, indexJoueur + 2, indexJoueur + 3);
            JoueurColArrivee = joueur.col + distance;
            break;
    }
    
    // on boucle en fonction de la distance jouée
    for (var i = 0; i < distance; i++)
    {
        // si on sort de la grille ou qu'il y a un obstacle ou un joueur sur le chemin on empèche le déplacement en passant le booléen à "true"
        if (JoueurRowArrivee < 0 || JoueurRowArrivee > 9 || JoueurColArrivee < 0 || JoueurColArrivee > 9)
            trouveObstacle = true;
        else if (grille[casesDeplacement[i]].dessin.getName() == 'obstacle' || grille[casesDeplacement[i]].contenu.getName() == 'joueur')
            trouveObstacle = true;
    }
    
    if (trouveObstacle)
        return false; // si obstacle on renvoit "false" à la fonction deplacementPossible
    else
        return true; // sinon "true"
}

// function mise à jour zone de combat du joueur
function updateZoneCombatJoueur(joueur,index)
{
    joueur.zoneCombat = [];
    joueur.zoneCombat.push(index-1,index+1,index-10,index+10);
}