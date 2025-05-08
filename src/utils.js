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
	id:        null,
	nome:      null,
    descricao: null,
    cpf:       null,
    telefone:  null,
    email:     null,
}

export const Cliente = {
	id: null,
    idVendedor:   null,

    nomePessoa:   null,
    nomeEmpresa:  null,
    nomeFantasia: null,
    descricao:    null,
    tipo:         "pessoaFisica",
    cpfCnpj:      null,
    telefone:     null,
    email:        null,
    cep:          null,
    rua:          null,
    numero:       null,
    complemento:  null,
    bairro:       null,
    cidade:       null,
    estado:       null,

    vendedor: Vendedor
}

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

























