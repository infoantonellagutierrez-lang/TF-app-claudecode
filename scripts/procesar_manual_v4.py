#!/usr/bin/env python3 -I
"""
Procesa el Manual de Pilates en Suspensión v4 — versión IMPECABLE:
- Cobertura de encabezado a 115pt (cubre la línea decorativa a 106pt)
- Títulos recoloreados con ajuste automático de tamaño de fuente
- Sin líneas oscuras bajo la franja amarilla
- Footer más limpio y amplio
- Correcciones ortográficas
- Eliminación completa de Centro Zen
"""

import io
import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

pdfmetrics.registerFont(TTFont('LibSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Italic', '/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-BoldItalic', '/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf'))
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold',
                   italic='LibSans-Italic', boldItalic='LibSans-BoldItalic')

TRX_YELLOW  = HexColor('#f0c040')
TRX_AMBER   = HexColor('#e8a620')
DARK_TEXT    = HexColor('#2c2c2c')
TITLE_COLOR  = HexColor('#c98a20')

SCRATCH    = '/tmp/claude-0/-home-user-TF-app-claudecode/a7b31f2b-04ae-57e5-ae94-68e8caaf1b2a/scratchpad'
MANUAL_SRC = '/root/.claude/uploads/a7b31f2b-04ae-57e5-ae94-68e8caaf1b2a/3b1f5ce1-Manual_PILATES_EN_SUSPENSION_ajustes_2_compressed.pdf'
COVERS_PDF = f'{SCRATCH}/Manual_Pilates_en_Suspension.pdf'
OUTPUT     = f'{SCRATCH}/Manual_Pilates_Suspension_FINAL.pdf'

W, H = letter
HEADER_COVER = 118   # Cubre todo: banda roja + logo + "MANUAL PILATES" + línea decorativa a 106pt
FOOTER_COVER = 92    # Cubre logo pie + barra roja + número de página

CORRECTIONS = [
    (3,  "del el mundo", "del mundo"),
    (3,  "modulo I", "módulo I"),
    (9,  "Aumente la fuerza", "Aumenta la fuerza"),
    (10, "anclaje este sujeto", "anclaje esté sujeto"),
    (10, "No debes deja que", "No debes dejar que"),
    (10, "cintas rosen", "cintas rocen"),
    (10, "lejos este del", "lejos esté del"),
    (18, "punto departida", "punto de partida"),
    (21, "vuela a subir", "vuelva a subir"),
    (25, "un a flexión", "una flexión"),
    (25, "una por ves", "una por vez"),
    (25, "receto del abdomen", "recto del abdomen"),
    (27, "hacia taras", "hacia atrás"),
    (29, "las citas", "las cintas"),
    (29, "vuela a la posición", "vuelva a la posición"),
    (31, "los bazos", "los brazos"),
    (31, "mangos rotadores", "manguitos rotadores"),
    (34, "des entrelace", "desentrelace"),
    (38, "5 tiempo por la nariz", "5 tiempos por la nariz"),
    (38, "5 tiempo por la boca", "5 tiempos por la boca"),
    (39, "ruda para", "ruede para"),
    (45, "balacéese", "balancéese"),
    (48, "lateramente", "lateralmente"),
    (48, "los flores de cadera", "los flexores de cadera"),
    (53, "habrá el pecho", "abra el pecho"),
    (53, "vuela a la flexión", "vuelva a la flexión"),
    (54, "las citas", "las cintas"),
    (55, "rodilla contraiga se", "rodilla contraria se"),
    (61, "forme un V", "forme una V"),
    (62, "un anglo de", "un ángulo de"),
    (66, "parece al lado", "párese al lado"),
    (67, "parece detrás", "párese detrás"),
    (68, "gatrocnemios", "gastrocnemios"),
    (69, "la mira a esa", "la mirada a esa"),
    (69, "la mira al piso", "la mirada al piso"),
]

CENTRO_ZEN_TEXTS = [
    (3, "www.centrozen.cl"),
    (3, "Actualmente Carlos Zorrilla es Trainer autorizado por la Escuela de formación internacional Centro Zen"),
    (3, "Pilates con sede en Chile, para ofrecer sus programas de certificación y talleres avalados por la PMA."),
]

PAGES_TO_SKIP = {0, 1, 3}


def find_text_bbox(words, search_text):
    search_lower = search_text.lower()
    for i in range(len(words)):
        combined = ""
        matched = []
        for j in range(i, len(words)):
            w = words[j]
            matched.append(w)
            if combined:
                combined += " "
            combined += w['text'].lower()
            if search_lower in combined:
                return (
                    matched[0]['x0'],
                    min(m['top'] for m in matched),
                    matched[-1]['x1'],
                    max(m['bottom'] for m in matched),
                )
            if len(combined) > len(search_lower) + 40:
                break
    return None


def find_title_texts(plumber_page):
    """Encuentra todos los títulos de sección (FranklinGothic, tamaño 14+)."""
    titles = []
    words = plumber_page.extract_words(
        keep_blank_chars=True, x_tolerance=2, y_tolerance=2,
        extra_attrs=['fontname', 'size']
    )

    current_line = []
    current_top = None

    for w in sorted(words, key=lambda x: (x['top'], x['x0'])):
        font = w.get('fontname', '')
        size = w.get('size', 0)
        is_title = ('FranklinGothic' in font or 'Franklin' in font) and size >= 14

        if is_title:
            if current_top is not None and abs(w['top'] - current_top) > 5:
                if current_line:
                    titles.append(current_line[:])
                    current_line = []
            current_line.append(w)
            current_top = w['top']
        else:
            if current_line:
                titles.append(current_line[:])
                current_line = []
                current_top = None

    if current_line:
        titles.append(current_line)

    return titles


def fit_text_width(c, text, font_name, max_size, max_width):
    """Reduce font size until text fits within max_width. Returns actual size used."""
    size = max_size
    while size > 6:
        c.setFont(font_name, size)
        tw = c.stringWidth(text, font_name, size)
        if tw <= max_width:
            return size
        size -= 0.5
    return size


def create_overlay(plumber_page, page_num, corrections, cz_covers):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    ph = float(plumber_page.height)
    cx = W / 2

    # ══ 1. COVER HEADER — white rect, 118pt from top ═════════
    c.setFillColor(white)
    c.rect(0, H - HEADER_COVER, W, HEADER_COVER, fill=1, stroke=0)

    # ══ 2. COVER FOOTER — white rect, 92pt from bottom ═══════
    c.rect(0, 0, W, FOOTER_COVER, fill=1, stroke=0)

    # ══ 3. NEW HEADER — yellow band, NO dark border line ═════
    band_h = 38
    band_y = H - band_h
    c.setFillColor(TRX_YELLOW)
    c.rect(0, band_y, W, band_h, fill=1, stroke=0)

    # Thin, soft amber accent at bottom of band (not black/dark)
    c.setStrokeColor(TRX_YELLOW)  # Same yellow, very subtle
    c.setLineWidth(0.3)
    c.line(0, band_y, W, band_y)

    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 9)
    c.drawCentredString(cx, band_y + 13, "MANUAL DE PILATES EN SUSPENSIÓN")

    # Small white space below the band (clean transition)
    c.setFillColor(white)
    c.rect(0, H - HEADER_COVER, W, HEADER_COVER - band_h, fill=1, stroke=0)

    # ══ 4. RECOLOR SECTION TITLES ════════════════════════════
    titles = find_title_texts(plumber_page)
    max_text_width = W - 90  # 45pt margins each side

    for title_words in titles:
        if not title_words:
            continue

        title_text = " ".join(w['text'] for w in title_words).strip()
        if title_text in ("MANUAL PILATES", "MANUAL PILATES "):
            continue

        x0 = min(w['x0'] for w in title_words)
        x1 = max(w['x1'] for w in title_words)
        top = min(w['top'] for w in title_words)
        bottom = max(w['bottom'] for w in title_words)
        orig_size = title_words[0].get('size', 16)

        y_rl = ph - bottom

        # Skip if in covered header area
        if top < HEADER_COVER:
            continue

        # Cover original red title
        pad = 3
        c.setFillColor(white)
        c.rect(x0 - pad, y_rl - pad,
               (x1 - x0) + 2*pad, (bottom - top) + 2*pad,
               fill=1, stroke=0)

        # Redraw in TRX color, auto-fitting font size
        fitted_size = fit_text_width(c, title_text, 'LibSans-Bold', orig_size * 0.88, max_text_width)
        c.setFillColor(TITLE_COLOR)
        c.setFont('LibSans-Bold', fitted_size)
        c.drawString(x0, y_rl + 2, title_text)

    # ══ 5. COVER Centro Zen in content ═══════════════════════
    words = plumber_page.extract_words(keep_blank_chars=True, x_tolerance=3, y_tolerance=3)

    for search_text in cz_covers:
        bbox = find_text_bbox(words, search_text)
        if bbox:
            x0, top, x1, bottom = bbox
            y_rl = ph - bottom
            c.setFillColor(white)
            c.rect(x0 - 3, y_rl - 3, (x1 - x0) + 6, (bottom - top) + 6, fill=1, stroke=0)

    # ══ 6. SPELLING CORRECTIONS ══════════════════════════════
    for wrong, correct in corrections:
        bbox = find_text_bbox(words, wrong)
        if bbox:
            x0, top, x1, bottom = bbox
            y_rl = ph - bottom
            fsize = bottom - top

            c.setFillColor(white)
            c.rect(x0 - 2, y_rl - 2, (x1 - x0) + 4, fsize + 4, fill=1, stroke=0)

            draw_size = max(7, min(fsize * 0.85, 11))
            c.setFillColor(DARK_TEXT)
            c.setFont('LibSans', draw_size)
            c.drawString(x0, y_rl + 1, correct)

    # ══ 7. NEW FOOTER ════════════════════════════════════════
    foot_h = 28
    c.setFillColor(TRX_YELLOW)
    c.rect(0, 0, W, foot_h, fill=1, stroke=0)

    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 9)
    c.drawCentredString(cx, 9, str(page_num))
    c.setFont('LibSans', 6)
    c.drawString(12, 9, "Lic. Carlos Alberto Zorrilla Martínez")
    c.drawRightString(W - 12, 9, "© Todos los derechos reservados")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf


def regenerate_copyright_page():
    """Regenera la página de derechos de autor limpia, sin artefactos."""
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
    from reportlab.platypus import Paragraph
    from reportlab.lib.styles import ParagraphStyle

    SOFT_CREAM = HexColor('#f5f0e8')
    DARK_CHARCOAL = HexColor('#1a1a2e')
    WARM_GOLD = HexColor('#c9a96e')
    MEDIUM_GREY = HexColor('#6b6b6b')

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)

    c.setFillColor(SOFT_CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    cx = W / 2

    # Decorative line
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

    y_title = y_top - 40
    c.setFillColor(DARK_CHARCOAL)
    c.setFont('LibSans-Bold', 20)
    c.drawCentredString(cx, y_title, "Derechos de Autor")

    y_line2 = y_title - 18
    c.setStrokeColor(WARM_GOLD)
    c.setLineWidth(0.5)
    c.line(cx - 60, y_line2, cx + 60, y_line2)

    y_symbol = y_line2 - 60
    c.setFillColor(WARM_GOLD)
    c.setFont('LibSans-Bold', 48)
    c.drawCentredString(cx, y_symbol, "©")

    left_margin = 80
    text_width = W - 2 * left_margin

    style_author = ParagraphStyle('author', fontName='LibSans-Bold', fontSize=14,
                                   leading=20, alignment=TA_CENTER, textColor=DARK_CHARCOAL)
    style_legal = ParagraphStyle('legal', fontName='LibSans', fontSize=12,
                                  leading=18, alignment=TA_JUSTIFY, textColor=DARK_CHARCOAL, spaceAfter=14)
    style_legal_center = ParagraphStyle('lc', fontName='LibSans', fontSize=12,
                                         leading=18, alignment=TA_CENTER, textColor=DARK_CHARCOAL, spaceAfter=14)
    style_emphasis = ParagraphStyle('em', fontName='LibSans-Bold', fontSize=12,
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
        pw, ph_text = p.wrap(text_width, 500)
        p.drawOn(c, left_margin, y_cursor - ph_text)
        y_cursor -= (ph_text + 8)

    # Bottom decoration — well above the bottom edge
    y_bottom_line = 130
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
    c.drawCentredString(cx, y_bottom_line - 28, "Primera edición")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf


def main():
    print("═══ Manual de Pilates en Suspensión — procesamiento v4 ═══")
    print()

    print("Abriendo manual original...")
    plumber = pdfplumber.open(MANUAL_SRC)
    reader = PdfReader(MANUAL_SRC)
    total_orig = len(reader.pages)
    print(f"  Páginas originales: {total_orig}")

    print("Leyendo portadas...")
    covers_reader = PdfReader(COVERS_PDF)

    corrections_map = {}
    for orig_page, wrong, correct in CORRECTIONS:
        corrections_map.setdefault(orig_page, []).append((wrong, correct))

    centro_zen_map = {}
    for orig_page, text in CENTRO_ZEN_TEXTS:
        centro_zen_map.setdefault(orig_page, []).append(text)

    writer = PdfWriter()

    # ── Cover page (from generated covers) ──
    writer.add_page(covers_reader.pages[0])
    print("  ✓ Portada")

    # ── Copyright page (regenerated fresh for clean bottom) ──
    copyright_buf = regenerate_copyright_page()
    copyright_reader = PdfReader(copyright_buf)
    writer.add_page(copyright_reader.pages[0])
    print("  ✓ Derechos de autor (regenerada limpia)")

    # ── Process content pages ──
    new_page_num = 1
    for i in range(total_orig):
        if i in PAGES_TO_SKIP:
            print(f"  ✗ Omitida pág original {i+1}")
            continue

        orig_page_num = i + 1
        corrections = corrections_map.get(orig_page_num, [])
        cz_covers = centro_zen_map.get(orig_page_num, [])

        plumber_page = plumber.pages[i]
        overlay_buf = create_overlay(plumber_page, new_page_num, corrections, cz_covers)
        overlay_reader = PdfReader(overlay_buf)

        orig_page = reader.pages[i]
        orig_page.merge_page(overlay_reader.pages[0])
        writer.add_page(orig_page)

        new_page_num += 1
        if (i + 1) % 10 == 0:
            print(f"  Procesadas {i+1}/{total_orig}...")

    # ── Back cover ──
    writer.add_page(covers_reader.pages[2])
    print("  ✓ Contraportada")

    writer.add_metadata({
        '/Title': 'Manual de Pilates en Suspensión',
        '/Author': 'Lic. Carlos Alberto Zorrilla Martínez',
        '/Subject': 'Fundamentos, técnica y metodología de Pilates en Suspensión',
    })

    print(f"\nGuardando PDF final...")
    with open(OUTPUT, 'wb') as f:
        writer.write(f)

    final = PdfReader(OUTPUT)
    print(f"\n✅ PDF final impecable: {OUTPUT}")
    print(f"   Total páginas: {len(final.pages)}")

    plumber.close()


if __name__ == '__main__':
    main()
