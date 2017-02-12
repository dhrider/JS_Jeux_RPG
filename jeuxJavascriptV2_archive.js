// Constantes de mouvements
var haut = 8;
var bas = 2;
var gauche = 4;
var droite = 6;

// variables concernant les objets du jeu
var nbObstables = 15;
var nbArmes = 4;
var nbJoueurs = 2;
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
var trouveArme = false;
var affiche = "";

// objet Arme
var Arme = {
    // initialisation de l'arme avec en paramêtre le nom et les dégats
    initArme: function(nom, degats){        
        this.nom = nom;
        this.degats = degats;
        this.indexGrille = 0;
    }
};

// objet Joueur
var Joueur = {
     // initialisation du personnage avec son nom et son arme en paramêtres
    initJoueur: function(nom, arme){        
        this.nom = nom;
        this.arme = arme;
        this.pointsDeVie = 100;
        this.indexGrille = 0;
        this.x = 0;
        this.y = 0;
    },
    
    // déplacement
    seDeplacer: function(direction, distance, grille, calque){
        var nouvelIndex = 0;
        var nouvelleCoordonnee = 0;
        switch(direction) // on switche on fonction de la direction
            {
                case haut: // touche 8 du pavé numérique 
                    nouvelIndex = this.indexGrille - distance * 10;
                    nouvelleCoordonnee = grille[this.indexGrille].contenu.getY() - distance * caseHauteur;
                    grille[this.indexGrille].contenu.setY(nouvelleCoordonnee);
                    this.y = nouvelleCoordonnee;
                    break;
                case bas:// touche 2 du pavé numérique
                    nouvelIndex = this.indexGrille + distance * 10;
                    nouvelleCoordonnee = grille[this.indexGrille].contenu.getY() + distance * caseLargeur;
                    grille[this.indexGrille].contenu.setY(nouvelleCoordonnee);
                    this.y = nouvelleCoordonnee;
                    break;
                case gauche:// touche 4 du pavé numérique
                    nouvelIndex = this.indexGrille - distance;
                    nouvelleCoordonnee = grille[this.indexGrille].contenu.getX() - distance * caseHauteur;
                    grille[this.indexGrille].contenu.setX(nouvelleCoordonnee);
                    this.x = nouvelleCoordonnee;
                    break;
                case droite:// touche 6 du pavé numérique 
                    nouvelIndex = this.indexGrille + distance;
                    nouvelleCoordonnee = grille[this.indexGrille].contenu.getX() + distance * caseLargeur;
                    grille[this.indexGrille].contenu.setX(nouvelleCoordonnee);
                    this.x = nouvelleCoordonnee;
                    break;
            };
        var temp = grille[this.indexGrille];
        grille[this.indexGrille] = grille[nouvelIndex];
        grille[nouvelIndex] = temp;
        this.indexGrille = nouvelIndex;
        calque.draw();
    }
};

// création des armes
var baton = Object.create(Arme);
var couteau = Object.create(Arme);
var epee = Object.create(Arme);
var massue =Object.create(Arme);
baton.initArme("baton",5);
couteau.initArme("couteau",10);
epee.initArme("epee",15);
massue.initArme("massue",20);

// création des joueurs
var chevalier = Object.create(Joueur);
var gobelin = Object.create(Joueur);
chevalier.initJoueur("chevalier",baton);
gobelin.initJoueur("gobelin",baton);

// affichage de la page
window.onload = function(){
    carte = new Kinetic.Stage({
        container: "kinetic",
        width: caseLargeur * carteLargeur,
        height: caseHauteur * carteHauteur
    });

    // calque de jeu
    calque = new Kinetic.Layer();

    // initialisation de la grille de jeu
    grille = initGrille(calque);
    
    // initialisation des obstacles
    initObstacles(calque,grille);
    
    // initialisation des armes
    initArmes(calque,grille,baton);
    initArmes(calque,grille,couteau);
    initArmes(calque,grille,epee);
    initArmes(calque,grille,massue);
    
    // initialisation des joueurs
    initJoueurs(calque,grille,chevalier);
    initJoueurs(calque,grille,gobelin);

    // on ajoute les calques à la carte
    carte.add(calque);
    
    // on affiche le lancement du jeu
    affiche = document.getElementById('affichage');
    affiche.innerHTML = "Le tour 1 va commencer :" + "\n\n" + chevalier.nom + " choisissez votre déplacement !" + "\n";
}

// fonction de jeu
function joue()
{
    // jeu
    nbTours++; // incrémentation du nombre de tours
    
    // on vide l'affichage
    affiche.innerHTML = "";
    
    // variable qui contiendra le joueur qui doit jouer son tour et le suivant
    var joueurActif = "";
    var joueurSuivant = "";

    // variable permettant de vérifier si le déplacement est possible
    var deplaceOk = false;
    
    // variables récupérant le choix du joueur
    var direction = document.querySelectorAll("input[name=dir]:checked");
    var distance = document.querySelectorAll("input[name=dist]:checked");

    // si le numéro du tour est :
    if (nbTours%2 == 1){
        joueurActif = chevalier; // impair = joueur 1 actif
        joueurSuivant = gobelin;
    }
    else {
        joueurActif = gobelin; // pair = jouer 2 actif
        joueurSuivant = chevalier;
    }    
    
    if (!errDeplacement)
        affiche.innerHTML = "\n" + joueurActif.nom + " le tour " + nbTours + " va commencer!" + "\n";

    var joueDirection = parseInt(direction[0].value);     
    var joueDistance = parseInt(distance[0].value);
   
    // on teste s'il n'y a pas d'obstacles sur le parcours du déplacement
    if (deplacementPossible(joueurActif,joueDirection,joueDistance,grille)){
        affiche.innerHTML += "\n" + "Déplacement possible." + "\n";
        joueurActif.seDeplacer(joueDirection,joueDistance,grille,calque); // on déplace le joueur
        affiche.innerHTML += "\n" + "Le joueur " + joueurActif.nom + " s'est déplacé de " + joueDistance + " case(s) vers le(la) " + direction[0].id + "\n" +
                             "\n" + joueurSuivant.nom + " a vous de jouer maintenant !";
        errDeplacement = false;
    }
    else {
        nbTours--;
        errDeplacement = true;
        affiche.innerHTML += "\n" + "déplacement impossible !" + "\n" + joueurActif.nom + " réessayez un autre déplacement !" + "\n";
    } 
}

// fonction random
function randomCase(nbCasesCarte){
    return Math.floor((Math.random() * nbCasesCarte-1) + 1);
}

// fonction d'initialisation de la grille de jeu
function initGrille(calque){
    var colonnes = carteLargeur;
    var lignes = carteHauteur;
    var obj = "";
    var cont = "";
    
    for (var l = 0; l < lignes; l++)
        for (var c = 0; c < colonnes; c++){
            cellule = {
                "dessin": obj = new Kinetic.Rect({
                            x: c * caseLargeur,
                            y: l * caseHauteur,
                            name: 'case',
                            width: caseLargeur,
                            height: caseHauteur,
                            stroke: "black",
                            strokeWidth: 3
                        }),
                "contenu": cont
            };
            
            calque.add(obj);
            grille.push(cellule);
        }
    
    return grille;
}

// fonction d'initialisation des obstacles
function initObstacles(calque, grille){
    for (var nb = 0; nb < nbObstables; nb++){
        var initOk = false;
        var index = randomCase(carteTotalCases);
        
        while(!initOk){
            if (elementsDeJeu.indexOf(index) == -1){
                grille[index].dessin.attrs.fill = 'black';
                grille[index].dessin.attrs.name = 'obstacle';
                initOk = true;
                elementsDeJeu.push(index);
                obstacles.push(index);
            }
            else
                index = randomCase(carteTotalCases);
        }
    }
    calque.draw();
}

// fonction d'initialisation des armes
function initArmes(calque, grille, arme){
    var obj = ""
    var initOk = false;
    var index = 0;
    
    while (!initOk){
        index = randomCase(carteTotalCases);
        
        if (elementsDeJeu.indexOf(index) == -1){
            obj = new Kinetic.Text({
                x: grille[index].dessin.attrs.x,
                y: grille[index].dessin.attrs.y,
                width: caseLargeur,
                height: caseHauteur,
                name: 'arme', 
                text: arme.nom,
                fontSize: 14,
                fontFamily: 'Calibri',
                align: 'center',
                fill: 'black'
            });
            
            grille[index].contenu = obj;
            initOk = true;
            elementsDeJeu.push(index);
            armes.push(index);
            arme.indexGrille = index;
            console.log(armes);
        }
    }
    
    calque.add(obj);
    calque.draw();
}

// fonction d'initialisation des joueurs
function initJoueurs(calque, grille, joueur){
    var obj = "";
    var initOk = false;
    var index = 0;
    
    while (!initOk){
        index = randomCase(carteTotalCases);
        
        if (elementsDeJeu.indexOf(index) == -1 && zoneNonContactJoueur.indexOf(index) == -1){
            obj = new Kinetic.Text({
                x: grille[index].dessin.attrs.x,
                y: grille[index].dessin.attrs.y,
                width: caseLargeur,
                height: caseHauteur,
                name: 'joueur', 
                text: joueur.nom + "\n" + joueur.arme.nom,
                fontSize: 14,
                fontFamily: 'Calibri',
                align: 'center',
                fill: 'black'
            });
            
            grille[index].contenu = obj;
            initOk = true;
            elementsDeJeu.push(index);
            joueurs.push(index);
            zoneNonContactJoueur.push(index,index-1,index+1,index-10,index+10,index-11,index+11,index-9,index+9);
            joueur.indexGrille = index;
            joueur.x = grille[index].dessin.attrs.x;
            joueur.y = grille[index].dessin.attrs.y;
        }
    }
    
    calque.add(obj);
    calque.draw();
}

// function de vérification du déplacement : pas d'obstacles au passage, ni arrivée en dehors de la carte
function deplacementPossible(joueur, direction, distance, grille){
    var casesDeplacement = [];
    var indexJoueur = joueur.indexGrille;
    var xJoueurArrivee = 0;
    var yJoueurArrivee = 0;
    var trouveObstacle = false;
    var index = 0;
    
    switch (direction){
        case haut:
            casesDeplacement.push(indexJoueur - 10, indexJoueur - 20, indexJoueur - 30);
            yJoueurArrivee = joueur.y - distance * caseHauteur;
            break;
        case bas:
            casesDeplacement.push(indexJoueur + 10, indexJoueur + 20, indexJoueur + 30);
            yJoueurArrivee = joueur.y + distance * caseHauteur;
            break;
        case gauche:
            casesDeplacement.push(indexJoueur - 1, indexJoueur - 2, indexJoueur - 3);
            xJoueurArrivee = joueur.x - distance * caseLargeur;
            break;
        case droite:
            casesDeplacement.push(indexJoueur + 1, indexJoueur + 2, indexJoueur + 3);
            xJoueurArrivee = joueur.x + distance * caseLargeur;
            break;
    }
    
    for (var i = 0; i < distance; i++){
        if (yJoueurArrivee < 0 || yJoueurArrivee > 540 || xJoueurArrivee < 0 || xJoueurArrivee > 540)
            trouveObstacle = true;
        else if (grille[casesDeplacement[i]].dessin.attrs.name == 'obstacle')
            trouveObstacle = true;
    }
    
    if (trouveObstacle)
        return false;
    else
        return true;
}