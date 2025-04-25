export default function List() {
    return (<></>)
}    

// import { useEffect, useState } from "react";
// import { ComentarioGetDto, getComentario } from "../requests";
// import { Link } from "react-router-dom";

// export default function List() {
//     const [ comentario, setComentario ] = useState();

//     let page = 0; 
//     useEffect(() => {
//         getComentario(page, 50).then((value)=> {
//             setComentario(value);
//         });
//     }, []);
    
//     if (comentario == undefined) return;

//     return comentario?.map((com, index) => (
//         <Link to={`/comentario/${com.id}`}>
//             <ComentarioItem
//                 key={index}
//                 usuario={com.usuario?.nome}
//                 nome={com.usuario?.nome}
//                 texto={com.corpo}
//                 data={com.data}
//             />
//         </Link>
//     ))
// }

// export function ComentarioItem({ usuario, nome, texto, data }) {
//     return (
//         <div className="flex space-x-3 p-4 border-b border-gray-200">
//             {/* <div className="bg-gray-300 h-10 w-10 rounded-full flex-shrink-0"></div> */}
//             <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                     <span className="font-semibold text-sm">{`${nome} (${usuario})`}</span>
//                     <span className="text-xs text-gray-500">{data ? convertData(data) : ""}</span>
//                 </div>
//                 <p className="text-sm mt-1 whitespace-pre-line">{texto}</p>
//             </div>
//         </div>
//     );
// };