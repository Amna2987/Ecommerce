const User = require("../models/user.model");
const { AppError } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const TokenService = require("../services/token.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "socialcircle87@gmail.com",
    pass: "ekbk mkyo vhkr eypl",
  },
}); 

exports.signupService = async (signupData) => {
  const { email, password } = signupData;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new AppError("User already exist try again");
  }

  // 1. Generate salt
  const salt = await bcrypt.genSalt(10);

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: signupData.username,
    email: signupData.email,
    password: hashedPassword,
  });
  // console.log(existingUser._id, "existing user id");

  // const token = jwt.sign({id: existingUser._id.toString()}, 'superSecretKey', { expiresIn: "15m"})

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  // token = Date.now().toLocaleString()
  // console.log('verify token', token);

  const link = `http://localhost:5173/verify/${verificationToken}`;
  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `<h2>Email Verification</h2><a href="${link}">Verify Email</a>`,
  }); ///
  return user;
};

exports.verifyEmailService = async (token) => {
  // // const decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFICATION_SECRET);
  // await User.findByIdAndUpdate(decoded.id, { isVerified: true });

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    console.log(hashedToken);
    

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    // emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  console.log(user, 'verification user');
  

  if (!user) {
    throw new AppError("email verification failed");
  }

  user.isVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpiry = null;

  await user.save();
  return user;
};
exports.loginService = async (loginData) => {
  const { email, password } = loginData;

  const loginUser = await User.findOne({ email: email });
  if (!loginUser) {
    throw new AppError("Invalid username or password");
  } else {
    const isMatched = await loginUser.comparePassword(
      password,
      loginUser.password
    );
    console.log(isMatched);

    if (!isMatched) return new AppError("Invalid username or password");

    const accessToken = TokenService.signAccessToken({
      sub: loginUser._id,
      email: loginUser.email,
      role: loginUser.role,
    });
    const refreshToken = TokenService.signRefreshToken({
      sub: loginUser._id.toString(),
    });
    // console.log("auth.ser reftoken", refreshToken);
    return { user: loginUser, accessToken, refreshToken };
  }
};
// exports.logoutService = async () => {};
exports.refreshService = async (token) => {
  // console.log(token, 'refreh');

  try {
    const payload = TokenService.verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    const newAccess = TokenService.signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    // console.log(newAccess, 'new access token');

    return { token: newAccess };
  } catch (error) {
    console.log(error);
  }
};

exports.updateImgService = async (userId,path) => {
  // console.log(token, 'refreh');

  const user = await User.findById({_id:userId})
  user.profileImg = path

  await user.save()

  // return profileImg
   return {
    profileImg: user.profileImg
  };
};
