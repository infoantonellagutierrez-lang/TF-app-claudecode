# Resumen del Proyecto: Manual de Pilates en Suspensión

## Objetivo
Transformar el manual original de 70 páginas (con branding de Centro Zen Pilates) en un manual limpio propiedad del **Lic. Carlos Alberto Zorrilla Martínez**, con tema visual TRX.

---

## Paleta de Colores

### Portada, Contraportada y Página de Derechos
| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo principal | Crema suave | `#f5f0e8` |
| Texto principal | Carbón oscuro | `#1a1a2e` |
| Acentos decorativos | Dorado cálido | `#c9a96e` |
| Texto secundario | Gris medio | `#6b6b6b` |

### Páginas de Contenido
| Elemento | Color | Hex |
|----------|-------|-----|
| Franja encabezado/pie | Amarillo TRX | `#f0c040` |
| Acento ámbar | Ámbar TRX | `#e8a620` |
| Texto cuerpo | Gris oscuro | `#2c2c2c` |
| Títulos de sección | Dorado oscuro | `#c98a20` |
| Fondo cobertura | Blanco | `#ffffff` |

---

## Fuentes Utilizadas
- **Liberation Sans Regular** — texto de cuerpo y correcciones ortográficas
- **Liberation Sans Bold** — títulos de sección, encabezados, números de página
- **Liberation Sans Italic / BoldItalic** — disponibles para énfasis

> Liberation Sans es un clon métrico de Arial, compatible con sistemas Linux sin licencia propietaria.

---

## Estructura del PDF Final (70 páginas)

1. **Portada** (generada) — tema TRX con imagen hero
2. **Derechos de autor** (generada) — aviso legal completo
3. **Páginas 3-70 del original** (67 páginas de contenido) — con overlays aplicados
4. **Contraportada** (generada)

### Páginas eliminadas del original
- Página 1 (portada original Centro Zen)
- Página 2 (créditos originales Centro Zen)
- Página 4 (página institucional Centro Zen / Rafael Jaque)

---

## Modificaciones Aplicadas en Cada Página de Contenido

### Encabezado
- **Cobertura**: rectángulo blanco de 118pt desde arriba (cubre banda roja, logo Centro Zen, texto "MANUAL PILATES", línea decorativa a 106pt)
- **Nuevo**: franja amarilla TRX de 38pt con texto centrado "MANUAL DE PILATES EN SUSPENSIÓN" (LibSans-Bold 9pt)
- **Borde inferior de franja**: línea de 0.3pt en amarillo TRX (mismo color, sin contraste oscuro)

### Pie de página
- **Cobertura**: rectángulo blanco de 92pt desde abajo (cubre logo Centro Zen, barra roja, número original)
- **Nuevo**: franja amarilla TRX de 28pt con:
  - Izquierda: "Lic. Carlos Alberto Zorrilla Martínez" (LibSans 6pt)
  - Centro: número de página (LibSans-Bold 9pt)
  - Derecha: "© Todos los derechos reservados" (LibSans 6pt)

### Títulos de sección
- **Detección**: fuente FranklinGothic, tamaño >= 14pt
- **Proceso**: cubrir original con blanco, redibujar en dorado oscuro (`#c98a20`)
- **Auto-fitting**: tamaño de fuente se reduce automáticamente hasta caber en ancho máximo (W - 90pt = 522pt)

### Eliminación de Centro Zen
- www.centrozen.cl (página 3)
- Párrafos sobre autorización de Centro Zen (página 3)
- Encabezados y pies de todas las páginas

---

## Correcciones Ortográficas (37 errores corregidos)

| Pág | Error | Corrección |
|-----|-------|------------|
| 3 | del el mundo | del mundo |
| 3 | modulo I | módulo I |
| 9 | Aumente la fuerza | Aumenta la fuerza |
| 10 | anclaje este sujeto | anclaje esté sujeto |
| 10 | No debes deja que | No debes dejar que |
| 10 | cintas rosen | cintas rocen |
| 10 | lejos este del | lejos esté del |
| 18 | punto departida | punto de partida |
| 21 | vuela a subir | vuelva a subir |
| 25 | un a flexión | una flexión |
| 25 | una por ves | una por vez |
| 25 | receto del abdomen | recto del abdomen |
| 27 | hacia taras | hacia atrás |
| 29 | las citas | las cintas |
| 29 | vuela a la posición | vuelva a la posición |
| 31 | los bazos | los brazos |
| 31 | mangos rotadores | manguitos rotadores |
| 34 | des entrelace | desentrelace |
| 38 | 5 tiempo por la nariz | 5 tiempos por la nariz |
| 38 | 5 tiempo por la boca | 5 tiempos por la boca |
| 39 | ruda para | ruede para |
| 45 | balacéese | balancéese |
| 48 | lateramente | lateralmente |
| 48 | los flores de cadera | los flexores de cadera |
| 53 | habrá el pecho | abra el pecho |
| 53 | vuela a la flexión | vuelva a la flexión |
| 54 | las citas | las cintas |
| 55 | rodilla contraiga se | rodilla contraria se |
| 61 | forme un V | forme una V |
| 62 | un anglo de | un ángulo de |
| 66 | parece al lado | párese al lado |
| 67 | parece detrás | párese detrás |
| 68 | gatrocnemios | gastrocnemios |
| 69 | la mira a esa | la mirada a esa |
| 69 | la mira al piso | la mirada al piso |

---

## Scripts del Proyecto

| Script | Función |
|--------|---------|
| `scripts/crear_manual_v2.py` | Genera 3 páginas: portada, derechos de autor, contraportada |
| `scripts/procesar_manual.py` | v1 del procesamiento (inicial) |
| `scripts/procesar_manual_v4.py` | Versión final: aplica overlays, correcciones, títulos, encabezados/pies |

### Dependencias Python
```
pypdf
pdfplumber
reportlab
```

---

## Medidas Clave del Layout Original
- Texto "MANUAL PILATES": y=50-61pt desde arriba
- Línea decorativa: y=106pt desde arriba
- Títulos de sección: y=119-165pt desde arriba (fuente FranklinGothic-MediumCond, 16-21pt)
- Texto cuerpo: desde ~y=169pt (MyriadPro-Regular, 12pt)
- Números de página: y=771-781pt
- Barra pie: y=774-783pt

---

## Archivos de Entrada
- **Manual original**: `Manual_PILATES_EN_SUSPENSION_ajustes_2_compressed.pdf` (70 páginas)
- **Imagen hero**: `hero.jpg` (680x413px, usada en portada)

## Archivo de Salida
- **PDF final**: `Manual_Pilates_Suspension_FINAL.pdf` (70 páginas)
