# Sabrina Fentanes · site

Página única (HTML/CSS/JS puro) com um cérebro 3D em partículas (three.js) no centro do hero.
Ao deslizar, a câmera entra no cérebro e o conteúdo aparece "por dentro da mente".

- `index.html`: página completa (textos, estilos e scripts)
- `assets/sabrina.jpg`: foto da Sabrina (vinda do site atual)
- `assets/brain-mark.png`, `assets/favicon.png`: o cérebro botânico do logo
- `assets/three.module.min.js`: three.js 0.160.0, incluído localmente, sem depender de CDN

Para publicar, envie a pasta inteira para qualquer hospedagem estática (WordPress com tema em branco,
Netlify, Vercel, Hostinger…). Para testar localmente: `python3 -m http.server` dentro desta pasta.

Respeita `prefers-reduced-motion` e mostra o logo em imagem caso o navegador não tenha WebGL.
