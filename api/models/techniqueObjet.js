
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Technique
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    objet : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Objet", 
        required: true 
    } ,
    technique : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Technique", 
        required: true 
    } 
    
});

module.exports = mongoose.model('TechniqueObjet', schema);