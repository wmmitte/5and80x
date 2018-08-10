
/**
 *
 * @author Amos T <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-07-17
 *
 * Classe Fabricant
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    nom: { type: String, required: true },

    prenom: { type: String, required: true },

    telephone: { type: String, required: true }
});

module.exports = mongoose.model('Fabricant', schema);