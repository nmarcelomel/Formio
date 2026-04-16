// ------------------------------------------------------------------
// CÓDIGO SUGERIDO PARA EL BOTÓN "Proteger mi Mascota" EN FORM.IO
// Pégalo en: Botón -> Pestaña "Logic" o "Custom" -> Custom JavaScript
// ------------------------------------------------------------------

// 1. Prevenir que el evento se dispare múltiples veces (debounce simple)
if (window.isNavigating) {
    return;
}

// 2. Verificar validez del formulario
var isValid = component.checkValidity(data, true, data);

if (isValid) {
    console.log('✅ Formulario válido, intentando navegar...');

    // Marcar flag global para evitar rebotes
    window.isNavigating = true;
    setTimeout(function () { window.isNavigating = false; }, 2000);

    // INTENTO 1: Emitir evento estándar de wizard
    // Esto debería funcionar si el formulario está configurado como Wizard
    if (instance.root && instance.root.wizard) {
        console.log('➡️ Usando wizard.nextPage()');
        instance.root.wizard.nextPage();
    }

    // INTENTO 2: Emitir evento custom explícito
    // Este evento será capturado por (customEvent) en Angular
    console.log('➡️ Emitiendo evento custom irAlPaso2');
    instance.emit('customEvent', {
        type: 'irAlPaso2',
        data: data,
        component: component
    });

    // INTENTO 3: Emitir submit si es la última página
    console.log('➡️ Emitiendo submit');
    instance.emit('submit', data);

} else {
    console.log('❌ Formulario inválido, mostrando errores');
    // Forzar mostrar errores
    component.checkValidity(data, true, data, true);
}
