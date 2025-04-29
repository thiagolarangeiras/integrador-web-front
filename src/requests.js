const url = "https://web.larangeira.site";

export function convertData(data){
    data = new Date(data);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
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
    pedidoSaida: "pedido-saida",
    pedidoSaidaProduto: "pedido-saida-produto",
    pedidoSaidaParcela: "pedido-saida-parcela",
    pedidoEntrada: "pedido-entrada",
    pedidoEntradaProduto: "pedido-entrada-produto",
    pedidoEntradaParcela: "pedido-entrada-parcela",
    marca: "marca",
    fornecedor: "fornecedor",
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
export async function getMarcaLista(page) {
    return getLista(callTypes.marca, page);
}

export async function postMarca(dados) {
    return post(callTypes.marca, dados);
}

export async function patchMarca(id, dados) {
    return patch(callTypes.marca, id, dados);
}

export async function deleteMarca(id) {
    return deleteCall(callTypes.marca, id);
}

//Produtos
export async function getProdutoLista(page) {
    return getLista(callTypes.produto, page);
}

export async function postProduto(dados) {
    return post(callTypes.produto, dados);
}

export async function patchProduto(id, dados) {
    return patch(callTypes.produto, id, dados);
}

export async function deleteProduto(id) {
    return deleteCall(callTypes.produto, id);
}