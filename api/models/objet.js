
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Objet
 *
 */

const mongoose = require('mongoose');


const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    lieuAcquisition : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "LieuAcquisition", 
        required: true 
    } ,

    emplacement : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Emplacement", 
        required: true 
    } ,

    collecteur : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Collecteur", 
        required: true 
    } ,
    categorie : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Categorie", 
        required: true 
    } ,

    lieuFabrication : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "LieuFabrication", 
        required: true 
    } ,

    fabricant : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Fabricant", 
        required: true 
    } ,

    etatConservation : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "EtatConservation", 
        required: true 
    } ,

    modeAcquisition : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ModeAcquisition", 
        required: true 
    } ,

    collectionn : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Collectionn", 
        required: true 
    } ,

    utilisateur : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Utilisateur", 
        required: true 
    } ,

    numeroInventaire: { type: String, required: true },

    ancienNumeroInventaire: { type: String, required: true },

    nom: { type: String, required: true },

    description: { type: String, required: true },

    infosComplementaire: { type: String, required: true },

    appelationLocale: { type: String, required: true },

    dateAcquisition: { type: Date, required: true },

    hauteur: { type: Number , required: false },

    profondeur: { type: Number , required: false },

    longueur: { type: Number , required: false },

    circonference: { type: Number , required: false },

    largeur: { type: Number , required: false },

    diametre: { type: Number , required: false },

    epaisseur: { type: Number , required: false },

    poids: { type: Number , required: false },

    datation: { type: Date , required: false },

    photoref: { type: String , required: true }, // voir possiblité denvoyer vers photo

    photooriginalname : { type: String , required: true },

    photodescription : { type: String , required: true },

    dateCreation: { type: Date , required: false },

    datMaj: { type: Date , required: false },

});

module.exports = mongoose.model('Objet', schema);