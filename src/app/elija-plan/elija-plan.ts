import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormioModule } from '@formio/angular';

@Component({
  selector: 'app-elija-plan',
  standalone: true,
  imports: [FormioModule],
  template: `
    <formio [src]="formioUrl" [options]="formOptions" (customEvent)="onCustomEvent($event)"></formio>
  `
})
export class ElijaPlan {
  // 1. URL unificada del Wizard
  formioUrl = 'https://fhqvtxjcdmcaoda.form.io/landing';

  // 2. CONFIGURACIÓN EXACTA DE PÁGINA
  public formOptions: any = {
    wizard: {
      page: 2 // Hoja 2: Elegir Plan
    }
  };

  constructor(private router: Router, private ngZone: NgZone) { }

  onCustomEvent(event: any) {
    console.log('🔔 Evento en ElijaPlan:', event.type);

    // Escucha el evento configurado
    if (event.type === 'navegarDesde-elijaPlan') {
      this.ngZone.run(() => {
        console.log('🚀 Navegando al siguiente paso...');
        // TODO: Definir ruta del paso 4. Por ahora log.
        // this.router.navigate(['/seguro-mascotas/confirmar']); 
      });
    }
  }
}
