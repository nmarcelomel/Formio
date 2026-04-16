# Guía de Configuración Form.io - Wizard Navigation Fix

## 🎯 Objetivo

Esta guía te ayudará a configurar correctamente el formulario en Form.io para eliminar IDs duplicados y configurar el botón `protegerMiMascota` para que navegue correctamente en el wizard.

## 📝 Pasos para Configurar el Formulario

### 1. Acceder al Form Builder

1. Ve a: https://sxgdwjdmxjfksmb.form.io
2. Inicia sesión con tus credenciales
3. Abre el formulario **seguromascotas**
4. Haz clic en **Edit Form** o **Form Builder**

### 2. Configurar el Botón `protegerMiMascota`

#### Opción A: Botón para Navegación entre Páginas del Wizard

Si el botón NO está en la última página del wizard:

1. **Selecciona el botón** en el Form Builder
2. En la pestaña **Display**, asegúrate que:
   - **Label**: "Proteger mi Mascota" (o el texto que prefieras)
3. En la pestaña **API**:
   - **Property Name (Key)**: `protegerMiMascota`
   - **Custom CSS Class**: `btn-primary` (opcional)
4. En la pestaña **Logic/Actions**:
   - **Action**: Selecciona "Event"
   - **Event Name**: `nextPage`
5. En la pestaña **Validation**:
   - Activa **Validate On**: "Change"
   - Activa **Show Validations**: Sí
6. En la pestaña **Settings** (o Custom):
   - **Disable on Form Invalid**: Activado ✓

#### Opción B: Botón para Submit (Última Página)

Si el botón ESTÁ en la última página del wizard:

1-4. Igual que la Opción A, pero en el paso 4:
   - **Action**: Selecciona "Submit"
   - O **Event Name**: `submit`

#### Configuración JSON Directa

Si prefieres editar el JSON directamente (pestaña **{}** del botón):

```json
{
  "type": "button",
  "label": "Proteger mi Mascota",
  "key": "protegerMiMascota",
  "action": "event",
  "event": "nextPage",
  "showValidations": true,
  "disableOnInvalid": true,
  "theme": "primary",
  "size": "md",
  "block": false,
  "leftIcon": "",
  "rightIcon": "",
  "customClass": "btn-primary",
  "tableView": false,
  "input": true
}
```

### 3. Eliminar IDs Duplicados

Los IDs duplicados causan que los eventos se disparen múltiples veces. Para solucionarlo:

#### Método 1: Auditoría Manual

1. En el Form Builder, revisa cada componente
2. Haz clic en cada componente → Pestaña **API**
3. Verifica el campo **HTML Element ID**:
   - Si está vacío → déjalo vacío (Form.io generará uno único)
   - Si tiene un valor → asegúrate que sea ÚNICO en todo el formulario
4. Revisa especialmente:
   - Botones
   - Campos de texto
   - Panels y Columns (componentes de layout)

#### Método 2: Exportar y Buscar Duplicados

1. Exporta el formulario como JSON (botón **</>** en la barra superior)
2. Copia el JSON completo
3. Busca todas las apariciones de `"id":` en el JSON
4. Identifica IDs duplicados
5. Edita el JSON para hacer los IDs únicos o elimínalos
6. Importa el JSON corregido de vuelta al formulario

### 4. Verificar la Configuración del Wizard

1. En el Form Builder, verifica que:
   - El formulario está configurado como **Wizard** (no Form)
   - Cada página del wizard tiene un nombre único
   - La navegación entre páginas está habilitada

2. En la configuración del Wizard (Settings):
   - **Display as Wizard**: Activado ✓
   - **Breadcrumb Type**: Choose one (Classic, Condensed, etc.)

### 5. Custom JavaScript (Si es Necesario)

Si necesitas lógica personalizada para el botón, puedes añadirla en:
**Form Settings → Custom JavaScript**

```javascript
// Ejemplo de custom logic para botón de wizard
Formio.Components.components.button.prototype.onClick = function(event) {
  // Validar primero
  if (!this.checkValidity(this.data, true, this.data)) {
    console.warn('Formulario inválido');
    return;
  }
  
  console.log('Formulario válido, emitiendo evento');
  
  // Verificar si es un wizard
  if (this.root.wizard) {
    console.log('Wizard detectado, navegando...');
    this.emit('nextPage');
  } else {
    console.log('Form simple, enviando...');
    this.emit('submit', this.data);
  }
};
```

> ⚠️ **Nota**: El código custom puede sobreescribir comportamiento por defecto. Úsalo solo si es necesario.

## 🧪 Verificación

Después de hacer los cambios:

1. **Guarda el formulario** en Form.io
2. **Recarga la aplicación Angular** en el navegador
3. **Abre la consola del navegador** (F12)
4. **Llena el formulario** y haz clic en "Proteger mi Mascota"
5. **Verifica en la consola**:
   - ✅ Solo un evento se dispara (no duplicados)
   - ✅ El mensaje indica navegación a siguiente página
   - ✅ El wizard avanza a la siguiente página

## 📊 Eventos Esperados

Con la configuración correcta, deberías ver en la consola:

```
🎯 Evento nextPage #1 [nextPage-1234567890]
  Tipo: nextPage
  Timestamp: 2026-01-18T...
  Datos del evento: { ... }
📄 Wizard: Navegando a la siguiente página
📊 Datos actuales: { ... }
```

**Sin duplicados ni advertencias.**

## 🐛 Troubleshooting

### Problema: El evento se dispara múltiples veces

**Solución**: Hay IDs duplicados. Revisa la sección "Eliminar IDs Duplicados".

### Problema: El botón no hace nada

**Solución**: 
- Verifica que la configuración del botón tenga `action: "event"` y `event: "nextPage"`
- Verifica que el formulario sea un Wizard

### Problema: El botón está deshabilitado

**Solución**: Hay errores de validación. Revisa:
- Campos requeridos no completados
- Formato de email o teléfono inválido
- Custom validations

### Problema: No navega a la siguiente página

**Solución en Angular**: Ya está implementado en el componente. El método `onNextPage()` permite que Form.io maneje la navegación automáticamente.

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores específicos
2. Verifica que el formulario en Form.io esté guardado
3. Limpia la caché del navegador y recarga
