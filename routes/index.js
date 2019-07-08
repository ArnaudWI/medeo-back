const router = require('express').Router();
const request = require('request');
const mongoose = require('mongoose');
const cors = require('cors')

router.use(cors())

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
};

mongoose.connect('mongodb://arnaud:arnaud69@ds249127.mlab.com:49127/medeo',
    options,
    function(err) {
     console.log(err);
    }
);

const favoriteSchema = mongoose.Schema({
    id: String,
    prefix: String,
    familyName: String,
    firstName: String,
    gender: String
});

const favoriteModel = mongoose.model('favorites', favoriteSchema);

//get practitioner data
router.get('/practitioner', function(req, res) {
  request("http://hapi.fhir.org/baseDstu3/Practitioner?_format=json&_pretty=true", function(error, response, practitioner) {
    practitioner = JSON.parse(practitioner);
    res.json({practitioner});
  });
});

//get device data
router.get('/device', function(req, res) {
  request("http://hapi.fhir.org/baseDstu3/Device?_format=json&_pretty=true", function(error, response, device) {
    device = JSON.parse(device);
    res.json({device});
  });
});

//get owner of device
router.post('/owner', function(req, res) {
  request(`http://hapi.fhir.org/baseDstu3/${req.body.owner}?_format=json&_pretty=true`, function(error, response, owner) {
    owner = JSON.parse(owner);
    res.json({owner});
  });
});

//add an practitioner to favorites
router.post('/add-favorites', function(req, res) {
    let newFavorite = new favoriteModel ({
      id: req.body.id,
      prefix: req.body.prefix,
      familyName: req.body.familyName,
      firstName: req.body.firstName,
      gender: req.body.gender
    })

    newFavorite.save(
      function (error, favorite){
        res.json({favorite, result: 'success'});
      }
    );
});

//delete an favorites
router.delete('/delete-favorites/:favoriteId', function(req, res) {
  favoriteModel.deleteOne(
  { id: req.params.favoriteId},
      function (err, response) {
        res.json({result: true});
      }
  );
});

// get my favorites
router.get('/myfavorites', function(req, res) {
  favoriteModel.find (
      function (err, favorites) {
        res.json({favorites});
      }
  );
});

module.exports = router;
