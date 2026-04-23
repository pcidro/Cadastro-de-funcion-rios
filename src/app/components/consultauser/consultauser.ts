import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { Funcionario } from '../../../interfaces/funcionario-interface';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultauser',
  imports: [FormsModule],
  templateUrl: './consultauser.html',
  styleUrl: './consultauser.css',
})
export class Consultauser implements OnInit {
  private _usersservice = inject(UsersService);
  private router: Router = inject(Router);
  funcionarios: Funcionario[] = [];
  nome: string = '';
  deletingId: string | null = null;

  ngOnInit(): void {
    this.funcionarios = this._usersservice.obterStorage();
  }

  apagarFuncionario(funcionarioApagar: Funcionario) {
    this._usersservice.apagarFuncionario(funcionarioApagar);
    this.funcionarios = this.funcionarios.filter(
      (funcionario) => funcionario.id !== funcionarioApagar.id,
    );
    this.deletingId = null;
  }

  pesquisar() {
    this.funcionarios = this._usersservice.pesquisarFuncionarios(this.nome);
  }

  preparaEditar(idEditar: string) {
    this.router.navigate(['/'], { queryParams: { id: idEditar } });
  }

  preparaDeletar(id: string) {
    this.deletingId = id;
  }

  formatarData(data: string) {
    const dia = data.substring(0, 2);
    const mes = data.substring(2, 4);
    const ano = data.substring(4, 8);

    return `${dia}/${mes}/${ano}`;
  }
}
