import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormioModule } from '@formio/angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormioModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  public formOptions: any = {
    wizard: {
      page: 0
    }
  };

  // URL del formulario (asegúrate de tenerla definida si la usas en el HTML)
  public formioUrl = 'https://fhqvtxjcdmcaoda.form.io/landing';

  constructor(private router: Router, private ngZone: NgZone) { }

  // CAMBIO CLAVE: Usamos onSubmit en lugar de onCustomEvent
  onSubmit(submission: any) {
    console.log('¡Formulario guardado exitosamente!', submission);

    // Navegamos a la siguiente página usando ngZone para evitar problemas de detección de cambios
    this.ngZone.run(() => {
      this.router.navigate(['/seguro-mascotas/datos-mascota']);
    });
  }
}