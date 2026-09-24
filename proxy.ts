import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip the Studio, API routes, Next internals and files with an extension.
  matcher: ["/((?!api|studio|_next|_vercel|.*\..*).*)"],
};
