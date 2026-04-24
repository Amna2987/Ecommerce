const authServices = require("../services/auth.services");
const { AppError } = require("../utils/errors");
const { success } = require("../utils/response.utils");

const COOKIE_NAME = "refreshToken";
function cookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // secure: false,
    // sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

exports.signupController = async (req, res) => {
  const signupData = req.body;
  console.log("signup data:", signupData);

  const user = await authServices.signupService(signupData);
  return success(res, "signup successfully and verification email sent", user, {}, 201);
};    

exports.verifyEmailController = async (req, res) => {
  console.log('verifyToken', req.params);
  const { token } = req.params;
  console.log('verifyToken 2', token);

  const verifyEmail = await authServices.verifyEmailService(token)

   return success(res, "email verification successfull", verifyEmail, {}, 201);
};

exports.loginController = async (req, res) => {
  // console.log("login data", req.body);
  const loginData = req.body;
  const { user, accessToken, refreshToken } = await authServices.loginService(
    loginData
  ); 

  res.cookie(COOKIE_NAME, refreshToken, cookieOptions());
  return success(res, "login successfull", { user, accessToken }, {}, 201);
};
exports.logoutController = async (req, res) => {
  // console.log('logout token', req.cookies);

  // res.clearCookie(COOKIE_NAME, { path: "/" });
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,       
    sameSite: "none",
    path: "/",
  });
  return success(res, "logout", { ok: true }, {}, 201);
};
exports.refreshController = async (req, res) => {
  const cookie_req = req.cookies[COOKIE_NAME];

  if (!cookie_req) return new AppError("please login");

  const { token } = await authServices.refreshService(cookie_req);
  return success(res, "login successfully", { accessToken: token }, {}, 201);
};


exports.updateImgController = async (req, res) => {

console.log('prof img', req.file);
console.log('prof img user', req.body);

const {userId} = req.body
const {path} = req.file

  const profileImg = await authServices.updateImgService(userId,path)
  console.log('prof return', profileImg);
  
  return success(res, "image updated successfully", profileImg, {}, 201);
};
