// ==============================================
// 1. INTERFACES - NOSSAS "FICHAS DE CADASTRO"
// ==============================================

// 1.1 INTERFACE PARA ANIMAIS - FICHA OBRIGATÓRIA
interface Animal {
    id: number;
    nome: string;
    especie: string;
    idade: number;
    peso: number;
    vacinado: boolean;
}

// 1.2 INTERFACE PARA SERVIÇOS - O QUE NOSSO PETSHOP OFERECE
interface Servico {
    id: number;
    tipo: string;
    animalId: number;
    preco: number;
    concluido: boolean;
    data?: string;
    horario?: string;
    funcionario?: string;
    duracao?: number;
    urgente?: boolean;
    observacoes?: string;
}

// ==============================================
// 2. LISTAS - ONDE GUARDAMOS NOSSOS DADOS
// ==============================================

let animais: Animal[] = [
    {
        id: 1,
        nome: "Rex",
        especie: "cachorro",
        idade: 3,
        peso: 15.5,
        vacinado: true
    },
    {
        id: 2,
        nome: "Mimi",
        especie: "gato", 
        idade: 2,
        peso: 4.2,
        vacinado: false
    }
];

let servicos: Servico[] = [
    {
        id: 1,
        tipo: "banho",
        animalId: 1,
        preco: 45.00,
        concluido: true
    }
];

let funcionarios: string[] = ["João", "Maria", "Pedro"];
let produtos: string[] = ["Ração Premium", "Brinquedo", "Coleira"];
let clientes: string[] = ["Ana Silva", "Carlos Santos"];
let tiposServico: string[] = ["banho", "tosa", "consulta", "vacinação"];

// ==============================================
// 3. FUNÇÕES PRINCIPAIS - O "MOTOR" DO SISTEMA
// ==============================================

function calcularIdade(anoNascimento: number): number {
    const anoAtual: number = new Date().getFullYear();
    return anoAtual - anoNascimento;
}

function criarAnimal(nome: string, especie: string, anoNascimento: number, peso: number): Animal {
    const idade = calcularIdade(anoNascimento);
    
    return {
        id: Math.floor(Math.random() * 1000),
        nome: nome,
        especie: especie,
        idade: idade,
        peso: peso,
        vacinado: false
    };
}

function agendarServico(servico: Servico): string {
    servicos.push(servico);
    return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
}

function calcularPrecoTotal(): number {
    let total: number = 0;
    servicos.forEach(servico => {
        total += servico.preco;
    });
    return total;
}

function filtrarAnimaisVacinados(): Animal[] {
    return animais.filter(animal => animal.vacinado === true);
}

function marcarComoVacinado(idAnimal: number): string {
    const animal = animais.find(a => a.id === idAnimal);
    if (animal) {
        animal.vacinado = true;
        return `✅ ${animal.nome} foi vacinado com sucesso!`;
    }
    return "❌ Animal não encontrado!";
}

function buscarAnimalPorNome(nome: string): Animal | undefined {
    return animais.find(animal => 
        animal.nome.toLowerCase() === nome.toLowerCase()
    );
}

// ==============================================
// 4. FUNÇÕES DE INTERFACE - PARA MOSTRAR NA TELA
// ==============================================

function testarFuncoes(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    // TESTANDO CADASTRO DE ANIMAL
    const novoAnimal = criarAnimal("Thor", "cachorro", 2020, 12.5);
    animais.push(novoAnimal);

    // TESTANDO AGENDAMENTO DE SERVIÇO
    const novoServico: Servico = {
        id: Date.now(),
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

function mostrarAnimais(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

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
                <button onclick="marcarComoVacinado(${animal.id})" ${animal.vacinado ? 'disabled' : ''}>
                    ${animal.vacinado ? '✅ Vacinado' : '💉 Aplicar Vacina'}
                </button>
            </div>
        `;
    });
    
    html += `<p><strong>Total:</strong> ${animais.length} animais</p></div>`;
    resultado.innerHTML = html;
}

function mostrarServicos(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

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
    
    html += `<p><strong>Total:</strong> ${servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`;
    resultado.innerHTML = html;
}

function mostrarErros(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    resultado.innerHTML = `
        <div class="erro-card">
            <h3>🚨 Erros que o TypeScript Previne</h3>
            <p>Estes códigos <strong>NÃO COMPILAM</strong> no TypeScript:</p>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 1: Tipo Incorreto</h4>
            <p><code>let idade: number = "5";</code></p>
            <small>🚫 Não pode colocar texto em variável de número</small>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 2: Ficha Incompleta</h4>
            <p><code>let animal: Animal = { nome: "Rex" };</code></p>
            <small>🚫 Tem que preencher TODAS as informações do animal</small>
        </div>
        <div class="erro-card">
            <h4>❌ ERRO 3: Parâmetro Errado</h4>
            <p><code>calcularIdade("2020");</code></p>
            <small>🚫 A função espera número, não texto</small>
        </div>
        <div class="animal-card">
            <h4>✅ Vantagem do TypeScript</h4>
            <p>Estes erros são descobertos <strong>ANTES</strong> de executar o código!</p>
        </div>
    `;
}

function cadastrarAnimal(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    resultado.innerHTML = `
        <div class="animal-card">
            <h3>➕ Cadastrando Novo Animal...</h3>
            <p>Aguarde 2 segundos...</p>
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

function mostrarEstatisticas(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    const totalAnimais = animais.length;
    const animaisVacinados = animais.filter(a => a.vacinado).length;
    const totalServicos = servicos.length;
    const servicosConcluidos = servicos.filter(s => s.concluido).length;
    const faturamentoTotal = calcularPrecoTotal();
    const percentualVacinados = totalAnimais > 0 ? Math.round((animaisVacinados/totalAnimais)*100) : 0;

    resultado.innerHTML = `
        <div class="animal-card">
            <h3>📊 Estatísticas do Petshop</h3>
            <p><strong>Total de Animais:</strong> ${totalAnimais}</p>
            <p><strong>Animais Vacinados:</strong> ${animaisVacinados} (${percentualVacinados}%)</p>
            <p><strong>Serviços Agendados:</strong> ${totalServicos}</p>
            <p><strong>Serviços Concluídos:</strong> ${servicosConcluidos}</p>
            <p><strong>Faturamento Total:</strong> R$ ${faturamentoTotal}</p>
        </div>
    `;
}

function agendarExemplo(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    if (animais.length === 0) {
        resultado.innerHTML = `
            <div class="erro-card">
                <h3>❌ Nenhum Animal Cadastrado</h3>
                <p>Cadastre um animal antes de agendar serviços.</p>
            </div>
        `;
        return;
    }

    const animal = animais[0];
    const novoServico: Servico = {
        id: Date.now(),
        tipo: "tosa",
        animalId: animal.id,
        preco: 35.00,
        concluido: false,
        data: "2024-03-25",
        horario: "14:00"
    };

    const mensagem = agendarServico(novoServico);

    resultado.innerHTML = `
        <div class="animal-card">
            <h3>⏰ Serviço Agendado!</h3>
            <p>${mensagem}</p>
            <p><strong>Animal:</strong> ${animal.nome}</p>
            <p><strong>Data:</strong> ${novoServico.data}</p>
            <p><strong>Horário:</strong> ${novoServico.horario}</p>
        </div>
    `;
}

function limparResultado(): void {
    const resultado = document.getElementById('resultado');
    if (!resultado) return;

    resultado.innerHTML = `
        <div class="animal-card">
            <h3>🗑️ Resultado Limpo</h3>
            <p>Clique nos botões para testar as funcionalidades.</p>
        </div>
    `;
}

// ==============================================
// 5. INICIALIZAÇÃO
// ==============================================

console.log("🚀 Sistema PetShop carregado com sucesso!");
console.log("🐾 Desenvolvido com TypeScript para evitar erros!");