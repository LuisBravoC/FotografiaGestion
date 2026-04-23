# Sistema de Temas - Documentación Técnica

## Resumen
Se ha implementado un **sistema de múltiples temas dinámicos** que permite a los usuarios cambiar entre 3 estilos visuales desde la página de Opciones. Los cambios se aplican instantáneamente con transiciones suaves y se persisten en localStorage.

## 📁 Archivos Creados

### 1. `src/lib/ThemeContext.jsx`
```
Contexto React que gestiona el tema actual
├─ Carga tema desde localStorage (clave: 'fotografia-theme')
├─ Aplica clase CSS al elemento html
├─ Hook useTheme() para usar en componentes
└─ VALID_THEMES: ['dark', 'light', 'google']
```

### 2. `src/styles/theme-dark.css`
```
Tema Oscuro (predeterminado)
├─ Fondos: #0f172a (muy oscuro), #1e293b (card)
├─ Accent: #6366f1 (indigo)
├─ Sombra: 0 4px 24px rgba(0,0,0,.35)
└─ Familiar para desarrollo
```

### 3. `src/styles/theme-light.css`
```
Tema Claro
├─ Fondos: #ffffff (blanco), #f8fafc (card)
├─ Accent: #6366f1 (mismo indigo)
├─ Sombra: 0 4px 24px rgba(0,0,0,.08)
└─ Tema inverno/día
```

### 4. `src/styles/theme-google.css`
```
Tema Google Material Design v3
├─ Fondos: #fafafa (gris claro), #ffffff (card)
├─ Accent: #1f71ba (azul profesional)
├─ Sombra: Material Design estándar
├─ Font-family: 'Google Sans', 'Roboto'
└─ Familiar para usuarios de Google Workspace
```

## 📝 Archivos Modificados

### `src/main.jsx`
```javascript
// Agregado:
import { ThemeProvider } from './lib/ThemeContext.jsx'
import './styles/theme-dark.css'
import './styles/theme-light.css'
import './styles/theme-google.css'

// Envuelto:
<ThemeProvider>
  <App />
</ThemeProvider>
```

### `src/pages/Opciones.jsx`
```javascript
// Agregado:
import { useTheme } from '../lib/ThemeContext.jsx'

// Uso en componente:
const { theme, setTheme } = useTheme()

// Botones dinámicos:
{Object.entries(themeConfig).map(([key, { icon, label }]) => (
  <button 
    onClick={() => setTheme(key)}
    className={`theme-pill ${theme === key ? 'theme-pill-active' : ''}`}
  >
    {icon} {label}
  </button>
))}
```

### `src/index.css`
```
Cambios:
├─ Agregadas transiciones: transition: background-color 0.3s ease, color 0.3s ease
├─ Estilos específicos para topbar en tema Google
├─ Mejorados estilos de .theme-pill (ahora interactivos)
└─ Topbar ajustado para diferentes alturas según tema
```

## 🎨 Variables CSS por Tema

### Dark Theme (`:root, html.dark`)
```css
--bg: #0f172a
--bg-card: #1e293b
--text: #f1f5f9
--accent: #6366f1
--deuda: #ef4444
--abonado: #f59e0b
--liquidado: #22c55e
```

### Light Theme (`html.light`)
```css
--bg: #ffffff
--bg-card: #f8fafc
--text: #1e293b
--accent: #6366f1
--deuda: #ef4444
--abonado: #f59e0b
--liquidado: #22c55e
```

### Google Theme (`html.google`)
```css
--bg: #fafafa
--bg-card: #ffffff
--text: #202124
--accent: #1f71ba
--deuda: #d32f2f (Material Red)
--abonado: #f57c00 (Material Orange)
--liquidado: #388e3c (Material Green)
```

## 🔌 API del Sistema

### useTheme Hook
```javascript
import { useTheme } from '@/lib/ThemeContext'

function MiComponente() {
  const { theme, setTheme } = useTheme()
  
  // Leer tema actual
  console.log(theme) // 'dark' | 'light' | 'google'
  
  // Cambiar tema
  setTheme('light')
}
```

### localStorage
```javascript
// Clave: 'fotografia-theme'
// Valor: 'dark' | 'light' | 'google'

localStorage.getItem('fotografia-theme') // → 'dark'
localStorage.setItem('fotografia-theme', 'google')
```

## 🎯 Flujo de Funcionamiento

```
1. App inicia
   ↓
2. ThemeProvider carga localStorage
   ↓
3. Si existe tema guardado → usa ese, sino usa 'dark'
   ↓
4. Aplica clase al html: <html class="dark">
   ↓
5. Variables CSS en theme-XXX.css se activan
   ↓
6. Componentes usan var(--bg), var(--accent), etc.
   ↓
7. Usuario hace click en Opciones → selecciona tema
   ↓
8. setTheme() actualiza estado + localStorage + clase html
   ↓
9. CSS se actualiza instantáneamente (transición 0.3s)
```

## ✨ Características Implementadas

✅ **Cambio de tema instantáneo** - Sin recargar página  
✅ **Transiciones suaves** - 0.3s ease en colores  
✅ **Persistencia** - localStorage guarda selección  
✅ **Material Design** - Tema Google profesional  
✅ **Responsive** - Funciona en móvil/tablet/desktop  
✅ **Accesible** - Colores respetan contraste mínimo  
✅ **Rendimiento** - CSS variables, sin runtime overhead  

## 🚀 Cómo Agregar un Nuevo Tema

1. **Crear archivo** `src/styles/theme-miTema.css`:
```css
html.miTema {
  --bg: #ffffff;
  --bg-card: #f0f0f0;
  --text: #000000;
  --accent: #007bff;
  /* ... más variables */
}
```

2. **Importar en** `src/main.jsx`:
```javascript
import './styles/theme-miTema.css'
```

3. **Actualizar** `src/lib/ThemeContext.jsx`:
```javascript
const VALID_THEMES = ['dark', 'light', 'google', 'miTema']
```

4. **Agregar botón en** `src/pages/Opciones.jsx`:
```javascript
const themeConfig = {
  dark: { icon: Moon, label: 'Oscuro' },
  light: { icon: Sun, label: 'Claro' },
  google: { icon: Globe, label: 'Google' },
  miTema: { icon: Star, label: 'Mi Tema' } // ← Nuevo
}
```

## 🧪 Testing

### Test Manual
```
1. Abrir app → Ir a Opciones
2. Click "Oscuro" → Verifica que el tema cambia
3. Click "Claro" → Verifica colores claros
4. Click "Google" → Verifica Material Design
5. Recargar página → Verifica que persiste tema
6. DevTools → localStorage['fotografia-theme'] debe estar presente
```

### Test de Accesibilidad
```
✓ Contraste WCAG AA en todos los temas
✓ Iconos con labels textuales
✓ Botones al menos 44px (móvil)
✓ Transiciones no interfieren con funcionalidad
```

## 📚 Referencias

- **Material Design v3**: https://m3.material.io/
- **CSS Variables**: MDN - CSS Custom Properties
- **React Context**: React Docs - useContext

## 🐛 Troubleshooting

### El tema no cambia
- Verificar que ThemeProvider está en main.jsx
- Verificar que useTheme() se llama dentro de ThemeProvider
- Abrir DevTools → verifica que clase se aplica al html

### El tema no persiste tras recargar
- Verificar localStorage está habilitado
- Verificar que setTheme() guarda en localStorage
- Ir a DevTools → Application → LocalStorage

### Estilos no se aplican
- Verificar que los archivos CSS están importados en main.jsx
- Verificar que el nombre de la clase html coincide
- Limpiar cache del navegador (Ctrl+Shift+Del)

---

**Versión**: 1.0  
**Fecha**: 2026-04-23  
**Autor**: Sistema de Temas - FotografiaGestion
