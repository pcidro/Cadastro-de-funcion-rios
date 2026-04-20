import { Injectable } from '@angular/core';
import { Funcionario } from '../../interfaces/funcionario-interface';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  static repoFuncionarios = '@funcionarios';

  salvarLocalStorage(funcionario: Funcionario) {
    const storage = this.obterStorage();
    storage.push(funcionario);
    localStorage.setItem(UsersService.repoFuncionarios, JSON.stringify(storage));
  }

  obterStorage(): Funcionario[] {
    const data = localStorage.getItem(UsersService.repoFuncionarios);
    return data ? JSON.parse(data) : [];
  }

  apagarFuncionario(funcionarioApagar: Funcionario) {
    const storage = this.obterStorage();
    const remove = storage.filter((funcionario) => funcionario.id !== funcionarioApagar.id);
    localStorage.setItem(UsersService.repoFuncionarios, JSON.stringify(remove));
  }

  pesquisarFuncionarios(nome: string): Funcionario[] {
    const funcionarios = this.obterStorage();
    if (!nome || nome.trim() === '') {
      return funcionarios;
    }

    const normalize = (texto: string) =>
      texto
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const termo = normalize(nome);

    return funcionarios.filter((funcionario) => normalize(funcionario.nome).includes(termo));
  }
}
