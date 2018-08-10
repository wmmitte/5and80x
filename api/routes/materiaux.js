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
const Materiaux = require("../models/materiaux");






/**
 *
 * Recuperation de la liste des materiaux
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Materiaux.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                materiaux: datas
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
 * Enregistrement de Materiaux
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const mat = new Materiaux({
        _id: new mongoose.Types.ObjectId(),
        libelle: req.body.libelle
        
    });
    
    /* Enregistrement  dans la BD*/
    mat.save()
        .then(data => {
            const response = {
                    message: "Materiaux enregistré avec succès",
                    materiaux: {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiaux/${data._id}`
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
 * Recuperation de Materiaux 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:matId", (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.matId;

    /*Execution de la requete de recherche dans la base de données*/
    Materiaux.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    materiaux: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiaux/${data._id}`
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
 * Mise à jour Materiaux
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:matId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.matId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    Materiaux.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Materiaux  modifié avec succès",
                materiaux: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiaux/${data._id}`
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
 * suppression Materiaux
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:matId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.matId;

    /*Execution de la requete*/
    Materiaux.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                materiaux: {_id:id},
                message: "Materiaux supprimé avec succès",
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
 * Recherches Materiaux
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Materiaux.find({$or:[
         {libelle:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    materiaux: datas
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