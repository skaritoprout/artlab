const grilleMusique = document.querySelector(".grille-musique");

const visionneuseMusique =
    document.querySelector(".visionneuse-musique");

const videoVisionneuse =
    document.querySelector(".visionneuse-video");

const grilleMusique =
    document.querySelector(".grille-musique");

grilleMusique.innerHTML = "";

/* Mélange aléatoire des vidéos */

const videosMelangees = [...window.musiqueFiles];

for (let i = videosMelangees.length - 1; i > 0; i--) {

    const positionAleatoire =
        Math.floor(Math.random() * (i + 1));

    [
        videosMelangees[i],
        videosMelangees[positionAleatoire]
    ] = [
        videosMelangees[positionAleatoire],
        videosMelangees[i]
    ];

}


/* Création automatique de la grille */

videosMelangees.forEach((nomFichier) => {

    const caseMusique = document.createElement("div");
    caseMusique.classList.add("case-musique");

    const video = document.createElement("video");

    video.src = `musique/${encodeURIComponent(nomFichier)}`;
    video.muted = true;
    video.preload = "metadata";
    video.playsInline = true;

    caseMusique.appendChild(video);
    grilleMusique.appendChild(caseMusique);


    /* Affiche une image de la vidéo dans la grille */

    video.addEventListener("loadedmetadata", () => {

        if (video.duration > 1) {
            video.currentTime = Math.min(1, video.duration / 2);
        }

    });


    /* Ouverture de la vidéo en grand */

    caseMusique.addEventListener("click", () => {

        videoVisionneuse.src =
            `musique/${encodeURIComponent(nomFichier)}`;

        visionneuseMusique.classList.add("ouverte");

        visionneuseMusique.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("visionneuse-active");

        videoVisionneuse.play();

    });

});


/* Fermeture en cliquant sur le fond noir */

visionneuseMusique.addEventListener("click", (event) => {

    if (event.target === visionneuseMusique) {
        fermerVisionneuseMusique();
    }

});


/* Fermeture avec la touche Échap */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        fermerVisionneuseMusique();
    }

});


/* Fonction de fermeture */

function fermerVisionneuseMusique() {

    videoVisionneuse.pause();
    videoVisionneuse.removeAttribute("src");
    videoVisionneuse.load();

    visionneuseMusique.classList.remove("ouverte");

    visionneuseMusique.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("visionneuse-active");

}