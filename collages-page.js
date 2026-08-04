const grille = document.querySelector(".grille-collages");
const visionneuse = document.querySelector(".visionneuse");
const imageVisionneuse = document.querySelector(".visionneuse-image");


/* ===========================
   Mélange aléatoire des images
=========================== */

const fichiersMelanges = [...window.collageFiles];

for (let i = fichiersMelanges.length - 1; i > 0; i--) {
    const positionAleatoire = Math.floor(Math.random() * (i + 1));

    [fichiersMelanges[i], fichiersMelanges[positionAleatoire]] =
        [fichiersMelanges[positionAleatoire], fichiersMelanges[i]];
}


/* ===========================
   Création automatique de la grille
=========================== */

fichiersMelanges.forEach((nomFichier) => {

    const caseCollage = document.createElement("div");
    caseCollage.classList.add("case-collage");

    const image = document.createElement("img");

    image.src = `collages/${encodeURIComponent(nomFichier)}`;
    image.alt = "";
    image.loading = "lazy";

    caseCollage.appendChild(image);
    grille.appendChild(caseCollage);


    /* Ouverture de l'image en grand */

    image.addEventListener("click", () => {

        imageVisionneuse.src = image.src;

        visionneuse.classList.add("ouverte");
        visionneuse.setAttribute("aria-hidden", "false");

        document.body.classList.add("visionneuse-active");

    });

});


/* ===========================
   Fermeture en cliquant sur le fond noir
=========================== */

visionneuse.addEventListener("click", (event) => {

    if (event.target === visionneuse) {
        fermerVisionneuse();
    }

});


/* ===========================
   Fermeture avec la touche Échap
=========================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        fermerVisionneuse();
    }

});


/* ===========================
   Fonction de fermeture
=========================== */

function fermerVisionneuse() {

    visionneuse.classList.remove("ouverte");
    visionneuse.setAttribute("aria-hidden", "true");

    imageVisionneuse.src = "";

    document.body.classList.remove("visionneuse-active");

}