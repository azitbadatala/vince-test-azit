import { AuthFailedError } from "../error/auth-failed-error";
import { UserCredential } from "../interface/user-credential";
import { USERS } from "../userLogins";

const authenticateCredentials = (
  userCredentials: UserCredential
): UserCredential => {
  const user = USERS.users.find(
    (user) =>
      user.userLogin === userCredentials.userLogin &&
      user.password === userCredentials.password
  );
  if (user) {
    return user;
  } else {
    throw new AuthFailedError("User not found");
  }
};

const decodeAuth = (authHeader: string) => {
  try {
    const authToken = authHeader.replace("Basic: ", "");
    const credentials = Buffer.from(authToken, "base64").toString("ascii").split(":");
    return credentials;
  } catch (err) {
    throw new AuthFailedError("Authentication credentials decoding failed");
  }
};

const validate = (userCredentials): UserCredential => {
    if (userCredentials.length === 2) {
        const userCredential: UserCredential = {
          userLogin: userCredentials[0],
          password: userCredentials[1],
        };
        return userCredential;
      } else {
        throw new AuthFailedError("Authentication credentials not valid");
      }
}

const authorizeUser = (authHeader: string) => {
  if (authHeader) {
    const parsedCredentials = decodeAuth(authHeader);
    const validatedCredentials = validate(parsedCredentials);
    authenticateCredentials(validatedCredentials);
  } else {
    throw new AuthFailedError("Authorization header missing");
  }
};

export default authorizeUser;
