
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Collection
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    categorie : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categorie', 
        required: true 
    } ,
    collectionn : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Collectionn', 
        required: true 
    } 


});

module.exports = mongoose.model('CollectionCategorie', schema);