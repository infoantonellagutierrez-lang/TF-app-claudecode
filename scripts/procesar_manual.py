#!/usr/bin/env python3 -I
"""
Procesa el Manual de Pilates en Suspensión completo:
1. Elimina logos/encabezados de Centro Zen (rectángulos blancos sobre branding)
2. Agrega nuevos encabezados/pies TRX amarillo/naranja
3. Omite página 4 (página institucional de Centro Zen)
4. Antepone portada, derechos de autor; agrega contraportada al final
5. Preserva TODAS las fotos originales
"""

import io
from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fuentes ───────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('LibSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Italic', '/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-BoldItalic', '/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf'))
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold',
                   italic='LibSans-Italic', boldItalic='LibSans-BoldItalic')

# ── Colores TRX ───────────────────────────────────────────────
TRX_YELLOW = HexColor('#f0c040')
TRX_AMBER  = HexColor('#e8a620')
DARK_TEXT   = HexColor('#2c2c2c')
WHITE_CREAM = HexColor('#fffdf8')

# ── Rutas ─────────────────────────────────────────────────────
SCRATCH = '/tmp/claude-0/-home-user-TF-app-claudecode/a7b31f2b-04ae-57e5-ae94-68e8caaf1b2a/scratchpad'
MANUAL_SRC = '/root/.claude/uploads/a7b31f2b-04ae-57e5-ae94-68e8caaf1b2a/3b1f5ce1-Manual_PILATES_EN_SUSPENSION_ajustes_2_compressed.pdf'
COVERS_PDF = f'{SCRATCH}/Manual_Pilates_en_Suspension.pdf'
OUTPUT     = f'{SCRATCH}/Manual_Pilates_Suspension_FINAL.pdf'

W, H = letter  # 612 x 792


def create_overlay_page(page_num, total_pages):
    """
    Crea una página de overlay que:
    - Cubre el encabezado rojo de Centro Zen (rectángulo blanco arriba)
    - Cubre el logo y barra roja del pie (rectángulo blanco abajo)
    - Agrega nuevo encabezado estilo TRX
    - Agrega nuevo pie con número de página y autor
    """
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)

    cx = W / 2

    # ══════════════════════════════════════════════════════════════
    # 1. CUBRIR branding original con rectángulos blancos
    # ══════════════════════════════════════════════════════════════

    # Encabezado rojo Centro Zen: cubre desde el tope hasta ~130pt abajo
    c.setFillColor(white)
    c.rect(0, H - 135, W, 135, fill=1, stroke=0)

    # Pie: logo Centro Zen + barra roja inferior (~85pt desde abajo)
    c.rect(0, 0, W, 88, fill=1, stroke=0)

    # ══════════════════════════════════════════════════════════════
    # 2. NUEVO ENCABEZADO estilo TRX
    # ══════════════════════════════════════════════════════════════

    # Banda amarilla superior
    band_h = 45
    band_y = H - band_h
    c.setFillColor(TRX_YELLOW)
    c.rect(0, band_y, W, band_h, fill=1, stroke=0)

    # Línea ámbar inferior de la banda
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(1.5)
    c.line(0, band_y, W, band_y)

    # Texto del encabezado
    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 11)
    c.drawCentredString(cx, band_y + 16, "MANUAL DE PILATES EN SUSPENSIÓN")

    # ══════════════════════════════════════════════════════════════
    # 3. NUEVO PIE
    # ══════════════════════════════════════════════════════════════

    # Banda amarilla inferior
    foot_h = 32
    c.setFillColor(TRX_YELLOW)
    c.rect(0, 0, W, foot_h, fill=1, stroke=0)

    # Línea ámbar superior del pie
    c.setStrokeColor(TRX_AMBER)
    c.setLineWidth(1.5)
    c.line(0, foot_h, W, foot_h)

    # Número de página centrado
    c.setFillColor(DARK_TEXT)
    c.setFont('LibSans-Bold', 10)
    c.drawCentredString(cx, 11, str(page_num))

    # Autor en pie (izquierda)
    c.setFont('LibSans', 7)
    c.drawString(15, 11, "Lic. Carlos Alberto Zorrilla Martínez")

    # Derechos (derecha)
    c.drawRightString(W - 15, 11, "© Todos los derechos reservados")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf


def process_manual():
    print("Leyendo manual original...")
    reader = PdfReader(MANUAL_SRC)
    total_orig = len(reader.pages)
    print(f"  Páginas originales: {total_orig}")

    print("Leyendo portadas generadas...")
    covers_reader = PdfReader(COVERS_PDF)

    writer = PdfWriter()

    # ── Agregar portada (página 1 del PDF de portadas) ─────────
    writer.add_page(covers_reader.pages[0])
    print("  + Portada")

    # ── Agregar página de derechos de autor (página 2) ─────────
    writer.add_page(covers_reader.pages[1])
    print("  + Derechos de autor")

    # ── Procesar páginas del manual original ───────────────────
    # Omitir: página 1 (portada original), página 2 (contraportada original),
    #         página 4 (info Centro Zen / Rafael Jaque)
    # Las páginas 1-2 del original son las tapas originales con Centro Zen
    # La página 3 en adelante es el contenido real
    # Página 4 (índice 3) es la de Centro Zen

    pages_to_skip = {0, 1, 3}  # índices 0-based: pág 1, 2 (tapas originales), pág 4 (Centro Zen)

    new_page_num = 1
    for i in range(total_orig):
        if i in pages_to_skip:
            print(f"  ✗ Omitida página original {i+1}")
            continue

        # Crear overlay para esta página
        overlay_buf = create_overlay_page(new_page_num, total_orig - len(pages_to_skip))
        overlay_reader = PdfReader(overlay_buf)
        overlay_page = overlay_reader.pages[0]

        # Obtener la página original
        orig_page = reader.pages[i]

        # Fusionar: primero la original, luego el overlay encima
        orig_page.merge_page(overlay_page)

        writer.add_page(orig_page)
        new_page_num += 1

        if (i + 1) % 10 == 0:
            print(f"  Procesadas {i+1}/{total_orig} páginas...")

    # ── Agregar contraportada al final (página 3 del PDF de portadas) ──
    writer.add_page(covers_reader.pages[2])
    print("  + Contraportada (al final)")

    # ── Metadatos ──────────────────────────────────────────────
    writer.add_metadata({
        '/Title': 'Manual de Pilates en Suspensión',
        '/Author': 'Lic. Carlos Alberto Zorrilla Martínez',
        '/Subject': 'Fundamentos, técnica y metodología de Pilates en Suspensión',
        '/Creator': 'Manual profesional',
    })

    # ── Guardar ────────────────────────────────────────────────
    print(f"\nGuardando PDF final...")
    with open(OUTPUT, 'wb') as f:
        writer.write(f)

    final_reader = PdfReader(OUTPUT)
    print(f"✅ PDF final generado: {OUTPUT}")
    print(f"   Total de páginas: {len(final_reader.pages)}")


if __name__ == '__main__':
    process_manual()
