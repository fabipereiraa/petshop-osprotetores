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
        try {
            atualizarPainelServicos();
        }
        catch (e) { }
        try {
            saveState();
        }
        catch (e) { }
        return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
    }
    Petshop.agendarServico = agendarServico;
    const STORAGE_KEY = 'petshop_state_v1';
    function saveState() {
        const state = { animais: Petshop.animais, servicos: Petshop.servicos, tiposServico: Petshop.tiposServico };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
        catch (e) {
            console.warn('Não foi possível salvar estado:', e);
        }
    }
    Petshop.saveState = saveState;
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            if (parsed.animais && Array.isArray(parsed.animais)) {
                Petshop.animais = parsed.animais;
            }
            if (parsed.servicos && Array.isArray(parsed.servicos)) {
                Petshop.servicos = parsed.servicos;
            }
            if (parsed.tiposServico && Array.isArray(parsed.tiposServico)) {
                Petshop.tiposServico = parsed.tiposServico;
            }
        }
        catch (e) {
            console.warn('Não foi possível carregar estado:', e);
        }
    }
    Petshop.loadState = loadState;
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
            try {
                saveState();
            }
            catch (e) { }
            return `✅ ${animal.nome} foi vacinado com sucesso!`;
        }
        return "❌ Animal não encontrado!";
    }
    Petshop.marcarComoVacinado = marcarComoVacinado;
    function buscarAnimalPorNome(nome) {
        return Petshop.animais.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    }
    Petshop.buscarAnimalPorNome = buscarAnimalPorNome;
    function atualizarPainelAnimais() {
        const totalEl = document.getElementById('total-animais');
        if (totalEl) {
            totalEl.textContent = String(Petshop.animais.length);
        }
    }
    Petshop.atualizarPainelAnimais = atualizarPainelAnimais;
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
                <div class="servico-item" data-servico-id="${servico.id}">
                    <h4>${servico.tipo} - R$ ${servico.preco.toFixed(2)}</h4>
                    <p><strong>Animal:</strong> ${animalNome} | <strong>Status:</strong> ${servico.concluido ? '✅ Concluído' : '⏳ Pendente'}</p>
                    ${servico.concluido ? '' : `<button class="btn-confirm" data-id="${servico.id}">Confirmar</button>`}
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${Petshop.servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`;
        resultado.innerHTML = html;
        const buttons = resultado.querySelectorAll('.btn-confirm');
        buttons.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const target = ev.currentTarget;
                const idStr = target.getAttribute('data-id');
                if (!idStr)
                    return;
                const id = parseInt(idStr, 10);
                confirmarServico(id);
            });
        });
    }
    Petshop.mostrarServicos = mostrarServicos;
    function confirmarServico(idServico) {
        const serv = Petshop.servicos.find(s => s.id === idServico);
        if (!serv)
            return;
        serv.concluido = true;
        try {
            const tipoLower = (serv.tipo || '').toLowerCase();
            if (tipoLower.indexOf('vac') !== -1) {
                const animal = Petshop.animais.find(a => a.id === serv.animalId);
                if (animal && !animal.vacinado) {
                    animal.vacinado = true;
                }
            }
        }
        catch (e) { }
        try {
            saveState();
        }
        catch (e) { }
        mostrarServicos();
        try {
            atualizarPainelServicos();
        }
        catch (e) { }
        try {
            atualizarPainelAnimais();
        }
        catch (e) { }
    }
    Petshop.confirmarServico = confirmarServico;
    function atualizarPainelServicos() {
        const el = document.getElementById('total-servicos');
        if (el)
            el.textContent = String(Petshop.servicos.length);
    }
    Petshop.atualizarPainelServicos = atualizarPainelServicos;
    function agendarServicoFormulario() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        let options = '';
        Petshop.animais.forEach(a => { options += `<option value="${a.id}">${a.nome} (${a.especie})</option>`; });
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>🗓️ Agendar Serviço</h3>
                <form id="form-servico">
                    <label>Animal:<br><select id="select-animal">${options}</select></label><br>
                    <label>Tipo de Serviço:<br><select id="select-tipo">${Petshop.tiposServico.map(t => `<option value="${t}">${t}</option>`).join('')}</select></label><br>
                    <label>Preço (R$):<br><input type="number" id="preco-servico" step="0.01" value="45.00" required></label><br>
                    <button type="submit">Agendar</button>
                </form>
            </div>
        `;
        const form = document.getElementById('form-servico');
        if (!form)
            return;
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const animalId = parseInt(document.getElementById('select-animal').value, 10);
            const tipo = document.getElementById('select-tipo').value;
            const preco = parseFloat(document.getElementById('preco-servico').value);
            if (Number.isNaN(animalId) || !tipo || Number.isNaN(preco)) {
                alert('Preencha os campos corretamente.');
                return;
            }
            const novo = { id: Date.now(), tipo, animalId, preco, concluido: false };
            agendarServico(novo);
            atualizarPainelAnimais();
            resultado.innerHTML = `<div class="animal-card"><h3>✅ Serviço agendado!</h3><p>Serviço de ${tipo} para o animal ID ${animalId} agendado.</p></div>`;
            atualizarPainelAnimais();
        });
    }
    Petshop.agendarServicoFormulario = agendarServicoFormulario;
    function cadastrarAnimal() {
        const resultado = document.getElementById('resultado');
        if (!resultado)
            return;
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>➕ Cadastrar Novo Animal</h3>
                <form id="form-cadastro">
                    <label>Nome:<br><input type="text" id="nome" required></label><br>
                    <label>Espécie:<br><input type="text" id="especie" required></label><br>
                    <label>Ano de Nascimento:<br><input type="number" id="anoNascimento" min="1900" max="${new Date().getFullYear()}" required></label><br>
                    <label>Peso (kg):<br><input type="number" step="0.1" id="peso" required></label><br>
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        `;
        const form = document.getElementById('form-cadastro');
        if (!form)
            return;
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const inputNome = document.getElementById('nome').value.trim();
            const inputEspecie = document.getElementById('especie').value.trim();
            const inputAno = parseInt(document.getElementById('anoNascimento').value, 10);
            const inputPeso = parseFloat(document.getElementById('peso').value);
            if (!inputNome || !inputEspecie || Number.isNaN(inputAno) || Number.isNaN(inputPeso)) {
                alert('Preencha todos os campos corretamente.');
                return;
            }
            resultado.innerHTML = `<div class="animal-card"><h3>➕ Cadastrando...</h3><p>Aguarde...</p></div>`;
            setTimeout(() => {
                const novoAnimal = criarAnimal(inputNome, inputEspecie, inputAno, inputPeso);
                Petshop.animais.push(novoAnimal);
                atualizarPainelAnimais();
                try {
                    saveState();
                }
                catch (e) { }
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
            }, 1000);
        });
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
        const btnCadastrar = document.getElementById('btn-cadastrar');
        const btnAgendarServico = document.getElementById('btn-agendar-servico');
        const btnListaServicos = document.getElementById('btn-lista-servicos');
        btnTipos === null || btnTipos === void 0 ? void 0 : btnTipos.addEventListener('click', mostrarTipos);
        btnAnimais === null || btnAnimais === void 0 ? void 0 : btnAnimais.addEventListener('click', mostrarAnimais);
        btnCadastrar === null || btnCadastrar === void 0 ? void 0 : btnCadastrar.addEventListener('click', cadastrarAnimal);
        btnAgendarServico === null || btnAgendarServico === void 0 ? void 0 : btnAgendarServico.addEventListener('click', agendarServicoFormulario);
        btnListaServicos === null || btnListaServicos === void 0 ? void 0 : btnListaServicos.addEventListener('click', mostrarServicos);
        loadState();
        atualizarPainelAnimais();
        atualizarPainelServicos();
    });
})(Petshop || (Petshop = {}));
window.Petshop = window.Petshop || (typeof Petshop !== 'undefined' ? Petshop : {});
