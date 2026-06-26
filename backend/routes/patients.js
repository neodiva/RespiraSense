const express = require('express');
const router = express.Router();

const Patient = require('../models/Patient');

/*
=========================================
Create New Patient
POST /api/patients
=========================================
*/
router.post('/', async (req, res) => {
  try {
    const {
      patient_id,
      name,
      age,
      gender,
      fitness_score
    } = req.body;

    const exists = await Patient.findOne({ patient_id });

    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID already exists.'
      });
    }

    const patient = await Patient.create({
      patient_id,
      name,
      age,
      gender,
      fitness_score
    });

    res.status(201).json({
      success: true,
      patient
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: 'Unable to create patient.'
    });
  }
});

/*
=========================================
Get All Patients
GET /api/patients
=========================================
*/
router.get('/', async (req, res) => {

  try {

    const patients = await Patient.find()
      .sort({ patient_id: 1 });

    res.json({
      success: true,
      patients
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: 'Unable to fetch patients.'
    });

  }

});

/*
=========================================
Get One Patient
GET /api/patients/:patient_id
=========================================
*/
router.get('/:patient_id', async (req, res) => {

  try {

    const patient = await Patient.findOne({
      patient_id: req.params.patient_id
    });

    if (!patient) {

      return res.status(404).json({
        success: false,
        error: 'Patient not found.'
      });

    }

    res.json({
      success: true,
      patient
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: 'Unable to fetch patient.'
    });

  }

});

/*
=========================================
Update Patient
PUT /api/patients/:patient_id
=========================================
*/
router.put('/:patient_id', async (req, res) => {

  try {

    const patient = await Patient.findOneAndUpdate(

      {
        patient_id: req.params.patient_id
      },

      req.body,

      {
        new: true,
        runValidators: true
      }

    );

    if (!patient) {

      return res.status(404).json({
        success: false,
        error: 'Patient not found.'
      });

    }

    res.json({
      success: true,
      patient
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: 'Unable to update patient.'
    });

  }

});

module.exports = router;