
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-18
 *
 * Classe Materiaux
 *
 */

const mongoose = require('mongoose');
const Objet = require('./objet');

const schema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId,

    objet : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Objet", 
        required: false 
    } ,
    materiaux : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Materiaux", 
        required: false 
    } 
    
});

module.exports = mongoose.model('MateriauxObjet', schema);