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
const MateriauxObjet = require("../models/materiauxObjet");






/**
 *
 * Recuperation de la liste des MateriauxObjet
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    MateriauxObjet.find()
        .sort([['_id',-1]])
        .populate('objet')
        .populate('materiaux')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                materiauxObjets: datas
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
 * Enregistrement de MateriauxObjet
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const matO = new MateriauxObjet({
        _id: new mongoose.Types.ObjectId(),
        materiaux: req.body.materiaux,
        objet: req.body.objet
        
    });
    
    /* Enregistrement  dans la BD*/
    matO.save()
        .then(data => {
            const response = {
                    message: "MateriauxObjet enregistré avec succès",
                    materiauxObjet: {
                        _id: data._id,
                        objet: data.objet,
                        materiaux: data.materiaux,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiauxObjets/${data._id}`
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
 * Recuperation de MateriauxObjet 
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:matOId", (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.matOId;

    /*Execution de la requete de recherche dans la base de données*/
    MateriauxObjet.findById(id)
        .populate('objet')
        .populate('materiaux')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    materiauxObjet: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiauxObjets/${data._id}`
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
 * Mise à jour MateriauxObjet
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:matOId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.matOId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = req.body;

    /*Execution de la requete*/
    MateriauxObjet.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "MateriauxObjet  modifié avec succès",
                materiauxObjet: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/materiauxObjets/${data._id}`
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
 * suppression MateriauxObjet
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:matOId", (req, res, next) => {
    /*recuperation de l'identifiant */
    const id = req.params.matOId;

    /*Execution de la requete*/
    MateriauxObjet.findByIdAndRemove(id)
        .exec()
        .then((data) => {
            const response = {
                materiauxObjet: {_id:id},
                message: "MateriauxObjet supprimé avec succès",
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
 * Recherches MateriauxObjet
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    MateriauxObjet.find({$or:[
      //   {libelle:{ $regex: keyword, $options: '/ix'}},
       //  {categorie.libelle :{ $regex: keyword, $options: '/ix'}}
         ]})
        .populate('objet')
        .populate('materiaux')
        .sort([['_id',-1]])
        .exec()
        .then(datas => {
            // console.log(datas);
            if (datas && datas.length !==0) { /*Il y a une correspondance à la recherche*/
                const response = {
                    materiauxObjets: datas
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