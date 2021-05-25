import { AuthFailedError } from "../error/auth-failed-error";
import { UserCredential } from "../model/user-credential";
import { USERS } from "../userLogins";
  
const authenticateCredentials = (userCredentials: UserCredential): UserCredential => {
    const user = USERS.users.find(user => user.userLogin === userCredentials.userLogin && user.password === userCredentials.password);
    if(user) {
        return user
    } else {
        throw new AuthFailedError('User not found');
    }
}

const decodeAuth = (authHeader: string): UserCredential => {
  try {
    const authToken = authHeader.replace('Basic: ', '');
    const credentials = Buffer.from(authToken, 'base64').toString('ascii').split(":");
    if (credentials.length === 2) {
        const credential: UserCredential = {userLogin: credentials[0], password: credentials[1]};
        return credential;
    } else {
        throw new AuthFailedError("Authentication credentials are not well-formed")
    }
  } catch(err) {
    throw new AuthFailedError("Authentication credentials decoding failed");
  }
}

const authorizeUser = (authHeader: string) => {
    if(authHeader) { 
        const credentials = decodeAuth(authHeader);
        authenticateCredentials(credentials);
    } else {
        throw new AuthFailedError("Authorization header missing");
    }
}

export default authorizeUser;
