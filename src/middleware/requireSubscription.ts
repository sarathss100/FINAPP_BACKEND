// middleware/requireSubscription.ts
import { ErrorMessages } from "../constants/errorMessages";
import { StatusCodes } from "../constants/statusCodes";
import { Request, Response, NextFunction, response } from "express";
import IUserRepository from "../repositories/user/interfaces/IUserRepository";
import UserRepository from "../repositories/user/UserRepository";
import { verifyAccessToken } from "../utils/auth/tokenUtils";
import { sendErrorResponse } from "../utils/responseHandler";

const userRepository: IUserRepository = new UserRepository();

interface CustomRequest extends Request {
  userId?: string;
}

export const requireSubscription = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
    const authHeader = req.cookies;
    if (!authHeader) {
        sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
        return;
    }
    
    // Retrieve accessToken from headers
    const accessToken = authHeader.accessToken;
    
    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    
    if (!decoded) {
        sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.TOKEN_VERIFICATION_FAILED);
        return;
    } 

  const userId = decoded.userId || '';

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const user = await userRepository.findByUserId(userId);
  if (!user || !user.subscription_status) {
    res.status(403).json({ success: false, message: 'Premium subscription required' });
    return;
  }

  return next();
};