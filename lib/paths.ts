export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(href: string): string {
  if (!href.startsWith("/")) return href;
  if (basePath && href.startsWith(basePath + "/")) return href;
  return basePath + href;
}
