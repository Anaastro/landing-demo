# 🚀 Landing Page Moderna con Panel de Administración

Una landing page completamente configurable con diseño moderno, dark mode y panel de administración intuitivo.

## ✨ Características Principales

### 🎨 Diseño Moderno

- **Márgenes laterales profesionales** con contenedor `max-w-7xl`
- **Animaciones fluidas** con Framer Motion
- **Dark Mode completo** con persistencia en localStorage
- **Glassmorphism** y efectos visuales modernos
- **Gradientes animados** y efectos parallax
- **Responsive design** optimizado para todos los dispositivos

### 🖥️ Panel de Administración

- **Sidebar navegable** con secciones organizadas
- **Configuración visual** sin necesidad de código
- **Subida de imágenes** directa a Firebase Storage
- **Vista previa en tiempo real** de cambios
- **Mensajes de éxito/error** con animaciones

### 📋 Secciones Configurables

#### 1. **Logo** 🏷️

- Texto personalizable
- Opción de mostrar imagen o icono
- Subida de logo personalizado
- Aparece en el navbar fijo

#### 2. **Banner** 🎨

- Título y subtítulo personalizables
- Imagen de fondo opcional
- Botón CTA configurable
- Efectos parallax y decorativos

#### 3. **Estadísticas** 📊

- Activar/Desactivar sección completa
- Múltiples estadísticas configurables
- Valores, etiquetas e iconos personalizables
- Diseño en grid responsive

#### 4. **Características** ⭐

- Lista ilimitada de características
- Título, descripción e icono
- Imágenes opcionales
- Animaciones stagger en scroll

#### 5. **Productos/Planes** 📦

- **Activar/Desactivar** sección completa
- Título y subtítulo personalizables
- Múltiples productos/planes
- Características por línea
- Opción de **destacar** productos
- Imágenes de productos opcionales
- Precio personalizable

#### 6. **Testimonios** 💬

- Testimonios de clientes
- Avatar opcional
- Calificación con estrellas
- Diseño moderno con glassmorphism

#### 7. **CTA (Call to Action)** 📢

- Título y descripción
- Botón configurable
- Imagen de fondo opcional
- Partículas animadas

#### 8. **Footer** ⚙️

- Información de contacto
- Redes sociales
- Diseño elegante con gradientes

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework de React
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilos utility-first
- **Framer Motion** - Animaciones
- **Firebase** - Backend (Firestore + Storage)
- **Lucide React** - Iconos modernos

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone <tu-repo>
cd landing-demo
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar Firebase**

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

- Landing page: `http://localhost:3000`
- Panel admin: `http://localhost:3000/admin`

## 📝 Uso del Panel de Administración

### Acceso

Navega a `/admin` para acceder al panel de administración.

### Navegación por Secciones

El sidebar izquierdo permite navegar entre las diferentes secciones:

- 🏷️ Logo
- 🎨 Banner
- 📊 Estadísticas
- ⭐ Características
- 📦 Productos
- 💬 Testimonios
- 📢 CTA
- ⚙️ Footer

### Activar/Desactivar Secciones

Las secciones de **Estadísticas** y **Productos** pueden activarse o desactivarse con un simple checkbox. Si están desactivadas, no aparecerán en la landing page.

### Agregar Contenido

1. Selecciona la sección en el sidebar
2. Haz clic en **"Agregar"** (cuando aplique)
3. Completa los campos del formulario
4. Sube imágenes si es necesario
5. Haz clic en **"Guardar Cambios"** (botón flotante abajo a la derecha)

### Subir Imágenes

- Haz clic en el campo de archivo
- Selecciona una imagen de tu dispositivo
- La imagen se subirá automáticamente a Firebase Storage
- Verás una vista previa una vez completada la subida

### Guardar Cambios

El botón de guardar está siempre visible en la parte inferior derecha. Haz clic para:

- Guardar todos los cambios en Firebase
- Ver confirmación de éxito
- Los cambios se reflejan inmediatamente en la landing page

## 🎨 Personalización de Colores

Los colores principales se configuran en `app/globals.css`:

```css
:root {
	--primary: 220 90% 56%; /* Azul principal */
	--secondary: 280 80% 60%; /* Púrpura secundario */
	--accent: 340 100% 50%; /* Acento rosa */
}
```

## 🌙 Dark Mode

El dark mode se activa/desactiva con:

- **Botón flotante** en la landing page (esquina superior derecha)
- **Toggle en el sidebar** del panel de administración
- La preferencia se guarda en localStorage

## 📱 Responsive Design

La landing page está optimizada para:

- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

Los márgenes laterales se ajustan automáticamente:

- Mobile: `px-6`
- Desktop: `px-8`
- Contenedor máximo: `max-w-7xl`

## 🔥 Características Modernas

### Animaciones

- Parallax effects en el banner
- Stagger animations en grids
- Hover effects en cards
- Scroll indicators animados
- Smooth transitions en dark mode

### Efectos Visuales

- Glassmorphism en cards
- Gradientes animados en textos
- Blur effects decorativos
- Shadows dinámicas
- Border animations

### Optimizaciones

- Lazy loading de imágenes
- Code splitting automático
- Prefetch de rutas
- Optimización de fuentes (Inter)
- Cache de Firebase

## 📂 Estructura del Proyecto

```
landing-demo/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Panel de administración
│   ├── globals.css           # Estilos globales y variables
│   ├── layout.tsx            # Layout raíz con ThemeProvider
│   └── page.tsx              # Landing page principal
├── components/
│   ├── AdminLayout.tsx       # Layout con sidebar para admin
│   ├── Banner.tsx            # Hero section
│   ├── Features.tsx          # Grid de características
│   ├── Navbar.tsx            # Navbar fijo con logo
│   ├── Products.tsx          # Sección de productos/planes
│   ├── Stats.tsx             # Estadísticas animadas
│   ├── Testimonials.tsx      # Testimonios de clientes
│   ├── CTAModern.tsx         # Call to action
│   ├── FooterModern.tsx      # Footer con info de contacto
│   └── ThemeProvider.tsx     # Context para dark mode
├── lib/
│   ├── firebase.ts           # Configuración de Firebase
│   ├── firestore.ts          # Funciones de Firestore/Storage
│   └── types.ts              # TypeScript interfaces
└── public/                   # Archivos estáticos

```

## 🔒 Seguridad

- Las credenciales de Firebase están en variables de entorno
- El panel de administración puede protegerse con autenticación
- Las imágenes se validan antes de subir
- Se previenen ataques XSS en inputs

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Build Manual

```bash
npm run build
npm start
```

## 📄 Licencia

MIT License - Úsalo libremente en tus proyectos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 💡 Tips y Trucos

### Optimizar Imágenes

Usa imágenes optimizadas (WebP) para mejor rendimiento.

### Contenido por Defecto

El contenido inicial se define en `lib/firestore.ts` en `defaultLandingContent`.

### Personalizar Animaciones

Ajusta las animaciones en cada componente modificando los objetos `variants` de Framer Motion.

### Añadir Secciones

1. Crea el componente en `components/`
2. Añade la interfaz en `lib/types.ts`
3. Actualiza `defaultLandingContent` en `lib/firestore.ts`
4. Añade la sección en `app/page.tsx`
5. Crea el formulario en `app/admin/page.tsx`
6. Añade el ítem en `AdminLayout.tsx`

## 📞 Soporte

¿Necesitas ayuda? Abre un issue en GitHub.

---

**¡Hecho con ❤️ y Next.js!**
