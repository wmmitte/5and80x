/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe fabricant
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fabricant = require("../models/fabricant");








/**
 *
 * Recuperation de la liste de Fabricant
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Fabricant.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                fabricant: datas.map(data => {
                    return {
                        _id: data._id,
                        nom: data.nom,
                        prenom : data.prenom,
                        telephone: data.telephone,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/fabricants/${data._id}`
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
 * Enregistrement Fabricant
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const fab = new Fabricant({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone       
    });
    //res.status(201).json(lieu);
    /* Enregistrement du lieu dans la BD*/
    fab.save()
        .then(data => {
            const response = {
                    message: "Fabricant enregistré avec succès",
                    fabricant: {
                        _id: data._id,
                        nom: data.nom,
                        prenom: data.prenom,
                        telephone: data.telephone,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/fabricants/${data._id}`
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
 * Recuperation de Fabricant 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:fabricantId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.fabricantId;

    /*Execution de la requete de recherche dans la base de données*/
    Fabricant.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    fabricant: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/fabricants/${data._id}`
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
 * Mise à jour Fabricant
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:fabricantId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.fabricantId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    Fabricant.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Fabricant  modifié avec succès",
                fabricant: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/fabricants/${data._id}`
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
 * suppression Fabricant
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:fabricantId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.fabricantId;

    /*Execution de la requete*/
    Fabricant.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                fabricant: {_id:id},
                message: "Fabricant supprimé avec succès",
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
 * Recherches  Fabricant
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Fabricant.find({$or:[
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
                    fabricants: datas
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