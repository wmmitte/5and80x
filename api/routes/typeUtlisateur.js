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
const TypeUtilisateur = require("../models/typeUtilisateur");








/**
 *
 * Recuperation de la liste de TypeUtilisateur
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    TypeUtilisateur.find()
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                typeUtilisateurs: datas.map(data => {
                    return {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/typeUtilisateurs/${data._id}`
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
 * Enregistrement de TypeUtilisateur
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {

    /* Preparation/construction de l'objet */
    const tu = new TypeUtilisateur({
        _id: new mongoose.Types.ObjectId(),
        libelle: req.body.libelle
        
    });
    //res.status(201).json(lieu);
    /* Enregistrement dans la BD*/
    tu.save()
        .then(data => {
            const response = {
                    message: "TypeUtilisateur enregistré avec succès",
                    typeUtilisateur: {
                        _id: data._id,
                        libelle: data.libelle,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/typeUtilisateurs/${data._id}`
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
 * Recuperation de TypeUtilisateur 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:typeUtilisateurId", (req, res, next) => {

    /*recuperation de l'identifiant de direction*/
    const id = req.params.typeUtilisateurId;

    /*Execution de la requete de recherche dans la base de données*/
    TypeUtilisateur.findById(id)
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    typeUtilisateur: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/typeUtilisateurs/${data._id}`
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
 * Mise à jour TypeUtilisateur
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:typeUtilisateurId", (req, res, next) => {
    /*recuperation de l'identifiant de direction*/
    const id = req.params.typeUtilisateurId;

    /*recuperation des attributs ayant ete modifies de direction*/
    const updateProperties = req.body;

    /*Execution de la requete*/
    TypeUtilisateur.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "TypeUtilisateur modifié avec succès",
                typeUtilisateur: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/typeUtilisateurs/${data._id}`
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
 * suppression TypeUtilisateur
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:typeUtilisateurId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.typeUtilisateurId;

    /*Execution de la requete*/
    TypeUtilisateur.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                typeUtilisateur: {_id:id},
                message: "TypeUtilisateur supprimé avec succès",
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
 * Recherches des TypeUtilisateur
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    TypeUtilisateur.find({$or:[
         {libelle:{ $regex: keyword, $options: '/ix'}}
         
         ]})
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    typeUtilisateurs: datas
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