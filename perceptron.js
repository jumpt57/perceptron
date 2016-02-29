
function Perceptron(){
    this.tauxApprentissage = 0.9;
    this.reseauDEntree = [];
    this.reseauDeSortie = [];
}

Perceptron.prototype.initialiserReseauxNeuronaux = function (nbNeuronesEnEntree, nbNeuronesEnSortie) {
    for (var i = 0; i < nbNeuronesEnEntree; ++i){
        this.reseauDEntree[i] = [];
        for(var j =0; j < nbNeuronesEnSortie; ++j){
            this.reseauDEntree[i][j] = 1;
        }
    }

    this.initialiserReseauxNeuronauxSortie(nbNeuronesEnSortie);
};

Perceptron.prototype.initialiserReseauxNeuronauxSortie = function (nbNeuronesEnSortie){
    for(var i = 0; i < nbNeuronesEnSortie; ++i){
        this.reseauDeSortie[i] = 1;
    }
}
function getPoids(poids, t, A, O, E){
    poids += t * (A - O) * E;
    return poids;
}

function getSortieAttendue(poids){
    if(poids != 0)	return 1;
    else			return 0;
}


Perceptron.prototype.apprendre = function (tableDePixels, nombreApprendre){

    this.chercher(tableDePixels);

    for (var y = 0; y < this.reseauDEntree.length; y++) {
        for (var x = 0; x < this.reseauDEntree[y].length; x++) {
            if (this.reseauDEntree[y][x] != -1) {
                var valeurAttendue = 0;

                if (x == nombreApprendre) {
                    valeurAttendue = 1;
                }
                var neuroneActif = this.reseauDeSortie[x] > SEUIL ? 1 : 0;
                this.reseauDEntree[y][x] = this.reseauDEntree[y][x] + this.tauxApprentissage * (valeurAttendue - neuroneActif) * tableDePixels[y];

            }
        }
    }
};

Perceptron.prototype.chercher = function (tableauDePixels) {

    this.initialiserReseauxNeuronauxSortie(this.reseauDEntree[0].length);

    for (var y = 0; y < this.reseauDEntree.length; y++) {
        for (var x = 0; x < this.reseauDEntree[y].length; x++) {
            if (this.reseauDEntree[y][x] != -1) {
                this.reseauDeSortie[x] += this.reseauDEntree[y][x] * tableauDePixels[y];
            }
        }
    }

    var nombresReconnus = [];

    for (var nb = 0; nb < this.reseauDEntree[0].length; nb++) {
        if (this.reseauDeSortie[nb] > SEUIL) {
            nombresReconnus.push(nb.toString());
        }
    }

    return nombresReconnus;
};


