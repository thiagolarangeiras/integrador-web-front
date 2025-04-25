import { useState, useEffect } from 'react';
import { getUsuarioLista } from '../requests';

const usuarioStruct = {
	id: 0,
	username: "",
	email: "",
	password: "",
	cargo: [""]
}

export default function Usuarios() {
	const [usuarios, setUsuarios] = useState();


	useEffect(() => {
		getUsuarioLista(0, 50).then((value) => {
			setUsuarios(value);
		})
	}, []);

	return (
		usuarios?.map(usuario => (
			<h1>EEEEEEEEEEEEEEEEEEEEEE : {usuario.username}</h1>
		))
	);
}
