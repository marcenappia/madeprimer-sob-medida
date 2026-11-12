import { useRef, type TouchEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { ProjectImage } from "./content";

const SWIPE_THRESHOLD = 50;

/** Horizontal swipe detection for touch screens; vertical drags are left to page scroll. */
export function useSwipe(onSwipe: (direction: -1 | 1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (event: TouchEvent) => {
      if (event.touches.length !== 1) { start.current = null; return; }
      start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    onTouchEnd: (event: TouchEvent) => {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const dx = event.changedTouches[0].clientX - origin.x;
      const dy = event.changedTouches[0].clientY - origin.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      onSwipe(dx < 0 ? 1 : -1);
    },
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  images: ProjectImage[];
  index: number;
  onMove: (direction: -1 | 1) => void;
};

export function ProjectLightbox({ open, onOpenChange, title, images, index, onMove }: Props) {
  const image = images[index];
  const swipe = useSwipe(onMove);
  const many = images.length > 1;

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="mp-lightbox-overlay" />
      <Dialog.Content
        className="mp-lightbox"
        aria-describedby="mp-lightbox-help"
        onKeyDown={(event) => {
          if (!many) return;
          if (event.key === "ArrowRight") { event.preventDefault(); onMove(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); onMove(-1); }
        }}
      >
        <div className="mp-lightbox-bar">
          <Dialog.Title className="mp-lightbox-title">{title}</Dialog.Title>
          <span className="mp-lightbox-counter" aria-live="polite">{pad(index + 1)} / {pad(images.length)}</span>
          <Dialog.Close className="mp-lightbox-close" aria-label="Fechar tela cheia">FECHAR ✕</Dialog.Close>
        </div>
        <p id="mp-lightbox-help" className="mp-sr-only">
          {many ? "Use as setas do teclado ou deslize para os lados para ver outras fotos. Pressione Esc para fechar." : "Pressione Esc para fechar."}
        </p>
        <div className="mp-lightbox-stage" {...swipe}>
          {image && (image.unavailable
            ? <div className="mp-lightbox-unavailable" role="img" aria-label="Imagem indisponível">Imagem indisponível</div>
            : <img key={image.src} src={image.src} alt={image.alt} className="mp-lightbox-image" decoding="async" />)}
        </div>
        {many && <div className="mp-lightbox-nav">
          <button type="button" onClick={() => onMove(-1)} aria-label="Foto anterior">← ANTERIOR</button>
          <button type="button" onClick={() => onMove(1)} aria-label="Próxima foto">PRÓXIMA →</button>
        </div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
