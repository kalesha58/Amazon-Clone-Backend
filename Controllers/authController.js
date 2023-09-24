import User from "../model/user.js";
import crypto from "crypto"
import { comparePassword, hashPassword } from "../Helper/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer"
const sendVerificationEmail = async (email, verificationToken) => {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        // Configure the email service or SMTP details here
        service: "gmail",
        auth: {
            user: "kalesha786kareem@gmail.com",
            pass: "fdszaaczqogwoqfo",
        },
    });

    // Compose the email message
    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://localhost:8000/api/v1/auth/verify/${verificationToken}`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};
export const verfifyEmail = async (req, res) => {
    try {
        const token = req.params.token;

        //Find the user witht the given verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification token" });
        }

        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email Verificatioion Failed" });
    }
}
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");

    return secretKey;
};

const secretKey = generateSecretKey();
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered:", email); // Debugging statement
            return res.status(400).json({ message: "Email already registered" });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });

        // Generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        // Save the user to the database
        await newUser.save();

        // Debugging statement to verify data
        console.log("New User Registered:", newUser);

        // Send verification email to the user
        // Use your preferred email service or library to send the email
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            message:
                "Registration successful. Please check your email for verification.",
                Success:true
        });
    } catch (error) {
        console.log("Error during registration:", error); // Debugging statement
        res.status(500).json({ message: "Registration failed" });
    }
};
//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        //generate a token
        const token = JWT.sign({ userId: user._id }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login Failed" });
    }
};
