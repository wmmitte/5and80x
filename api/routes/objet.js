/**
 *
 * @author WmYameogo <wendmi.yameogo@tic.gov.bf>
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
const Objet = require("../models/objet");
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


//create mongo connection
const mongoURI=_CONFIGS.databaseSourceName;
const conn=mongoose.createConnection(mongoURI,{ useNewUrlParser: true });

//init gfs
let gfs;

conn.once('open',() => {
   // console.log('bd ouverte');
   //init stream*

   gfs=Grid(conn.db,mongoose.mongo);
   gfs.collection('Objet');
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
       
      return new Promise((resolve, reject) => { 
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
         // const id = 'Id';
          const fileInfo = {
            filename: filename,
            bucketName: 'Objet'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

/**
 *
 * Recuperation de la liste de tous les objets
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Objet.find()
    //  .select("nom description") // Selection des attributs necessaires
        .sort([['_id',-1]])
        .populate('lieuAcquisition')
        .populate('emplacement')
        .populate('collecteur')
        .populate('categorie')
        .populate('lieuFabrication')
        .populate('fabricant')
        .populate('etatConservation')
        .populate('modeAcquisition')
        .populate('collectionn')
        .populate('utilisateur')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                objets: datas
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
 * Enregistrement d'un objet
 * dans la base de données
 * POST
 * url : /
 */
router.post("/",upload.single('file'), (req, res, next) => {

    /* Preparation/construction de l'objet */
    const objet = new Objet({
        _id: new mongoose.Types.ObjectId(),

        numeroInventaire: req.body.numeroInventaire,

        ancienNumeroInventaire: req.body.ancienNumeroInventaire,

        nom: req.body.nom,

        description: req.body.description,
        //image: 'default.jpg',

        infosComplementaire:req.body.infosComplementaire ,

        appelationLocale: req.body.appelationLocale ,

        dateAcquisition: Date.now(), // req.body.dateAcquisition,

        hauteur: req.body.hauteur,

        profondeur: req.body.profondeur,

        longueur: req.body.longueur,

        circonference: req.body.circonference,

        largeur: req.body.largeur,

        diametre: req.body.diametre,

        epaisseur: req.body.epaisseur,

        poids: req.body.poids,

        datation:  Date.now(), // req.body.datation,

        photoref: req.file.filename, // voir possiblité denvoyer vers photo

        photooriginalname: req.file.originalname,

        photodescription:req.body.photodescription,

        dateCreation: Date.now(), //req.body.dateCreation,

        datMaj: Date.now(), //req.body.datMaj,

        lieuAcquisition : req.body.lieuAcquisition ,
    
        emplacement : req.body.emplacement ,
    
        collecteur : req.body.collecteur ,

        categorie : req.body.categorie ,
    
        lieuFabrication : req.body.lieuFabrication ,
    
        fabricant : req.body.fabricant ,
    
        etatConservation : req.body.etatConservation ,
    
        modeAcquisition :req.body.modeAcquisition ,
    
        collectionn : req.body.collectionn ,
    
        utilisateur : req.body.utilisateur 

    });

    /* Enregistrement de l'objet dans la BD*/
    objet.save()
        .then(data => {
            const response = {
                    message: "Objet enregistré avec succès",
                    objet: data, /*{
                        _id: data._id,
                        numeroInventaire: data.numeroInventaire,
                        ancienNumeroInventaire: data.ancienNumeroInventaire,
                        appelationLocale: data.appelationLocale,
                        nom: data.nom,
                        description: data.description,
                        image: data.image,
                        request: {
                            type: "GET",
                            url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/objets/${data._id}`
                        }
                    }*/
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/objets/${data._id}`
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
 * Recuperation d'un objet
 * dans la base de données
 * dont on connait l'identifiant
 * GET
 * url : /:_Id
 */
router.get("/:objetId", (req, res, next) => {

    /*recuperation de l'identifiant de l'objet*/
    const id = req.params.objetId;

    /*Execution de la requete de recherche dans la base de données*/
    Objet.findById(id)
        .sort([['_id',-1]])
        .populate('lieuAcquisition')
        .populate('emplacement')
        .populate('collecteur')
        .populate('categorie')
        .populate('lieuFabrication')
        .populate('fabricant')
        .populate('etatConservation')
        .populate('modeAcquisition')
        .populate('collectionn')
        .populate('utilisateur')
        .exec()
        .then(data => {
            if (data) { /*Il y a un objet qui correspond à la recherche*/
                const response = {
                    objet: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/objets/${data._id}`
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


//tester l'affichage d'une Image dont on connait le nom
//Stocké dans la bd ( dans collection photo simple) 

router.get("/photoref/:photooriginalname", (req, res, next) => {

    /*recuperation de l'identifiant */
    const nom = req.params.photooriginalname;

    /*Execution de la requete de recherche dans la base de données*/
    //Photo.findById(id)
    Objet.findOne({photooriginalname:nom})
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
               
                const readStream= gfs.createReadStream(data.photoref);
                readStream.pipe(res);
            // On pourra donc afficher limage dans la vue en lui envoyant data
               
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
 * Mise à d'un objet
 * dans la base de données
 * dont on connait l'identifiant
 * PATCH
 * url : /:_Id
 */
router.put("/:objetId", (req, res, next) => {

    /*recuperation de l'identifiant de l'objet*/
    const id = req.params.objetId;

    /*
    const updateProperties= {
        
        numeroInventaire: req.body.numeroInventaire,

        ancienNumeroInventaire: req.body.ancienNumeroInventaire,

        nom: req.body.nom,

        description: req.body.description,
        
        infosComplementaire:req.body.infosComplementaire ,

        appelationLocale: req.body.appelationLocale ,

        dateAcquisition: Date.now(), // req.body.dateAcquisition,

        hauteur: req.body.hauteur,

        profondeur: req.body.profondeur,

        longueur: req.body.longueur,

        circonference: req.body.circonference,

        largeur: req.body.largeur,

        diametre: req.body.diametre,

        epaisseur: req.body.epaisseur,

        poids: req.body.poids,

        datation:  Date.now(), // req.body.datation,

      //  photoref: req.file.filename, // voir possiblité denvoyer vers photo

       // photooriginalname: req.file.originalname,

     //   photodescription:req.body.photodescription,

        dateCreation: Date.now(), //req.body.dateCreation,

        datMaj: Date.now(), //req.body.datMaj,

        lieuAcquisition : req.body.lieuAcquisition ,
    
        emplacement : req.body.emplacement ,
    
        collecteur : req.body.collecteur ,

        categorie : req.body.categorie ,
    
        lieuFabrication : req.body.lieuFabrication ,
    
        fabricant : req.body.fabricant ,
    
        etatConservation : req.body.etatConservation ,
    
        modeAcquisition :req.body.modeAcquisition ,
    
        collectionn : req.body.collectionn ,
    
        utilisateur : req.body.utilisateur 
    };
*/


    /*recuperation des attributs ayant ete modifies de l'objet*/
   const updateProperties = req.body;

    /*Execution de la requete*/
    Objet.findByIdAndUpdate(id, updateProperties,{new:true})
        .exec()
        .then((data) => {
            const response = {
                message: "Objet modifié avec succès",
                objet: data,
                request: {
                    type: "GET",
                    url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/objets/${data._id}`
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
 * suppression d'un objet
 * dans la base de données
 * dont on connait l'identifiant
 * DELETE
 * url : /:_Id
 */
router.delete("/:objetId", (req, res, next) => {
    /*recuperation de l'identifiant de l'objet*/
    const id = req.params.objetId;
 /*Execution de la requete*/
    Objet.findById(id)
        .exec()
        .then(data => {
            if (data.photoref) { /*Il y a une image de reference à la recherche*/
                //suppression de l'image de reference
                    filename= data.photoref;
                    gfs.remove({filename:filename, root:'Objet'}, (err, gridStore)=>{
                        if(err){
                            return res.status(404).json({err:err});
                        } 
                    }) ;
            }
            
            //suppression de l'objet
            Objet.findByIdAndRemove(id)
                .exec()
                .then((data) => {
                 const response = {
                    objet: {_id:id},
                    message: "Objet supprimé avec succès",
                 };
                  res.status(200).json(response);
             })
                .catch(err => {
                    console.log(err);
                   res.status(500).json({
                      error: err
                 });
                });
            

        });
 
});


/**
 *
 * Recherches de tous les objets
 * dans la base de données
 * dont on connait un mot cle
 * GET
 * url : /:_Id
 */
router.get("/search/:keyword", (req, res, next) => {

    /*recuperation du mot cley pour la recherche l'objet*/
    const keyword = req.params.keyword;

    /*Execution de la requete de recherche dans la base de données*/
    Objet.find({$or:[{numeroInventaire:{ $regex: '^'+keyword}},
            {ancienNumeroInventaire:{ $regex: '^'+keyword}},
            {nom:{ $regex: '^'+keyword}},
            {appelationLocale:{ $regex: '^'+keyword}},
            {description:{ $regex: '^'+keyword}}]})
        .sort([['_id',-1]])
        .populate('lieuAcquisition')
        .populate('emplacement')
        .populate('collecteur')
        .populate('categorie')
        .populate('lieuFabrication')
        .populate('fabricant')
        .populate('etatConservation')
        .populate('modeAcquisition')
        .populate('collectionn')
        .populate('utilisateur')
        .exec()
        .then(datas => {
            if (datas) { /*Il y a un objet qui correspondat à la recherche*/
                const response = {
                    objets: datas
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
 * Ajouter/modifier la photo de refence
 * d'un objet 
 * dont on connait son id
 * put
 * url : /:_Id
 */

router.put("/addref/:objetId",upload.single('file'), (req, res, next) => {

    /*recuperation de l'identifiant */
    const id = req.params.objetId;

    /*recuperation des attributs ayant ete modifies */
    const updateProperties = {

        photoref: req.file.filename, 

        photooriginalname: req.file.originalname,

        photodescription:req.body.photodescription
    } ;

    Objet.findById(id)
        .exec()
        .then(data => {
            if (data.photoref) { /*Il y a une image de reference à la recherche*/
                //suppression de l'image de reference
                    const filename= data.photoref;
                    gfs.remove({filename:filename, root:'Objet'}, (err, gridStore)=>{
                        if(err){
                            return res.status(404).json({err:err});
                        } 
                    }) ;
            }

            
            //ajoute des nouvelles informations
            Objet.findByIdAndUpdate(id, updateProperties,{new:true})
                .exec()
                .then((data) => {
                const response = {
                    message: "photoreference  modifiée avec succès",
                    reference: data
                    
             };
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

            

        });

});






/**
 *
 * supprimer la photo de refence
 * d'un objet 
 * dont on connait son id
 * put
 * url : /:_Id
 */
router.delete("/rmref/:objetId", (req, res, next) => {

     /*recuperation de l'identifiant */
     const id = req.params.objetId;

     /*recuperation des attributs ayant ete modifies */
     const updateProperties = {
 
         photoref: "", 
 
         photooriginalname: "" ,
 
         photodescription: "" 
     } ;
 
     Objet.findById(id)
         .exec()
         .then(data => {
             if (data.photoref) { /*Il y a une image de reference à la recherche*/
                 //suppression de l'image de reference
                     const filename= data.photoref;
                     gfs.remove({filename:filename, root:'Objet'}, (err, gridStore)=>{
                         if(err){
                             return res.status(404).json({err:err});
                         } 
                     }) ;
             }
 
             
             //ajoute des nouvelles informations
             Objet.findByIdAndUpdate(id, updateProperties,{new:true})
                 .exec()
                 .then((data) => {
                 const response = {
                     message: "photoreference  supprimée avec succès",
                     referen: data
                     
              };
                 res.status(200).json(response);
             })
             .catch(err => {
                 console.log(err);
                 res.status(500).json({
                     error: err
                 });
             });
 
             
 
         });
});



module.exports = router;
