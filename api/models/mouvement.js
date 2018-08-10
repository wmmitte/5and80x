
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Mouvement
 *
 */

const mongoose = require('mongoose');
const TypeMouvement= require('./typeMouvement');
const Objet = require ('./objet');

const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    typeMouvement : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "TypeMouvement", 
        required: true 
    } ,

    objet : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Objet", 
        required: false 
    } ,

    description: { type: String, required: true },

    date: { type: Date, required: true }

});

module.exports = mongoose.model('Mouvement', schema);