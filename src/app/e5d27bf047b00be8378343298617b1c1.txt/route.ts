// IndexNow key file — must be served at the site root as "<key>.txt" for
// Bing/Yandex to trust pings signed with this key (see src/lib/indexnow.ts).
// If INDEXNOW_KEY ever changes, this folder name must be renamed to match.
export async function GET() {
  return new Response(process.env.INDEXNOW_KEY ?? "", {
    headers: { "Content-Type": "text/plain" },
  });
}
