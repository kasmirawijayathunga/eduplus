import config from "@/config/config";
import db from "@/config/db";
import tokens from "@/config/tokens";
import jwt from "jsonwebtoken";
import moment from "moment";

const getAccessToken = async (): Promise<string | null> => {
    try {
        const localDb = sessionStorage.getItem(`EDUPLUS_access`);
        if (!localDb) return null;

        const { access } = JSON.parse(localDb);
        return access?.token || null;
    } catch (error) {
        console.error("Error parsing access token:", error);
        return null;
    }
};

export const generateTokens = async (user: { id: string; role: number; email: string; name: string }) => {
    const token_access = jwt.sign(
        { id: user.id, role: user.role, email: user.email, type: tokens.tokenTypes.ACCESS },
        config.jwt.secret,
        { expiresIn: `${config.jwt.accessExpirationMinutes}m` }
    );

    const token_refresh = jwt.sign(
        { id: user.id, role: user.role, email: user.email, type: tokens.tokenTypes.REFRESH },
        config.jwt.secret,
        { expiresIn: `${config.jwt.refreshExpirationDays}d` }
    );

    // await db.users.update({ where: { id: user.id }, data: { token: token_refresh } });

    return {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        access: { token: token_access, expire: moment().add(config.jwt.accessExpirationMinutes, "minutes").format() },
        refresh: { token: token_refresh, expire: moment().add(config.jwt.refreshExpirationDays, "days").format() },
    };
};

const Auth = {
    getAccessToken,
};

export interface AuthUser {
  id: string;
  role: number;
  email: string;
  name: string;
  access: {
    token: string;
    expire: string;
  };
  refresh?: {
    token: string;
    expire: string;
  };
}

export default Auth;