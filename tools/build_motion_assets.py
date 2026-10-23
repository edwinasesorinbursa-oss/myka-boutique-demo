from PIL import Image, ImageOps, ImageEnhance
from pathlib import Path
import subprocess, json
root=Path(__file__).resolve().parent.parent
names=['29cc32f2adb37549','0574bcf28e734abe','73f1f707eb4bb1b0','d14b20a494f7f604','dac222a325f7eb5d','72c0517149ccecc6','0528006e7582a3f4','458edb3db56c0c76','d22ca4808fad2cec','fa6117f421c3c39f']
files=[root/'assets/images'/('myka-original-'+n+'.jpg') for n in names]
for p in files:
    if not p.exists(): raise SystemExit(f'Falta asset: {p}')
poster=Image.new('RGB',(1920,1080),'#e9d8d0')
for i,p in enumerate(files):
    im=Image.open(p).convert('RGB');im=ImageOps.fit(im,(384,540),centering=(.5,.48),method=Image.Resampling.LANCZOS)
    im=ImageEnhance.Contrast(im).enhance(1.04)
    poster.paste(im,((i%5)*384,(i//5)*540))
out=root/'assets';out.mkdir(exist_ok=True)
poster.save(out/'myka-motion-grid.webp','WEBP',quality=78,method=6)
layout='|'.join(f'{(i%5)*384}_{(i//5)*540}' for i in range(10))
# 10 image streams; independent subtle zoom/position in a single 5x2 video sprite.
args=['ffmpeg','-hide_banner','-loglevel','error','-y']
for p in files: args+=['-loop','1','-framerate','15','-i',str(p)]
parts=[]
for i in range(10):
    direction=1 if i%2 else -1
    # move crop window slightly differently for each tile
    parts.append(f'[{i}:v]scale=430:610:force_original_aspect_ratio=increase,crop=430:610,'
                 f'zoompan=z=min(zoom+0.00055\\,1.09):x=iw/2-(iw/zoom/2)+{direction}*on*0.065:'
                 f'y=ih/2-(ih/zoom/2):d=90:s=384x540:fps=15,setsar=1[v{i}]')
parts.append(''.join(f'[v{i}]' for i in range(10))+f'xstack=inputs=10:layout={layout}:fill=black[v]')
filter_complex=';'.join(parts)
args+=['-filter_complex',filter_complex,'-map','[v]','-t','6','-c:v','libx264','-preset','veryfast','-crf','29','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(out/'myka-motion-grid.mp4')]
print('MEDIA_BUILD_START',flush=True)
subprocess.run(args,check=True,timeout=210)
for name in ('myka-motion-grid.webp','myka-motion-grid.mp4'):
    print('MEDIA',name,(out/name).stat().st_size,flush=True)
