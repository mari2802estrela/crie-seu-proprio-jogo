import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hamster Explorador: O Desafio dos Países" },
      { name: "description", content: "Quiz de geografia mágico: 30 desafios sobre países, capitais e fronteiras em 3 fases numa floresta encantada." },
      { property: "og:title", content: "Hamster Explorador: O Desafio dos Países" },
      { property: "og:description", content: "30 desafios. 3 fases. Um mundo de mistérios! Você conhece mesmo o mundo?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
