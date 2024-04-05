"use scrict";

export const tarefas = [
    {
        id: 1,
        descricao: "Estudar para o Exame de Matemática",
        projeto: "Estudos",
        dataCriacao: "2024-03-31T08:00:00Z",
        dataPrazo: "2024-03-31T08:00:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 2,
        descricao: "Preparar Relatório de Vendas Trimestral",
        projeto: "Vendas",
        dataCriacao: "2024-03-31T10:30:00Z",
        dataPrazo: "2024-03-31T10:30:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 3,
        descricao: "Marcar Reunião com Cliente X",
        projeto: "Cliente X",
        dataCriacao: "2024-03-31T13:45:00Z",
        dataPrazo: "2024-03-31T13:45:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 4,
        descricao: "Comprar Mantimentos",
        projeto: "Casa",
        dataCriacao: "2024-03-31T16:00:00Z",
        dataPrazo: "2024-03-31T16:00:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 5,
        descricao: "Atualizar Documentação do Projeto Y",
        projeto: "Projeto Y",
        dataCriacao: "2024-03-31T09:15:00Z",
        dataPrazo: "2024-04-01T09:15:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 6,
        descricao: "Enviar Convites para a Festa de Aniversário",
        projeto: "Social",
        dataCriacao: "2024-03-31T14:20:00Z",
        dataPrazo: "2024-04-01T14:20:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 7,
        descricao: "Revisar Contrato de Parceria",
        projeto: "Parcerias",
        dataCriacao: "2024-03-31T11:00:00Z",
        dataPrazo: "2024-04-01T11:00:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 8,
        descricao: "Agendar Manutenção do Veículo",
        projeto: "Carro",
        dataCriacao: "2024-03-31T12:40:00Z",
        dataPrazo: "2024-04-01T12:40:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 9,
        descricao: "Ler o Novo Livro de Ficção",
        projeto: "Lazer",
        dataCriacao: "2024-03-31T17:30:00Z",
        dataPrazo: "2024-03-09T17:30:00Z",
        completa: false,
        abandonada: false
    },
    {
        id: 10,
        descricao: "Registrar Despesas do Mês",
        projeto: "Finanças",
        dataCriacao: "2024-03-31T08:45:00Z",
        dataPrazo: "2024-04-05T08:45:00Z",
        completa: false,
        abandonada: false
    }
];

export const subtarefas = [
    {
        id: 1,
        subtarefas: [
            {
                descricao: "Estudar Álgebra Linear",
                completa: false
            },
            {
                descricao: "Resolver Exercícios de Cálculo",
                completa: false
            },
            {
                descricao: "Revisar Teoremas de Geometria",
                completa: false
            },
        ],
    },
    {
        id: 6,
        subtarefas: [
            {
                descricao: "Escolher Design de Convites",
                completa: false
            },
            {
                descricao: "Enviar Convites por E-mail",
                completa: false
            },
            {
                descricao: "Confirmar Presença dos Convidados",
                completa: false
            }
        ],
    },
    {
        id: 8,
        subtarefas: [
            {
                descricao: "Agendar Horário na Oficina",
                completa: false
            },
            {
                descricao: "Levar o Veículo para Manutenção",
                completa: false
            },
        ],
    },
    {
        id: 9,
        subtarefas: [
            {
                descricao: "Encontrar um Local Confortável",
                completa: true
            },
            {
                descricao: "Preparar uma Bebida Quente",
                completa: false
            },
            {
                descricao: "Escolher um Livro Interessante",
                completa: false
            },
        ],
    },
];
