import jwt from "jsonwebtoken";

const DEFAULT_SECRET = "skyauth-external-api-secret";

const secret = process.env.EXTERNAL_API_SECRET ?? DEFAULT_SECRET;

type ExternalTokenPayload = {
  employeeId: string;
  airlineId: string;
  email: string;
};

export function signExternalToken(payload: ExternalTokenPayload, options?: jwt.SignOptions) {
  return jwt.sign(payload, secret, {
    expiresIn: "15m",
    ...options,
  });
}

export function verifyExternalToken(token: string) {
  try {
    return jwt.verify(token, secret) as ExternalTokenPayload;
  } catch {
    return null;
  }
}
