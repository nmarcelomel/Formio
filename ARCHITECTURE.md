# Arquitectura del Proyecto — Seguro Mascotas App

## 1. Visión General

**Seguro Mascotas App** es una aplicación web de tipo Single Page Application (SPA) construida con **Angular 21** que implementa un flujo de cotización y contratación de seguros para mascotas. Los formularios y la lógica de presentación se gestionan de forma dinámica a través de **Form.io**, un motor de formularios headless que actúa como CMS de formularios.

```
┌─────────────────────────────────────────────────────────┐
│                      NAVEGADOR                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Angular 21 SPA                       │  │
│  │                                                   │  │
│  │  ┌─────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Landing  │→ │ DatosMascota │→ │  ElijaPlan  │  │  │
│  │  │ (Paso 1) │  │   (Paso 2)   │  │  (Paso 3)   │  │  │
│  │  └────┬─────┘  └──────┬───────┘  └──────┬──────┘  │  │
│  │       │               │                  │         │  │
│  │       └───────────────┴──────────────────┘         │  │
│  │                       │                            │  │
│  │              ┌────────▼────────┐                   │  │
│  │              │  @formio/angular │                   │  │
│  │              │   (FormioModule) │                   │  │
│  │              └────────┬────────┘                   │  │
│  └───────────────────────┼───────────────────────────┘  │
│                          │ HTTPS                        │
└──────────────────────────┼──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │    Form.io Cloud API     │
              │  fhqvtxjcdmcaoda.form.io │
              │                          │
              │  • /landing              │
              │  • /datosmascota         │
              └──────────────────────────┘
```

---

## 2. Stack Tecnológico

| Capa              | Tecnología                | Versión   | Propósito                                    |
|-------------------|---------------------------|-----------|----------------------------------------------|
| Framework         | Angular                   | 21.1.0    | SPA, routing, componentes standalone         |
| Formularios       | @formio/angular + formiojs| 10.x / 4.x| Renderizado dinámico de formularios desde API |
| UI Base           | Bootstrap                 | 5.3.x     | Grid system, utilidades CSS                  |
| Estilos           | SCSS                      | —         | Preprocesador CSS con variables y nesting    |
| Reactividad       | RxJS                      | 7.8.x     | Streams reactivos (dependencia de Angular)   |
| Lenguaje          | TypeScript                | 5.9.x     | Tipado estático                              |
| Build             | Angular CLI + Vite        | 21.1.0    | Compilación, dev server, bundling            |
| Testing           | Vitest                    | 4.x       | Unit testing                                 |

---

## 3. Estructura de Carpetas

```
seguro-mascotas-app/
├── src/
│   ├── app/
│   │   ├── app.ts                  # Componente raíz (shell)
│   │   ├── app.html                # Template raíz — solo <router-outlet>
│   │   ├── app.scss                # Estilos del shell (vacío)
│   │   ├── app.config.ts           # Configuración: providers, router, Form.io
│   │   ├── app.routes.ts           # Definición de rutas
│   │   ├── app.spec.ts             # Test del componente raíz
│   │   │
│   │   ├── landing/                # PASO 1 — Landing / Hero + Formulario inicial
│   │   │   ├── landing.ts
│   │   │   ├── landing.html
│   │   │   └── landing.scss
│   │   │
│   │   ├── datos-mascota/          # PASO 2 — Datos de la mascota
│   │   │   ├── datos-mascota.ts
│   │   │   ├── datos-mascota.html
│   │   │   └── datos-mascota.scss
│   │   │
│   │   └── elija-plan/             # PASO 3 — Selección de plan
│   │       └── elija-plan.ts       # (template inline)
│   │
│   ├── styles.scss                 # Estilos globales (Bootstrap, Form.io, overrides)
│   ├── index.html                  # HTML host + lógica JS del carrusel
│   ├── index_backup.html           # Backup del index original
│   └── main.ts                     # Bootstrap de la aplicación
│
├── public/
│   └── favicon.ico
│
├── angular.json                    # Configuración del workspace Angular
├── tsconfig.json                   # Config base de TypeScript
├── tsconfig.app.json               # Config TS para la app
├── tsconfig.spec.json              # Config TS para tests
├── package.json                    # Dependencias y scripts
├── FIX_FORM_BUTTON.js              # Snippet de referencia para lógica de botón en Form.io
├── FORMIO_CONFIG_GUIDE.md          # Guía de configuración de Form.io
└── README.md
```

---

## 4. Arquitectura de Componentes

La app usa **componentes standalone** de Angular 21 (sin NgModules). Cada vista es un componente independiente que importa directamente sus dependencias.

```
                    ┌──────────────┐
                    │     App      │
                    │  (app-root)  │
                    │ RouterOutlet │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │   Landing   │ │  Datos   │ │  ElijaPlan  │
     │             │ │ Mascota  │ │             │
     │ eager load  │ │ lazy load│ │  lazy load  │
     └──────┬──────┘ └────┬─────┘ └──────┬──────┘
            │              │              │
            └──────────────┴──────────────┘
                           │
                  ┌────────▼────────┐
                  │   FormioModule  │
                  │  <formio> tag   │
                  └─────────────────┘
```

### Detalle por componente

| Componente          | Selector             | Carga      | Formulario Form.io         | Responsabilidad                              |
|---------------------|----------------------|------------|-----------------------------|----------------------------------------------|
| `App`               | `app-root`           | Eager      | —                           | Shell, contiene `<router-outlet>`            |
| `Landing`           | `app-landing`        | Eager      | `/landing` (Wizard page 0) | Hero banner, formulario inicial, navegación  |
| `DatosMascotaComponent` | `app-datos-mascota` | Lazy   | `/datosmascota`            | Formulario de datos de la mascota con stepper|
| `ElijaPlan`         | `app-elija-plan`     | Lazy       | `/landing` (Wizard page 2) | Selección de plan de cobertura               |

---

## 5. Routing y Navegación

```
/  ──(redirect)──▶  /seguro-mascotas  ──(submit)──▶  /seguro-mascotas/datos-mascota  ──▶  /seguro-mascotas/elija-plan
```

| Ruta                              | Componente            | Estrategia  |
|-----------------------------------|-----------------------|-------------|
| `/`                               | Redirect → `/seguro-mascotas` | —    |
| `/seguro-mascotas`                | `Landing`             | Eager       |
| `/seguro-mascotas/datos-mascota`  | `DatosMascotaComponent`| Lazy (dynamic import) |
| `/seguro-mascotas/elija-plan`     | `ElijaPlan`           | Lazy (dynamic import) |

La navegación entre pasos se dispara por eventos de Form.io:
- **Landing → DatosMascota**: evento `(submit)` del formulario, navegación programática con `Router.navigate()` dentro de `NgZone.run()`.
- **ElijaPlan**: escucha `(customEvent)` para navegación futura (TODO en el código).

---

## 6. Integración con Form.io

### Patrón de integración

La app delega la definición de formularios al servicio cloud de Form.io. Angular actúa como **orquestador de navegación y shell visual**, mientras Form.io provee:

- Estructura de campos (inputs, radios, selects)
- Validaciones
- Lógica condicional
- Layout (columnas, paneles)
- Contenido HTML dinámico (banners, textos)

```
┌─────────────────────────────────────────┐
│           Angular Component             │
│                                         │
│  <formio [src]="url"                    │
│          [options]="opts"               │
│          (submit)="onSubmit($event)"    │
│          (customEvent)="onCustom($e)">  │
│  </formio>                              │
│                                         │
│  Responsabilidades Angular:             │
│  • Routing entre pasos                  │
│  • Estilos y branding (SCSS overrides)  │
│  • Lógica de navegación                 │
│  • Configuración de Form.io            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           Form.io Cloud                 │
│                                         │
│  Responsabilidades Form.io:             │
│  • Definición de campos                 │
│  • Validaciones                         │
│  • Layout y estructura                  │
│  • Contenido dinámico (HTML, imágenes)  │
│  • Lógica condicional de campos         │
│  • Almacenamiento de submissions        │
└─────────────────────────────────────────┘
```

### Configuración global

```typescript
// app.config.ts
{
  provide: FormioAppConfig,
  useValue: {
    appUrl: 'https://sxgdwjdmxjfksmb.form.io',
    apiUrl: 'https://api.form.io'
  }
}
```

### Endpoints de formularios

| Endpoint                                      | Usado en         | Tipo    |
|-----------------------------------------------|------------------|---------|
| `https://fhqvtxjcdmcaoda.form.io/landing`    | Landing, ElijaPlan| Wizard |
| `https://fhqvtxjcdmcaoda.form.io/datosmascota`| DatosMascota    | Form   |

---

## 7. Estrategia de Estilos

La app usa una estrategia de estilos en tres capas:

```
┌─────────────────────────────────────────────┐
│  Capa 3: Estilos de componente (.scss)      │  ← Scoped por componente
│  • landing.scss (::ng-deep para Form.io)    │
│  • datos-mascota.scss (ViewEncapsulation.None)│
├─────────────────────────────────────────────┤
│  Capa 2: Estilos globales (styles.scss)     │  ← Overrides globales
│  • Reset de Form.io (loader, wizard nav)    │
│  • Hero banner                              │
│  • Carrusel de planes                       │
│  • Botones (estados disabled/enabled)       │
│  • Floating form card                       │
├─────────────────────────────────────────────┤
│  Capa 1: Librerías base                     │  ← Fundación
│  • Bootstrap 5 (bootstrap.min.css)          │
│  • Form.io (formio.full.min.css)            │
└─────────────────────────────────────────────┘
```

**Nota importante**: Se usa `::ng-deep` y `ViewEncapsulation.None` extensivamente para poder sobreescribir los estilos internos que Form.io genera dinámicamente en el DOM.

---

## 8. Flujo de Datos

```
┌──────────┐    submit     ┌──────────────┐   submit    ┌───────────┐
│ Landing  │──────────────▶│ DatosMascota │────────────▶│ ElijaPlan │
│          │               │              │             │           │
│ Form.io  │               │   Form.io    │             │  Form.io  │
│ Wizard   │               │   Form      │             │  Wizard   │
│ Page 0   │               │              │             │  Page 2   │
└──────────┘               └──────────────┘             └───────────┘
     │                            │                          │
     ▼                            ▼                          ▼
  Form.io Cloud            Form.io Cloud              Form.io Cloud
  (submissions)            (submissions)              (submissions)
```

- Los datos de cada paso se envían directamente a Form.io Cloud como **submissions**.
- La navegación entre pasos es controlada por Angular Router.
- No hay un servicio de estado compartido entre componentes (cada formulario es independiente).

---

## 9. Build y Despliegue

### Scripts disponibles

| Comando          | Descripción                          |
|------------------|--------------------------------------|
| `npm start`      | Dev server (`ng serve`)              |
| `npm run build`  | Build de producción (`ng build`)     |
| `npm run watch`  | Build en modo watch (development)    |
| `npm test`       | Ejecutar tests (`ng test` / Vitest)  |

### Build pipeline

```
TypeScript + SCSS
       │
       ▼
  Angular CLI (Vite)
       │
       ├── Compilación AOT
       ├── Tree-shaking
       ├── Bundling
       └── Output hashing (producción)
       │
       ▼
   dist/seguro-mascotas-app/
```

### Presupuestos de bundle

| Tipo              | Warning | Error |
|-------------------|---------|-------|
| Initial bundle    | 2 MB    | 5 MB  |
| Component styles  | 10 KB   | 20 KB |

---

## 10. Diagrama de Dependencias

```
seguro-mascotas-app
│
├── @angular/core          ── Framework base
├── @angular/common        ── Directivas comunes (NgIf, NgFor, etc.)
├── @angular/router        ── Routing SPA
├── @angular/forms         ── Soporte de formularios reactivos
├── @angular/platform-browser ── Renderizado en navegador
├── @angular/compiler      ── Compilador JIT (dev)
│
├── @formio/angular        ── Componente <formio> para Angular
├── @formio/js             ── Motor de renderizado Form.io v5
├── formiojs               ── Motor de renderizado Form.io v4 (legacy)
│
├── bootstrap              ── CSS framework (grid, utilidades)
├── rxjs                   ── Programación reactiva
└── tslib                  ── Helpers de TypeScript
```

> **Nota**: Existen dos versiones del motor Form.io (`@formio/js` v5 y `formiojs` v4). Esto puede deberse a una migración en curso o a compatibilidad con `@formio/angular` v10.

---

## 11. Consideraciones y Oportunidades de Mejora

| Área                  | Estado Actual                                    | Recomendación                                              |
|-----------------------|--------------------------------------------------|------------------------------------------------------------|
| Estado compartido     | No hay servicio de estado entre pasos            | Implementar un servicio con signals para compartir datos del flujo |
| JS en index.html      | Lógica del carrusel en script inline             | Migrar a una directiva o componente Angular                |
| ViewEncapsulation     | `None` en DatosMascota (estilos globales)        | Evaluar uso de `::ng-deep` scoped en su lugar              |
| Dependencias Form.io  | Dos versiones del motor (v4 + v5)                | Consolidar a una sola versión                              |
| Environments          | No hay archivos de environment                   | Crear `environment.ts` / `environment.prod.ts` para URLs de Form.io |
| Guards                | Sin route guards                                 | Agregar guards para evitar acceso directo a pasos sin completar el anterior |
| Error handling        | Console.log básico                               | Implementar manejo de errores centralizado                 |
| Testing               | Solo existe `app.spec.ts`                        | Agregar tests por componente                               |
