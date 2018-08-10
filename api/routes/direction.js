/**
 *
 * @author WmYameogo <wendmi.yameogo@tic.gov.bf>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe Direction
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Direction = require("../models/direction");

/**
 *
 * Recuperation de la liste des directions
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Direction.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                directions: datas.map(data => {
                    return {
                        _id: data._id,
                        sigle: data.sigle,
                        nom: data.nom,
                        description: data.description,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/directions/${data._id}`
                        }
                    };
                })
            };
            res.status(200).json(response); // si resultats disponible
        })
        .catch(err => { // en cas d'erreur
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * Enregistrement direction
 * dans la base de données
 * POSTtimet
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de direction */
    const direction = new Direction({
        _id: new mongoose.Types.ObjectId(),
        sigle: req.body.sigle,
        nom: req.body.nom,
        description: req.body.description
    });

    /* Enregistrement de direction dans la BD*/
    direction.save()
        .then(data => {
            const response = {
                    message: "Direction enregistré avec succès",
                    direction: {
                        _id: data._id,
                        sigle: data.sigle,
                        nom: data.nom,
                        description: data.description /*,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/directions/${data._id}`
                        }*/
                    }
                }
            ;
            res.status(201).json(response); /* si resultats disponible */
        })
        .catch(err => { /* en cas d'erreur */
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * Recuperation direction
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:directionId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.directionId;

    /*Execution de la requete de recherche dans la base de données*/
    Direction.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    direction: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/directions/${data._id}`
                    }
                };
                res
                    .status(200)
                    .json(response);
            } else { /* Pas de correspondance après la recherche dasn la BD */
                res
                    .status(404)
                    .json({message: "Aucun élément valide correspondant à cet identifiant"});
            }
        })
        .catch(err => { // en cas d'erreur
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * Mise à jour direction
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:directionId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.directionId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    Direction.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Direction modifié avec succès",
                direction: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/directions/${data._id}`
                }
            };
            res
                .status(200)
                .json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * suppression direction
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:directionId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.directionId;

    /*Execution de la requete*/
    Direction.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                direction: {_id:id},
                message: "Direction supprimé avec succès",
            };
            res
                .status(200)
                .json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * Recherches des directions
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Direction.find({$or:[
         {sigle:{ $regex: keyword, $options: '/ix'}},
         {nom:{ $regex: keyword, $options: '/ix'}},
         {description:{ $regex: keyword, $options: '/ix'}}
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas) { /*Il y a une qui correspondance à la recherche*/
                const response = {
                    directions: datas
                };
                res
                    .status(200)
                    .json(response);
            } else { /* Pas de correspondance après la recherche dasn la BD */
                res
                    .status(404)
                    .json({message: "Aucun élément valide correspondant à cet identifiant"});
            }
        })
        .catch(err => { // en cas d'erreur
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


/**
 *
 * Enregistrement direction test
 * dans la base de données
 * POST
 * url : /
 */
router.post("/test", (req, res, next) => {

    for (i = 0; i < 15; i++) {
        /* Preparation/construction de direction */
         const direction = new Direction({
             _id: new mongoose.Types.ObjectId(),
             sigle: 'SIGLE 0' + i,
             nom: 'NOM Mitte 0' + i,
             description: 'DESCRIPTION mitte desc 0' + i + 'Etudes Un homme de 78 ans s\'est effondré et a été transporté à l\'hopital. On lui a donné un oxygène pour le soutenir pendant 24 heures. Après quelque temps, il allait mieux Alors, le médecin lui a donné sa note de 500.000f, et quand il a vu la facture, il a commencé à pleurer. Le médecin lui a dit de ne pas pleurer à cause du projet de loi. Mais l\'homme a dit: "Je ne pleure pas à cause de l\'argent, je peux payer tout l\'argent. Je pleure parce que pour seulement 24 heures d\'utilisation de l\'oxygène, je dois payer 500.000f, mais je respire l\'air libre de Dieu depuis 78 ans. J\'ai jamais rien payer, savez-vous combien je lui dois? Le docteur baissa la tête et coula des larmes Maintenant, à toi qui lit ceci, tu respire l\'air libre de Dieu sans aucun prix à payer depuis des années s\'il te plaît prends juste 2secondes de ton temps et envoie ceci à toute tes connaissances pour leur rappeler de toujours dire "Merci seigneur" pour la gratuité des services de Dieu dans leurs vies.'
         });

    /* Enregistrement de direction dans la BD*/
    direction.save()
        .then(data => {
            const response = {
                    message: "Direction enregistré avec succès",
                    direction: {
                        _id: data._id,
                        sigle: data.sigle,
                        nom: data.nom,
                        description: data.description,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/directions/${data._id}`
                        }
                    }
                }
            ;
            res.status(201).json(response);
            /* si resultats disponible */
        })
        .catch(err => { /* en cas d'erreur */
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
});


module.exports = router;
