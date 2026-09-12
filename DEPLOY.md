# 🚀 Guía de Deploy a Vercel

## Pasos Rápidos

### 1. Prepara tu Repositorio
```bash
# Asegúrate de tener todo pusheado
git add -A
git commit -m "ready for production"
git push origin claude/tf-finance-app-s8se6m
```

### 2. Deploy en Vercel

#### Opción A: Desde CLI (Recomendado)
```bash
# Instala Vercel CLI (una sola vez)
npm i -g vercel

# Haz deploy
vercel

# Cuando pregunte:
# - "Set up and deploy?" → Yes
# - "Which scope?" → Tu cuenta
# - "Link to existing project?" → No (primera vez)
# - "What's your project's name?" → tf-finance-app
# - "In which directory is your code?" → ./
# - "Want to override settings?" → No
```

#### Opción B: Desde Web
1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Haz clic en "Add New..." → "Project"
4. Selecciona tu repositorio `TF-app-claudecode`
5. Elige rama `claude/tf-finance-app-s8se6m`
6. Vercel detectará automáticamente que es Vite
7. Haz clic en "Deploy"

### 3. Configura Variables de Entorno en Vercel

**En la consola de Vercel:**

1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-tu-clave-aqui` (tu API key real)
   - **Environment**: Production, Preview, Development

```bash
# O con CLI:
vercel env add ANTHROPIC_API_KEY
# Pega tu clave cuando pregunte
```

### 4. Redeploy (después de agregar env vars)
```bash
vercel --prod
```

## ¿Qué Hace Vercel Automáticamente?

✅ Compila `npm run build` → genera carpeta `dist/`
✅ Despliega frontend en CDN global
✅ Crea serverless functions desde `/api/chat.js`
✅ Configura proxy automático: `/api/*` → Functions
✅ Provee URL pública (ej: `tf-finance-app.vercel.app`)
✅ SSL/HTTPS automático
✅ Deployments continuos con cada push

## Después del Deploy

1. **Tu app estará en**: `https://tf-finance-app.vercel.app`
2. **Boti funcionará**: Llama a `/api/chat` → Vercel Functions → Anthropic API
3. **Los datos**: Se guardan en localStorage del usuario (sin servidor backend)

## Troubleshooting

### ❌ Error: "API key not configured"
- Verifica que `ANTHROPIC_API_KEY` esté en Vercel → Settings → Environment Variables
- Redeploy después de agregar la variable:
  ```bash
  vercel --prod
  ```

### ❌ Error: "Cannot GET /api/chat"
- Asegúrate de que `api/chat.js` está en el repositorio
- Verifica que el contenido del archivo es correcto:
  ```bash
  cat api/chat.js | head -5
  ```

### ❌ 404 en la app después de deploy
- Verifica que el build fue exitoso: `npm run build`
- En local: `npm run preview`
- Revisa logs en Vercel Dashboard → Deployments → View Logs

## Custom Domain (Opcional)

En Vercel Dashboard:
1. Settings → Domains
2. Add → Ingresa tu dominio (ej: `miapp.com`)
3. Sigue las instrucciones para configurar DNS

## Variables de Entorno para Desarrollo

El archivo `.env` local es ignorado por git (está en `.gitignore`).

Para desarrollo:
```bash
echo 'ANTHROPIC_API_KEY=sk-ant-tu-clave' > .env
npm run dev
```

Para producción:
- Configura en Vercel Dashboard
- No necesitas `.env` en el repositorio

## Monitoreo

Después de deploy, verifica:

```bash
# Verifica que la app carga
curl https://tf-finance-app.vercel.app

# Verifica que el API funciona
curl -X POST https://tf-finance-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola","financialSummary":"Test"}'
```

## Rollback (si algo sale mal)

En Vercel Dashboard:
1. Deployments
2. Haz clic en el deployment anterior (el que funcionaba)
3. Haz clic en "Promote to Production"

---

¿Preguntas? Revisa https://vercel.com/docs o pregúntame.
