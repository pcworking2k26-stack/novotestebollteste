# Pré-LP Jogo do Hexa — Railway Ready

Projeto Next.js mobile-first pronto para subir no GitHub e Railway.

## Rodar local

```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:3000
```

## Deploy Railway

Build Command:

```bash
npm run build
```

Start Command:

```bash
npm run start
```

## Pixel

Meta Pixel configurado no arquivo `app/layout.tsx`:

```txt
1502866891279664
```

## Destino do botão

URL configurada no arquivo `app/page.tsx`:

```txt
https://jogodohexa.plataformapremios.site/#cadastro
```

## Importante para GitHub

Não suba `node_modules`, `.next`, `dist`, `build` ou `.env`. Este ZIP já vem com `.gitignore` correto.

Se você já tentou subir uma pasta antiga com `node_modules`, faça em uma pasta NOVA extraída deste ZIP:

```bash
git init
git branch -M main
git remote add origin https://github.com/pcworking2k26-stack/novotestebollteste.git
git add .
git commit -m "deploy: pre lp jogo do hexa"
git push -u origin main --force
```
