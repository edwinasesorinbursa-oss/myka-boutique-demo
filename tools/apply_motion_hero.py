from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
html_path=root/'index.html'
source=html_path.read_text(encoding='utf-8')
css=(root/'tools/motion_styles.css').read_text(encoding='utf-8')
js=(root/'tools/motion_carousel.js').read_text(encoding='utf-8')
stage='''<section class="reel-hero" id="inicio" aria-label="Pasarela MYKA Boutique & Beauty">
  <div class="reel-frame">
    <div class="reel-studio-mark"><img data-myka-locked="true" src="assets/images/myka-original-088491a7ebfb8a8d.png" alt="MYKA Boutique & Beauty, logo oficial" draggable="false"></div>
    <div class="reel-badge">✦ MYKA BOUTIQUE · BEAUTY STUDIO ✦</div>
    <h1 class="reel-headline">La moda inspira.<br><span>Tu mirada enamora.</span></h1>
    <p class="reel-subline">Un universo donde cada vestido cuenta una historia y cada mirada revela tu esencia.<br>Descubre tu estilo. Celebra tu belleza. Sé tú misma.</p>
    <div class="reel-spark" aria-hidden="true">//</div>
    <div class="reel-handnote reel-note-right" aria-hidden="true">Belleza que<br>deja huella</div>
    <svg class="reel-stroke reel-stroke-right" viewBox="0 0 144 160" aria-hidden="true"><path d="M 17 4 C 108 18 132 48 96 92 C 83 110 63 120 46 137 M 46 137 L 47 111 M 46 137 L 69 126"/></svg>
    <div class="reel-handnote reel-note-bottom" aria-hidden="true">Encuentra tu<br>momento MYKA</div>
    <svg class="reel-stroke reel-stroke-bottom" viewBox="0 0 120 95" aria-hidden="true"><path d="M 6 78 C 27 9 60 19 97 30 M 97 30 L 75 13 M 97 30 L 78 43"/></svg>
    <canvas id="mykaMotionCanvas" class="reel-carousel" role="img" tabindex="0" aria-label="Pasarela con cinco vestidos y cinco estilos de pestañas de MYKA; arrastra para explorar o usa las flechas del teclado"></canvas>
    <img src="assets/myka-motion-grid.webp" id="mykaMotionPoster" alt="" hidden decoding="async">
    <video id="mykaMotionVideo" src="assets/myka-motion-grid.mp4" preload="metadata" autoplay muted playsinline loop aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none" tabindex="-1"></video>
    <div class="reel-ambient" aria-hidden="true"></div>
    <div class="reel-actions">
      <span class="reel-cta-frame"><a class="reel-cta" href="#boutique">EXPLORAR BOUTIQUE <span aria-hidden="true">↗</span></a></span>
      <a class="reel-cta reel-cta-secondary" href="#beauty">BEAUTY STUDIO <span aria-hidden="true">↗</span></a>
    </div>
    <p class="reel-footnote">MODA · BELLEZA · CONFIANZA · MYKA</p>
  </div>
</section>'''
if source.count('<section class="hero" id="inicio">')!=1:
    raise RuntimeError('Expected exactly one original hero')
source,n=re.subn(r'<section class="hero" id="inicio">.*?</section>',lambda _:stage,source,count=1,flags=re.S)
if n!=1:raise RuntimeError('Could not replace original hero')
if source.count('</style>')!=1:raise RuntimeError('CSS tag count unexpected')
source=source.replace('</style>','\n'+css+'\n</style>',1)
source=source.replace('</body>','\n<script>\n'+js+'\n</script>\n</body>',1)
font='<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">'
source=source.replace('</head>',font+'\n</head>',1)
html_path.write_text(source,encoding='utf-8')
print('UPDATED_HTML',len(source.encode('utf-8')),'canvas=',source.count('mykaMotionCanvas'),'video=',source.count('myka-motion-grid.mp4'))
