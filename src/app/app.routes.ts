import { Routes } from '@angular/router';
import { Landing } from './landing/landing';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'seguro-mascotas',
        pathMatch: 'full'
    },
    {
        path: 'seguro-mascotas',
        component: Landing
    },
    {
        path: 'seguro-mascotas/datos-mascota',
        loadComponent: () => import('./datos-mascota/datos-mascota').then(m => m.DatosMascotaComponent)
    },
    {
        path: 'seguro-mascotas/elija-plan',
        loadComponent: () => import('./elija-plan/elija-plan').then(m => m.ElijaPlan)
    }
];
