#!/usr/bin/env python3 -I
"""
Manual Pilates en Suspensión v2
- Con foto original del TRX
- Tonos claros amarillo/naranja como las cintas TRX
- Sin logos de Centro Zen
- Aviso legal del Lic. Carlos Alberto Zorrilla Martínez
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

# ── Registrar fuentes ──────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Caladea', '/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Caladea-Bold', '/usr/share/fonts/truetype/crosextra/Caladea-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Caladea-BoldItalic', '/usr/share/fonts/truetype/crosextra/Caladea-BoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('Caladea-Italic', '/usr/share/fonts/truetype/crosextra/Caladea-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Italic', '/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-BoldItalic', '/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf'))

# Registrar familia para que <b> e <i> funcionen en Paragraph
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold',
                   italic='LibSans-Italic', boldItalic='LibSans-BoldItalic')

# ── Paleta TRX: amarillos y naranjas claros ────────────────────
TRX_YELLOW = HexColor('#f0c040')        # Amarillo TRX vibrante
TRX_AMBER = HexColor('#e8a620')         # Ámbar/naranja
TRX_LIGHT = HexColor('#fdf6e3')         # Fondo crema muy claro
TRX_WARM_BG = HexColor('#fef9ef')       # Fondo cálido
DARK_TEXT = HexColor('#2c2c2c')         # Texto oscuro
MEDIUM_TEXT = HexColor('#5a5040')       # Texto secundario cálido
SOFT_BORDER = HexColor('#e8c860')       # Bordes suaves dorados
WHITE_CREAM = HexColor('#fffdf8')       # Blanco cálido

SCRATCH = '/tmp/claude-0/-home-user-TF-app-claudecode/a7b31f2b-04ae-57e5-ae94-68e8caaf1b2a/scratchpad'
HERO_IMG = f'{SCRATCH}/images/hero.jpg'
OUTPUT = f'{SCRATCH}/Manual_Pilates_en_Suspension.pdf'

W, H = letter  # 612 x 792 pts


def draw_cover(c):
    """Página 1: Portada clara con foto y bordes amarillo/naranja TRX"""

    # ── Fondo blanco cálido ──
    c.setFillColor(WHITE_CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Borde exterior amarillo TRX ──
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(3)
    margin = 20
    c.rect(margin, margin, W - 2*margin, H - 2*margin, fill=0, stroke=1)

    # ── Borde interior fino ámbar ──
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(0.7)
    inner = 28
    c.rect(inner, inner, W - 2*inner, H - 2*inner, fill=0, stroke=1)

    cx = W / 2

    # ── Banda superior amarilla con título ──
    band_top = H - 20
    band_h = 90
    band_bottom = band_top - band_h

    # Degradado simulado: banda amarilla
    c.setFillColor(TRX_YELLOW)
    c.rect(20, band_bottom, W - 40, band_h, fill=1, stroke=0)

    # Borde inferior de la banda en ámbar
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(2)
    c.line(20, band_bottom, W - 20, band_bottom)

    # Texto "MANUAL" en la banda
    c.setFillColor(white)
    c.setFont('LibSans-Bold', 14)
    c.drawCentredString(cx, band_bottom + 55, "M  A  N  U  A  L")

    # Título principal en la banda
    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 28)
    c.drawCentredString(cx, band_bottom + 18, "PILATES EN SUSPENSIÓN")

    # ── Foto del TRX ──
    img_margin = 40
    img_w = W - 2 * img_margin
    # La imagen original es 680x413, proporcional:
    img_h = img_w * (413.0 / 680.0)
    img_y = band_bottom - img_h - 15

    # Marco naranja alrededor de la foto
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(2.5)
    frame_pad = 4
    c.rect(img_margin - frame_pad, img_y - frame_pad,
           img_w + 2*frame_pad, img_h + 2*frame_pad, fill=0, stroke=1)

    # Dibujar la foto
    c.drawImage(HERO_IMG, img_margin, img_y, width=img_w, height=img_h,
                preserveAspectRatio=True, anchor='c')

    # ── Sección inferior ──
    # Línea decorativa amarilla
    y_line = img_y - 35
    line_w = 120
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(1.2)
    c.line(cx - line_w, y_line, cx - 8, y_line)
    c.line(cx + 8, y_line, cx + line_w, y_line)
    # Rombo central
    c.setFillColor(TRX_AMBER)
    c.saveState()
    c.translate(cx, y_line)
    c.rotate(45)
    c.rect(-4, -4, 8, 8, fill=1, stroke=0)
    c.restoreState()

    # Subtítulo
    y_sub = y_line - 30
    c.setFillColor(MEDIUM_TEXT)
    c.setFont('LibSans', 12)
    c.drawCentredString(cx, y_sub, "Fundamentos, técnica y metodología")

    # ── Autor ──
    y_author_label = y_sub - 45
    c.setFillColor(TRX_AMBER)
    c.setFont('LibSans', 12)
    c.drawCentredString(cx, y_author_label, "ELABORADO POR")

    y_author = y_author_label - 24
    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 14)
    c.drawCentredString(cx, y_author, "Lic. Carlos Alberto Zorrilla Martínez")

    # Línea final
    y_final = y_author - 20
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(0.8)
    c.line(cx - 80, y_final, cx + 80, y_final)

    c.showPage()


def draw_copyright_page(c):
    """Página 2: Aviso legal (se mantiene igual - fondo crema elegante)"""
    SOFT_CREAM = HexColor('#f5f0e8')
    DARK_CHARCOAL = HexColor('#1a1a2e')
    WARM_GOLD = HexColor('#c9a96e')
    LIGHT_LINE = HexColor('#d4c5a9')
    MEDIUM_GREY = HexColor('#6b6b6b')

    c.setFillColor(SOFT_CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    cx = W / 2

    # Línea decorativa superior
    y_top = H - 120
    c.setStrokeColor(WARM_GOLD)
    c.setLineWidth(0.8)
    c.line(cx - 100, y_top, cx + 100, y_top)
    c.setFillColor(WARM_GOLD)
    c.saveState()
    c.translate(cx, y_top)
    c.rotate(45)
    c.rect(-3, -3, 6, 6, fill=1, stroke=0)
    c.restoreState()

    # Título
    y_title = y_top - 40
    c.setFillColor(DARK_CHARCOAL)
    c.setFont('LibSans-Bold', 20)
    c.drawCentredString(cx, y_title, "Derechos de Autor")

    y_line2 = y_title - 18
    c.setStrokeColor(WARM_GOLD)
    c.setLineWidth(0.5)
    c.line(cx - 60, y_line2, cx + 60, y_line2)

    # Símbolo ©
    y_symbol = y_line2 - 60
    c.setFillColor(WARM_GOLD)
    c.setFont('LibSans-Bold', 48)
    c.drawCentredString(cx, y_symbol, "©")

    # Texto legal
    left_margin = 80
    text_width = W - 2 * left_margin

    style_author = ParagraphStyle('author', fontName='LibSans-Bold', fontSize=14,
                                   leading=20, alignment=TA_CENTER, textColor=DARK_CHARCOAL)
    style_legal = ParagraphStyle('legal', fontName='LibSans', fontSize=12,
                                  leading=18, alignment=TA_JUSTIFY, textColor=DARK_CHARCOAL, spaceAfter=14)
    style_legal_center = ParagraphStyle('legal_center', fontName='LibSans', fontSize=12,
                                         leading=18, alignment=TA_CENTER, textColor=DARK_CHARCOAL, spaceAfter=14)
    style_emphasis = ParagraphStyle('emphasis', fontName='LibSans-Bold', fontSize=12,
                                     leading=18, alignment=TA_CENTER, textColor=DARK_CHARCOAL, spaceAfter=10)

    texts = [
        (style_author, "Lic. Carlos Alberto Zorrilla Martínez"),
        (style_legal_center, "Todos los derechos reservados."),
        (style_legal,
         "Este manual es propiedad exclusiva de su autor, "
         "el <b>Lic. Carlos Alberto Zorrilla Martínez</b>. "
         "Queda estrictamente prohibida su reproducción total o parcial, "
         "distribución, comunicación pública, transformación o cualquier "
         "otra forma de explotación, ya sea por medios electrónicos, "
         "mecánicos, fotocopia, grabación u otros métodos, sin la "
         "autorización previa, expresa y por escrito del autor."),
        (style_legal,
         "El contenido de esta obra, incluyendo textos, ilustraciones, "
         "diseños, metodología, secuencias de ejercicios y toda la "
         "información aquí contenida, se encuentra protegido por las leyes "
         "nacionales e internacionales de propiedad intelectual y derechos "
         "de autor."),
        (style_legal,
         "El uso no autorizado de este material constituye una violación a "
         "los derechos de propiedad intelectual del autor y será perseguido "
         "conforme a la legislación aplicable."),
        (style_emphasis,
         "Queda prohibida la reproducción, distribución<br/>"
         "o divulgación de este manual sin autorización escrita del autor."),
    ]

    y_cursor = y_symbol - 40
    for style, text in texts:
        p = Paragraph(text, style)
        pw, ph = p.wrap(text_width, 500)
        p.drawOn(c, left_margin, y_cursor - ph)
        y_cursor -= (ph + 8)

    # Línea inferior
    y_bottom_line = 120
    c.setStrokeColor(WARM_GOLD)
    c.setLineWidth(0.8)
    c.line(cx - 100, y_bottom_line, cx + 100, y_bottom_line)
    c.setFillColor(WARM_GOLD)
    c.saveState()
    c.translate(cx, y_bottom_line)
    c.rotate(45)
    c.rect(-3, -3, 6, 6, fill=1, stroke=0)
    c.restoreState()

    c.setFillColor(MEDIUM_GREY)
    c.setFont('LibSans', 12)
    c.drawCentredString(cx, y_bottom_line - 25, "Primera edición")

    c.showPage()


def draw_back_cover(c):
    """Página 3: Contraportada clara con bordes amarillo/naranja TRX"""

    # Fondo blanco cálido
    c.setFillColor(WHITE_CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    cx = W / 2

    # Borde exterior amarillo
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(3)
    margin = 20
    c.rect(margin, margin, W - 2*margin, H - 2*margin, fill=0, stroke=1)

    # Borde interior fino
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(0.7)
    inner = 28
    c.rect(inner, inner, W - 2*inner, H - 2*inner, fill=0, stroke=1)

    # ── Contenido central ──
    y_center = H / 2 + 30

    # Línea superior decorativa
    y_deco_top = y_center + 70
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(1)
    c.line(cx - 100, y_deco_top, cx - 8, y_deco_top)
    c.line(cx + 8, y_deco_top, cx + 100, y_deco_top)
    c.setFillColor(TRX_AMBER)
    c.saveState()
    c.translate(cx, y_deco_top)
    c.rotate(45)
    c.rect(-4, -4, 8, 8, fill=1, stroke=0)
    c.restoreState()

    # "MANUAL"
    c.setFillColor(TRX_AMBER)
    c.setFont('LibSans-Bold', 14)
    c.drawCentredString(cx, y_center + 35, "M  A  N  U  A  L")

    # Título
    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 24)
    c.drawCentredString(cx, y_center - 5, "Pilates en Suspensión")

    # Línea bajo título
    y_line = y_center - 25
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(1)
    c.line(cx - 80, y_line, cx + 80, y_line)

    # Autor
    c.setFillColor(MEDIUM_TEXT)
    c.setFont('LibSans', 12)
    c.drawCentredString(cx, y_center - 55, "Lic. Carlos Alberto Zorrilla Martínez")

    # Línea inferior decorativa
    y_deco_bot = y_center - 90
    c.setStrokeColor(TRX_YELLOW)
    c.setLineWidth(1)
    c.line(cx - 100, y_deco_bot, cx - 8, y_deco_bot)
    c.line(cx + 8, y_deco_bot, cx + 100, y_deco_bot)
    c.setFillColor(TRX_AMBER)
    c.saveState()
    c.translate(cx, y_deco_bot)
    c.rotate(45)
    c.rect(-4, -4, 8, 8, fill=1, stroke=0)
    c.restoreState()

    # ── Pie ──
    # Banda inferior amarilla
    band_h = 50
    c.setFillColor(TRX_YELLOW)
    c.rect(20, 20, W - 40, band_h, fill=1, stroke=0)
    # Borde superior de la banda
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(2)
    c.line(20, 20 + band_h, W - 20, 20 + band_h)

    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans', 10)
    c.drawCentredString(cx, 50, "© Todos los derechos reservados.")
    c.drawCentredString(cx, 36, "Prohibida su reproducción sin autorización del autor.")

    c.showPage()


# ── Generar PDF ────────────────────────────────────────────────
c = canvas.Canvas(OUTPUT, pagesize=letter)
c.setTitle("Manual de Pilates en Suspensión")
c.setAuthor("Lic. Carlos Alberto Zorrilla Martínez")
c.setSubject("Fundamentos, técnica y metodología de Pilates en Suspensión")

draw_cover(c)
draw_copyright_page(c)
draw_back_cover(c)

c.save()
print(f"✅ PDF generado: {OUTPUT}")
