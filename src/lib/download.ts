function isAppleMobile() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const iOSDevice = /iPad|iPhone|iPod/i.test(ua);
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return iOSDevice || iPadOs;
}

function startBackgroundDownload(downloadUrl: string) {
  const iframe = document.createElement("iframe");
  iframe.src = downloadUrl;
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  iframe.style.cssText =
    "position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;left:-9999px;top:-9999px";
  document.body.appendChild(iframe);

  window.setTimeout(() => {
    iframe.remove();
  }, 60_000);
}

/**
 * Inicia o download sem roubar o foco (iframe) e redireciona a aba atual
 * para o WhatsApp — no iPhone, `target=_blank` no Drive deixava o grupo
 * “esquecido” atrás da aba de download.
 */
export function downloadThenRedirect(
  downloadUrl: string,
  redirectUrl: string,
  delayMs = 1200,
) {
  startBackgroundDownload(downloadUrl);

  const wait = isAppleMobile() ? Math.min(delayMs, 700) : delayMs;

  window.setTimeout(() => {
    window.location.assign(redirectUrl);
  }, wait);
}
