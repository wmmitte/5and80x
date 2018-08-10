/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Module des routes de la classe Categorie
 *
 */

const _CONFIGS = require('../../configs');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Categorie = require("../models/categorie");








/**
 *
 * Recuperation de la liste des Categories
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Categorie.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                categories: datas.map(data => {
                    return {
                        _id: data._id,
                        libelle: data.libelle,
                        description: data.description,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/categories/${data._id}`
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
 * Enregistrement d'une Categorie
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const cat = new Categorie({
        _id: new mongoose.Types.ObjectId(),
        libelle: req.body.libelle,
        description: req.body.description
        
    });
    //res.status(201).json(lieu);
    /* Enregistrement du lieu dans la BD*/
    cat.save()
        .then(data => {
            const response = {
                    message: "Categorie enregistrée avec succès",
                    categorie: {
                        _id: data._id,
                        libelle: data.libelle,
                        description:data.description,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/categories/${data._id}`
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
 * Recuperation de la Categorie 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:categorieId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.categorieId;

    /*Execution de la requete de recherche dans la base de données*/
    Categorie.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    categorie: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/categories/${data._id}`
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
 * Mise à jour Categorie
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:categorieId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.categorieId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    Categorie.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Categorie  modifiée avec succès",
                categorie: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/categories/${data._id}`
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
 * suppression Categorie
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:categorieId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.categorieId;

    /*Execution de la requete*/
    Categorie.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                categorie: {_id:id},
                message: "Categorie supprimée avec succès",
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
 * Recherches des Categorie
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Categorie.find({$or:[
         {libelle:{ $regex: keyword, $options: '/ix'}},
         {description:{ $regex: keyword, $options: '/ix'}}
         
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    categories: datas
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