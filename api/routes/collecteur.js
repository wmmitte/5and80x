/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe collecteur
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Collecteur = require("../models/collecteur");








/**
 *
 * Recuperation de la liste des Collecteurs
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Collecteur.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                collecteurs: datas.map(data => {
                    return {
                        _id: data._id,
                        nom: data.nom,
                        prenom: data.prenom,
                        telephone: data.telephone,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collecteurs/${data._id}`
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
 * Enregistrement de Collecteur
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const col = new Collecteur({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone:req.body.telephone
        
    });
    //res.status(201).json(lieu);
    /* Enregistrement du lieu dans la BD*/
    col.save()
        .then(data => {
            const response = {
                    message: "collecteur enregistré avec succès",
                    collecteur: {
                        _id: data._id,
                        nom: data.nom,
                        prenom: data.prenom,
                        telephone: data.telephone,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collecteurs/${data._id}`
                        }
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
 * Recuperation de collecteur 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:collecteurId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.collecteurId;

    /*Execution de la requete de recherche dans la base de données*/
    Collecteur.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collecteur: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collecteurs/${data._id}`
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
 * Mise à jour collecteur
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:collecteurId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.collecteurId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    Collecteur.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "collecteur  modifié avec succès",
                collecteur: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collecteur/${data._id}`
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
 * suppression collecteur
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:collecteurId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.collecteurId;

    /*Execution de la requete*/
    Collecteur.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                collecteur: {_id:id},
                message: "collecteur supprimé avec succès",
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
 * Recherches collecteurs
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Collecteur.find({$or:[
         {nom:{ $regex: keyword, $options: '/ix'}},
         {prenom:{ $regex: keyword, $options: '/ix'}},
         {telephone:{ $regex: keyword, $options: '/ix'}}
         
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collecteurs: datas
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


module.exports = router;