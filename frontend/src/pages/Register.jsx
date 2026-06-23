import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",

        email: "",

        password: "",

        confirmPassword: "",

        role: "patient",

        dob: "",

        fitnessLevel: 3

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [generatedID, setGeneratedID] = useState("");



    function handleChange(e){

        setForm({

            ...form,

            [e.target.name]:
                e.target.name === "fitnessLevel"
                    ? Number(e.target.value)
                    : e.target.value

        });

    }



    async function handleSubmit(e){

        e.preventDefault();

        setError("");

        setSuccess("");



        if(form.password !== form.confirmPassword){

            setError("Passwords do not match.");

            return;

        }



        if(form.password.length < 6){

            setError("Password must contain at least 6 characters.");

            return;

        }



        setLoading(true);



        try{

            const payload = {

                name: form.name,

                email: form.email,

                password: form.password,

                role: form.role

            };



            if(form.role === "patient"){

                payload.dob = form.dob;

                payload.fitnessLevel = form.fitnessLevel;

            }



            const res = await api.post(

                "/auth/register",

                payload

            );



            setSuccess("Account created successfully!");



            if(res.data.patient_id){

                setGeneratedID(res.data.patient_id);

            }



            setTimeout(()=>{

                navigate("/login");

            },3000);



        }

        catch(err){

            setError(

                err.response?.data?.error ||

                "Registration failed."

            );

        }

        finally{

            setLoading(false);

        }

    }



    return(

        <div style={styles.page}>

            <div style={styles.card}>


                <div style={styles.brand}>

                    <div style={styles.logo}>

                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                        >

                            <polyline

                                points="2,14 7,14 9,6 12,22 15,10 18,18 21,14 26,14"

                                stroke="#00d4ff"

                                strokeWidth="2"

                                strokeLinecap="round"

                                strokeLinejoin="round"

                            />

                        </svg>

                    </div>

                    <div>

                        <h1 style={styles.title}>

                            RespiraSense

                        </h1>

                        <p style={styles.subtitle}>

                            Create your account

                        </p>

                    </div>

                </div>



                <form
                    onSubmit={handleSubmit}
                    style={styles.form}
                >

                    <div style={styles.field}>

                        <label style={styles.label}>

                            Full Name

                        </label>

                        <input

                            style={styles.input}

                            name="name"

                            value={form.name}

                            onChange={handleChange}

                            placeholder="John Smith"

                            required

                        />

                    </div>



                    <div style={styles.field}>

                        <label style={styles.label}>

                            Email

                        </label>

                        <input

                            type="email"

                            style={styles.input}

                            name="email"

                            value={form.email}

                            onChange={handleChange}

                            placeholder="doctor@hospital.com"

                            required

                        />

                    </div>



                    <div style={styles.field}>

                        <label style={styles.label}>

                            Password

                        </label>

                        <input

                            type="password"

                            style={styles.input}

                            name="password"

                            value={form.password}

                            onChange={handleChange}

                            placeholder="Minimum 6 characters"

                            required

                        />

                    </div>



                    <div style={styles.field}>

                        <label style={styles.label}>

                            Confirm Password

                        </label>

                        <input

                            type="password"

                            style={styles.input}

                            name="confirmPassword"

                            value={form.confirmPassword}

                            onChange={handleChange}

                            placeholder="Re-enter password"

                            required

                        />

                    </div>



                    <div style={styles.field}>

                        <label style={styles.label}>

                            Role

                        </label>

                        <select

                            style={styles.input}

                            name="role"

                            value={form.role}

                            onChange={handleChange}

                        >

                            <option value="doctor">

                                Doctor

                            </option>

                            <option value="caregiver">

                                Caregiver

                            </option>

                            <option value="patient">

                                Patient

                            </option>

                        </select>

                    </div>
                                        {form.role === "patient" && (

                        <>

                            <div style={styles.field}>

                                <label style={styles.label}>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="dob"
                                    value={form.dob}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />

                            </div>

                            <div style={styles.field}>

                                <label style={styles.label}>
                                    Fitness Level
                                </label>

                                <select
                                    name="fitnessLevel"
                                    value={form.fitnessLevel}
                                    onChange={handleChange}
                                    style={styles.input}
                                >

                                    <option value={1}>
                                        Sedentary
                                    </option>

                                    <option value={2}>
                                        Lightly Active
                                    </option>

                                    <option value={3}>
                                        Moderately Active
                                    </option>

                                    <option value={4}>
                                        Very Active
                                    </option>

                                    <option value={5}>
                                        Athlete
                                    </option>

                                </select>

                            </div>

                        </>

                    )}

                    {error && (

                        <div style={styles.error}>

                            {error}

                        </div>

                    )}

                    {success && (

                        <div style={styles.success}>

                            <strong>

                                {success}

                            </strong>

                            {generatedID && (

                                <>

                                    <br />

                                    <br />

                                    <span>

                                        Patient ID

                                    </span>

                                    <div style={styles.patientID}>

                                        {generatedID}

                                    </div>

                                </>

                            )}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >

                        {

                            loading

                            ?

                            "Creating Account..."

                            :

                            "Create Account"

                        }

                    </button>

                </form>

                <p style={styles.footer}>

                    Already have an account?

                    {" "}

                    <Link
                        to="/login"
                        style={styles.link}
                    >

                        Sign In

                    </Link>

                </p>

            </div>

        </div>

    );

}

const styles = {

    page:{

        minHeight:"100vh",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        background:
            "radial-gradient(circle at top,#10234b 0%,#0a0e1a 70%)",

        padding:"30px"

    },

    card:{

        width:"100%",

        maxWidth:"470px",

        background:"#111827",

        borderRadius:"18px",

        padding:"40px",

        border:"1px solid #1e2d45",

        boxShadow:"0 0 60px rgba(0,212,255,.08)"

    },

    brand:{

        display:"flex",

        gap:"15px",

        alignItems:"center",

        marginBottom:"30px"

    },

    logo:{

        width:"50px",

        height:"50px",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        borderRadius:"12px",

        background:"#00d4ff15",

        border:"1px solid #00d4ff30"

    },

    title:{

        color:"#fff",

        fontSize:"22px",

        fontWeight:"700"

    },

    subtitle:{

        color:"#94a3b8",

        marginTop:"5px",

        fontSize:"13px"

    },

    form:{

        display:"flex",

        flexDirection:"column",

        gap:"18px"

    },

    field:{

        display:"flex",

        flexDirection:"column",

        gap:"7px"

    },

    label:{

        color:"#94a3b8",

        fontSize:"12px",

        textTransform:"uppercase",

        letterSpacing:".5px"

    },

    input:{

        padding:"12px 14px",

        borderRadius:"8px",

        background:"#0a0e1a",

        border:"1px solid #1e2d45",

        color:"#fff",

        outline:"none",

        fontSize:"14px"

    },
        button:{

        marginTop:"10px",

        padding:"14px",

        background:"#00d4ff",

        color:"#08111f",

        border:"none",

        borderRadius:"10px",

        fontWeight:"700",

        fontSize:"15px",

        cursor:"pointer",

        transition:"0.2s"

    },

    error:{

        background:"#ef444415",

        border:"1px solid #ef444440",

        color:"#ef4444",

        padding:"12px",

        borderRadius:"8px",

        fontSize:"13px"

    },

    success:{

        background:"#10b98115",

        border:"1px solid #10b98140",

        color:"#10b981",

        padding:"14px",

        borderRadius:"8px",

        textAlign:"center",

        fontSize:"14px"

    },

    patientID:{

        marginTop:"10px",

        display:"inline-block",

        padding:"10px 18px",

        borderRadius:"8px",

        background:"#00d4ff15",

        border:"1px solid #00d4ff40",

        color:"#00d4ff",

        fontWeight:"700",

        fontSize:"18px",

        letterSpacing:"1px"

    },

    footer:{

        marginTop:"24px",

        textAlign:"center",

        color:"#94a3b8",

        fontSize:"13px"

    },

    link:{

        color:"#00d4ff",

        textDecoration:"none",

        fontWeight:"600"

    }

};