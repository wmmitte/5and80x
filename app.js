/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module principal de l'application
 *
 */

/**
 * Inclusion des modules necessaires
 */
const _CONFIGS = require('./configs');
const _MESSAGES = require('./messages/messages');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const mongoose = require("mongoose");


/**
 * Import des routes
 */
const objetRoutes = require("./api/routes/objet");
const directionRoutes = require("./api/routes/direction");
const lieuAcquisitionRoutes = require("./api/routes/lieuAcquisition");
const categorieRoutes = require ("./api/routes/categorie");
const collecteurRoutes = require("./api/routes/collecteur") ;
const collectionRoutes = require("./api/routes/collectionn");
const emplacementRoutes = require("./api/routes/emplacement");
const etatConservationRoutes = require("./api/routes/etatConservation");
const fabricantRoutes = require("./api/routes/fabricant");
const lieuFabricationRoutes = require("./api/routes/lieuFabrication");
const modeAcquisitionRoutes = require("./api/routes/modeAcquisition");
const museeRoutes = require("./api/routes/musee");
const typeMouvementRoutes = require("./api/routes/typeMouvement");
const typeUtilisateurRoutes = require("./api/routes/typeUtlisateur");
const utilisateurRoutes = require("./api/routes/utilisateur");
const mouvementRoutes = require("./api/routes/mouvement");
const materiauxRoutes = require("./api/routes/materiaux");
const techniqueRoutes = require("./api/routes/technique");
const photoRoutes = require("./api/routes/photo");
const collectionCategorieRoutes = require("./api/routes/collectionCategorie");
const materiauxObjetRoutes = require("./api/routes/materiauxObjet");
const techniqueObjetRoutes = require("./api/routes/techniqueObjet");



/**
 * Connexion à la base de données
 */
mongoose.connect(`${_CONFIGS.databaseSourceName}`,{ useNewUrlParser: true });
                
const db = mongoose.connection;
db.on('error', function () {
    console.log(_MESSAGES.database.Connexion_error);
    
});
db.once('open', function () {
    console.log(_MESSAGES.database.Connexion_success);
});
mongoose.Promise = global.Promise;


/**
 * Initialisation du comportement du serveur
 */
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
   // console.log(_CONFIGS.applicationEndpoint);
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


/**
 * Publication des routes du serveur
 */
app.use(_CONFIGS.applicationEndpoint + "/objets", objetRoutes);
app.use(_CONFIGS.applicationEndpoint + "/directions", directionRoutes);
app.use(_CONFIGS.applicationEndpoint + "/lieuAcquisitions", lieuAcquisitionRoutes);
app.use(_CONFIGS.applicationEndpoint + "/categories", categorieRoutes);
app.use(_CONFIGS.applicationEndpoint + "/collecteurs", collecteurRoutes);
app.use(_CONFIGS.applicationEndpoint + "/collections", collectionRoutes);
app.use(_CONFIGS.applicationEndpoint + "/emplacements", emplacementRoutes);
app.use(_CONFIGS.applicationEndpoint + "/etatConservations", etatConservationRoutes);
app.use(_CONFIGS.applicationEndpoint + "/fabricants", fabricantRoutes);
app.use(_CONFIGS.applicationEndpoint + "/lieuFabrications", lieuFabricationRoutes);
app.use(_CONFIGS.applicationEndpoint + "/modeAcquisitions", modeAcquisitionRoutes);
app.use(_CONFIGS.applicationEndpoint + "/musees", museeRoutes);
app.use(_CONFIGS.applicationEndpoint + "/typeMouvements", typeMouvementRoutes);
app.use(_CONFIGS.applicationEndpoint + "/typeUtilisateurs", typeUtilisateurRoutes);
app.use(_CONFIGS.applicationEndpoint + "/utilisateurs", utilisateurRoutes);
app.use(_CONFIGS.applicationEndpoint + "/mouvements", mouvementRoutes);
app.use(_CONFIGS.applicationEndpoint + "/materiaux", materiauxRoutes);
app.use(_CONFIGS.applicationEndpoint + "/techniques", techniqueRoutes);
app.use(_CONFIGS.applicationEndpoint + "/photos", photoRoutes);
app.use(_CONFIGS.applicationEndpoint + "/collectionCategories", collectionCategorieRoutes);
app.use(_CONFIGS.applicationEndpoint + "/materiauxObjets", materiauxObjetRoutes);
app.use(_CONFIGS.applicationEndpoint + "/techniqueObjets", techniqueObjetRoutes);




/**
 * Capture des erreurs en cas d'utilisation de
 * routes inexistantes
 */

app.use((req, res, next) => {
    const error = new Error("Page non trouvee");
    error.status = 404;
    next(error);
});


/**
 * Notifications et envoi des erreurs capturées par le serveur
 * quelque soit la nature de l'erreur
 */
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;