
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
const Objet = require('./objet');

const schema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    libelle: { type: String, required: true }
    
});

module.exports = mongoose.model('Technique', schema);