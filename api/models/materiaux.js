
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

const schema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    libelle: { type: String, required: true }
    
});

module.exports = mongoose.model('Materiaux', schema);