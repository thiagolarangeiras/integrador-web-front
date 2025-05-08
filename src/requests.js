const url = "http://localhost:8080";

export function convertData(data){
    data = new Date(data);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

function getInit(method, token){
    let init = {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    return init;
}


// ["Access-Control-Allow-Origin", "http://localhost:5173"],
// ["Access-Control-Allow-Credentials", "true"]

//Login

export async function getTeste() {
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(`${url}/teste`, init);
    if(response.status === 200) return true;
    return false;
}

export async function getTesteLogin() {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    const response = await fetch(`${url}/teste/login`, init);
    if(response.status === 200) return true;
    return false;
}

export async function postLogin(dados) {
    const init = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/auth/login`, init);
    const result = await response.json();
    localStorage.setItem("token", result.token);
    return result;
}

export async function logout() {
    localStorage.removeItem("token");
    return true;
}

// Tentativa de padrao
export const callTypes = {
    vendedor: "vendedor",
    usuario: "usuario",
    produto: "produto",
    pedidoSaidaParcela: "pedido-saida-parcela",
    pedidoEntrada: "pedido-entrada",
    pedidoEntradaProduto: "pedido-entrada-produto",
    pedidoEntradaParcela: "pedido-entrada-parcela",
    cliente: "cliente",
}

export async function get(type, id) {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/${type}/${id}`, init);
    return await response.json();
}

export async function getLista(type, page, count= 50) {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/${type}?page=${page}&count=${count}`, init);
    return await response.json();
}

export async function post(type, dados) {
    const token = localStorage.getItem("token");
    const init = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/${type}`, init);
    return await response.json();
}

export async function patch(type, id, dados) {
    const token = localStorage.getItem("token");
    const init = {
        method: "PATCH",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/${type}/${id}`, init);
    return await response.json();
}

export async function deleteCall(type, id) {
    const token = localStorage.getItem("token");
    const init = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/${type}/${id}`, init);
    if(response.status === 200) return true;
    return false;
}

//Usuarios
export async function getUsuario(id) {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/usuario/${id}`, init);
    return await response.json();
}

export async function getUsuarioLista(page, count) {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/usuario?page=${page}&count=${count}`, init);
    if(response.status != 200) return null;
    return await response.json();
}

export async function postUsuario(dados) {
    const token = localStorage.getItem("token");
    const init = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/usuario`, init);
    return await response.json();
}

export async function patchUsuario(id, dados) {
    const token = localStorage.getItem("token");
    const init = {
        method: "PATCH",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/usuario/${id}`, init);
    return await response.json();
}

export async function deleteUsuario(id) {
    const token = localStorage.getItem("token");
    const init = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(`${url}/usuario/${id}`, init);
    if(response.status === 200) return true;
    return false;
}

//Marca
export async function getMarca(id) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/marca/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getMarcaLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/marca?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getMarcaListaNome(name, page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/marca?page=${page}&count=${count}&nome=${name}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postMarca(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/marca`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchMarca(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/marca/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deleteMarca(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/marca/${id}`, init);
    if (response.status != 200) return false;
    return true;
}

//Produtos
export async function getProduto(id) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/produto/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getProdutoLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/produto?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postProduto(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/produto`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchProduto(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/produto/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deleteProduto(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/produto/${id}`, init);
    if (response.status != 200) return false;
    return true;
}

//Fornecedor
export async function getFornecedor(id) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/fornecedor/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getFornecedorLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/fornecedor?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getFornecedorListaNome(name, page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/fornecedor?page=${page}&count=${count}&nome=${name}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postFornecedor(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/fornecedor`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchFornecedor(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/fornecedor/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deleteFornecedor(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/fornecedor/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

//Clientes
export async function getClienteLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/cliente?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getClienteListaNome(name, page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/cliente?page=${page}&count=${count}&name=${name}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postCliente(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/cliente`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchCliente(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/cliente/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deleteCliente(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/cliente/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

//Vendedores
export async function getVendedorLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/vendedor?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getVendedorListaNome(name, page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/vendedor?page=${page}&count=${count}&name=${name}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postVendedor(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/vendedor`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchVendedor(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/vendedor/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deleteVendedor(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/vendedor/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

//Pedido Saida
export async function getPedidoSaida(id) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/pedido-saida/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getPedidoSaidaLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/pedido-saida?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postPedidoSaida(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/pedido-saida`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchPedidoSaida(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/pedido-saida/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deletePedidoSaida(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/pedido-saida/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

// Pedido Saida Produto
export async function getPedidoSaidaProduto(id) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/pedido-saida-produto/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function getPedidoSaidaProdutoLista(page, count=50) {
    const token = localStorage.getItem("token");
    let init = getInit("GET", token);
    const response = await fetch(`${url}/pedido-saida-produto?page=${page}&count=${count}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function postPedidoSaidaProduto(dados) {
    const token = localStorage.getItem("token");
    let init = getInit("POST", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/pedido-saida-produto`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function patchPedidoSaidaProduto(id, dados) {
    const token = localStorage.getItem("token");
    let init = getInit("PATCH", token);
    init.body = JSON.stringify(dados);
    const response = await fetch(`${url}/pedido-saida-produto/${id}`, init);
    if (response.status != 200) return null;
    return await response.json();
}

export async function deletePedidoSaidaProduto(id) {
    const token = localStorage.getItem("token");
    let init = getInit("DELETE", token);
    const response = await fetch(`${url}/pedido-saida-produto/${id}`, init);
    if (response.status != 200) return false;
    return true;
}