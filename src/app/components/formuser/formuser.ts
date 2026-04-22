import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users-service';
import { v4 as uuid } from 'uuid';
import { toSignal } from '@angular/core/rxjs-interop';
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

import { Funcionario } from '../../../interfaces/funcionario-interface';
import { BrasilApiService } from '../../services/brasilapi-service';
import { of, startWith, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formuser',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './formuser.html',
  styleUrl: './formuser.css',
})
export class Formuser implements OnInit {
  private _usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private _brasilApi = inject(BrasilApiService);
  updating: boolean = false;
  idFuncionarioSelecionado: string | null = null;
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
      switchMap((uf) => {
        if (!uf) {
          return of([]);
        }

        return this._brasilApi.listarCidades(uf);
      }),
    ),
    { initialValue: [] },
  );

  isInvalid(field: string) {
    const control = this.cadastroForm.get(field);
    return control?.invalid && control?.touched;
  }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }
    const values = this.cadastroForm.getRawValue();

    const funcionario: Funcionario = {
      id: this.updating && this.idFuncionarioSelecionado ? this.idFuncionarioSelecionado : uuid(),
      ...values,
    };

    this._usersService.salvarLocalStorage(funcionario);
    this.cadastroForm.reset();
    this.updating = false;
    this.idFuncionarioSelecionado = null;
  }

  // QueryParamMap = Objeto com chave e valor, nesse caso ID:valor
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query: any) => {
      const params = query['params'];
      const id = params['id'];
      if (id) {
        const funcionario = this._usersService.buscarFuncionarioPorId(id);
        if (funcionario) {
          this.updating = true;
          this.idFuncionarioSelecionado = id;
          this.cadastroForm.patchValue(funcionario);
        }
      }
    });
  }
}
