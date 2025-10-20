// Encapsula o código dentro de um namespace para evitar conflitos globais
namespace Petshop {
    // Interfaces
    export interface Animal {
        id: number;
        nome: string;
        especie: string;
        idade: number;
        peso: number;
        vacinado: boolean;
    }

    export interface Servico {
        id: number;
        tipo: string;
        animalId: number;
        preco: number;
        concluido: boolean;
        data?: string;
        horario?: string;
    }

    // Dados iniciais (dentro do namespace para evitar redeclaração global)
    export let animais: Animal[] = [
        { id: 1, nome: "Rex", especie: "cachorro", idade: 3, peso: 15.5, vacinado: true },
        { id: 2, nome: "Mimi", especie: "gato", idade: 2, peso: 4.2, vacinado: false }
    ];

    export let servicos: Servico[] = [
        { id: 1, tipo: "banho", animalId: 1, preco: 45.00, concluido: true }
    ];

    export let tiposServico: string[] = ["banho", "tosa", "consulta", "vacinação"];

    // Funções utilitárias
    export function calcularIdade(anoNascimento: number): number {
        const anoAtual = new Date().getFullYear();
        return anoAtual - anoNascimento;
    }

    export function criarAnimal(nome: string, especie: string, anoNascimento: number, peso: number): Animal {
        const idade = calcularIdade(anoNascimento);
        return { id: Math.floor(Math.random() * 1000), nome, especie, idade, peso, vacinado: false };
    }

    export function agendarServico(servico: Servico): string {
        servicos.push(servico);
        return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
    }

    export function calcularPrecoTotal(): number {
        return servicos.reduce((acc, s) => acc + s.preco, 0);
    }

    export function filtrarAnimaisVacinados(): Animal[] {
        return animais.filter(a => a.vacinado === true);
    }

    export function marcarComoVacinado(idAnimal: number): string {
        const animal = animais.find(a => a.id === idAnimal);
        if (animal) {
            animal.vacinado = true;
            return `✅ ${animal.nome} foi vacinado com sucesso!`;
        }
        return "❌ Animal não encontrado!";
    }

    export function buscarAnimalPorNome(nome: string): Animal | undefined {
        return animais.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    }

    // Funções de interface
    export function testarFuncoes(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        const novoAnimal = criarAnimal("Thor", "cachorro", 2020, 12.5);
        animais.push(novoAnimal);
        const novoServico: Servico = { id: Date.now(), tipo: "banho", animalId: novoAnimal.id, preco: 45.00, concluido: false };
        const mensagemServico = agendarServico(novoServico);
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>🧪 Teste das Funções Principais</h3>
                <p><strong>Animal Criado:</strong> ${novoAnimal.nome} - ${novoAnimal.idade} anos</p>
                <p><strong>Serviço:</strong> ${mensagemServico}</p>
                <p><strong>Preço Total:</strong> R$ ${calcularPrecoTotal()}</p>
                <p><strong>Animais Vacinados:</strong> ${filtrarAnimaisVacinados().length}</p>
            </div>
        `;
    }

    export function mostrarAnimais(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        if (animais.length === 0) {
            resultado.innerHTML = `<div class="animal-card"><h3>🗒️ Lista de Animais</h3><p>Nenhum animal cadastrado ainda.</p></div>`;
            return;
        }
        let html = '<div class="animal-card"><h3>🗒️ Lista de Animais Cadastrados</h3>';
        animais.forEach(animal => {
            html += `
                <div class="animal-item">
                    <h4>${animal.nome} (${animal.especie})</h4>
                    <p><strong>ID:</strong> ${animal.id} | <strong>Idade:</strong> ${animal.idade} anos</p>
                    <p><strong>Peso:</strong> ${animal.peso} kg | <strong>Vacinado:</strong> ${animal.vacinado ? '✅ Sim' : '❌ Não'}</p>
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${animais.length} animais</p></div>`;
        resultado.innerHTML = html;
    }

    export function mostrarServicos(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        if (servicos.length === 0) {
            resultado.innerHTML = `<div class="animal-card"><h3>📋 Serviços Agendados</h3><p>Nenhum serviço agendado ainda.</p></div>`;
            return;
        }
        let html = '<div class="animal-card"><h3>📋 Serviços Agendados</h3>';
        servicos.forEach(servico => {
            const animal = animais.find(a => a.id === servico.animalId);
            const animalNome = animal ? animal.nome : "Animal não encontrado";
            html += `
                <div class="servico-item">
                    <h4>${servico.tipo} - R$ ${servico.preco}</h4>
                    <p><strong>Animal:</strong> ${animalNome} | <strong>Status:</strong> ${servico.concluido ? '✅ Concluído' : '⏳ Pendente'}</p>
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`;
        resultado.innerHTML = html;
    }

    export function mostrarErros(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        resultado.innerHTML = `
            <div class="erro-card">
                <h3>⚠️ Erros que o TypeScript Previne</h3>
                <p>Exemplos de erros detectáveis pelo TypeScript.</p>
            </div>
        `;
    }

    export function cadastrarAnimal(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        resultado.innerHTML = `<div class="animal-card"><h3>➕ Cadastrando Novo Animal...</h3><p>Aguarde 2 segundos...</p></div>`;
        setTimeout(() => {
            const novoAnimal = criarAnimal("Luna", "gato", 2023, 3.2);
            animais.push(novoAnimal);
            resultado.innerHTML = `
                <div class="animal-card">
                    <h3>✅ Animal Cadastrado com Sucesso!</h3>
                    <p><strong>Nome:</strong> ${novoAnimal.nome}</p>
                    <p><strong>Espécie:</strong> ${novoAnimal.especie}</p>
                    <p><strong>Idade:</strong> ${novoAnimal.idade} ano(s)</p>
                    <p><strong>Peso:</strong> ${novoAnimal.peso} kg</p>
                    <p><strong>ID:</strong> ${novoAnimal.id}</p>
                    <p><strong>Vacinado:</strong> ${novoAnimal.vacinado ? '✅ Sim' : '❌ Não'}</p>
                    <small>✨ Total de animais cadastrados: ${animais.length}</small>
                </div>
            `;
        }, 2000);
    }

    export function mostrarEstatisticas(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        const totalAnimais = animais.length;
        const animaisVacinados = animais.filter(a => a.vacinado).length;
        const totalServicos = servicos.length;
        const faturamentoTotal = calcularPrecoTotal();
        const percentualVacinados = totalAnimais > 0 ? Math.round((animaisVacinados / totalAnimais) * 100) : 0;
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>📊 Estatísticas do Petshop</h3>
                <p><strong>Total de Animais:</strong> ${totalAnimais}</p>
                <p><strong>Animais Vacinados:</strong> ${animaisVacinados} (${percentualVacinados}%)</p>
                <p><strong>Serviços Agendados:</strong> ${totalServicos}</p>
                <p><strong>Faturamento Total:</strong> R$ ${faturamentoTotal}</p>
            </div>
        `;
    }

    export function mostrarTipos(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        const lista = tiposServico.length > 0 ? tiposServico : ['banho', 'tosa', 'consulta', 'vacinação'];
        let html = '<div class="animal-card"><h3>📚 Tipos de Serviços</h3><ul class="tipos-list">';
        lista.forEach(tipo => { html += `<li>${tipo}</li>`; });
        html += '</ul></div>';
        resultado.innerHTML = html;
    }

    // Inicialização: adicionar listeners quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        const btnTipos = document.getElementById('btn-tipos');
        const btnAnimais = document.getElementById('btn-animais');
        const btnFuncoes = document.getElementById('btn-funcoes');
        const btnErros = document.getElementById('btn-erros');
        const btnCadastrar = document.getElementById('btn-cadastrar');

        btnTipos?.addEventListener('click', mostrarTipos);
        btnAnimais?.addEventListener('click', mostrarAnimais);
        btnFuncoes?.addEventListener('click', testarFuncoes);
        btnErros?.addEventListener('click', mostrarErros);
        btnCadastrar?.addEventListener('click', cadastrarAnimal);
    });
}

// Expor o namespace globalmente para fácil acesso em runtime
(window as any).Petshop = (window as any).Petshop || (typeof Petshop !== 'undefined' ? Petshop : {});
