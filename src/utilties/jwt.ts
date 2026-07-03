import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
    const token = jwt.sign(payload,secret, { expiresIn } as SignOptions);
    return token;
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    const verifyToken = jwt.verify(token, secret);  
   return {
    success: true,
    data: verifyToken,
   }
  } catch (error:any) {
    console.log("token verification error", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const jwtUtils = {
  verifyToken,
  createToken,
};
