
// fonction attaque
function attaquer()
{
    // si le joueur suivant avait choisit de se défendre au tour précedent
    if (joueurSuivant.seDefend)
    {
        joueurSuivant.pointsDeVie -= joueurActif.arme.degats / 2; // il ne perd que la moitié de ses points de vie
        joueurSuivant.seDefend = false; // on remet sa prochaine action défense à false
        
        affiche.innerHTML = joueurActif.nom + " a attaqué et a infligé que " + joueurActif.arme.degats / 2 + " dégats à " + joueurSuivant.nom + "\n\n"
    }
    // sinon
    else
    {
        joueurSuivant.pointsDeVie -= joueurActif.arme.degats;

        affiche.innerHTML = joueurActif.nom + " a attaqué et a infligé " + joueurActif.arme.degats + " dégats à " + joueurSuivant.nom + "\n\n" +
            joueurSuivant.nom + " a encore " + joueurSuivant.pointsDeVie + "\n\n" +
            joueurSuivant.nom + " attaquez ou defendez";

        // le joueur actif devient le joueur suivant pour le prochain tour
        var temp = joueurActif;
        joueurActif = joueurSuivant;
        joueurSuivant = temp;

        // si le joueur suivant n'a plus de points de vie, il est mort
        if (joueurSuivant.pointsDeVie <= 0 || joueurActif.pointsDeVie <= 0)
        {
            // on cache les boutons attaquer et défendre
            document.getElementById("attaquer").style.visibility = "hidden";
            document.getElementById("defendre").style.visibility = "hidden";

            affiche.innerHTML = joueurActif.nom + " est mort !" + "\n\n" + joueurSuivant.nom + " a gagné !";
        }
    }
}

// fonction défendre
function defendre()
{
    joueurActif.seDefend = true; // le joueur actif va se défendre au prochain tour
    
    affiche.innerHTML = joueurActif.nom + " va se défendre au prochain coup de " + joueurSuivant.nom + "\n\n" +
                        joueurSuivant.nom + " attaquez ou defendez";
    
    // le joueur actif devient le joueur suivant pour le prochain tour
    var temp = joueurActif;
    joueurActif = joueurSuivant;
    joueurSuivant = temp;
}