const grilleDessins = document.querySelector(".grille-dessins");

const visionneuseDessins =
    document.querySelector(".visionneuse-dessins");

const imageVisionneuseDessin =
    document.querySelector(".visionneuse-dessin-image");


/* Mélange aléatoire des dessins */

const dessinsMelanges = [...window.dessinFiles];

for (let i = dessinsMelanges.length - 1; i > 0; i--) {

    const positionAleatoire =
        Math.floor(Math.random() * (i + 1));

    [
        dessinsMelanges[i],
        dessinsMelanges[positionAleatoire]
    ] = [
        dessinsMelanges[positionAleatoire],
        dessinsMelanges[i]
    ];
}


/* Création de la grille */

dessinsMelanges.forEach((nomFichier) => {

    const caseDessin = document.createElement("div");
    caseDessin.classList.add("case-dessin");

    const image = document.createElement("img");

    image.src = `dessins/${encodeURIComponent(nomFichier)}`;
    image.alt = "";
    image.loading = "lazy";

    caseDessin.appendChild(image);
    grilleDessins.appendChild(caseDessin);


    /* Ouverture du dessin en grand */

    image.addEventListener("click", () => {

        imageVisionneuseDessin.src = image.src;

        visionneuseDessins.classList.add("ouverte");
        visionneuseDessins.setAttribute("aria-hidden", "false");

        document.body.classList.add("visionneuse-active");

    });

});


/* Fermeture en cliquant sur le fond noir */

visionneuseDessins.addEventListener("click", (event) => {

    if (event.target === visionneuseDessins) {
        fermerVisionneuseDessins();
    }

});


/* Fermeture avec Échap */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        fermerVisionneuseDessins();
    }

});


function fermerVisionneuseDessins() {

    visionneuseDessins.classList.remove("ouverte");

    visionneuseDessins.setAttribute(
        "aria-hidden",
        "true"
    );

    imageVisionneuseDessin.src = "";

    document.body.classList.remove("visionneuse-active");

}