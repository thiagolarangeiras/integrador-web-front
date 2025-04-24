// const init: RequestInit = {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, *cors, same-origin
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//         "Content-Type": "application/json",
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: "follow", // manual, *follow, error
//     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
// };
const url = "http://localhost:8080";

export function convertData(data: Date): string{
    data = new Date(data);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

export async function logout(): Promise<boolean> {
    localStorage.removeItem("token");
    return true;
}

export async function getTeste(): Promise<boolean> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/teste`, init);
    if(response.status === 200) return true;
    return false;
}

//Users
export type UsuarioGetDto = {
    id: number;
    nome: string;
    email: string;
}

export type UsuarioPostDto = {
    nome: string;
    email: string;
    senha: string;
}

export type UsuarioLoginDto = {
    nome: string;
    senha: string;
}

export type LoginDto = {
    token: string;
}

export async function postSign(dados: UsuarioPostDto): Promise<UsuarioGetDto>{
    const init: RequestInit = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(dados),
    };
    const response = await fetch(`${url}/auth/signin`, init);
    return await response.json();
}

export async function postLogin(dados: UsuarioLoginDto): Promise<LoginDto> {
    const init: RequestInit = {
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
    const result: LoginDto = await response.json();
    localStorage.setItem("token", result.token);
    return result;
}


//Forum
export type ForumGetDto = {
    id: number;
    nome: string;
    descricao: string;
}

export type ForumPostDto = {
    nome: string;
    descricao: string;
}

export async function getForumDetails(id: number): Promise<ForumGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/forum/${id}`, init);
    return await response.json();
}

export async function getForumFiltered(search: string, page: number, count: number): Promise<ForumGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/forum?search=${search}&page=${page}&count=${count}`, init);
    return await response.json();
}

export async function getForum(page: number, count: number): Promise<ForumGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/forum?page=${page}&count=${count}`, init);
    return await response.json();
}

export async function postForum(dados: ForumPostDto): Promise<ForumGetDto>{
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/forum`, init);
    return await response.json();
}

export async function putForum(id: number, dados: ForumPostDto): Promise<ForumGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/forum/${id}`, init);
    return await response.json();
}

export async function deleteForum(id: number): Promise<ForumGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/forum/${id}`, init);
    return await response.json();
}

// Topicos
export type TopicoGetDto = {
    id: number;
    idUsuario: number;
    idForum: number;
    titulo: string;
    corpo: string;
    data: Date;
    usuario?: UsuarioGetDto
}

export type TopicoPostDto = {
    idForum: number;
    titulo: string;
    corpo: string;
}

export type TopicoPutDto = {
    titulo: string;
    corpo: string;
}

export async function getTopicoDetails(id: number): Promise<TopicoGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/topico/${id}`, init);
    return await response.json();
}

export async function getTopicoByForum(idForum: number, page: number, count: number): Promise<TopicoGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/topico?id-forum=${idForum}&page=${page}&count=${count}`, init);
    return await response.json();
}

export async function getTopico(page: number, count: number): Promise<TopicoGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/topico?page=${page}&count=${count}`, init);
    return await response.json();
}

export async function postTopico(dados: TopicoPostDto): Promise<TopicoGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/topico`, init);
    return await response.json();
}

export async function putTopico(id: number, dados: TopicoPutDto): Promise<TopicoGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/topico/${id}`, init);
    return await response.json();
}

export async function deleteTopico(id: number): Promise<TopicoGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/topico/${id}`, init);
    return await response.json();
}


//Comentarios
export type ComentarioGetDto = {
    id: number;
    idUsuario: number;
    idTopico: number;
    idComentarioPai: number;
    corpo: string;
    data: Date;
    usuario?: UsuarioGetDto;
    topico?: TopicoGetDto;
    comentarioPai?: ComentarioGetDto;
    comentariosFilhos?: ComentarioGetDto[];
}

export type ComentarioPostDto = {
    idTopico?: number;
    idComentarioPai?: number;
    corpo?: string;
}

export type ComentarioPutDto = {
    corpo: string;
}

export async function getComentarioDetails(id: number): Promise<ComentarioGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/comentario/${id}`, init);
    return await response.json();
}

export async function getComentarioPorTopico(idTopico: number, page: number, count: number): Promise<ComentarioGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/comentario?id-topico=${idTopico}&page=${page}&count=${count}`, init);
    return await response.json();
}

export async function getComentarioPorComentario(idComentario: number, page: number, count: number): Promise<ComentarioGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/comentario?id-comentario=${idComentario}&page=${page}&count=${count}`, init);
    return await response.json();
}

export async function getComentario(page: number, count: number): Promise<ComentarioGetDto[]> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/comentario?page=${page}&count=${count}`, init);
    return await response.json();
}

export async function postComentario(dados: ComentarioPostDto): Promise<ComentarioGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/comentario`, init);
    return await response.json();
}

export async function putComentario(id: number, dados: ComentarioPutDto): Promise<ComentarioGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
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
    const response = await fetch(`${url}/comentario/${id}`, init);
    return await response.json();
}

export async function deleteComentario(id: number): Promise<TopicoGetDto> {
    const token = localStorage.getItem("token");
    const init: RequestInit = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        headers: [["Authorization", `Bearer ${token}`]],
    };
    const response = await fetch(`${url}/comentario/${id}`, init);
    return await response.json();
}