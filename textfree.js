
    /*recuperation de l'identifiant */
  
    const id = req.params.objetId;
    const updateProperties = {
        photoref:'', 
        photooriginalname: '',
        photodescription:''
    } 
        Objet.findById(id)
        .exec()
        .then(data => {
            if (data.photoref ) //&& data.photoref.length>0
            { /*Il y a une image de reference à la recherche*/
                //suppression de l'image de reference
                 const filname= data.photoref;
                    gfs.remove({filename:filname, root:'Objet'}, (err, gridStore)=>{
                        if(err){
                            return res.status(404).json({err:err});
                        } 
                    }) ;

              }

            //ajoute des nouvelles informations
            Objet.findByIdAndUpdate(id, updateProperties,{new:true})
            .exec()
            .then((data) => {
             response = {
                message: "photoreference  supprimée avec succès",
                referen: data
                 };
            }).catch(err => {
            res.status(500).json({error: err});
                });
           
        }).catch(err => {
            res.status(500).json({error: err});
                });





{
        
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