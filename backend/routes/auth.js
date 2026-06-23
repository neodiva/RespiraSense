const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/* ----------------------------------------------------
   Generate Patient ID
   Example:
   RS-P001
   RS-P002
---------------------------------------------------- */

async function generatePatientID() {

    const lastPatient = await User.findOne({
        patient_id: { $exists: true, $ne: null }
    }).sort({ patient_id: -1 });

    if (!lastPatient || !lastPatient.patient_id) {
        return "RS-P001";
    }

    const lastNumber = parseInt(
        lastPatient.patient_id.replace("RS-P", "")
    );

    return `RS-P${String(lastNumber + 1).padStart(3, "0")}`;
}

/* ----------------------------------------------------
   REGISTER
---------------------------------------------------- */

router.post('/register', async (req, res) => {

    try {

        let {
            name,
            email,
            password,
            role,
            dob,
            fitnessLevel
        } = req.body;

        email = email.toLowerCase().trim();

        const existing = await User.findOne({ email });

        if (existing) {

            return res.status(400).json({
                error: "Email already registered."
            });

        }

        const newUser = {

            name: name.trim(),

            email,

            password,

            role

        };

        if (role === "patient") {

            newUser.patient_id = await generatePatientID();

            newUser.dob = dob;

            newUser.fitnessLevel = fitnessLevel;

        }

        const user = new User(newUser);

        await user.save();

        res.status(201).json({

            success: true,

            message: "Registration successful.",

            patient_id: user.patient_id || null

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Server Error"

        });

    }

});

/* ----------------------------------------------------
   LOGIN
---------------------------------------------------- */

router.post('/login', async (req, res) => {

    try {

        let { email, password } = req.body;

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({

                error: "Invalid email or password."

            });

        }

        const match = await user.comparePassword(password);

        if (!match) {

            return res.status(401).json({

                error: "Invalid email or password."

            });

        }

        const token = jwt.sign(

            {

                id: user._id,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        let displayName = user.name;

        if (user.role === "doctor") {

            displayName = `Dr. ${user.name}`;

        }

        res.json({

            token,

            name: user.name,

            displayName,

            role: user.role,

            patient_id: user.patient_id,

            dob: user.dob,

            age: user.age,

            fitnessLevel: user.fitnessLevel,

            patient_ids: user.patient_ids

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Server Error"

        });

    }

});

module.exports = router;