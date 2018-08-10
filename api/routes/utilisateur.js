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
const Utilisateur = require("../models/utilisateur");








/**
 *
 * Recuperation de la liste des Utilisateurs
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Utilisateur.find()
        .sort([['_id',-1]])
        .populate('typeUtilisateur')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                utilisateurs: datas
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
 * Enregistrement de Utilisateur
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const ut = new Utilisateur({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        prenom: req.body.prenom,
        login: req.body.login,
        password: req.body.password,
        telephone: req.body.telephone,
        adresse: req.body.adresse,
        email: req.body.email,
        typeUtilisateur:req.body.typeUtilisateur
        
    });
    
    /* Enregistrement  dans la BD*/
    ut.save()
        .then(data => {
            const response = {
                    message: "Utilisateur enregistré avec succès",
                    utilisateur: {
                        _id: data._id,
                        nom: data.nom,
                        prenom: data.prenom,
                        login: data.login,
                        password: data.password,
                        telephone: data.telephone,
                        adresse: data.adresse,
                        email: data.email,
                        typeUtilisateur:data.typeUtilisateur,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/utilisateurs/${data._id}`
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
 * Recuperation de utilisateur 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:userId", (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.userId;

    /*Execution de la requete de recherche dans la base de données*/
    Utilisateur.findById(id)
        .populate('typeUtilisateur')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    utilisateur: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/utilisateurs/${data._id}`
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
 * Mise à jour utilisateur
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:userId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.userId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    Utilisateur.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Utilisateur  modifié avec succès",
                utilisateur: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/utilisateurs/${data._id}`
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
 * suppression utilisateur
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:userId", (req, res, next) => {
    /*recuperation de l'identifiant direction*/
    const id = req.params.userId;

    /*Execution de la requete*/
    Utilisateur.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                utilisateur: {_id:id},
                message: "utilisateur supprimé avec succès",
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
 * Recherches utilisateurs
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Utilisateur.find({$or:[
         {nom:{ $regex: keyword, $options: '/ix'}},
         {prenom:{ $regex: keyword, $options: '/ix'}},
         {login:{ $regex: keyword, $options: '/ix'}},
         {telephone:{ $regex: keyword, $options: '/ix'}},
         {adresse:{ $regex: keyword, $options: '/ix'}},
         {email:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .populate('typeUtilisateur')
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    utilisateurs: datas
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