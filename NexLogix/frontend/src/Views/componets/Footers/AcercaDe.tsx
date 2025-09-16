import "../../Styles/Footers/infoPages.css";

const AcercaDe = () => {
    return (
        <>
            <div className="container py-5 info-section">
                <h1 className="text-center mt-4 mb-4 info-title">Acerca de NexLogix</h1>
                <div className="info-card p-4 p-md-5">
                    <p className="mb-0" style={{ color: "#d9d9e6" }}>
                        Somos una empresa dedicada a la logística y envíos a nivel nacional. Nuestro objetivo es brindar un
                        servicio rápido, seguro y eficiente para satisfacer las necesidades de nuestros clientes. Contamos con
                        un equipo profesional comprometido y tecnología de punta que nos permite optimizar cada etapa del proceso logístico.

                        <br /><br />
                        Este proyecto ha sido desarrollado especialmente para empresas del sector de transporte y logística, 
                        con el fin de facilitar la gestión de envíos, rutas, pagos y trazabilidad de paquetes en tiempo real. 
                        Nuestra plataforma está diseñada pensando en la eficiencia operativa, automatizando procesos clave 
                        y permitiendo un mayor control tanto para administradores como para empleados en campo.

                        <br /><br />
                        A través de esta solución, buscamos impactar positivamente en áreas como el manejo de inventario, 
                        la planificación de entregas, la atención al cliente y la supervisión del personal logístico. 
                        Nuestra misión es convertirnos en un aliado tecnológico estratégico para empresas que deseen modernizar 
                        sus procesos y alcanzar un mayor nivel de competitividad en la industria del transporte.

                        <br /><br />
                        Con una interfaz intuitiva, módulos personalizables y herramientas integradas de seguimiento, 
                        ofrecemos una solución integral lista para adaptarse a las necesidades específicas de cada organización. 
                        Porque entendemos que en logística, el tiempo es oro... y nosotros te ayudamos a optimizarlo.
                    </p>
                </div>
            </div>
        </>
    );
};

export default AcercaDe;