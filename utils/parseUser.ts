import { GetServerSidePropsContext } from "next";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";

import { UserType } from "../types/api";

export default function parseUser(
  ctx: GetServerSidePropsContext
): UserType | null {
  const cookie = ctx.req.headers.cookie;
  if (!cookie) {
    console.log("no cookie present");
    return null;
  }

  const { token } = parse(cookie);

  if (!token) {
    console.log("no token present");
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as UserType;

    return decoded;
  } catch (e) {
    console.log(e);
    return null;
  }
}
