/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe Objet
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ModeAcquisition = require("../models/modeAcquisition");








/**
 *
 * Recuperation de la liste de ModeAcquisition
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    ModeAcquisition.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                modeAcquisitions: datas.map(data => {
                    return {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/modeAcquisitions/${data._id}`
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
 * Enregistrement de ModeAcquisition
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const ma = new ModeAcquisition({
        _id: new mongoose.Types.ObjectId(),
        libelle: req.body.libelle
        
    });
    //res.status(201).json(lieu);
    /* Enregistrement dans la BD*/
    ma.save()
        .then(data => {
            const response = {
                    message: "ModeAcquisition enregistré avec succès",
                    modeAcquisition: {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/modeAcquisitions/${data._id}`
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
 * Recuperation de ModeAcquisition 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:modeAcquisitionId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.modeAcquisitionId;

    /*Execution de la requete de recherche dans la base de données*/
    ModeAcquisition.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    modeAcquisition: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/modeAcquisitions/${data._id}`
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
 * Mise à jour ModeAcquisition
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:modeAcquisitionId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.modeAcquisitionId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    ModeAcquisition.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "ModeAcquisition d'acquisition modifié avec succès",
                modeAcquisition: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/modeAcquisitions/${data._id}`
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
 * suppression ModeAcquisition
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:modeAcquisitionId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.modeAcquisitionId;

    /*Execution de la requete*/
    ModeAcquisition.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                modeAcquisition: {_id:id},
                message: "ModeAcquisition supprimé avec succès",
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
 * Recherches des ModeAcquisition
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    ModeAcquisition.find({$or:[
         {libelle:{ $regex: keyword, $options: '/ix'}}
         
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    modeAcquisitions: datas
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