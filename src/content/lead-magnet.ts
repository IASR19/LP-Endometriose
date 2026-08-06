export const leadMagnetConfig = {
  brandName: "Grape Clinic",
  instagramHandle: "grapeclinic_",
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  /** Download direto do Google Drive (export=download). */
  ebookDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1kMbo3Tc1RlbEVUXvHAkfrRlmfyG_JIKo",
  ebookViewUrl:
    "https://drive.google.com/file/d/1kMbo3Tc1RlbEVUXvHAkfrRlmfyG_JIKo/view?usp=drive_link",
  whatsappGroupUrl:
    "https://chat.whatsapp.com/IRX54cUtzbzHyTTUzJqQM7?s=sh&p=a&ilr=0",
  /** Delay entre início do download e redirect ao WhatsApp. */
  redirectDelayMs: 1200,
  avatarSrc: "/images/chat-avatar-dra.png",
  finalScreenSrc: "/images/final-screen.webp",
  finalScreenWidth: 1290,
  finalScreenHeight: 2293,
} as const;

export const siteMeta = {
  title: "Guia gratuito de Endometriose | Grape Clinic",
  description:
    "Receba o guia gratuito sobre endometriose: sinais, cuidados e tratamento. Captação Grape Clinic.",
} as const;
