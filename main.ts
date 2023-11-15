import { Hono, HonoRequest } from "https://deno.land/x/hono@v3.10.0/mod.ts";
import { html } from "https://deno.land/x/hono@v3.10.0/helper.ts";
import { getHeaders } from "./util.ts";

const app = new Hono();
const nejire_url = "http://nejiten.halfmoon.jp/";
const base_url = Deno.env.get("BASE_URL") || "http://localhost:8000/";

app.get("/", (c) => {
  return c.html(html`
    <html>
      <head>
        <title>Nejire Proxy</title>
      </head>
      <body>
        ねじれ天国にアクセスできない人のためのProxyサイトです。<br>
        仕組み上、ログイン情報が管理者(ねじれ天国の管理者とは異なる)に駄々洩れですので、<br>
        理解したうえでご利用は自己責任でお願いします。<br>
        <br>
        <a href="/index.cgi">ねじれ天国(Proxy)トップへ</a>
        <br><br>
        管理: @euro_s
      </body>
    </html>
  `);
});

app.get("*", async (c) => {
  return await proxyRequest(c.req.url.replace(base_url, ""), c.req);
});

app.post("*", async (c) => {
  return await proxyRequest(c.req.url.replace(base_url, ""), c.req);
});

async function proxyRequest(url: string, req: HonoRequest) {
  const headers = getHeaders(req.raw.headers.get("Cookie") as string);
  const body = req.method === "POST" ? await req.arrayBuffer() : null;

  return fetch(`${nejire_url}${url}`, {
    headers,
    body,
    method: req.method,
    redirect: "manual",
  });
}

Deno.serve(app.fetch);
