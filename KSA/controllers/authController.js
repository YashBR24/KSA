const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, isOtpExpired } = require('../utils/otpGenerator');
const { verifyRecaptcha } = require('../utils/recaptcha');
const {log} = require("../Logs/logs");

exports.signups = async (req, res) => {

    const { name, mobile_no, email, date_of_birth, gender, password } = req.body;
    log(`USER_SIGNUP_MOBILE_${mobile_no}_${email}`)
    // Verify reCAPTCHA
    // const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    // if (!recaptchaValid) {
    //     return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    // }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });
        
        const otp = generateOTP();
        //console.log(otp)
        const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

        const newUser = new User({
            name,
            mobile_no,
            email,
            date_of_birth,
            gender:gender.toLowerCase(),
            password,
            otp,
            otpExpires
        });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful. Verify OTP sent to your email.' });
    } catch (error) {
        log(`USER_SIGNUP_MOBILE_ERROR`)
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.signup = async (req, res) => {

    const { name, mobile_no, email, date_of_birth, gender, password, recaptchaToken } = req.body;
    log(`USER_SIGNUP_WEB_${mobile_no}_${email}`)
    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const otp = generateOTP();
        //console.log(otp)
        const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

        const newUser = new User({
            name,
            mobile_no,
            email,
            date_of_birth,
            gender:gender.toLowerCase(),
            password,
            otp,
            otpExpires
        });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful. Verify OTP sent to your email.' });
    } catch (error) {
        log(`USER_SIGNUP_ERROR_WEB`);
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    //console.log('Verify')
    const { email, otp, recaptchaToken } = req.body;
    log(`OTP_VERIFICATION_${email}`);

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaValid) {

        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    try {

        const user = await User.findOne({ email });


        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp || isOtpExpired(user.otpExpires)) {

            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();
        
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        log(`OTP_VERIFICATION_ERROR`);
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtpLogin = async (req, res) => {
    //console.log('Login verify')
    const { email, otp, recaptchaToken } = req.body;
    log(`OTP_VERIFICATION_LOGIN_${email}`);

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaValid) {

        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    try {


        const user = await User.findOne({ email });


        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp || isOtpExpired(user.otpExpires)) {

            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();
        const token = jwt.sign({ id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,role:user.role }, process.env.JWT_SECRET); // Token can use the stringified ID

        res.status(200).json({ message: 'Login successful',role:user.role, token ,id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,name:user.name});

    } catch (error) {
        log(`OTP_VERIFICATION_ERROR`);
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtps = async (req, res) => {
    //console.log('Verify')
    const { email, otp } = req.body;
    log(`OTP_VERIFICATION_MOBILE_${email}`);

    // Verify reCAPTCHA
    // const recaptchaValid = await verifyRecaptcha(recaptchaToken);

    // if (!recaptchaValid) {
    //
    //     return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    // }

    try {

        const user = await User.findOne({ email });


        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp || isOtpExpired(user.otpExpires)) {

            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        log(`OTP_VERIFICATION_ERROR_MOBILE`);
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtpLogins = async (req, res) => {
    //console.log('Login verify')
    const { email, otp } = req.body;

    log(`OTP_VERIFICATION_LOGIN_MOBILE_${email}`);
    // Verify reCAPTCHA
    // const recaptchaValid = await verifyRecaptcha(recaptchaToken);

    // if (!recaptchaValid) {
    //
    //     return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    // }

    try {


        const user = await User.findOne({ email });


        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp || isOtpExpired(user.otpExpires)) {

            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save();
        const token = jwt.sign({ id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,role:user.role }, process.env.JWT_SECRET); // Token can use the stringified ID

        res.status(200).json({ message: 'Login successful',role:user.role, token ,id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,name:user.name});

    } catch (error) {
        log(`OTP_VERIFICATION_FAILED_MOBILE`);
        //console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;
//console.log(1)
    log(`LOGIN_${email}`);
    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaValid) {
        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    try {

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // if (!user.isVerified) {
        //     log(`NOT_VERIFIED_${email}`);
        //     const otp = generateOTP();
        //     const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

        //     user.otp = otp;
        //     user.otpExpires = otpExpires;
        //     await user.save();

        //     //console.log("Generated OTP for user:", otp);

        //     return res.status(403).json({
        //         message: 'Account not verified. OTP has been sent to your email.',
        //         otpSent: true
        //     });
        // }
        log(`SUCCESSFULL_LOGIN_${email}`);
        const token = jwt.sign({ id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,role:user.role }, process.env.JWT_SECRET); // Token can use the stringified ID

        res.status(200).json({ message: 'Login successful',role:user.role, token ,id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,name:user.name});

    } catch (error) {
        log(`LOGIN_ERROR`);
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logins = async (req, res) => {
    const { email, password } = req.body;
    log(`LOGIN_MOBILE_${email}`);
    // Verify reCAPTCHA
    // const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    //
    // if (!recaptchaValid) {
    //     return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    // }

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            log(`NOT_VERIFIED_MOBILE_${email}`);
            const otp = generateOTP();
            const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRATION);

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();

            //console.log("Generated OTP for user:", otp);

            return res.status(403).json({
                message: 'Account not verified. OTP has been sent to your email.',
                otpSent: true
            });
        }

        const token = jwt.sign({ id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,role:user.role }, process.env.JWT_SECRET); // Token can use the stringified ID
        log(`SUCCESSFULL_LOGIN_${email}`);
        res.status(200).json({ message: 'Login successful',role:user.role, token ,id: user._id.toHexString(),email:user.email,mobile:user.mobile_no,name:user.name});

    } catch (error) {
        log(`LOGIN_ERROR_MOBILE`);
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
