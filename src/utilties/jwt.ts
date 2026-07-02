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
    const verifyToken = jwt.verify(token, secret) as JwtPayload;  
    return verifyToken;
  } catch (error:any) {
    console.log("token verification error", error);
    throw new Error(error.message);
  }
};

export const jwtUtils = {
  verifyToken,
  createToken,
};
