import { Injectable } from '@angular/core';
import { Funcionario } from '../../interfaces/funcionario-interface';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  static repoFuncionarios = '@funcionarios';

  salvarLocalStorage(funcionario: Funcionario) {
    const funcionarios = this.obterStorage();
    const index = funcionarios.findIndex((f) => f.id === funcionario.id);
    if (index !== -1) {
      funcionarios[index] = funcionario;
    } else {
      funcionarios.push(funcionario);
    }

    localStorage.setItem(UsersService.repoFuncionarios, JSON.stringify(funcionarios));
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

  buscarFuncionarioPorId(idBuscado: string): Funcionario | undefined {
    const funcionarios = this.obterStorage();
    return funcionarios.find((cliente) => cliente.id === idBuscado);
  }
}
