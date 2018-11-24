const express = require('express');
const router = express();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../models/Profile');
const User = require('../models/User');

//@route GET api/profile
//@description Route to get users profile
//@access private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {}
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'user profile not found'
        return res.status(404).json(errors);
      }
      res.json(profile)
    }).catch(err => res.status(404).json(err));
});

//@route POST api/profile
//@description Route to create or edit users profile
//@access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.gihubUserName) profileFields.gihubUserName = req.body.gihubUserName;
  //skills - split into an array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        //update the profile
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile))
      } else {
        //Create Profile
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            erros.handle = 'That handle already exists';
            res.status(400).json(errors);
          }
          //Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));

        });
      }
    })

});

module.exports = router;