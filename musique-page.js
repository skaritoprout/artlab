const grilleMusique =
    document.querySelector(".grille-musique");

const visionneuseMusique =
    document.querySelector(".visionneuse-musique");

const videoVisionneuse =
    document.querySelector(".visionneuse-video");


/* ===========================
   Vérifications
=========================== */

if (!grilleMusique) {
    throw new Error(
        'La grille ".grille-musique" est introuvable.'
    );
}

if (!visionneuseMusique) {
    throw new Error(
        'La visionneuse ".visionneuse-musique" est introuvable.'
    );
}

if (!videoVisionneuse) {
    throw new Error(
        'La vidéo ".visionneuse-video" est introuvable.'
    );
}


/* ===========================
   Nettoyage de la grille
=========================== */

grilleMusique.innerHTML = "";


/* ===========================
   Liste des vidéos
=========================== */

const videosDisponibles =
    Array.isArray(window.musiqueFiles)
        ? [...window.musiqueFiles]
        : [];


/* ===========================
   Mélange aléatoire
=========================== */

melanger(videosDisponibles);


/* ===========================
   Création des miniatures
=========================== */

videosDisponibles.forEach((nomFichier) => {

    const cheminVideo =
        `musique/${encodeURIComponent(nomFichier)}`;


    const caseMusique =
        document.createElement("button");

    caseMusique.type = "button";
    caseMusique.className = "case-musique";

    caseMusique.setAttribute(
        "aria-label",
        `Ouvrir ${nomFichier}`
    );


    const video =
        document.createElement("video");

    video.className = "miniature-video";

    video.src = cheminVideo;
    video.muted = true;
    video.defaultMuted = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.controls = false;

    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");


    /*
     * Place la miniature à environ une seconde
     * après le début de la vidéo.
     */

    video.addEventListener(
        "loadedmetadata",
        () => {

            if (
                Number.isFinite(video.duration) &&
                video.duration > 0.2
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
     * Force l'affichage de l'image une fois
     * la position atteinte.
     */

    video.addEventListener(
        "seeked",
        () => {

            video.pause();

        }
    );


    /*
     * Si le fichier n'existe pas ou ne peut pas
     * être lu, la case est retirée.
     */

    video.addEventListener(
        "error",
        () => {

            console.error(
                `Impossible de charger la vidéo : ${nomFichier}`
            );

            caseMusique.remove();

        }
    );


    caseMusique.appendChild(video);
    grilleMusique.appendChild(caseMusique);


    /* Ouverture en grand */

    caseMusique.addEventListener(
        "click",
        () => {

            ouvrirVideo(
                cheminVideo
            );

        }
    );

});


/* ===========================
   Ouverture de la vidéo
=========================== */

function ouvrirVideo(cheminVideo) {

    videoVisionneuse.pause();

    videoVisionneuse.src =
        cheminVideo;

    videoVisionneuse.load();


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


    /*
     * La lecture démarre après le clic.
     * Si Chrome la bloque, les contrôles restent disponibles.
     */

    videoVisionneuse
        .play()
        .catch(() => {

            console.log(
                "La vidéo est prête. Cliquez sur Lecture."
            );

        });

}


/* ===========================
   Fermeture
=========================== */

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


/* Clic sur le fond noir */

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


/* Empêche le clic sur la vidéo de fermer */

videoVisionneuse.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);


/* Fermeture avec Échap */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            visionneuseMusique.classList.contains(
                "ouverte"
            )
        ) {
            fermerVisionneuseMusique();
        }

    }
);


/* ===========================
   Fonction de mélange
=========================== */

function melanger(tableau) {

    for (
        let index = tableau.length - 1;
        index > 0;
        index -= 1
    ) {

        const indexAleatoire =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            tableau[index],
            tableau[indexAleatoire]
        ] = [
            tableau[indexAleatoire],
            tableau[index]
        ];

    }

}