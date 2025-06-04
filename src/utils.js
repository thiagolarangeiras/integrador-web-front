export const UsuarioCargo = [
    "adm",
    "funcionario",
    "vendedor",
]

export const Usuario = {
    id:       null,
    username: null,
    email:    null,
    password: null,
    cargo:    null
}

export const Marca = {
    id: null,
    nome: null,
}

export const Fornecedor = {
    id:       null,
    nome:     null,
    cpfCnpj:  null,
    endereco: null,
    telefone: null,
    email:    null,
}

export const Produto = {
    idFornecedor: null,
    idMarca: null,
    nome: null,
    descricao: null,
    valorCompra: null,
    valorVenda: null,
    qtEstoque: null,

    marca: Marca,
    fornecedor: Fornecedor,
}

export const Vendedor = {
    id: null,
    nome: null,
    descricao: null,
    cpf: null,
    telefone: null,
    email: null,
}

export const Cliente = {
	id: null,
    idVendedor: null,

    nomePessoa: null,
    nomeEmpresa: null,
    nomeFantasia: null,
    descricao: null,
    tipo: "pessoaFisica",
    cpfCnpj: null,
    telefone: null,
    email: null,
    cep: null,
    rua: null,
    numero: null,
    complemento: null,
    bairro: null,
    cidade: null,
    estado: null,

    vendedor: Vendedor
}

export const StatusPagamento = [
    "NaoPago",
    "Pago",
];

export const StatusEntrega = [
    "Pendente",
    "EmTransporte",
    "Entregue",
];

export const StatusPedido = [
    "Pendente",
    "Aprovado",
    "EmTransporte",
    "Entregue",
    "Cancelado",
    "Devolvido",
];

export const StatusParcela = [
    "Pendente",
    "Paga",
    "Atrassada",
    "Renegociada",
    "Cancelada",
];

export const PedidoSaida = {
	id: null,
	idCliente: null,
	idVendedor: null,
	dataCriacao: null,
	dataVigencia: null,
	dataEntregaPrevista: null,
	dataEntregaReal: null,
	status: null,
	statusEntrega: null,
	statusPagamento: null,
	valorTotal: null,
	valorFrete: null,

	cliente: Cliente,
	vendedor: Vendedor,
};

export const PedidoSaidaProduto = {
	id: null,
	idPedidoSaida: null,
	idProduto: null,
	qtde: null,
	valorUnitario: null,
	valorTotal: null,

	produto: Produto,
};

export const PedidoSaidaParcela = {
	id: null,
    idPedidoSaida: null,
    valor: null,
    dataVencimento: null,
    status: null,
};

export const PedidoEntrada = {
	id: null,
	idFornecedor: null,
	dataCriacao: null,
	dataVigencia: null,
	dataEntregaPrevista: null,
	dataEntregaReal: null,
	status: null,
	statusEntrega: null,
	statusPagamento: null,
	valorTotal: null,
	valorFrete: null,
	fornecedor: Fornecedor,
};

export const PedidoEntradaProduto = {
	id: null,
	idPedidoEntrada: null,
	idProduto: null,
	qtde: null,
	valorUnitario: null,
	valorTotal: null,
	produto: Produto,
};

export const PedidoEntradaParcela = {
	id: null,
    idPedidoEntrada: null,
    valor: null,
    dataVencimento: null,
    status: null,
};

export const EstadosBr = [
    "SC",
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SP",
    "SE",
    "TO",
]

export async function handleInputChange(e, setItem) {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
};

export function aplicarMascaraTelefone(e, setItem) {
    const name = e.target.name;
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;

    if (value.length > 10) {
        formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
        formattedValue = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        formattedValue = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) {
        formattedValue = value.replace(/^(\d{0,2}).*/, '($1');
    }

    setItem(prev => ({
        ...prev,
        [name]: formattedValue
    }));
};

export function aplicarMascaraDocumento(e, setItem, tipo) {
    const name = e.target.name;
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;

    if (tipo === "pessoaFisica") {
        if (value.length <= 11) {
            formattedValue = value.replace(/(\d{3})(\d)/, '$1.$2');
            formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
            formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
    } else {
        if (value.length <= 14) {
            formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
            formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
            formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
        }
    }
    setItem(prev => ({
        ...prev,
        [name]: formattedValue
    }));
};


export function aplicarMascaraCEP(e, setItem) {
    const name = e.target.name;
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');

    setItem(prev => ({
        ...prev,
        [name]: formattedValue
    }));
};

export function aplicarMascaraData(e, setValue) {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '');

    // Aplica a máscara: DD/MM/AAAA
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;

    setValue(`${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`);
};

export function aplicarMascaraDinheiro(e, setValue) {
    const value = e.target.value;
    const name = e.target.name;
    const digits = value.replace(/\D/g, '');

    // Converte para número e divide por 100 para centavos
    const number = parseFloat(digits) / 100;

    // Formata como moeda BRL
    const result = number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    setValue(prev => ({
        ...prev,
        [name]: result
    }));
};