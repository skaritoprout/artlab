const fs = require("fs");
const path = require("path");

const dossierDessins =
    path.join(__dirname, "dessins");

const fichierListe =
    path.join(__dirname, "dessins-list.js");

const extensionsImages =
    /\.(png|jpg|jpeg|webp|gif)$/i;

const fichiers = fs
    .readdirSync(dossierDessins)
    .filter((nomFichier) =>
        extensionsImages.test(nomFichier)
    )
    .sort((a, b) =>
        a.localeCompare(b, "fr", {
            numeric: true,
            sensitivity: "base"
        })
    );

const contenu =
    `window.dessinFiles = ${JSON.stringify(fichiers, null, 4)};\n`;

fs.writeFileSync(
    fichierListe,
    contenu,
    "utf8"
);

console.log(
    `${fichiers.length} dessins ajoutés à la galerie.`
);