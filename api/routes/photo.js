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
const Photo = require("../models/photo");
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
   gfs.collection('Photo');
})

//creatte storage engine

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
            bucketName: 'Photo'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

//Une fois sur cette route on enregistre le fichier
//et on peut recuperer les infos relatives a celui ci
//pour enregistrer dans la collections photo
  router.post("/test",upload.single('file'),(req, res) => {
    //res.json({file:req.file,body:req.body});
    const foto= new Photo({
        _id: new mongoose.Types.ObjectId(),
        objet: req.body.objet ,
        description: req.body.description,
        filename: req.file.filename,
        originalname: req.file.originalname,
        uploadDate: req.file.uploadDate,
        contentType: req.file.contentType
    });

    foto.save()
        .then(data=>{
            const response = {
                message: "enregistré avec succès",
                photo: data
            };
        res.status(201).json(response); /* si resultats disponible */
        })
  });



/**
 *
 * Recuperation de la liste des photos
 * de la base des données
 * GET
 * url : /
 */
router.get("/", (req, res, next) => {
    Photo.find()
     //  .sort([['_id',-1]])
        .populate('objet')
        .exec()
        .then(datas => {
            const response = {
                nombre: datas.length,
                photos: datas
            }; // On pourra donc afficher limage dans la vue en lui envoyant datas
                // si on a la route => router.get("/image/:ImgName", (req, res)=>{...}); 
                //qui affiche une image en fonction du name ici /image/:phoName
                //on mettra <img src="image"+data.filename >
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
 * Enregistrement de Photo
 * dans la base de données
 * POST
 * url : /
 */
router.post("/", upload.single('file'), (req, res, next) => {
 

    /* Preparation/construction de l'objet */
    const foto= new Photo({
        _id: new mongoose.Types.ObjectId(),
        objet: req.body.objet ,
        description: req.body.description,
        originalname: req.file.originalname,
        filename: req.file.filename,
        uploadDate: req.file.uploadDate,
        contentType: req.file.contentType
    });
    
    /* Enregistrement  dans la BD*/
    foto.save()
        .then(data=>{
            const response = {
                message: "Photo enregistrée avec succès",
                photo: data
            };
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
 * Recuperation de Photo 
 * dans la base de données
 * dont on connait le nom
 * GET
 * url : /:_Id
 */
router.get("/:phoName", (req, res, next) => {

    /*recuperation de l'identifiant */
    const nom = req.params.phoName;

    /*Execution de la requete de recherche dans la base de données*/
    //Photo.findById(id)
    Photo.findOne({filename:nom})
        .populate('objet')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
                const response = {
                    photo: data,
                    request: {
                        type: "GET",
                        url: `${_CONFIGS.serverAdress}${_CONFIGS.applicationEndpoint}/photos/${data._id}`
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

//tester l'affichage d'une Photo dont on connait le nom
//Stocké dans la bd ( dans collection photo simple) 

router.get("/image/:phoName", (req, res, next) => {

    /*recuperation de l'identifiant */
    const nom = req.params.phoName;

    /*Execution de la requete de recherche dans la base de données*/
    //Photo.findById(id)
    Photo.findOne({filename:nom})
        .populate('objet')
        .exec()
        .then(data => {
            if (data) { /*Il y a une correspondance à la recherche*/
               
                const readStream= gfs.createReadStream(data.filename);
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
 * suppression Photo
 * dans la base de données
 * dont on connait le nom
 * DELETE
 * url : /:_Id
 */
router.delete("/:phoName", (req, res, next) => {
    /*recuperation de l'identifiant */
    const fname = req.params.phoName;

    /*Execution de la requete*/
    
    gfs.remove({filename:fname, root:'Photo'}, (err, gridStore)=>{
        if(err){
            return res.status(404).json({err:err});
        }
        const response = {
            image: fname,
            message: "photo supprimée avec succès",
        };
        res
            .status(200)
            .json(response);
    })
});



module.exports = router;