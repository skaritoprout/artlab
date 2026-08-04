import * as pdfjsLib from
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.mjs";


/* ===========================
   Worker PDF.js
=========================== */

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.worker.mjs";


/* ===========================
   Éléments de la page
=========================== */

const grille =
    document.querySelector(".grille-ecrits");

const visionneuse =
    document.querySelector(".visionneuse-ecrits");

const contenuVisionneuse =
    document.querySelector(
        ".contenu-visionneuse-ecrits"
    );

const imageVisionneuse =
    document.querySelector(
        ".visionneuse-ecrits-image"
    );

const pdfVisionneuse =
    document.querySelector(
        ".visionneuse-ecrits-pdf"
    );


/*
 * Permet d’arrêter le rendu d’un PDF
 * lorsque la visionneuse est refermée.
 */

let numeroOuverture = 0;


/* ===========================
   Liste des fichiers
=========================== */

const fichiers =
    Array.isArray(window.ecritsFiles)
        ? [...window.ecritsFiles]
        : [];


/* Ordre aléatoire à chaque ouverture */

melanger(fichiers);


/* ===========================
   Création de la grille
=========================== */

fichiers.forEach((nomFichier) => {

    const extension =
        obtenirExtension(nomFichier);

    const chemin =
        obtenirChemin(nomFichier);


    const caseEcrit =
        document.createElement("button");

    caseEcrit.type = "button";
    caseEcrit.className = "case-ecrit";

    caseEcrit.setAttribute(
        "aria-label",
        `Ouvrir ${nomFichier}`
    );


    if (extension === "pdf") {

        creerMiniaturePdf(
            caseEcrit,
            chemin,
            nomFichier
        );

    } else {

        creerMiniatureImage(
            caseEcrit,
            chemin,
            nomFichier
        );

    }


    caseEcrit.addEventListener(
        "click",
        () => {

            ouvrirFichier(
                extension,
                chemin,
                nomFichier
            );

        }
    );


    grille.appendChild(caseEcrit);

});


/* ===========================
   Miniature d’une image
=========================== */

function creerMiniatureImage(
    caseEcrit,
    chemin,
    nomFichier
) {

    const image =
        document.createElement("img");

    image.src = chemin;
    image.alt = nomFichier;
    image.loading = "lazy";

    image.className =
        "miniature-ecrit-image";

    caseEcrit.appendChild(image);

}


/* ===========================
   Miniature d’un PDF
=========================== */

async function creerMiniaturePdf(
    caseEcrit,
    chemin,
    nomFichier
) {

    const attente =
        document.createElement("div");

    attente.className =
        "chargement-miniature-pdf";

    attente.textContent = "PDF";

    caseEcrit.appendChild(attente);


    try {

        const documentPdf =
            await pdfjsLib.getDocument({
                url: chemin
            }).promise;


        const premierePage =
            await documentPdf.getPage(1);


        const viewportOriginal =
            premierePage.getViewport({
                scale: 1
            });


        const largeurVoulue = 300;

        const echelle =
            largeurVoulue /
            viewportOriginal.width;


        const viewport =
            premierePage.getViewport({
                scale: echelle
            });


        const canvas =
            document.createElement("canvas");


        const contexte =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        canvas.width =
            Math.ceil(viewport.width);

        canvas.height =
            Math.ceil(viewport.height);

        canvas.className =
            "miniature-ecrit-pdf";


        await premierePage.render({
            canvasContext: contexte,
            viewport: viewport,
            background: "#ffffff"
        }).promise;


        attente.remove();

        caseEcrit.appendChild(canvas);

    } catch (erreur) {

        console.error(
            `Erreur de miniature pour ${nomFichier} :`,
            erreur
        );

        attente.textContent = "PDF";

    }

}


/* ===========================
   Ouverture d’un fichier
=========================== */

async function ouvrirFichier(
    extension,
    chemin,
    nomFichier
) {

    numeroOuverture += 1;

    const ouvertureActuelle =
        numeroOuverture;


    nettoyerVisionneuse();


    visionneuse.classList.add(
        "ouverte"
    );

    visionneuse.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "visionneuse-active"
    );


    if (extension === "pdf") {

        pdfVisionneuse.classList.add(
            "visible"
        );


        /*
         * Attend que la visionneuse soit réellement
         * visible avant de calculer sa largeur.
         */

        await attendreAffichage();


        await afficherPdf(
            chemin,
            nomFichier,
            ouvertureActuelle
        );

    } else {

        imageVisionneuse.src =
            chemin;

        imageVisionneuse.alt =
            nomFichier;

        imageVisionneuse.classList.add(
            "visible"
        );

    }

}


/* ===========================
   Affichage complet du PDF
=========================== */

async function afficherPdf(
    chemin,
    nomFichier,
    ouvertureActuelle
) {

    pdfVisionneuse.innerHTML = "";


    const chargement =
        document.createElement("div");

    chargement.className =
        "chargement-pdf-complet";

    chargement.textContent =
        "Chargement…";

    pdfVisionneuse.appendChild(
        chargement
    );


    try {

        const documentPdf =
            await pdfjsLib.getDocument({
                url: chemin
            }).promise;


        if (
            ouvertureActuelle !==
            numeroOuverture
        ) {
            return;
        }


        chargement.remove();


        for (
            let numeroPage = 1;
            numeroPage <= documentPdf.numPages;
            numeroPage += 1
        ) {

            if (
                ouvertureActuelle !==
                numeroOuverture
            ) {
                return;
            }


            const page =
                await documentPdf.getPage(
                    numeroPage
                );


            const viewportOriginal =
                page.getViewport({
                    scale: 1
                });


            const largeurVisionneuse =
                pdfVisionneuse.clientWidth ||
                window.innerWidth * 0.9;


            const largeurDisponible =
                Math.min(
                    largeurVisionneuse,
                    1200
                );


            const echelle =
                largeurDisponible /
                viewportOriginal.width;


            const viewport =
                page.getViewport({
                    scale: echelle
                });


            const densite =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );


            const canvas =
                document.createElement(
                    "canvas"
                );


            const contexte =
                canvas.getContext(
                    "2d",
                    {
                        alpha: false
                    }
                );


            canvas.width =
                Math.ceil(
                    viewport.width *
                    densite
                );

            canvas.height =
                Math.ceil(
                    viewport.height *
                    densite
                );


            canvas.style.width =
                `${Math.ceil(
                    viewport.width
                )}px`;

            canvas.style.height =
                `${Math.ceil(
                    viewport.height
                )}px`;


            canvas.setAttribute(
                "aria-label",
                `Page ${numeroPage} de ${nomFichier}`
            );


            const conteneurPage =
                document.createElement(
                    "div"
                );

            conteneurPage.className =
                "page-pdf";


            conteneurPage.appendChild(
                canvas
            );

            pdfVisionneuse.appendChild(
                conteneurPage
            );


            await page.render({
                canvasContext: contexte,
                viewport: viewport,

                transform: [
                    densite,
                    0,
                    0,
                    densite,
                    0,
                    0
                ],

                background: "#ffffff"
            }).promise;

        }

    } catch (erreur) {

        console.error(
            `Erreur pendant l’affichage de ${nomFichier} :`,
            erreur
        );


        pdfVisionneuse.innerHTML = "";


        const message =
            document.createElement(
                "div"
            );

        message.className =
            "erreur-pdf";

        message.textContent =
            "Le document ne peut pas être affiché.";


        pdfVisionneuse.appendChild(
            message
        );

    }

}


/* ===========================
   Fermeture
=========================== */

function fermerVisionneuse() {

    numeroOuverture += 1;


    visionneuse.classList.remove(
        "ouverte"
    );

    visionneuse.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "visionneuse-active"
    );


    nettoyerVisionneuse();

}


/* ===========================
   Nettoyage
=========================== */

function nettoyerVisionneuse() {

    imageVisionneuse.classList.remove(
        "visible"
    );

    imageVisionneuse.removeAttribute(
        "src"
    );

    imageVisionneuse.alt = "";


    pdfVisionneuse.classList.remove(
        "visible"
    );

    pdfVisionneuse.innerHTML = "";

}


/* ===========================
   Clic sur le fond noir
=========================== */

visionneuse.addEventListener(
    "click",
    (event) => {

        if (event.target === visionneuse) {

            fermerVisionneuse();

        }

    }
);


/*
 * Un clic sur le PDF ou sur l’image
 * ne doit pas fermer la visionneuse.
 */

contenuVisionneuse.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);


/* ===========================
   Fermeture avec Échap
=========================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            visionneuse.classList.contains(
                "ouverte"
            )
        ) {

            fermerVisionneuse();

        }

    }
);

/* ===========================
   Défilement du PDF avec les flèches
=========================== */

document.addEventListener("keydown", (event) => {

    const pdfEstOuvert =
        visionneuse.classList.contains("ouverte") &&
        pdfVisionneuse.classList.contains("visible");

    if (!pdfEstOuvert) {
        return;
    }

    if (event.key === "ArrowDown") {

        event.preventDefault();

        visionneuse.scrollBy({
            top: 180,
            behavior: "smooth"
        });

    }

    if (event.key === "ArrowUp") {

        event.preventDefault();

        visionneuse.scrollBy({
            top: -180,
            behavior: "smooth"
        });

    }

});

/* ===========================
   Fonctions utilitaires
=========================== */

function obtenirExtension(
    nomFichier
) {

    return nomFichier
        .split(".")
        .pop()
        .toLowerCase();

}


function obtenirChemin(
    nomFichier
) {

    return `ecrits/${encodeURIComponent(
        nomFichier
    )}`;

}


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


function attendreAffichage() {

    return new Promise(
        (resolve) => {

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        resolve
                    );

                }
            );

        }
    );

}