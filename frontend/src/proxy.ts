import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, isLang, LANG_COOKIE, langOfSlug, SITE_SLUGS, sitePath, type Lang } from "@/shared/i18n/config";

const remember = (res: NextResponse, lang: Lang) => {
  res.cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
};

/**
 * Public site: `/` shows the default language (rewritten to `/ru`) unless the visitor chose another
 * one; opening a language URL stores the choice, so the dashboard and API follow it too.
 * Dashboard: no session cookie → login.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (req.cookies.has("tf_token")) return NextResponse.next();
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const saved = req.cookies.get(LANG_COOKIE)?.value;
    if (isLang(saved) && saved !== DEFAULT_LANG) return NextResponse.redirect(new URL(sitePath(saved), req.url));
    return NextResponse.rewrite(new URL(`/${SITE_SLUGS[DEFAULT_LANG]}`, req.url));
  }

  const lang = langOfSlug(pathname.slice(1));
  if (!lang) return NextResponse.next();
  if (lang === DEFAULT_LANG) return remember(NextResponse.redirect(new URL("/", req.url)), lang);
  return remember(NextResponse.next(), lang);
}

export const config = { matcher: ["/", "/dashboard/:path*", "/ru", "/uz", "/uz-cyrl", "/en", "/ky"] };
