// tableau des obstacles, armes et joueurs
var obstacles = [];
var armes = [];
var joueurs = [];

// variables de jeu
var jeuEnCours = true;
var nbTours = 0;
var valideChoix = false; 
var errDeplacement = false;
var showArme1 = false;
var showArme2 = false;
var showArme3 = false;
var showArme4 = false;
var joueurChangeArme = "";

// objet case vide
var caseVide = {
    // initialisation de la case
    initCase: function(){
        this.bloque = false;
        this.x = 0;
        this.y = 0;
        this.id = 0;
    },
    
    // fonction dessinant la case avec les positions x et y en cours
    dessiner: function(posX, posY, pos){
        
        // on crée l'objet carré vide avec Kinetic
        var carre = new Kinetic.Rect({
                    x: posX,
                    y: posY,
                    name: 'caseVide',
                    width: 60,
                    height: 60,
                    stroke: "black",
                    strokeWidth: 3
                });
        
        this.x = posX;
        this.y = posY;
        this.id = pos;
        
        return carre;
    }
};

// objet obstacle
var caseObstacle = {
    // initialisation de la case
    initCase: function(){
        this.bloque = true;
        this.x = 0;
        this.y = 0;
    },
    
    // fonction dessinant la case avec les positions x et y en cours
    dessiner: function(posX, posY){
        
        // on crée l'objet carré plein avec Kinetic
        var carre = new Kinetic.Rect({
                    x: posX,
                    y: posY,
                    name: 'caseObstacle',
                    width: 60,
                    height: 60,
                    fill: "black"
                });
        
        this.x = posX;
        this.y = posY;
        
        return carre;
    }
};

// objet arme
var Arme = {
    // initialisation de l'arme avec en paramêtre le nom et les dégats
    initArme: function(nom, degats){        
        this.nom = nom;
        this.degats = degats;
        this.x = 0;
        this.y = 0;
    },
    
    // fonction dessinant l'arme avec les position x et y 
    dessiner: function(posX,posY){
        
        // on crée l'objet text avec Kinetic
         var t = new Kinetic.Text({
                    x: posX,
                    y: posY,
                    width: 60,
                    height: 60,
                    name: 'arme', // name commun à toutes les armes
                    id: this.nom, // id unique
                    text: this.nom,
                    fontSize: 14,
                    fontFamily: 'Calibri',
                    align: 'center',
                    fill: 'black'
                });
        
        // on affecte les positions x et y de l'objet arme en fonction de la position ou elle est dessinée
        this.x = posX;
        this.y = posY;
        
        return t;
    }
};

// objet personnage
var Personnage = {
    // initialisation du personnage avec son nom et son arme en paramêtres
    initPersonnage: function(nom, arme){
        
        this.nom = nom;
        this.arme = arme;
        this.pointsDeVie = 100;
        this.x = 0;
        this.y = 0;
    },
    
    // fonction déplacant le personnage avec la direction, la distance et la calque en cours en paramêtres
    seDeplacer: function(direction, distance, calque){
        
            var pX = this.x;
            var pY = this.y;
        
            switch(direction) // on switche on fonction de la direction
            {
                case 8: // touche 8 du pavé numérique : vers le haut
                    pY -= distance*60;
                    break;
                case 6:// touche 6 du pavé numérique : vers la gauche
                    pX += distance*60;
                    break;
                case 2:// touche 2 du pavé numérique : vers le bas
                    pY += distance*60;
                    break;
                case 4:// touche 4 du pavé numérique : vers la droite
                    pX -= distance*60;
                    break;
            }
        
            // on affecte les positions x et y de l'objet personnage en fonction de la position ou il est déplacé
            this.x = pX;
            this.y = pY;
        
            // on récupère le calque du personnage concernée
            var c = calque.get("#" + this.nom);
        
            // on réaffecte ses attributs x et y
            c.setX(pX);
            c.setY(pY);
        
            return this.x, this.y, c;
    },
    
    // fonction déssinant le personnage avec son arme avec en paramêtres la position x et y
    dessiner: function(posX,posY){
        
        var nomJoueurArme = this.nom + "\n" + this.arme.nom;
        
        var t = new Kinetic.Text({
                    x: posX,
                    y: posY,
                    width: 60,
                    height: 60,
                    id: this.nom,
                    name: 'joueur',
                    text: nomJoueurArme,
                    fontSize: 16,
                    fontFamily: 'Calibri',
                    align: 'center',
                    fill: 'black'
                });
        
        // on affecte les positions x et y de l'objet personnage en fonction de la position ou il est dessiné
        this.x = posX;
        this.y = posY;
        
        return t;
    },
    
    // fonction gérant la récupération de l'arme trouvée
    changeArme: function(arme){
        
        var nomJoueurArme = this.nom + "\n" + arme.nom;
        
        var t = new Kinetic.Text({
                    x: this.x,
                    y: this.y,
                    width: 60,
                    height: 60,
                    id: this.nom,
                    name: 'joueur',
                    text: nomJoueurArme,
                    fontSize: 16,
                    fontFamily: 'Calibri',
                    align: 'center',
                    fill: 'black'
                });
        
        return t;
    }
};

// on crée le éléments du plateau de jeu : case vide + case obstacle
var casVide = Object.create(caseVide);
var casObtacle = Object.create(caseObstacle);
                
casVide.initCase();
casObtacle.initCase();

// on crée les 2 joueurs
var joueur1 = Object.create(Personnage);
var joueur2 = Object.create(Personnage);

// on crée les 4 armes
var arme1 = Object.create(Arme);
var arme2 = Object.create(Arme);
var arme3 = Object.create(Arme);
var arme4 = Object.create(Arme);

// on initialise les armes
arme1.initArme("baton",5);
arme2.initArme("couteau",10);
arme3.initArme("epee",15);
arme4.initArme("massue",20);

// on initialise les joueurs
joueur1.initPersonnage("guerrier",arme1);
joueur2.initPersonnage("gobelin",arme1);

// définition de la variable scène
var scene = "";

// définition de la variable calque
var calque = "";

// dévinition de la variable d'affichage des infos
var affiche = "";

//variables position x et y à 0
var xPosition = 0;
var yPosition = 0;

// variables servant à la création des obstacles aléatoires
var nbObstables = 0;
var nbObstaclesMax = 30;
var positionObstacle = 0;
var positionObstacleOk = false;
var aleatoireObstacle = 0;

 // variables pour le positionnement aléatoire des armes
var nbArmes = 0;
var nbArmesMax = 4;
var positionArme = 0;
var positionArmeOk = false;
var aleatoireArme = 0;
var indexArmes = 0;

// variables pour le positionnement des joueurs
var nbJoueurs = 0;
var nbJoueursMax = 2;
var positionJoueur = 0;
var positionJoueurOk = false;
var aleatoireJoueur = 0;
var indexJoueur = 0;

// chargement de la page et dessin de la carte de jeux avec armes et joueurs
window.onload = function(){
    
    // définition de la variable scène
    scene = new Kinetic.Stage({        
        container: "kinetic",
        width: 600,
        height: 600
    });

    // définition de la variable calque
    calque = new Kinetic.Layer();
    
    // on remplit le tableau obstacles de 30 obstacles aléatoires
    while (nbObstables != nbObstaclesMax) // tant qu'on a pas 30 obstaces, on boucle
    {
        while (!positionObstacleOk)// on boucle tant qu'on a pas un emplacement libre
        {
            aleatoireObstacle = Math.floor((Math.random() * 100) + 1);
                   
            // si on ne trouve pas déjà l'obstacles dans le tableau obtacles
            if (obstacles.indexOf(aleatoireObstacle) == -1)
            {
                obstacles.push(aleatoireObstacle); // on rajoute dans le tableau
                positionObstacleOk = true; // on passe à true pour sortir de la boucle
                nbObstables++; // incrémentaion du nombre d'obstacles
            }
        }
        
        positionObstacleOk = false; // on repasse à false pour boucler sur l'obstacle suivant
    }
    
    // on remplit le tableau armes de 4 armes aléatoires
    while (nbArmes != nbArmesMax) //
    {
        while (!positionArmeOk)
        {
            aleatoireArme = Math.floor((Math.random() * 100) + 1);
            
            // si la position de l'arme n'est ni dans la tableau des obstacles, ni de celui des armes
            if (obstacles.indexOf(aleatoireArme) == -1 && armes.indexOf(aleatoireArme) == -1)
            {
                armes.push(aleatoireArme);
                positionArmeOk = true;
                nbArmes++;
            }
        }
        
        positionArmeOk = false;
    }
    
    // on remplit le tableau joueurs avec 2 joueurs
    while (nbJoueurs != nbJoueursMax)
    {
        while(!positionJoueurOk)
        {
            aleatoireJoueur = Math.floor((Math.random() * 100) + 1);
            
            // si la position du joueur n'est ni dans le tableau obstacles, ni dans celui des armes, ni celui des jouerus. Et si les 2 joureurs ne sont pas sur de cases adjacentes
            if (obstacles.indexOf(aleatoireJoueur) == -1 && armes.indexOf(aleatoireJoueur) == -1 && joueurs.indexOf(aleatoireJoueur) == -1 && !trouveAdversaire(joueurs))
            {
                joueurs.push(aleatoireJoueur);
                positionJoueurOk = true;
                nbJoueurs++;
            }
        }
        
        positionJoueurOk = false;
    }
    
    // on dessine la carte de jeu
    var pos = 0;    
    for (var i = 0; i < 10; i++) // sur 10 lignes
    {
        for (var j = 0; j < 10; j++) // sur 10 colonnes
        {            
            // si la position x sur la ligne ne se trouve pas dans le
            // tableau des obstacles
            if (obstacles.indexOf(positionObstacle) == -1)
            {
                // on crée une carré vide
                 calque.add(casVide.dessiner(xPosition,yPosition,pos));
                
                // si on se trouve sur une case ne possédant pas une arme
                if (armes.indexOf(positionArme) != -1)
                {
                    var nomArme = "";
                    
                    switch (indexArmes) // on affecte le nom de l'arme en fonction de son ordre
                    {
                        case 0: // arme 1
                            calque.add(arme1.dessiner(xPosition,yPosition));
                            break;
                        case 1: // arme 2
                            calque.add(arme2.dessiner(xPosition,yPosition));
                            break;
                        case 2: // arme 3
                            calque.add(arme3.dessiner(xPosition,yPosition));
                            break;
                        case 3: // arme 4
                            calque.add(arme4.dessiner(xPosition,yPosition));
                            break;
                    }
                    
                    indexArmes++; // on incrémente l'index armes
                }
                
                // si on se trouve sur une case ne possédant pas un joueur
                if (joueurs.indexOf(positionJoueur) != -1)
                {
                    switch (indexJoueur) // on affecte le nom du joueur en fonction de son ordre
                    {
                        case 0: // joueur 1
                            calque.add(joueur1.dessiner(xPosition,yPosition));
                            break;
                        case 1: // joueur 2
                            calque.add(joueur2.dessiner(xPosition,yPosition));
                            break;
                    }
                    
                    indexJoueur++; // on incrémente l'index joueur
                }
            }
            else // sinon on dessine un carré plein représentant un obstacle
            {
                 calque.add(casObtacle.dessiner(xPosition,yPosition,pos));
            }
            
            // on incrémente le pointeur de position des obstacles, armes et joueurs
            positionObstacle++;
            positionArme++;
            positionJoueur++;
            
            pos++;
            
            xPosition += 60; // on décale l'origine x du prochain carré
        }
        
        yPosition += 60; // on décale l'origine y du prochain carré
        xPosition = 0; // on repart en début de ligne
     }
    
    // ajout des claques à la scène
    scene.add(calque);
    
    affiche = document.getElementById('affichage');
    
    affiche.innerHTML = "Le tour 1 va commencer :" + "\n\n" + joueur1.nom + " choisissez votre déplacement !" + "\n";
    
}

// fonction de jeu
function joue()
{
    // jeu
    nbTours++; // incrémentation du nombre de tours
    
    // variable qui contiendra le joueur qui doit jouer son tour et le suivant
    var joueurActif = "";
    var joueurSuivant = "";

    // variable permettant de vérifier si le déplacement est possible
    var deplaceOk = false;
    
    // variables récupérant le choix du joueur
    var direction = document.querySelectorAll("input[name=dir]:checked");
    var distance = document.querySelectorAll("input[name=dist]:checked");

    // si le numéro du tour est :
    if(nbTours%2 == 1)
    {
        joueurActif = joueur1; // impair = joueur 1 actif
        joueurSuivant = joueur2;
    }
    else
    {
        joueurActif = joueur2; // pair = jouer 2 actif
        joueurSuivant = joueur1;
    }    
    
    if (!errDeplacement)
        affiche.innerHTML = "\n" + joueurActif.nom + " le tour " + nbTours + " va commencer!" + "\n";

    var joueDirection = parseInt(direction[0].value);     
    var joueDistance = parseInt(distance[0].value);
   
    // on teste s'il n'y a pas d'obstacles sur le parcours du déplacement
    if (deplacementPossible(joueurActif,joueDirection,joueDistance,calque))
    {
        affiche.innerHTML += "\n" + "Déplacement possible." + "\n"

        joueurActif.seDeplacer(joueDirection,joueDistance,calque); // on déplace le joueur

        affiche.innerHTML += "\n" + "Le joueur " + joueurActif.nom + " s'est déplacé de " + joueDistance + " case(s) vers le(la) " + direction[0].id + "\n";

        // gestion de l'arrivée sur une case comportant une arme : NON FONCTIONNEL POUR LE MOMENT
        var armeTrouvee = trouveArme(joueurActif,calque); // on regarde si la case de destination possède une arme

        // si une arme est trouvee
        if (armeTrouvee) 
        {
            var armeEnCours = joueurActif.arme; // on récupère l'arme du joueur en cours
            var j = calque.get("#" + joueurActif.nom); // on récupère le calque de joueur en cours

            // on switch en fonction de l'arme trouvée
            switch (armeTrouvee)
            {
                // si c'est un baton
                case "baton":                                
                    var a = calque.get("#baton"); // on récupère son calque
                    a.hide();
                    showArme1 = true;
                    joueurChangeArme = joueurActif;

                    joueurActif.arme = arme1; // on change l'arme du joueur avec celle trouvée soit le baton

                    var n = joueurActif.nom + "\n" + joueurActif.arme.nom; // on change le texte du joueur
                    j.setAttr('id',n); // son Id
                    j.setAttr('text',n); // son texte
                    
                    break; // on sort du switch

                case "couteau":
                    var a = calque.get("#couteau");
                    a.hide();
                    showArme2 = true;
                     joueurChangeArme = joueurActif;

                    joueurActif.arme = arme2;
                    arme2 = armeEnCours;

                    var n = joueurActif.nom + "\n" + joueurActif.arme.nom; 
                    j.setAttr('id',n);
                    j.setAttr('text',n);
                    
                    break;

                case "epee":
                    var a = calque.get("#epee");
                    a.hide();
                    showArme3 = true;
                     joueurChangeArme = joueurActif;

                    joueurActif.arme = arme3;
                    arme3 = armeEnCours;

                    var n = joueurActif.nom + "\n" + joueurActif.arme.nom;                                
                    j.setAttr('id',n);
                    j.setAttr('text',n);

                    break;

                case "massue":
                    var a = calque.get("#massue"); 
                    a.hide();
                    showArme4 = true;
                     joueurChangeArme = joueurActif;

                    joueurActif.arme = arme4;
                    arme4 = armeEnCours;

                    var n = joueurActif.nom + "\n" + joueurActif.arme.nom;                                
                    j.setAttr('id',n);
                    j.setAttr('text',n);

                    break;
            }
            
            // si le numéro du tour est :
            if(nbTours%2 == 1)
            {
                joueur1 = joueurActif; 
            }
            else
            {
                joueur2 = joueurActif; 
            }    
           
            
            calque.draw(); // on redessine pour afficher les changements
        }
        else
        {
            if (showArme1)
            {
                var c = calque.get("#baton");
                c.show();
                showArme1 = false;
            }
            else if (showArme2)
            {
                var c = calque.get("#couteau");
                c.show();
                showArme2 = false;
            }
            else if (showArme3)
            {
                var c = calque.get("#epee");
                c.show();
                showArme3 = false;
            }
            else if (showArme4)
            {
                var c = calque.get("#massue");
                c.show();
                showArme4 = false;
            }
        
            calque.draw(); // s'il n'y a pas d'arme, on redessine la calque pour afficher le déplacement

            errDeplacement = false;

            affiche.innerHTML += "\n" + joueurSuivant.nom + " a vous de jouer :" + "\n";
        }

    }
    else // sinon on permet de revenir au début de du choix direction et distance
    {
        nbTours--;
        errDeplacement = true;

        affiche.innerHTML += "\n" + "déplacement impossible !" + "\n" + joueurActif.nom + " réessayez un autre déplacement !" + "\n";
    } 
}

// fonction de recherche pour vérifier que les 2 joueurs ne se touchent pas
function trouveAdversaire(tab)
{
    var j = [];
    
    for (var i in tab)
    {
       j.push(tab[i]);
    }
    
    if (j[0] == j[1]-1 || j[0] == j[1]+1 || j[0] == j[1]-10 || j[0] == j[1]+10 ||
        j[1] == j[0]-1 || j[1] == j[0]+1 || j[1] == j[0]-10 || j[1] == j[0]+10)
    {
        return true;
    }
    else
        return false;
}

// fonction de vérification de présence d'obstacle lors d'un déplacement
function deplacementPossible(joueur,direction,distance,calque)
{
    // on avvecte la position acuelle du joueur en cours
    var xJoueur = joueur.x;
    var yJoueur = joueur.y;
    
    // variables permettant de verifier les nouvelles coordonnées
    var xObst = 0;
    var yObst = 0;
    
    // booléen de vérifiacation
    var ok = true;
    
    // on récupère la collection de calque ayant name = caseObstacle
    var c = calque.get(".caseObstacle");
    
    // en fonction de la direction
    switch(direction)
    {
        case 8: // vers le haut
            
            // on boucle en fonction de la distance choisi 1,2 ou 3
            for(var i=1; i<=distance; i++)
            {
                 xObst = xJoueur; // l'axe x ne change pas donc = x du joueur
                 yObst = yJoueur - 60*i; // l'axe y évolu par palier de 60

                // on boucle les 30 obstacles
                 for (var j=0; j<30; j++)
                 {
                     // si x ET y de l'obstacle correspondent à ceux de la case destination ET si cette case est un obstacle ou si on sort du plateau de jeu
                     if ((c[j].getX() == xObst && c[j].getY() == yObst && c[j].getName() == 'caseObstacle') || yObst < 0)
                     {
                         ok = false; // booléen à false pour empècher le déplacement
                         break; // on force la sortie de la boule
                     }
                 }
                 
                // si false
                 if (!ok)
                     break; // on sort de la 2eme boucle
            }
            
            break;
            
        case 2: // vers le bas
            
            for(var i=1; i<=distance; i++)
             {
                 xObst = xJoueur;
                 yObst = yJoueur + 60*i;
                 
                 for (var j=0; j<30; j++)
                 {
                     if ((c[j].getX() == xObst && c[j].getY() == yObst && c[j].getName() == 'caseObstacle') || yObst > 540)
                     {
                         ok = false;
                         break;
                     }
                 }
                 
                 if (!ok)
                     break;
             }
            
            break;
            
        case 4: // vers la gauche
            
            for(var i=1; i<=distance; i++)
             {
                 xObst = xJoueur - 60*i;
                 yObst = yJoueur;
                 
                 for (var j=0; j<30; j++)
                 {
                     if ((c[j].getX() == xObst && c[j].getY() == yObst && c[j].getName() == 'caseObstacle') || xObst < 0)
                     {
                         ok = false;
                         break;
                     }
                 }
                 
                 if (!ok)
                     break;
             }
            
            break;
            
        case 6: // vers la droite
            
            for(var i=1; i<=distance; i++)
             {
                 xObst = xJoueur + 60*i;
                 yObst = yJoueur;
                 
                 for (var j=0; j<30; j++)
                 {
                     if ((c[j].getX() == xObst && c[j].getY() == yObst && c[j].getName() == 'caseObstacle') || xObst > 540)
                     {
                         ok = false;
                         break;
                     }
                 }
                 
                 if (!ok)
                     break;
             }
            
            break;
    }
    
    return ok; // on renvoi le booléen
}

// fonction gérant l'arrivé d'un joueur sur une case Arme
function trouveArme(joueur,calque)
{
    // on récupère la position du joueur
    var xJoueur = joueur.x;
    var yJoueur = joueur.y;
    var armeTrouvee = "";
    
    // on récupère les calques "armes"
    var a = calque.get(".arme");
    
    // on boucle sur les 4 armes
    for (var i=0; i<4; i++)
    {
        if (xJoueur == a[i].getX() && yJoueur == a[i].getY()) // si la position du joueur correspond à celle d'une arme
        {
            armeTrouvee = a[i].attrs.id; // on récupère son id
        }
    }
    
    return armeTrouvee; // on revoie l'id de l'arme trouvée
}

// fonction gérant la rencontre d'un adversaire
function Adversaire(joueur, calque)
{
    
}
