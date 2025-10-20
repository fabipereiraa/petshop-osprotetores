"use strict";
var Petshop;
(function (Petshop) {
    Petshop.animais = [
        { id: 1, nome: "Rex", especie: "cachorro", idade: 3, peso: 15.5, vacinado: true },
        { id: 2, nome: "Mimi", especie: "gato", idade: 2, peso: 4.2, vacinado: false }
    ];
    Petshop.servicos = [
        { id: 1, tipo: "banho", animalId: 1, preco: 45.00, concluido: true }
    ];
    Petshop.tiposServico = ["banho", "tosa", "consulta", "vacinação"];
    function calcularIdade(anoNascimento) {
        const anoAtual = new Date().getFullYear();
        return anoAtual - anoNascimento;
    }
    Petshop.calcularIdade = calcularIdade;
    function criarAnimal(nome, especie, anoNascimento, peso) {
        const idade = calcularIdade(anoNascimento);
        return { id: Math.floor(Math.random() * 1000), nome, especie, idade, peso, vacinado: false };
    }
    Petshop.criarAnimal = criarAnimal;
    function agendarServico(servico) {
        Petshop.servicos.push(servico);
        return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
    }
    Petshop.agendarServico = agendarServico;
    function calcularPrecoTotal() {
        return Petshop.servicos.reduce((acc, s) => acc + s.preco, 0);
    }
    Petshop.calcularPrecoTotal = calcularPrecoTotal;
    function filtrarAnimaisVacinados() {
        return Petshop.animais.filter(a => a.vacinado === true);
    }
    Petshop.filtrarAnimaisVacinados = filtrarAnimaisVacinados;
    function marcarComoVacinado(idAnimal) {
        const animal = Petshop.animais.find(a => a.id === idAnimal);
        if (animal) {
            animal.vacinado = true;
            return `✅ ${animal.nome} foi vacinado com sucesso!`;
        }
        return "❌ Animal não encontrado!";
    }
    Petshop.marcarComoVacinado = marcarComoVacinado;
    function buscarAnimalPorNome(nome) {
        return Petshop.animais.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    }
    Petshop.buscarAnimalPorNome = buscarAnimalPorNome;
    function testarFuncoes() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        const novoAnimal = criarAnimal("Thor", "cachorro", 2020, 12.5);
        Petshop.animais.push(novoAnimal);
        const novoServico = { id: Date.now(), tipo: "banho", animalId: novoAnimal.id, preco: 45.00, concluido: false };
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
    Petshop.testarFuncoes = testarFuncoes;
    function mostrarAnimais() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        if (Petshop.animais.length === 0) {
            resultado.innerHTML = `<div class="animal-card"><h3>🗒️ Lista de Animais</h3><p>Nenhum animal cadastrado ainda.</p></div>`;
            return;
        }
        let html = '<div class="animal-card"><h3>🗒️ Lista de Animais Cadastrados</h3>';
        Petshop.animais.forEach(animal => {
            html += `
                <div class="animal-item">
                    <h4>${animal.nome} (${animal.especie})</h4>
                    <p><strong>ID:</strong> ${animal.id} | <strong>Idade:</strong> ${animal.idade} anos</p>
                    <p><strong>Peso:</strong> ${animal.peso} kg | <strong>Vacinado:</strong> ${animal.vacinado ? '✅ Sim' : '❌ Não'}</p>
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${Petshop.animais.length} animais</p></div>`;
        resultado.innerHTML = html;
    }
    Petshop.mostrarAnimais = mostrarAnimais;
    function mostrarServicos() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        if (Petshop.servicos.length === 0) {
            resultado.innerHTML = `<div class="animal-card"><h3>📋 Serviços Agendados</h3><p>Nenhum serviço agendado ainda.</p></div>`;
            return;
        }
        let html = '<div class="animal-card"><h3>📋 Serviços Agendados</h3>';
        Petshop.servicos.forEach(servico => {
            const animal = Petshop.animais.find(a => a.id === servico.animalId);
            const animalNome = animal ? animal.nome : "Animal não encontrado";
            html += `
                <div class="servico-item">
                    <h4>${servico.tipo} - R$ ${servico.preco}</h4>
                    <p><strong>Animal:</strong> ${animalNome} | <strong>Status:</strong> ${servico.concluido ? '✅ Concluído' : '⏳ Pendente'}</p>
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${Petshop.servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`;
        resultado.innerHTML = html;
    }
    Petshop.mostrarServicos = mostrarServicos;
    function mostrarErros() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        resultado.innerHTML = `
            <div class="erro-card">
                <h3>⚠️ Erros que o TypeScript Previne</h3>
                <p>Exemplos de erros detectáveis pelo TypeScript.</p>
            </div>
        `;
    }
    Petshop.mostrarErros = mostrarErros;
    function cadastrarAnimal() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        resultado.innerHTML = `<div class="animal-card"><h3>➕ Cadastrando Novo Animal...</h3><p>Aguarde 2 segundos...</p></div>`;
        setTimeout(() => {
            const novoAnimal = criarAnimal("Luna", "gato", 2023, 3.2);
            Petshop.animais.push(novoAnimal);
            resultado.innerHTML = `
                <div class="animal-card">
                    <h3>✅ Animal Cadastrado com Sucesso!</h3>
                    <p><strong>Nome:</strong> ${novoAnimal.nome}</p>
                    <p><strong>Espécie:</strong> ${novoAnimal.especie}</p>
                    <p><strong>Idade:</strong> ${novoAnimal.idade} ano(s)</p>
                    <p><strong>Peso:</strong> ${novoAnimal.peso} kg</p>
                    <p><strong>ID:</strong> ${novoAnimal.id}</p>
                    <p><strong>Vacinado:</strong> ${novoAnimal.vacinado ? '✅ Sim' : '❌ Não'}</p>
                    <small>✨ Total de animais cadastrados: ${Petshop.animais.length}</small>
                </div>
            `;
        }, 2000);
    }
    Petshop.cadastrarAnimal = cadastrarAnimal;
    function mostrarEstatisticas() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        const totalAnimais = Petshop.animais.length;
        const animaisVacinados = Petshop.animais.filter(a => a.vacinado).length;
        const totalServicos = Petshop.servicos.length;
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
    Petshop.mostrarEstatisticas = mostrarEstatisticas;
    function mostrarTipos() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        const lista = Petshop.tiposServico.length > 0 ? Petshop.tiposServico : ['banho', 'tosa', 'consulta', 'vacinação'];
        let html = '<div class="animal-card"><h3>📚 Tipos de Serviços</h3><ul class="tipos-list">';
        lista.forEach(tipo => { html += `<li>${tipo}</li>`; });
        html += '</ul></div>';
        resultado.innerHTML = html;
    }
    Petshop.mostrarTipos = mostrarTipos;
    document.addEventListener('DOMContentLoaded', () => {
        const btnTipos = document.getElementById('btn-tipos');
        const btnAnimais = document.getElementById('btn-animais');
        const btnFuncoes = document.getElementById('btn-funcoes');
        const btnErros = document.getElementById('btn-erros');
        const btnCadastrar = document.getElementById('btn-cadastrar');
        btnTipos === null || btnTipos === void 0 ? void 0 : btnTipos.addEventListener('click', mostrarTipos);
        btnAnimais === null || btnAnimais === void 0 ? void 0 : btnAnimais.addEventListener('click', mostrarAnimais);
        btnFuncoes === null || btnFuncoes === void 0 ? void 0 : btnFuncoes.addEventListener('click', testarFuncoes);
        btnErros === null || btnErros === void 0 ? void 0 : btnErros.addEventListener('click', mostrarErros);
        btnCadastrar === null || btnCadastrar === void 0 ? void 0 : btnCadastrar.addEventListener('click', cadastrarAnimal);
    });
})(Petshop || (Petshop = {}));
window.Petshop = window.Petshop || (typeof Petshop !== 'undefined' ? Petshop : {});
