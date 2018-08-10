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
const Collectionn = require("../models/collectionn");








/**
 *
 * Recuperation de la liste des Collections
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Collectionn.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                collectionns: datas
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
 * Enregistrement de Collection
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    
  //  const idCategorie= req.body.idCat ; 

    /* Preparation/construction de l'objet */
    const coll = new Collectionn({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        presentation: req.body.presentation
        
    });
    
    /* Enregistrement  dans la BD*/
    coll.save()
        .then(data => {
            const response = {
                    message: "Collection enregistrée avec succès",
                    collectionn: {
                        _id: data._id,
                        nom: data.nom,
                        presentation: data.presentation,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collections/${data._id}`
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
 * Recuperation de Collection 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:collectionId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.collectionId;

    /*Execution de la requete de recherche dans la base de données*/
    Collectionn.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collectionn: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collections/${data._id}`
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
 * Mise à jour Collection
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:collectionId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.collectionId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    Collectionn.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "collection  modifiée avec succès",
                collectionn: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collections/${data._id}`
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
 * suppression collection
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:collectionId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.collectionId;

    /*Execution de la requete*/
    Collectionn.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                collectionn: {_id:id},
                message: "collection supprimée avec succès",
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
 * Recherches collections
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Collectionn.find({$or:[
         {nom:{ $regex: keyword, $options: '/ix'}},
         {presentation:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collectionns: datas
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