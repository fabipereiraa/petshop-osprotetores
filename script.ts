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
        // atualiza painel de serviços (se presente)
        try { atualizarPainelServicos(); } catch (e) { /* ignore se não inicializado ainda */ }
        // persistir
        try { saveState(); } catch (e) { }
        return `✅ Serviço de ${servico.tipo} agendado! Preço: R$ ${servico.preco}`;
    }

    // Persistência com localStorage
    const STORAGE_KEY = 'petshop_state_v1';

    export function saveState(): void {
        const state = { animais, servicos, tiposServico };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Não foi possível salvar estado:', e);
        }
    }

    export function loadState(): void {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed.animais && Array.isArray(parsed.animais)) {
                animais = parsed.animais as Animal[];
            }
            if (parsed.servicos && Array.isArray(parsed.servicos)) {
                servicos = parsed.servicos as Servico[];
            }
            if (parsed.tiposServico && Array.isArray(parsed.tiposServico)) {
                tiposServico = parsed.tiposServico as string[];
            }
        } catch (e) {
            console.warn('Não foi possível carregar estado:', e);
        }
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
            try { saveState(); } catch (e) { }
            return `✅ ${animal.nome} foi vacinado com sucesso!`;
        }
        return "❌ Animal não encontrado!";
    }

    export function buscarAnimalPorNome(nome: string): Animal | undefined {
        return animais.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    }

    // Funções de interface
    // Atualiza apenas o contador do painel de animais
    export function atualizarPainelAnimais(): void {
        const totalEl = document.getElementById('total-animais');
        if (totalEl) {
            totalEl.textContent = String(animais.length);
        }
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
                <div class="servico-item" data-servico-id="${servico.id}">
                    <h4>${servico.tipo} - R$ ${servico.preco.toFixed(2)}</h4>
                    <p><strong>Animal:</strong> ${animalNome} | <strong>Status:</strong> ${servico.concluido ? '✅ Concluído' : '⏳ Pendente'}</p>
                    ${servico.concluido ? '' : `<button class="btn-confirm" data-id="${servico.id}">Confirmar</button>`}
                </div>
            `;
        });
        html += `<p><strong>Total:</strong> ${servicos.length} serviços | <strong>Valor Total:</strong> R$ ${calcularPrecoTotal()}</p></div>`;
        resultado.innerHTML = html;

        // adicionar listeners aos botões de confirmar
        const buttons = resultado.querySelectorAll('.btn-confirm');
        buttons.forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const target = ev.currentTarget as HTMLButtonElement;
                const idStr = target.getAttribute('data-id');
                if (!idStr) return;
                const id = parseInt(idStr, 10);
                confirmarServico(id);
            });
        });
    }

    // Confirma (marca como concluído) um serviço pelo id
    export function confirmarServico(idServico: number): void {
        const serv = servicos.find(s => s.id === idServico);
        if (!serv) return;
        serv.concluido = true;
        // Se o serviço for vacinação, marcar o animal como vacinado
        try {
            const tipoLower = (serv.tipo || '').toLowerCase();
            if (tipoLower.indexOf('vac') !== -1) {
                const animal = animais.find(a => a.id === serv.animalId);
                if (animal && !animal.vacinado) {
                    animal.vacinado = true;
                }
            }
        } catch (e) { /* ignore errors na verificação de tipo */ }

        try { saveState(); } catch (e) { }
        // atualizar a listagem e o painel de serviços/animais
        mostrarServicos();
        try { atualizarPainelServicos(); } catch (e) { }
        try { atualizarPainelAnimais(); } catch (e) { }
    }

    // Atualiza o painel de serviços (contador)
    export function atualizarPainelServicos(): void {
        const el = document.getElementById('total-servicos');
        if (el) el.textContent = String(servicos.length);
    }

    // Mostra um formulário para agendar serviços
    export function agendarServicoFormulario(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        // Form com seleção do animal e tipo/preço
        let options = '';
        animais.forEach(a => { options += `<option value="${a.id}">${a.nome} (${a.especie})</option>`; });
        resultado.innerHTML = `
            <div class="animal-card">
                <h3>🗓️ Agendar Serviço</h3>
                <form id="form-servico">
                    <label>Animal:<br><select id="select-animal">${options}</select></label><br>
                    <label>Tipo de Serviço:<br><select id="select-tipo">${tiposServico.map(t => `<option value="${t}">${t}</option>`).join('')}</select></label><br>
                    <label>Preço (R$):<br><input type="number" id="preco-servico" step="0.01" value="45.00" required></label><br>
                    <button type="submit">Agendar</button>
                </form>
            </div>
        `;

        const form = document.getElementById('form-servico') as HTMLFormElement | null;
        if (!form) return;
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const animalId = parseInt((document.getElementById('select-animal') as HTMLSelectElement).value, 10);
            const tipo = (document.getElementById('select-tipo') as HTMLSelectElement).value;
            const preco = parseFloat((document.getElementById('preco-servico') as HTMLInputElement).value);
            if (Number.isNaN(animalId) || !tipo || Number.isNaN(preco)) {
                alert('Preencha os campos corretamente.');
                return;
            }
            const novo: Servico = { id: Date.now(), tipo, animalId, preco, concluido: false };
            agendarServico(novo);
            // atualizar painel e mostrar confirmação
            atualizarPainelAnimais();
            resultado.innerHTML = `<div class="animal-card"><h3>✅ Serviço agendado!</h3><p>Serviço de ${tipo} para o animal ID ${animalId} agendado.</p></div>`;
            atualizarPainelAnimais();
        });
    }

    export function cadastrarAnimal(): void {
        const resultado = document.getElementById('resultado');
        if (!resultado) return;
        // Exibe um formulário para inserir os dados do novo animal
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

        const form = document.getElementById('form-cadastro') as HTMLFormElement | null;
        if (!form) return;

        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const inputNome = (document.getElementById('nome') as HTMLInputElement).value.trim();
            const inputEspecie = (document.getElementById('especie') as HTMLInputElement).value.trim();
            const inputAno = parseInt((document.getElementById('anoNascimento') as HTMLInputElement).value, 10);
            const inputPeso = parseFloat((document.getElementById('peso') as HTMLInputElement).value);

            if (!inputNome || !inputEspecie || Number.isNaN(inputAno) || Number.isNaN(inputPeso)) {
                alert('Preencha todos os campos corretamente.');
                return;
            }

            // Simula processamento e adiciona o novo animal
            resultado.innerHTML = `<div class="animal-card"><h3>➕ Cadastrando...</h3><p>Aguarde...</p></div>`;
            setTimeout(() => {
                const novoAnimal = criarAnimal(inputNome, inputEspecie, inputAno, inputPeso);
                animais.push(novoAnimal);
                // atualiza painel de animais e persiste
                atualizarPainelAnimais();
                try { saveState(); } catch (e) { }

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
            }, 1000);
        });
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
        const btnCadastrar = document.getElementById('btn-cadastrar');
        const btnAgendarServico = document.getElementById('btn-agendar-servico');
        const btnListaServicos = document.getElementById('btn-lista-servicos');

        btnTipos?.addEventListener('click', mostrarTipos);
        btnAnimais?.addEventListener('click', mostrarAnimais);
        btnCadastrar?.addEventListener('click', cadastrarAnimal);
        btnAgendarServico?.addEventListener('click', agendarServicoFormulario);
        btnListaServicos?.addEventListener('click', mostrarServicos);

        // Carrega estado salvo e atualiza painéis
        loadState();
        atualizarPainelAnimais();
        atualizarPainelServicos();
    });
}

// Expor o namespace globalmente para fácil acesso em runtime
(window as any).Petshop = (window as any).Petshop || (typeof Petshop !== 'undefined' ? Petshop : {});
