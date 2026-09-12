# TF Finance - Aplicación Web de Finanzas Personales

Una aplicación web moderna de finanzas personales construida con **React + Vite + Tailwind CSS** con asistente financiero AI integrado.

## Características

- **📊 Dashboard Completo**: Visualiza tu saldo, ingresos, gastos y categorías
- **📈 Estadísticas Detalladas**: Gráficos de ingresos mensuales y desglose por categoría
- **💼 Gestión de Billetera**: Múltiples cuentas (Efectivo, Banco, Binance, PayPal) y movimientos
- **👤 Perfil Personalizado**: Configura idioma, moneda y tasas de cambio
- **🤖 Boti - Asistente Financiero IA**: Habla con Boti para obtener análisis y consejos sobre tus finanzas
- **💱 Multi-moneda**: Soporta USD, EUR, Bs y USDT con conversión automática
- **🌙 Tema Oscuro**: Interfaz elegante con paleta de colores TF (azul brand)
- **📱 Responsive**: Optimizado para mobile-first, mejorado en desktop

## Requisitos

- Node.js 18+ 
- npm o yarn

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/infoantonellagutierrez-lang/TF-app-claudecode.git
cd TF-app-claudecode

# Instalar dependencias
npm install

# Crear archivo .env con tu API key de Anthropic
cp .env.example .env
# Edita .env y agrega tu clave API de Anthropic
```

## Configuración

### Obtener API Key de Anthropic (para Boti)

1. Ve a https://console.anthropic.com
2. Crea una cuenta o inicia sesión
3. Navega a **API Keys**
4. Haz clic en **Create Key**
5. Copia la clave generada
6. Pégala en el archivo `.env`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Desarrollo

```bash
# Inicia Vite (frontend en puerto 5173) y servidor API (puerto 3001)
npm run dev

# O ejecuta solo el frontend
npm run dev:vite

# O ejecuta solo el servidor API
npm run dev:api
```

La app estará disponible en **http://localhost:5173**

## Compilar para Producción

```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```
├── src/
│   ├── components/       # Componentes React reutilizables
│   │   ├── ChatPanel.jsx # Panel de chat Boti
│   │   └── ...
│   ├── pages/           # Páginas principales (Home, Stats, Wallet, Profile)
│   ├── context/         # FinanceContext para estado global
│   ├── App.jsx          # Componente raíz
│   └── main.jsx
├── api/
│   └── chat.js          # Función serverless para chat con Anthropic
├── server.js            # Servidor Express para API en desarrollo
├── tailwind.config.js   # Configuración de Tailwind CSS
└── vite.config.js       # Configuración de Vite

```

## Usando Boti - Asistente Financiero

### Cómo Acceder

1. Abre la app en tu navegador
2. Haz clic en el icono **de burbuja de chat** (💬) en el header superior derecho
3. Se abrirá el panel de Boti en pantalla completa

### Ejemplos de Preguntas

- "¿Cuál es mi saldo total?"
- "¿Cómo está mi gasto en alimentación?"
- "Dame consejos para ahorrar dinero"
- "¿Cuál es mi categoría de gasto más alta?"
- "Analiza mis hábitos de gasto"

### Costos y Token Usage

Cada respuesta de Boti muestra:
- **Token Count**: Número total de tokens utilizados (input + output)
- **Costo**: Precio estimado en USD (Claude Sonnet 4.6: $3/M input, $15/M output)
- **Costo de Sesión**: Acumulado de todas las respuestas en la sesión actual

**Nota**: El costo que ves es estimado. El cargo real depende de Anthropic.

## Paleta de Colores TF

- **Brand**: `#0057FF` (Azul principal)
- **Brand Light**: `#3D7FFF` (Azul claro)
- **Brand Pale**: `#7AABFF` (Azul pálido)
- **Brand Dark**: `#003DB3` (Azul oscuro)

## Almacenamiento de Datos

Todos los datos se guardan en **localStorage** del navegador:
- Sin servidor backend
- Sin base de datos
- Datos persistentes en el navegador local
- Privacidad total (datos nunca se envían al servidor)

## Seguridad

- La API key de Anthropic se configura en el servidor (nunca se expone al cliente)
- El archivo `.env` está en `.gitignore`
- Las respuestas de Boti se renderizan como Markdown seguro (sin HTML crudo)

## Instalación Rápida (Desarrollo Local)

```bash
# Clone, instale, configure y corra
git clone https://github.com/infoantonellagutierrez-lang/TF-app-claudecode.git
cd TF-app-claudecode
npm install
echo 'ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui' > .env
npm run dev
# Abre http://localhost:5173
```

## Troubleshooting

### Boti no responde
- Verifica que tengas una API key válida en `.env`
- Asegúrate de que el servidor API está corriendo (puerto 3001)
- Revisa la consola del navegador (F12) para errores

### Los números no se calculan correctamente
- Limpia el localStorage: Abre DevTools → Storage → Local Storage → Elimina entradas `tf_*`
- Recarga la página

### El nav inferior tapa el input de Boti
- El input está diseñado con padding inferior para evitar esto
- Si persiste, abre DevTools y verifica el viewport size

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Haz commit con mensajes descriptivos
4. Abre un Pull Request

## Licencia

MIT

---

**Desarrollado con ❤️ usando React, Vite y Claude AI**
