"""Extract editable Arial Bold outlines for the BLOQUE relief scene."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

font = TTFont('/System/Library/Fonts/Supplemental/Arial Bold.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
height = font['OS/2'].sCapHeight

class Contours(BasePen):
    def __init__(self):
        super().__init__(glyphs)
        self.paths = []
        self.path = []
    def _moveTo(self, p): self.path = [p]
    def _lineTo(self, p): self.path.append(p)
    def _curveToOne(self, a,b,c):
        p = self._getCurrentPoint()
        for n in range(1,13):
            t=n/12;u=1-t
            self.path.append(tuple(u**3*p[i]+3*u*u*t*a[i]+3*u*t*t*b[i]+t**3*c[i] for i in (0,1)))
    def _qCurveToOne(self, a,b):
        p = self._getCurrentPoint()
        for n in range(1,13):
            t=n/12;u=1-t
            self.path.append(tuple(u*u*p[i]+2*u*t*a[i]+t*t*b[i] for i in (0,1)))
    def _closePath(self): self.paths.append(self.path)
    def _endPath(self): self._closePath()

out={}
for letter in 'BLOQUE':
    pen=Contours();glyphs[cmap[ord(letter)]].draw(pen)
    xs=[x for path in pen.paths for x,y in path]
    center=(min(xs)+max(xs))/2
    out[letter]=[[[round((x-center)/height*1.25,6),round((y/height-.5)*1.25,6)] for x,y in path] for path in pen.paths]
Path('scene/glyphs.json').write_text(json.dumps(out,separators=(',',':')))
print({letter:sum(map(len,paths)) for letter,paths in out.items()})
