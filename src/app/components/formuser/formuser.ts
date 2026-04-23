import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users-service';
import { v4 as uuid } from 'uuid';

import { Funcionario } from '../../../interfaces/funcionario-interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormService } from '../../services/form-service';

@Component({
  selector: 'app-formuser',
  imports: [ReactiveFormsModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './formuser.html',
  styleUrl: './formuser.css',
})
export class Formuser implements OnInit {
  private _usersService = inject(UsersService);
  formHandler = inject(FormService);
  private route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  updating: boolean = false;
  idFuncionarioSelecionado: string | null = null;

  isInvalid(field: string) {
    const control = this.formHandler.cadastroForm.get(field);
    return control?.invalid && control?.touched;
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
          this.formHandler.cadastroForm.patchValue(funcionario);
        }
      }
    });
  }
  onSubmit() {
    if (this.formHandler.cadastroForm.invalid) {
      this.formHandler.cadastroForm.markAllAsTouched();
      return;
    }
    const values = this.formHandler.cadastroForm.getRawValue();

    const funcionario: Funcionario = {
      id: this.updating && this.idFuncionarioSelecionado ? this.idFuncionarioSelecionado : uuid(),
      ...values,
    };

    if (this.updating) {
      this.toastr.success('Funcionário editado com sucesso!');
    } else {
      this.toastr.success('Funcionário cadastrado com sucesso!');
    }

    this._usersService.salvarLocalStorage(funcionario);
    this.formHandler.reset();
    this.updating = false;
    this.idFuncionarioSelecionado = null;
  }
}
