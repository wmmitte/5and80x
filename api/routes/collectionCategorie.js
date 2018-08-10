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
const CollectionCategorie = require("../models/collectionCategorie");








/**
 *
 * Recuperation de la liste des CollectionCategorie
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    CollectionCategorie.find()
        .sort([['_id',-1]])
        .populate('categorie')
        .populate('collectionn')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                collectionCategories: datas
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
 * Enregistrement de CollectionCategorie
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    
  //   

    /* Preparation/construction de l'objet */
    const collcat = new CollectionCategorie({
        _id: new mongoose.Types.ObjectId(),
        collectionn: req.body.collectionn,
        categorie:req.body.categorie
        
    });
    
    /* Enregistrement  dans la BD*/
    collcat.save()
        .then(data => {
            const response = {
                    message: "CollectionCategorie enregistrée avec succès",
                    collectionCategorie: {
                        _id: data._id,
                        collectionn: data.collectionn,
                        categorie: data.categorie,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collectionCategories/${data._id}`
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
 * Recuperation de CollectionCategorie 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:collectionCatId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.collectionCatId;

    /*Execution de la requete de recherche dans la base de données*/
    CollectionCategorie.findById(id)
        .populate('categorie')
        .populate('collectionn')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collectionCategorie: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collectionCategories/${data._id}`
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
router.put("/:collectionCatId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.collectionCatId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    CollectionCategorie.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "CollectionCategorie  modifiée avec succès",
                collectionCategorie: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/collectionCategories/${data._id}`
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
 * suppression CollectionCategorie
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:collectionCatId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.collectionCatId;

    /*Execution de la requete*/
    CollectionCategorie.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                collectionCategorie: {_id:id},
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
 * Recherches CollectionCategorie
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    CollectionCategorie.find({$or:[
      //   {nom:{ $regex: keyword, $options: '/ix'}},
       //  {presentation:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .populate('categorie')
        .populate('collectionn')
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    collectionCategories: datas
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