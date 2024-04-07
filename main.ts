import { Hono } from "https://deno.land/x/hono@v3.10.0/mod.ts";
import { html } from "https://deno.land/x/hono@v3.10.0/helper.ts";

const app = new Hono();
const nejire_url = "https://nejiten.halfmoon.jp/";
const base_url = Deno.env.get("BASE_URL") || "http://localhost:8000/";

app.get("/", (c) => {
  return c.html(html`
  <html>
    <head>
      <title>【閉鎖】Nejire Proxy</title>
    </head>
    <body>
      ねじれ天国本サイトのSSL対応(https化)に伴い、本Proxyサイトは閉鎖しました。<br>
      <br><br>
      <a href="${nejire_url}index.cgi">ねじれ天国トップへ</a>
      <br><br>
      管理: @euro_s
    </body>
  </html>
  `);
});

app.get("*", (c) => {
  return c.html(html`
  <html>
    <head>
      <title>【閉鎖】Nejire Proxy</title>
    </head>
    <body>
      ねじれ天国本サイトのSSL対応(https化)に伴い、本Proxyサイトは閉鎖しました。<br>
      あなたがアクセスしようとしたページは以下のURLです。<br>
      <a href="${c.req.url.replace(base_url, nejire_url)}">${c.req.url.replace(base_url, nejire_url)}</a>
      <br><br>
      <a href="${nejire_url}index.cgi">ねじれ天国トップへ</a>
      <br><br>
      管理: @euro_s
    </body>
  </html>
  `);
});

Deno.serve(app.fetch);
