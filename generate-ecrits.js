const fs = require("fs");
const path = require("path");

const dossierEcrits = path.join(__dirname, "ecrits");
const fichierListe = path.join(__dirname, "ecrits-list.js");

const extensionsAutorisees = /\.(png|jpg|jpeg|webp|pdf)$/i;

if (!fs.existsSync(dossierEcrits)) {
    console.error('Le dossier "ecrits" est introuvable.');
    process.exit(1);
}

const fichiers = fs
    .readdirSync(dossierEcrits)
    .filter((nomFichier) => {
        const chemin = path.join(dossierEcrits, nomFichier);

        return (
            fs.statSync(chemin).isFile() &&
            extensionsAutorisees.test(nomFichier)
        );
    })
    .sort((a, b) =>
        a.localeCompare(b, "fr", {
            numeric: true,
            sensitivity: "base"
        })
    );

const contenu =
    `window.ecritsFiles = ${JSON.stringify(fichiers, null, 4)};\n`;

fs.writeFileSync(fichierListe, contenu, "utf8");

console.log(
    `${fichiers.length} fichier(s) ajouté(s) à la galerie Écrits.`
);