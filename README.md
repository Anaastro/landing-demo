# Landing Page con Panel de Administración

Landing page dinámica con panel de administración completo, usando Next.js 16, Firebase Firestore y Storage.

## 🚀 Características

- ✅ Landing page totalmente configurable
- ✅ Panel de administración completo en `/admin`
- ✅ Contenido almacenado en Firestore
- ✅ Imágenes gestionadas con Firebase Storage
- ✅ Banner configurable con imagen de fondo
- ✅ Secciones de características, testimonios y CTA
- ✅ Footer personalizable
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones y transiciones suaves

## 📦 Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar Firebase:**

   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita **Firestore Database** y **Storage**
   - Copia las credenciales de configuración
   - Crea un archivo `.env.local` basado en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. **Editar `.env.local` con tus credenciales:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

4. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

5. **Abrir en el navegador:**
   - Landing: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎨 Estructura del Proyecto

```
landing-demo/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Panel de administración
│   ├── globals.css            # Estilos globales
│   ├── layout.tsx
│   └── page.tsx               # Landing page principal
├── components/
│   ├── Banner.tsx             # Componente de banner
│   ├── Features.tsx           # Sección de características
│   ├── Testimonials.tsx       # Sección de testimonios
│   ├── CTA.tsx                # Llamada a la acción
│   └── Footer.tsx             # Footer
├── lib/
│   ├── firebase.ts            # Configuración de Firebase
│   ├── firestore.ts           # Funciones de Firestore/Storage
│   └── types.ts               # Tipos TypeScript
└── .env.local.example         # Plantilla de variables de entorno
```

## 🔧 Uso del Panel de Administración

1. **Acceder al panel:** Navega a `/admin`

2. **Editar contenido:**

   - **Banner:** Título, subtítulo, imagen, texto del botón
   - **Características:** Agregar/eliminar/editar features con íconos o imágenes
   - **Testimonios:** Gestionar opiniones de clientes con avatares
   - **CTA:** Configurar llamada a la acción con imagen de fondo
   - **Footer:** Información de contacto y redes sociales

3. **Subir imágenes:**

   - Usa los campos de archivo para subir imágenes
   - Se almacenan automáticamente en Firebase Storage
   - Las URLs se guardan en Firestore

4. **Guardar cambios:**
   - Click en "Guardar Todos los Cambios"
   - Los cambios se reflejan inmediatamente en la landing

## 🗄️ Estructura de Datos en Firestore

La colección `landing` contiene un documento `main` con toda la configuración de la landing page.

## 🔐 Seguridad (Recomendaciones)

⚠️ **IMPORTANTE:** El panel de administración actual no tiene autenticación. Para producción:

1. Implementar Firebase Authentication
2. Proteger la ruta `/admin` con middleware
3. Configurar reglas de seguridad en Firestore y Storage

## 🚀 Despliegue

```bash
# Construir para producción
npm run build

# Iniciar en producción
npm start
```

O desplegar en [Vercel](https://vercel.com):

```bash
vercel
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: móvil (< 768px), tablet (768px-1024px), desktop (> 1024px)
- ✅ Imágenes optimizadas con Next.js Image
- ✅ Grid adaptativo para features y testimonios
