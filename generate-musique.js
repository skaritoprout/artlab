const fs = require("fs");
const path = require("path");

const dossierMusique = path.join(__dirname, "musique");
const fichierListe = path.join(__dirname, "musique-list.js");

const extensionsVideos = /\.(mp4|webm|ogg|mov)$/i;

const fichiers = fs
    .readdirSync(dossierMusique)
    .filter((nomFichier) => extensionsVideos.test(nomFichier))
    .sort((a, b) =>
        a.localeCompare(b, "fr", {
            numeric: true,
            sensitivity: "base"
        })
    );

const contenu =
    `window.musiqueFiles = ${JSON.stringify(fichiers, null, 4)};\n`;

fs.writeFileSync(
    fichierListe,
    contenu,
    "utf8"
);

console.log(
    `${fichiers.length} vidéos ajoutées à la galerie musicale.`
);