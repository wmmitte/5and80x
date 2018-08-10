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
const Mouvement = require("../models/mouvement");









/**
 *
 * Recuperation de la liste des mouvements
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Mouvement.find()
        .sort([['_id',-1]])
        .populate('typeMouvement')
        .populate('objet')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                mouvements: datas
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
 * Enregistrement de Mouvement
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const mou = new Mouvement({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        date: Date.now(), // date: req.body.date,
        typeMouvement: req.body.typeMouvement,
        objet: req.body.objet
        
    });
    
    /* Enregistrement  dans la BD*/
    mou.save()
        .then(data => {
            const response = {
                    message: "Mouvement enregistré avec succès",
                    mouvement: {
                        _id: data._id,
                        description: data.description,
                        date: data.date,
                        typeMouvement: data.typeMouvement,
                        objet: data.objet,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/mouvements/${data._id}`
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
 * Recuperation de Mouvements 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:mouvId", (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.mouvId;

    /*Execution de la requete de recherche dans la base de données*/
    Mouvement.findById(id)
        .populate('typeMouvement')
        .populate('objet')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    mouvement: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/mouvements/${data._id}`
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
 * Mise à jour mouvement
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:mouvId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.mouvId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    Mouvement.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Mouvement  modifié avec succès",
                mouvement: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/mouvements/${data._id}`
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
 * suppression mouvement
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:mouvId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.mouvId;

    /*Execution de la requete*/
    Mouvement.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                mouvement: {_id:id},
                message: "mouvement supprimé avec succès",
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
 * Recherches mouvement
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Mouvement.find({$or:[
         {description:{ $regex: keyword, $options: '/ix'}},
       // {date:{ $regex: keyword, $options: '/ix'}},
       // {objet :{ $regex: keyword, $options: '/ix'}}
         ]})
        .populate('typeMouvement')
        .populate('objet')
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    mouvements: datas
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