/** Abre o download e, após um delay, redireciona (ex.: grupo do WhatsApp). */
export function downloadThenRedirect(
  downloadUrl: string,
  redirectUrl: string,
  delayMs = 1200,
) {
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    window.location.href = redirectUrl;
  }, delayMs);
}
