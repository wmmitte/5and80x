
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Utilisateur
 *
 */

const mongoose = require('mongoose');
const TypeUtilisateur = require ('./typeUtilisateur') ;

const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    typeUtilisateur : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "TypeUtilisateur", 
        required: true 
    } ,

    nom: { type: String, required: true },

    prenom: { type: String, required: true },

    login: { type: String, required: true },

    password: { type: String, required: true },

    telephone: { type: String, required: true },

    adresse: { type: String, required: true },

    email: { type: String, required: true }
});

module.exports = mongoose.model('Utilisateur', schema);