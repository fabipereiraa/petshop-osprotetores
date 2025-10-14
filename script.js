"use strict";
// ==============================================
// 1. INTERFACES - NOSSAS "FICHAS DE CADASTRO"
// ==============================================
// ❌ ERRO: Esquecer de preencher TODOS os campos
// const animalErrado: Animal = { nome: "Rex", idade: 3 };
// ✅ SOLUÇÃO: Preencher TODOS os campos obrigatórios
const animalCorreto = {
    id: 1,
    nome: "Rex",
    especie: "cachorro",
    idade: 3,
    peso: 15.5,
    vacinado: true
};
// ==============================================
// 2. LISTAS - ONDE GUARDAMOS NOSSOS DADOS
// ==============================================
// 2.1 LISTA DE ANIMAIS CADASTRADOS
let animais = [];
// 2.2 LISTA DE SERVIÇOS AGENDADOS
let servicos = []; // CORREÇÃO: Nome da variável estava errado
// OPÇÃO C: LISTAS EXTRAS
let funcionarios = []; // Lista de funcionários
let produtos = []; // Lista de produtos à venda
let clientes = []; // Lista de nomes dos clientes
let tiposServico = []; // Lista de tipos de serviços
// ==============================================
// 3. FUNÇÕES PRINCIPAIS - O "MOTOR" DO SISTEMA
// ==============================================
// 3.1 FUNÇÃO PARA CALCULAR IDADE DO ANIMAL
function calcularIdade(anoNascimento) {
    const anoAtual = new Date().getFullYear(); // CORREÇÃO: Ano dinâmico
    return anoAtual - anoNascimento;
}
// 3.2 FUNÇÃO PARA CRIAR UM NOVO ANIMAL
function criarAnimal(nome, especie, anoNascimento, peso) {
    const idade = calcularIdade(anoNascimento); // CORREÇÃO: Usando função calcularIdade
    return {
        id: Math.floor(Math.random() * 1000),
        nome: nome,
        especie: especie,
        idade: idade,
        peso: peso,
        vacinado: false
    };
}
// 3.3 FUNÇÃO PARA AGENDAR SERVIÇOS - CORRIGIDA
function agendarServico(servico) {
    servicos.push(servico); // CORREÇÃO: servicos (com S) não servico
    return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
}
// OPÇÃO D: FUNÇÕES EXTRAS
// FUNÇÃO para calcular preço total de serviços - CORRIGIDA
function calcularPrecoTotal() {
    let total = 0;
    servicos.forEach(servico => {
        total += servico.preco;
    });
    return total;
}
// FUNÇÃO para encontrar animais vacinados
function filtrarAnimaisVacinados() {
    return animais.filter(animal => animal.vacinado === true);
}
// FUNÇÃO para marcar animal como vacinado
function marcarComoVacinado(idAnimal) {
    const animal = animais.find(a => a.id === idAnimal);
    if (animal) {
        animal.vacinado = true;
    }
}
// FUNÇÃO para buscar animal pelo nome
function buscarAnimalPorNome(nome) {
    return animais.find(animal => animal.nome.toLowerCase() === nome.toLowerCase());
}
// ==============================================
// 4. FUNÇÕES DE INTERFACE - PARA MOSTRAR NA TELA
// ==============================================
// BOTÃO 1: TESTAR FUNÇÕES PRINCIPAIS
function testarFuncoes() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    // TESTANDO CADASTRO DE ANIMAL
    const novoAnimal = criarAnimal("Thor", "cachorro", 2020, 12.5);
    animais.push(novoAnimal);
    // TESTANDO AGENDAMENTO DE SERVIÇO
    const novoServico = {
        id: 1,
        tipo: "banho",
        animalId: novoAnimal.id,
        preco: 45.00,
        concluido: false
    };
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
// BOTÃO 2: MOSTRAR ANIMAIS CADASTRADOS
function mostrarAnimais() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    if (animais.length === 0) {
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>📝 Lista de Animais</h3>
                <p>Nenhum animal cadastrado ainda.</p>
            </div>
        `;
        return;
    }
    let html = '<div class="animal-card"><h3>📝 Lista de Animais Cadastrados</h3>';
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
// BOTÃO 3: MOSTRAR SERVIÇOS - CORRIGIDA
function mostrarServicos() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    if (servicos.length === 0) {
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>📋 Serviços Agendados</h3>
                <p>Nenhum serviço agendado ainda.</p>
            </div>
        `;
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
    html += `<p><strong>Total:</strong> ${servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`; // CORREÇÃO: servicos (com S)
    resultado.innerHTML = html;
}
// BOTÃO 4: MOSTRAR ERROS QUE TYPESCRIPT EVITA
function mostrarErros() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    resultado.innerHTML = `
        <div class="erro-card">
            <h3>🚨 Erros que o TypeScript Previne</h3>
            <p>Estes códigos <strong>NÃO COMPILAM</strong> no TypeScript:</p>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 1: Tipo Incorreto</h4>
            <p><code>let idade: number = "5";</code></p>
            <small>🚫 Não pode colocar texto em variável de número</small>
            <small>💡 <strong>Problema do Petshop:</strong> "5 anos" vira "51" na soma</small>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 2: Ficha Incompleta</h4>
            <p><code>let animal: Animal = { nome: "Rex" };</code></p>
            <small>🚫 Tem que preencher TODAS as informações do animal</small>
            <small>💡 <strong>Problema do Petshop:</strong> Fichas de animais incompletas</small>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 3: Parâmetro Errado</h4>
            <p><code>calcularIdade("2020");</code></p>
            <small>🚫 A função espera número, não texto</small>
            <small>💡 <strong>Problema do Petshop:</strong> Cálculos errados de idade</small>
        </div>
        <div class="animal-card">
            <h4>✅ Vantagem do TypeScript</h4>
            <p>Estes erros são descobertos <strong>ANTES</strong> de executar o código!</p>
            <p>No JavaScript normal, o CLIENTE é que descobriria esses erros! 😱</p>
        </div>
    `;
}
// BOTÃO 5: CADASTRAR NOVO ANIMAL
function cadastrarAnimal() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    resultado.innerHTML = `
        <div class="animal-card">
            <h3>➕ Cadastrando Novo Animal...</h3>
            <p>Aguarde 2 segundos enquanto nós cadastramos...</p>
        </div>
    `;
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
// FUNÇÃO para mostrar estatísticas - CORRIGIDA
function mostrarEstatisticas() {
    const resultado = document.getElementById('resultado');
    if (!resultado)
        return;
    const totalAnimais = animais.length;
    const animaisVacinados = animais.filter(a => a.vacinado).length;
    const totalServicos = servicos.length; // CORREÇÃO: servicos (com S)
    const servicosConcluidos = servicos.filter(s => s.concluido).length; // CORREÇÃO: servicos (com S)
    const faturamentoTotal = calcularPrecoTotal();
    resultado.innerHTML = `
        <div class="animal-card">
            <h3>📊 Estatísticas do Petshop</h3>
            <p><strong>Total de Animais:</strong> ${totalAnimais}</p>
            <p><strong>Animais Vacinados:</strong> ${animaisVacinados} (${Math.round((animaisVacinados / totalAnimais) * 100)}%)</p>
            <p><strong>Serviços Agendados:</strong> ${totalServicos}</p>
            <p><strong>Serviços Concluídos:</strong> ${servicosConcluidos}</p>
            <p><strong>Faturamento Total:</strong> R$ ${faturamentoTotal}</p>
        </div>
    `;
}
// ==============================================
// 5. MENSAGEM INICIAL - EXECUTADA AO CARREGAR
// ==============================================
console.log("🚀 Sistema PetShop carregado com sucesso!");
console.log("🐾 Desenvolvido com TypeScript para evitar erros!");
console.log("💡 Dica: Abra o Console (F12) para ver mensagens!");
console.log("👉 Clique nos botões para testar as funcionalidades!");
