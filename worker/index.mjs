import { handleAnalyzePost } from "./analyze.mjs";

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = normalizePath(url.pathname);

    if (path === "/api/analyze") {
      if (request.method === "POST") {
        return handleAnalyzePost(request, env);
      }
      return new Response("Method not allowed", { status: 405 });
    }

    if (!env.ASSETS) {
      return new Response("Static assets not configured", { status: 500 });
    }

    return env.ASSETS.fetch(request);
  },
};
