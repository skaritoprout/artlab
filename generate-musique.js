const fs = require("fs");
const path = require("path");


/* ===========================
   Emplacements
=========================== */

const dossierMusique =
    path.join(__dirname, "musique");

const fichierListe =
    path.join(
        __dirname,
        "musique-list.js"
    );


/* ===========================
   Extensions autorisées
=========================== */

const extensionsVideos =
    /\.(mp4|webm|ogg)$/i;


/* ===========================
   Vérification du dossier
=========================== */

if (!fs.existsSync(dossierMusique)) {

    console.error(
        'Le dossier "musique" est introuvable.'
    );

    process.exit(1);

}


/* ===========================
   Lecture des vidéos
=========================== */

const fichiers = fs
    .readdirSync(dossierMusique)
    .filter((nomFichier) => {

        const cheminComplet =
            path.join(
                dossierMusique,
                nomFichier
            );

        return (
            fs.statSync(
                cheminComplet
            ).isFile() &&
            extensionsVideos.test(
                nomFichier
            )
        );

    })
    .sort((a, b) => {

        return a.localeCompare(
            b,
            "fr",
            {
                numeric: true,
                sensitivity: "base"
            }
        );

    });


/* ===========================
   Création de musique-list.js
=========================== */

const contenu =
`window.musiqueFiles = ${JSON.stringify(
    fichiers,
    null,
    4
)};
`;


fs.writeFileSync(
    fichierListe,
    contenu,
    "utf8"
);


console.log(
    `${fichiers.length} vidéo(s) ajoutée(s) à la galerie musicale.`
);