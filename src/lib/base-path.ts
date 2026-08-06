/** Base path da aplicação (ex.: `/endometriose`). Vazio em ausência de config. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixa caminhos absolutos da app com o basePath.
 * Use em `<img>` nativo e URLs manuais — `next/image` e `Link` já aplicam sozinhos.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
