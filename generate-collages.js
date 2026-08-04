const fs = require("fs");
const path = require("path");

const dossierCollages = path.join(__dirname, "collages");
const fichierListe = path.join(__dirname, "collages-list.js");

const extensionsImages = /\.(png|jpg|jpeg|webp|gif)$/i;

const fichiers = fs
    .readdirSync(dossierCollages)
    .filter((nomFichier) => extensionsImages.test(nomFichier))
    .sort((a, b) =>
        a.localeCompare(b, "fr", {
            numeric: true,
            sensitivity: "base"
        })
    );

const contenu = `window.collageFiles = ${JSON.stringify(fichiers, null, 4)};\n`;

fs.writeFileSync(fichierListe, contenu, "utf8");

console.log(`${fichiers.length} images ajoutées à la galerie.`);