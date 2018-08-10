/**
 *
 * @author WmYameogo <wendmi.yameogo@tic.gov.bf>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Classe Direction
 *
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    //numero d'inventire de l'direction
    sigle: { type: String, required: true },
    
    //nom ou intitulé de l'direction
    nom: { type: String, required: true },

    description: { type: String, required: false }
});

module.exports = mongoose.model('Direction', schema);