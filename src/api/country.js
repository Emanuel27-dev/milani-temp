// /api/country.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "")
        .split(",")[0]
        .trim() ||
      req.socket?.remoteAddress ||
      "";

    // Servicio sencillo sin token. Si no pasa la IP, igual responde por la IP pública
    const resp = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "milani-headless/1.0" },
      cache: "no-store",
    });
    const j = await resp.json();

    // country_code_alpha2 → "PE", "US", etc.
    const code =
      j?.country_code ||
      j?.country ||
      "US"; // fallback razonable

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ country: code });
  } catch (e) {
   console.log(e);
    return res.status(200).json({ country: "US" });
  }
}
