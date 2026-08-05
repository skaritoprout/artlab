const grilleMusique =
    document.querySelector(".grille-musique");

const visionneuseMusique =
    document.querySelector(".visionneuse-musique");

const videoVisionneuse =
    document.querySelector(".visionneuse-video");


/* Nettoie la grille avant de créer les vidéos */

grilleMusique.innerHTML = "";


/* Vérification de la liste */

const videosDisponibles =
    Array.isArray(window.musiqueFiles)
        ? [...window.musiqueFiles]
        : [];


/* Mélange aléatoire */

for (
    let i = videosDisponibles.length - 1;
    i > 0;
    i--
) {
    const positionAleatoire =
        Math.floor(Math.random() * (i + 1));

    [
        videosDisponibles[i],
        videosDisponibles[positionAleatoire]
    ] = [
        videosDisponibles[positionAleatoire],
        videosDisponibles[i]
    ];
}


/* Création de la grille */

videosDisponibles.forEach((nomFichier) => {

    const cheminVideo =
        `musique/${encodeURIComponent(nomFichier)}`;

    const caseMusique =
        document.createElement("div");

    caseMusique.className = "case-musique";


    const video =
        document.createElement("video");

    video.src = cheminVideo;
    video.muted = true;
    video.preload = "metadata";
    video.playsInline = true;


    /*
     * Permet d’afficher une image extraite
     * du début de la vidéo.
     */

    video.addEventListener(
        "loadedmetadata",
        () => {

            if (
                Number.isFinite(video.duration) &&
                video.duration > 0
            ) {
                video.currentTime =
                    Math.min(
                        1,
                        video.duration / 2
                    );
            }

        }
    );


    /*
     * Si une vidéo est introuvable,
     * sa case est supprimée.
     */

    video.addEventListener(
        "error",
        () => {

            console.error(
                `Impossible de charger : ${nomFichier}`
            );

            caseMusique.remove();

        }
    );


    caseMusique.appendChild(video);
    grilleMusique.appendChild(caseMusique);


    /* Ouverture en grand */

    caseMusique.addEventListener(
        "click",
        async () => {

            videoVisionneuse.src =
                cheminVideo;

            visionneuseMusique.classList.add(
                "ouverte"
            );

            visionneuseMusique.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "visionneuse-active"
            );

            try {
                await videoVisionneuse.play();
            } catch (erreur) {
                console.log(
                    "La lecture attend une action de l’utilisateur.",
                    erreur
                );
            }

        }
    );

});


/* Fermeture en cliquant sur le fond */

visionneuseMusique.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            visionneuseMusique
        ) {
            fermerVisionneuseMusique();
        }

    }
);


/* Fermeture avec Échap */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            fermerVisionneuseMusique();
        }

    }
);


/* Fonction de fermeture */

function fermerVisionneuseMusique() {

    videoVisionneuse.pause();

    videoVisionneuse.removeAttribute(
        "src"
    );

    videoVisionneuse.load();


    visionneuseMusique.classList.remove(
        "ouverte"
    );

    visionneuseMusique.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "visionneuse-active"
    );

}