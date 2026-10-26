import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JJ Quiz: O Desafio dos Países" },
      { name: "description", content: "Quiz de geografia mágico: 50 desafios sobre países, capitais e fronteiras em 5 fases numa floresta encantada." },
      { property: "og:title", content: "JJ Quiz: O Desafio dos Países" },
      { property: "og:description", content: "50 desafios. 5 fases. Um mundo de mistérios! Você conhece mesmo o mundo?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
