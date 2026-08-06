# LP Endometriose — Grape Clinic

Landing page de lead magnet (chatbot + tela final do ebook) da Grape Clinic.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- `motion/react`

Estrutura inspirada no [Grape-Site](../0.%20Grape-Site), enxuta para uma LP única (sem backend Nest, sem persistência de leads nesta etapa).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Fluxo

1. Chat sequencial (nome → WhatsApp → e-mail → profissão → diagnóstico → sintoma → interesse em consulta).
2. Tela final com arte do ebook.
3. Clique no botão → inicia download do PDF → redireciona ao grupo do WhatsApp.

Links e delays ficam em `src/content/lead-magnet.ts`. O roteiro do chat fica em `src/content/chat-flow.ts`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```
