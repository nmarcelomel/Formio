import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para directivas básicas
import { FormioModule } from '@formio/angular'; // <--- 1. IMPORTAR ESTO


@Component({
    selector: 'app-datos-mascota',
    standalone: true, // Asegúrate de que esto esté en true
    imports: [
        CommonModule,
        FormioModule // <--- 2. AGREGAR AQUÍ
    ],
    templateUrl: './datos-mascota.html',
    styleUrls: ['./datos-mascota.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DatosMascotaComponent {
    onSubmit(submission: any) {
        console.log("Form Submitted", submission);
    }
}
