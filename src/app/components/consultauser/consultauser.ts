import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { Funcionario } from '../../../interfaces/funcionario-interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultauser',
  imports: [FormsModule],
  templateUrl: './consultauser.html',
  styleUrl: './consultauser.css',
})
export class Consultauser implements OnInit {
  private _usersservice = inject(UsersService);
  funcionarios: Funcionario[] = [];
  nome: string = '';

  ngOnInit(): void {
    this.funcionarios = this._usersservice.obterStorage();
  }

  apagarFuncionario(funcionarioApagar: Funcionario) {
    this._usersservice.apagarFuncionario(funcionarioApagar);
    this.funcionarios = this.funcionarios.filter(
      (funcionario) => funcionario.id !== funcionarioApagar.id,
    );
  }

  pesquisar() {
    this.funcionarios = this._usersservice.pesquisarFuncionarios(this.nome);
  }
}
