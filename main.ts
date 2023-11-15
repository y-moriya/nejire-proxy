import { Hono } from "https://deno.land/x/hono@v3.10.0/mod.ts";
import { html } from "https://deno.land/x/hono@v3.10.0/helper.ts";

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

app.get("*", (c) => {
  const url = c.req.url;
  const new_url = nejire_url + url.replace(base_url, "");

  const cookies = c.req.raw.headers.get("Cookie") as string;
  const login_cookie = getCookieValue(cookies, "login") as string;
  const headers = new Headers();
  headers.append("Cookie", `login=${login_cookie}`);

  return fetch(new_url, { headers: headers });
});

app.post("*", async (c) => {
  const url = c.req.url;
  const new_url = nejire_url + url.replace(base_url, "");

  const cookies = c.req.raw.headers.get("Cookie") as string;
  const login_cookie = getCookieValue(cookies, "login") as string;
  const headers = new Headers();
  headers.append("Cookie", `login=${login_cookie}`);

  const body = await c.req.arrayBuffer();

  return fetch(new_url, {
    headers: headers,
    body: body,
    method: "POST",
    redirect: "manual",
  });
});

function getCookieValue(cookieString: string, key: string) {
  // Cookie文字列をセミコロンで分割
  let cookies: string[] = [];
  try {
    cookies = cookieString.split(";");
  } catch (_error) {
    console.error("Cookieのパースに失敗しました");
    return null;
  }

  // キーを検索して値を取得
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // キーが見つかったら値を返す
    if (cookie.startsWith(key + "=")) {
      return cookie.substring(key.length + 1);
    }
  }

  // キーが見つからない場合はnullを返す
  return null;
}

Deno.serve(app.fetch);
