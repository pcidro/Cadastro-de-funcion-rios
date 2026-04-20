import { Routes } from '@angular/router';
import { Formuser } from './components/formuser/formuser';
import { Consultauser } from './components/consultauser/consultauser';

export const routes: Routes = [
  {
    path: '',
    component: Formuser,
  },
  {
    path: 'consulta',
    component: Consultauser,
  },
];
