
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-18
 *
 * Classe Photo
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    objet : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Objet", 
        required: false 
    } ,

    filename : { type: String, required: false }, // à completer avec Gridfs

    originalname : { type: String, required: false },

    uploadDate : { type: Date, required: true },

    contentType: { type: String, required: true },

    description: { type: String, required: true }
    
    
    // imageId: { type: String, require: true } //=> Envisager pour la suppression dans les deux tables
});

module.exports = mongoose.model('Photo', schema);