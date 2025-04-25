import { useEffect, useState } from "react";
import { getTeste } from "../requests";

export default function Teste() {
    const [ texto, setTexto ] = useState("");

    let page = 0; 
    useEffect(() => {
        getTeste().then((value)=> {
            setTexto(value);
        });
    }, []);
    

    return (
        <h1>{texto}</h1>
    );
}