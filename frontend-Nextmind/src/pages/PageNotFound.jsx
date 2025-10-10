import ChatHeader from "../components/ChatHeader";
import "./PageNotFound.css";

export default function PageNotFound() {
	const goHome = () => {
		window.location.href = "/";
	};

	const goNewHole = () => {
		window.location.href = "/#/hole/new"; // asumiendo que creás uno al entrar
	};

	return (
		<div className="page-404">
			<ChatHeader />
			<div className="content">
				<div className="card">
					<h1>404</h1>
					<p>Ups, no encontramos lo que buscabas.</p>
					<p>Probá volver al inicio o iniciar un nuevo chat.</p>

					<div className="actions">
						<button className="button" onClick={goHome}>Volver al inicio</button>
						<button className="button secondary" onClick={goNewHole}>Nuevo chat</button>
					</div>
				</div>
			</div>
		</div>
	);
}
