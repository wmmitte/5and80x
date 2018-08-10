/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe etatConservation
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const EtatConservation = require("../models/etatConservation");








/**
 *
 * Recuperation de la liste de EtatConservations
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    EtatConservation.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                etatConservations: datas.map(data => {
                    return {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/etatConservations/${data._id}`
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
 * Enregistrement EtatConservation
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const eta = new EtatConservation({
        _id: new mongoose.Types.ObjectId(),
        libelle: req.body.libelle        
    });
    //res.status(201).json(lieu);
    /* Enregistrement du lieu dans la BD*/
    eta.save()
        .then(data => {
            const response = {
                    message: "EtatConservation enregistré avec succès",
                    etatConservation: {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/etatConservations/${data._id}`
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
 * Recuperation de EtatConservation 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:etatConservationId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.etatConservationId;

    /*Execution de la requete de recherche dans la base de données*/
    EtatConservation.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    etatConservation: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/etatConservations/${data._id}`
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
 * Mise à jour EtatConservation
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:etatConservationId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.etatConservationId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    EtatConservation.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "EtatConservation  modifié avec succès",
                etatConservation: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/etatConservations/${data._id}`
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
 * suppression EtatConservation
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:etatConservationId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.etatConservationId;

    /*Execution de la requete*/
    EtatConservation.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                etatConservation: {_id:id},
                message: "EtatConservation supprimé avec succès",
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
 * Recherches  EtatConservation
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    EtatConservation.find({$or:[
         {libelle:{ $regex: keyword, $options: '/ix'}}
         
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    etatConservations: datas
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