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
const TechniqueObjet = require("../models/techniqueObjet");






/**
 *
 * Recuperation de la liste des TechniqueObjet
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    TechniqueObjet.find()
        .sort([['_id',-1]])
        .populate('objet')
        .populate('technique')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                techniqueObjets: datas
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
 * Enregistrement de TechniqueObjet
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const techO = new TechniqueObjet({
        _id: new mongoose.Types.ObjectId(),
        technique: req.body.technique,
        objet: req.body.objet
        
    });
    
    /* Enregistrement  dans la BD*/
    techO.save()
        .then(data => {
            const response = {
                    message: "TechniqueObjet enregistré avec succès",
                    techniqueObjet: {
                        _id: data._id,
                        technique: data.technique,
                        objet: data.objet,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/techniqueObjets/${data._id}`
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
 * Recuperation de TechniqueObjet 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:tecOId", (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.tecOId;

    /*Execution de la requete de recherche dans la base de données*/
    TechniqueObjet.findById(id)
        .populate('objet')
        .populate('technique')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    techniqueObjet: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/techniqueObjets/${data._id}`
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
 * Mise à jour TechniqueObjet
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:tecOId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.tecOId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    TechniqueObjet.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "TechniqueObjet  modifié avec succès",
                techniqueObjet: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/techniqueObjets/${data._id}`
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
 * suppression TechniqueObjet
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:tecOId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.tecOId;

    /*Execution de la requete*/
    TechniqueObjet.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                techniqueObjet: {_id:id},
                message: "TechniqueObjet supprimé avec succès",
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
 * Recherches TechniqueObjet
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    TechniqueObjet.find({$or:[
       //  {libelle:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .populate('objet')
        .populate('technique')
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    techniqueObjets: datas
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