"use scrict";

// import { tarefas, subtarefas } from "./tarefas.js";

if(!localStorage.getItem("tarefas")) localStorage.setItem("tarefas", JSON.stringify([]));
if(!localStorage.getItem("subtarefas")) localStorage.setItem("subtarefas", JSON.stringify([]));

const tarefas = JSON.parse(localStorage.getItem("tarefas"));
const subtarefas = JSON.parse(localStorage.getItem("subtarefas"));

// Variáveis

const [inputTarefa, inputProjeto] = document.querySelectorAll(".input-tarefa input");
const inputPrazo = Array.from(document.querySelectorAll(".radio-prazo input"));
const btnSubmitTarefa = document.querySelector(".submit-tarefa");
const btnMudarTema = document.querySelector(".mode-switch");
const containerTarefas = document.querySelector(".minhas-tarefas");
const containerTarefasAbandonadas = document.querySelector(".tarefas-grupo-vencidas");

const coresDarkMode = {
    "--separadores": "#57534e6c",
    "--fundo": "#0C0A09",
    "--fundo-interface": "#1C1917",
    "--tipografia-principal": "#D6D3D1",
    "--tipografia-accent": "#57534E",
    "--detalhe": "#78716C",
    "--detalhe-secundario": "#44403C",
    "--accent": "#292524",
    "--vermelho-main": "#F87171",
    "--vermelho-accent": "rgba(248, 113, 113, 0.08)",
    "--amarelo-main": "#F97316",
    "--amarelo-accent": "rgba(249, 115, 22, 0.08)",
    "--verde-main": "#10B981",
    "--verde-accent": "rgba(16, 185, 129, 0.08)"
};
const coresLightMode = {
    "--separadores": "#E7E5E4",
    "--fundo": "#E7E5E4",
    "--fundo-interface": "#F5F5F4",
    "--tipografia-principal": "#57534E",
    "--tipografia-accent": "#A8A29E",
    "--detalhe": "#D9D9D9",
    "--detalhe-secundario": "#D6D3D1",
    "--accent": "#FAFAF9",
    "--vermelho-main": "#F87171",
    "--vermelho-accent": "#FEE2E2",
    "--amarelo-main": "#F97316",
    "--amarelo-accent": "#FFEDD5",
    "--verde-main": "#10B981",
    "--verde-accent": "#D1FAE5"
};
let darkMode = true;

let adicionandoSubtarefa = false;
let parentTarefaAdicionada;

let editando = false;
let textoEditado;
let antigoTextoGlobal;


// Funções

const gerarTarefasPorPrazo = function (tarefas) {
    //Gerando timestamps dinâmicos para fazer os testes lógicos
    const hojeISO = new Date().toISOString();
    const hoje = new Date(hojeISO.split("T")[0]).getTime();
    const amanha = new Date(hoje + (24 * 60 * 60 * 1000)).getTime();

    const tarefasPorPrazo = {
        hoje: [],
        amanha: [],
        semana: [],
        vencidas: [],
    };

    tarefas.forEach(tarefa => {
        const prazo = new Date(tarefa.dataPrazo.split("T")[0]).getTime();

        if (prazo === hoje) tarefasPorPrazo.hoje.push(tarefa);
        if (prazo === amanha) tarefasPorPrazo.amanha.push(tarefa);
        if (prazo > amanha) tarefasPorPrazo.semana.push(tarefa);
        if (prazo < hoje) {
            tarefa.abandonada = true;
            tarefasPorPrazo.vencidas.push(tarefa);
        };
    });

    //adcionando subtarefas as tarefas que possuem subtarefas
    for (const tarefas of Object.values(tarefasPorPrazo)) {
        tarefas.forEach(tarefa => {
            if (subtarefas.some(el => el.id === tarefa.id)) {
                const index = subtarefas.findIndex(el => el.id === tarefa.id);
                tarefa.subtarefas = subtarefas[index].subtarefas;
            };
        });
    };

    return tarefasPorPrazo;
};

const criarElemento = function(tipoElemento, classes, conteudo){
    const elemento = document.createElement(tipoElemento);
    if(classes.length) elemento.classList.add(...classes);
    if(conteudo) elemento.textContent = conteudo;

    return elemento;
};

const criarTarefas = function (tarefas) {
    const formatadorData = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const criarTarefaSimples = function(tarefa){
        const wrapperTarefaWrapper = criarElemento("div", ["wrapper-tarefa"]);

        const tarefaWrapper = criarElemento("div", ["tarefa"]);

        const descricaoWrapper = criarElemento("div", ["descricao"]);
        const riscoTarefa = criarElemento("div", ["tarefa-risco"]);
        const checkTarefa = criarElemento("div", ["check-tarefa"]);
        const labelDescricao = criarElemento("p", ["descricao-texto", "editavel"], tarefa.descricao);
        const iconAdiconarTarefaChild = criarElemento("i", ["ph", "ph-plus-circle"]);

        const labelProjeto = criarElemento("p", ["projeto-texto", "editavel"], tarefa.projeto || "*");
        const labelData = criarElemento("p", ["data-texto", "editavel"], `Criada em ${formatadorData.format(new Date(tarefa.dataCriacao))}`);

        checkTarefa.dataset.concluido = tarefa.completa;
        tarefaWrapper.dataset.id = tarefa.id;

        descricaoWrapper.append(riscoTarefa, checkTarefa, labelDescricao, iconAdiconarTarefaChild);
        tarefaWrapper.append(descricaoWrapper, labelProjeto, labelData);
        wrapperTarefaWrapper.append(tarefaWrapper);

        return wrapperTarefaWrapper;
    };

    const criarTarefaComplexa = function(tarefa){
        const tarefaWrapper = criarElemento("div", ["tarefa-complexa"]);

        const tarefaParentWrapper = criarElemento("div", ["tarefa-parent"]);
        const descricaoParentWrapper = criarElemento("div", ["descricao"]);
        const bolaParent = criarElemento("div", ["bola"]);
        const labelDescricaoParent = criarElemento("p", ["descricao-texto", "editavel"], tarefa.descricao);
        const iconAdiconarTarefaChild = criarElemento("i", ["ph", "ph-plus-circle"]);

        const labelProjetoParent = criarElemento("p", ["projeto-texto", "editavel"], tarefa.projeto || "*");
        const labelDataParent = criarElemento("p", ["data-texto"], `Criada em ${formatadorData.format(new Date(tarefa.dataCriacao))}`);

        const tarefasChildWrapper = criarElemento("div", ["tarefas-child-wrapper"]);
        const linhaTarefasChild = criarElemento("div", ["linha-tarefas-child"]);
        const containerTarefasChild = criarElemento("div", ["tarefas-child"]);

        if (tarefa.subtarefas.every(subtarefa => subtarefa.completa === true)) tarefaParentWrapper.dataset.concluido = true;
        else tarefaParentWrapper.dataset.concluido = false;

        tarefaWrapper.dataset.id = tarefa.id;

        descricaoParentWrapper.append(bolaParent, labelDescricaoParent, iconAdiconarTarefaChild);
        tarefaParentWrapper.append(descricaoParentWrapper, labelProjetoParent, labelDataParent);

        tarefa.subtarefas.forEach((subtarefa, i) => {
            if (!subtarefa.completa) {
                const containerTarefaChild = criarElemento("div", ["tarefa-child"]);
                const descricaoChildWrapper = criarElemento("div", ["descricao"]);

                const bolinhaChild = criarElemento("div", ["bolinha-tarefa-child"]);
                const riscoTarefa = criarElemento("div", ["tarefa-risco"]);
                const checkChild = criarElemento("div", ["check-tarefa"]);
                const labelDescricaoChild = criarElemento("p", ["descricao-texto-child", "editavel"], subtarefa.descricao);

                checkChild.dataset.concluido = subtarefa.completa;
                containerTarefaChild.dataset.index = i;

                descricaoChildWrapper.append(riscoTarefa, checkChild, labelDescricaoChild);
                containerTarefaChild.append(bolinhaChild, descricaoChildWrapper);
                containerTarefasChild.append(containerTarefaChild);
            };
        });

        tarefasChildWrapper.append(linhaTarefasChild, containerTarefasChild);
        tarefaWrapper.append(tarefaParentWrapper, tarefasChildWrapper);

        return tarefaWrapper;
    };

    const criarTarefaVencida = function(tarefa){
        const tarefaWrapper = criarElemento("div", ["tarefa", "tarefa-vencida"]);

        const descricaoWrapper = criarElemento("div", ["descricao"]);
        const iconTentarDeNovo = criarElemento("i", ["ph", "ph-arrow-clockwise"]);
        const iconApagarTarefa = criarElemento("i", ["ph", "ph-trash"]);
        const labelDescricao = criarElemento("p", ["descricao-texto"], tarefa.descricao);

        const labelProjeto = criarElemento("p", ["projeto-texto"], tarefa.projeto || "*");
        const labelData = criarElemento("p", ["data-texto"], `Criada em ${formatadorData.format(new Date(tarefa.dataCriacao))}`);

        tarefaWrapper.dataset.id = tarefa.id;

        descricaoWrapper.append(iconTentarDeNovo, iconApagarTarefa, labelDescricao);
        tarefaWrapper.append(descricaoWrapper, labelProjeto, labelData);

        return tarefaWrapper;
    };

    const tarefasWrapper = criarElemento("div", ["tarefas"]);

    tarefas.forEach(tarefa => {
        if(tarefa.completa) return;
        
        if (!tarefa.abandonada) {
            if (!tarefa.subtarefas) tarefasWrapper.append(criarTarefaSimples(tarefa));
            else tarefasWrapper.append(criarTarefaComplexa(tarefa));
        } else tarefasWrapper.append(criarTarefaVencida(tarefa));
    });

    return tarefasWrapper;
};

const renderizarTarefasPorPrazo = function (tarefas) {
    const htmls = {
        hoje: '<hgroup class="tarefas-header"><h1 class="tarefas-titulo">Para hoje</h1><h3 class="tarefas-tag tag-hoje">Me priorize!</h3></hgroup>',
        amanha: '<hgroup class="tarefas-header"><h1 class="tarefas-titulo">Para amanhã</h1><h3 class="tarefas-tag tag-amanha">Se planeje para mim.</h3></hgroup>',
        semana: '<hgroup class="tarefas-header"><h1 class="tarefas-titulo">Para essa semana</h1><h3 class="tarefas-tag tag-semana">Pode me deixar por último ;)</h3></hgroup>',
        vencidas: '<h2>Tarefas vencidas</h2>',
    };

    for (const [prazo, tarefasArr] of Object.entries(tarefas)) {
        const containerTarefas = document.querySelector(`.tarefas-grupo-${prazo}`);

        containerTarefas.innerHTML = htmls[prazo];

        if (tarefasArr.every(tarefa => tarefa.completa) || !tarefasArr.length) {
            const nadaAquiWrapper = criarElemento("div", ["nada-aqui"]);
            const nadaAquiTexto = criarElemento("p", [], prazo === "vencidas" ? "Ainda não tem nada aqui... E eu espero que nunca tenha!" : "Ainda não tem nada aqui.");

            nadaAquiWrapper.append(nadaAquiTexto);

            containerTarefas.append(nadaAquiWrapper);
        } else {
            const tarefasPrazo = criarTarefas(tarefasArr);
            containerTarefas.append(tarefasPrazo);
        };
    };
};

const editarTexto = function (textoClicado) {
    textoClicado.contentEditable = true;
};

const concluirEdicaoTexto = function (textoEditado) {
    const tarefaEditadaEl = textoEditado.closest(".tarefa") || textoEditado.closest(".tarefa-complexa");
    const idTarefaEditada = +tarefaEditadaEl.dataset.id;
    const tarefaEditada = tarefas.find(tarefa => tarefa.id === idTarefaEditada);

    const novoValor = textoEditado.textContent.trim() || antigoTextoGlobal;

    if (textoEditado.classList.contains("descricao-texto")) tarefaEditada.descricao = novoValor;

    if (textoEditado.classList.contains("projeto-texto")) tarefaEditada.projeto = novoValor;;

    if (textoEditado.classList.contains("descricao-texto-child")) {
        const tarefaChildIndex = +textoEditado.closest(".tarefa-child").dataset.index;
        const subtarefaObj = subtarefas.find(subtarefa => subtarefa.id === idTarefaEditada);
        subtarefaObj.subtarefas[tarefaChildIndex].descricao = novoValor;
    };

    textoEditado.contentEditable = false;

    init();
};

const adicionarSubtarefa = function (tarefaParent) {
    if (adicionandoSubtarefa) return;

    parentTarefaAdicionada = tarefaParent.closest(".wrapper-tarefa") || tarefaParent;

    adicionandoSubtarefa = true;

    const containerTarefaChild = document.createElement("div");
    const inputAdicionar = document.createElement("input");

    inputAdicionar.classList.add("adicionar-subtarefa");
    containerTarefaChild.classList.add("tarefa-child");
    containerTarefaChild.append(inputAdicionar);


    if (tarefaParent.classList.contains("tarefa-complexa")) {
        const containerTarefasChild = tarefaParent.querySelector(".tarefas-child");
        containerTarefasChild.append(containerTarefaChild);
    };

    if (tarefaParent.classList.contains("tarefa")) {
        const tarefaWrapper = tarefaParent.parentElement;
        tarefaWrapper.append(containerTarefaChild);
    };
};

const concluirAdicaoSubtarefa = function (tarefaParent) {
    if (!adicionandoSubtarefa) return;

    tarefaParent = tarefaParent.querySelector(".tarefa") || tarefaParent;

    const input = document.querySelector(".adicionar-subtarefa");
    const elementoASerDeletado = input.parentElement;
    const idTarefa = +tarefaParent.dataset.id;
    const subtarefaObj = subtarefas.find(subtarefa => subtarefa.id === idTarefa);

    if (!input.value) {
        elementoASerDeletado.remove();
        return;
    };

    if (subtarefaObj) {
        subtarefaObj.subtarefas.push({
            descricao: input.value,
            completa: false,
        });

        elementoASerDeletado.remove();
        init();
    } else {
        subtarefas.push({
            id: idTarefa,
            subtarefas: [
                {
                    descricao: input.value,
                    completa: false,
                },
            ],
        });

        elementoASerDeletado.remove();
        init();
    };
};

const criarNovaTarefa = function () {
    const valorTarefa = inputTarefa.value.trim();
    const valorProjeto = inputProjeto.value.trim();
    const valorPrazo = inputPrazo.find(input => input.checked).value;
    const proxId = tarefas.at(-1)?.id + 1 || 1;

    const calcDiasAteSabado = function(){
        let dias = 0;

        const diasAteSabado = function(hoje = new Date()){
            if(hoje.getDay() === 6) return dias;
            else {
                const hojeTime = hoje.getTime();
                const amanha = new Date(hojeTime + (24 * 60 * 60 * 1000));
                dias++;
                return diasAteSabado(amanha);
            };
        };

        return diasAteSabado;
    };

    const diasPrazo = {
        hoje: 0,
        amanha: 1,
        semana: calcDiasAteSabado()(),
    };

    const hoje = new Date().getTime();
    const hojeIso = new Date(hoje).toISOString();
    const prazo = new Date(hoje + (diasPrazo[valorPrazo] * 24 * 60 * 60 * 1000)).toISOString();


    if (!valorTarefa) {
        inputTarefa.style.borderColor = "var(--vermelho-main)"

        inputTarefa.focus;

        inputTarefa.value = "";
        inputProjeto.value = "";

        setTimeout(() => inputTarefa.style.borderColor = "var(--detalhe-secundario)", 2000);

        return;
    };

    tarefas.push({
        id: proxId,
        descricao: valorTarefa,
        projeto: valorProjeto,
        dataCriacao: hojeIso,
        dataPrazo: prazo,
        completa: false,
        abandonada: false,
    });

    inputTarefa.value = "";
    inputProjeto.value = "";
    inputPrazo[0].checked = true;

    init();
};

const handleModeSwitch = function (isDarkMode = false) {
    const esquemaDeCores = isDarkMode ? coresDarkMode : coresLightMode;
    
    for(const [nome, valor] of Object.entries(esquemaDeCores)) document.documentElement.style.setProperty(nome, valor);
};

const init = function () {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    localStorage.setItem("subtarefas", JSON.stringify(subtarefas));

    const tarefasObj = gerarTarefasPorPrazo(tarefas);
    renderizarTarefasPorPrazo(tarefasObj);
};

handleModeSwitch(true);
init();


//Event Handlers

containerTarefas.addEventListener("click", function (e) {
    const target = e.target;

    // handle task completion
    if (target.classList.contains("check-tarefa")) {
        if (adicionandoSubtarefa) return;

        const tarefa = target.closest(".tarefa") || target.closest(".tarefa-complexa");
        const tarefaId = +tarefa.dataset.id;
        const tarefaObj = tarefas.find(tarefa => tarefa.id === tarefaId);

        if (tarefa.classList.contains("tarefa")) {
            tarefaObj.completa = target.dataset.concluido = true;

            setTimeout(function () {
                tarefa.style.opacity = 0;
                setTimeout(function () {
                    init();
                }, 350);
            }, 500);
        };

        if (tarefa.classList.contains("tarefa-complexa")) {
            const tarefaChildClicada = target.closest(".tarefa-child");
            const subtarefaObj = subtarefas.find(subtarefa => subtarefa.id === tarefaId);
            const tarefaEl = tarefa.querySelector(".tarefa-parent");

            subtarefaObj.subtarefas[+tarefaChildClicada.dataset.index].completa = true;
            target.dataset.concluido = true;

            setTimeout(function () {
                tarefaChildClicada.style.opacity = 0;
                setTimeout(function () {
                    init();
                }, 350);
            }, 500);

            if (subtarefaObj.subtarefas.every(subtarefa => subtarefa.completa)) {
                tarefaObj.completa = true;
                tarefaEl.dataset.concluido = true;
                setTimeout(function () {
                    tarefa.style.opacity = 0;
                    setTimeout(function () {
                        init();
                    }, 350);
                }, 500);
            };
        };
    };

    //handle new subtask
    if (target.classList.contains("ph-plus-circle")) {
        const tarefaParent = target.closest(".tarefa-complexa") || target.closest(".tarefa");

        if (target.closest(".tarefa-complexa")) adicionarSubtarefa(tarefaParent);

        if (target.closest(".tarefa")) adicionarSubtarefa(tarefaParent);
    };
});

containerTarefasAbandonadas.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("ph")) {
        const hoje = new Date().toISOString();
        const tarefaId = +target.closest(".tarefa").dataset.id;
        const tarefaObj = tarefas.find(tarefa => tarefa.id === tarefaId);

        if (target.classList.contains("ph-arrow-clockwise")) {
            tarefaObj.abandonada = false;
            tarefaObj.dataPrazo = hoje;
        };

        if (target.classList.contains("ph-trash")) {
            tarefaObj.completa = true;
        };

        init();
    };
});

btnSubmitTarefa.addEventListener("click", function (e) {
    e.preventDefault();

    criarNovaTarefa();
});

btnMudarTema.addEventListener("click", function (e) {
    const botao = e.target.closest(".mode-switch") || e.target;
    const [lua, sol] = botao.children;

    darkMode = !darkMode;
    [lua.dataset.active, sol.dataset.active] = [sol.dataset.active, lua.dataset.active];
    handleModeSwitch(darkMode);
});

containerTarefas.addEventListener("dblclick", function (e) {
    const target = e.target;

    if (target.classList.contains("editavel")) {
        const parent = target.closest(".tarefa")?.querySelector(".check-tarefa") || target.closest(".tarefas-child-wrapper")?.previousElementSibling || target.closest(".tarefa-parent");

        const tarefaConcluida = parent.dataset.concluido;

        if (!editando) {
            if (target.classList.contains("projeto-texto")) {
                editando = true;
                textoEditado = target;
                antigoTextoGlobal = undefined;
                editarTexto(target);
            };
            if (target.classList.contains("descricao-texto") || target.classList.contains("descricao-texto-child") && tarefaConcluida === "false") {
                editando = true;
                textoEditado = target;
                antigoTextoGlobal = target.textContent;
                editarTexto(target);
            };
        };
    };
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Enter") {
        if (editando) {
            concluirEdicaoTexto(textoEditado);
            setTimeout(() => editando = false, 1);
        };

        if (adicionandoSubtarefa) {
            concluirAdicaoSubtarefa(parentTarefaAdicionada);
            setTimeout(() => adicionandoSubtarefa = false, 1);
        };
    };

    if (e.key === "Enter" && !adicionandoSubtarefa && !editando) {
        criarNovaTarefa();
    };
});

window.addEventListener("click", function (e) {
    if (!(e.target.classList.contains("editavel")) && editando) {
        concluirEdicaoTexto(textoEditado);
        editando = false;
    };

    if (!e.target.classList.contains("adicionar-subtarefa") && !e.target.classList.contains("ph-plus-circle") && adicionandoSubtarefa) {
        concluirAdicaoSubtarefa(parentTarefaAdicionada);
        adicionandoSubtarefa = false;
    };
});
