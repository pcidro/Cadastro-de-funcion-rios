import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrasilApiService } from './brasilapi-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, startWith, switchMap } from 'rxjs';

interface IFormControls {
  nome: FormControl<string>;
  idade: FormControl<string>;
  funcao: FormControl<string>;
  cpf: FormControl<string>;
  dataNascimento: FormControl<string>;
  email: FormControl<string>;
  estado: FormControl<string>;
  cidade: FormControl<string>;
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _brasilApi = inject(BrasilApiService);
  cadastroForm: FormGroup<IFormControls> = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    funcao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dataNascimento: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cpf: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  estados = toSignal(this._brasilApi.listarUfs(), { initialValue: [] });

  cidades = toSignal(
    this.cadastroForm.controls.estado.valueChanges.pipe(
      startWith(this.cadastroForm.controls.estado.value),
      switchMap((uf) => (uf ? this._brasilApi.listarCidades(uf) : of([]))),
    ),
    { initialValue: [] },
  );
  reset() {
    this.cadastroForm.reset();
  }
}
