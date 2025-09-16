import "../../Styles/Footers/infoPages.css";

const EstamosUbicadosEn = () => {
    return (
      <div className="container my-5 info-section">
        <h2 className="text-center mb-3 info-title">Estamos ubicados en:</h2>
        <p className="text-center info-subtitle">Av Cra 30 #17-28, Bogotá</p>
        
        <div className="map-wrapper">
          <iframe
            title="Ubicación Bogotá"
            src="https://www.google.com/maps?q=Ave+Cra+30+%2317-28,+Bogotá&output=embed"
            className="map-embed"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    );
  };
  
  export default EstamosUbicadosEn;
  