// 
//
//
const url = "https://integrador-web-feqi.onrender.com";

export function convertData(data){
    data = new Date(data);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

export async function logout() {
    localStorage.removeItem("token");
    return true;
}

export async function getTeste() {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/ajuda`, init);
    console.log(response);
    if(response.status === 200) return response;
    return false;
}

export async function getTeste2() {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/ajuda`, init);
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

export async function getUsuario(id) {
    const token = localStorage.getItem("token");
    const init = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
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
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/usuario?page=${page}&count=${count}`, init);
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
        headers: [
            [ "Authorization", `Bearer ${token}`],
            [ "Content-Type", "application/json"]
        ],
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/usuario`, init);
    return await response.json();
}

export async function patchUsuario(id, dados) {
    const token = localStorage.getItem("token");
    const init = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [
            [ "Authorization", `Bearer ${token}`],
            [ "Content-Type", "application/json"]
        ],
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
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/usuario/${id}`, init);
    return await response.json();
}