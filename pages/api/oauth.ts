import type { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

import UserModel from "../../db/userModel";
import connectDB from "../../db/connectDB";
import { DBUserType } from "../../types/db";
import { ReqUser } from "../../types/api";
import authMiddleware from "../../utils/authMiddleware";

interface TokensResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  id_token: string;
}

interface DecodedGoogleJWT {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
}

const SCOPES = "profile email";

const REDIRECT_URI = "http://localhost:3000/api/oauth";

const OAUTH_LINK = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&client_id=${
  process.env.GOOGLE_CLIENT_ID
}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}`;

const TOKEN_LINK = `https://oauth2.googleapis.com/token`;

async function getTokens(code: string) {
  const response = await fetch(TOKEN_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code as string,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  return await response.json();
}

export default async function handler(req: ReqUser, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid oauth request",
    });
  }

  authMiddleware(req);

  if (req.user) {
    // if user is already signed in, redirect them to the dashboard
    return res.redirect("/dashboard");
  }

  try {
    await connectDB();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "server error" });
  }

  const { code = null, error = null } = req.query;

  if (!code && !error) {
    return res.redirect(OAUTH_LINK);
  }

  if (error) {
    return res.status(400).json({
      error: "Something went wrong while logging you in, please try again...",
    });
  }

  const tokens: TokensResponse = await getTokens(code as string);

  const decoded: DecodedGoogleJWT = jwtDecode(tokens.id_token);

  if (decoded.sub) {
    let user: DBUserType = await UserModel.findOne({
      googleId: decoded.sub,
    });

    // Do we the store the access and refresh token in db?
    if (!user) {
      user = new UserModel({
        googleId: decoded.sub,
        name: decoded.given_name,
        username: "none",
        password: "none",
        avatar_url: "none",
      });

      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user.id,
        googleId: user.googleId,
        username: user.username,
        avatar_url: user.avatar_url,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV !== `development`,
        sameSite: `lax`,
        path: `/`,
      })
    );

    res.redirect("/dashboard");
  } else {
    res
      .status(500)
      .json({ error: "There was an error with google sign in..." });
  }
}
