/**
 *
 * @author WmYameogo <wendmi.yameogo@tic.gov.bf>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Classe Objet
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    //numero d'inventire de l'objet
    numeroInventaire: { type: String, required: false },

    //ancien numero d'inventire de l'objet
    ancienNumeroInventaire: { type: String, required: false },

    //nom ou intitulé de l'objet
    nom: { type: String, required: true },

    //appelation locale de l'objet
    appelationLocale: { type: String, required: false },

    description: { type: String, required: false },

    //photo ou image de l'objet
    image: { type: String, required: false }
});

module.exports = mongoose.model('Objet', schema);