"use client";

import Image from "next/image";
import { useState } from "react";

import { leadMagnetConfig } from "@/content/lead-magnet";
import { downloadThenRedirect } from "@/lib/download";
import { cn } from "@/lib/utils";

type EbookFinalScreenProps = {
  className?: string;
};

export function EbookFinalScreen({ className }: EbookFinalScreenProps) {
  const [busy, setBusy] = useState(false);

  function handleDownload() {
    if (busy) return;
    setBusy(true);

    downloadThenRedirect(
      leadMagnetConfig.ebookDownloadUrl,
      leadMagnetConfig.whatsappGroupUrl,
      leadMagnetConfig.redirectDelayMs,
    );
  }

  return (
    <section
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-[#1a1816] px-0 sm:bg-[#ebe6dc] sm:px-4 sm:py-4",
        className,
      )}
      aria-label="Acesso ao ebook"
    >
      <div className="relative w-full overflow-hidden sm:rounded-sm">
        <Image
          src={leadMagnetConfig.finalScreenSrc}
          alt="Clique no botão para baixar o ebook gratuito sobre endometriose"
          width={1290}
          height={2293}
          priority
          quality={95}
          sizes="(max-width: 448px) 100vw, 448px"
          draggable={false}
          className="pointer-events-none h-auto w-full select-none"
        />

        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className={cn(
            "cta-pulse absolute z-20 flex items-center justify-center rounded-full",
            "bg-[#7d6448] px-3 text-center font-semibold uppercase leading-[1.15] tracking-[0.03em] text-white",
            /* espaço vazio à direita do livro, acima do @grapeclinic_ */
            "left-[42%] top-[72.5%] h-[6.2%] w-[50%]",
            "text-[clamp(0.5rem,2.45vw,0.72rem)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574] focus-visible:ring-offset-2",
            "hover:bg-[#6e573e]",
            busy ? "cursor-wait opacity-90" : "cursor-pointer",
          )}
        >
          {busy ? "Abrindo..." : "Baixe seu ebook gratuitamente"}
        </button>

        {busy ? (
          <a
            href={leadMagnetConfig.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[8%] left-1/2 z-20 w-[80%] -translate-x-1/2 rounded-full bg-[#1a1816]/90 px-3 py-2.5 text-center text-[12px] font-medium text-[#f2e8d5] backdrop-blur-sm"
          >
            Se o grupo não abriu, toque aqui
          </a>
        ) : null}
      </div>
    </section>
  );
}
