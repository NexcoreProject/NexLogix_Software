import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileController } from '../../../Controllers/Users/UserController';
import { UserProfile } from '../../../models/Interfaces/UserProfile';
import axios from 'axios';
import './../../Styles/Home/HomeStyle.css';

const HomeManager = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Utilidad visual: iniciales del usuario (solo UI)
  const getInitials = (name?: string) => {
    if (!name) return 'NM';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        const response = await UserProfileController();
        console.log('Response:', response.data);
        if (response.data.success) {
          setProfile(response.data.Data);
        } else {
          setError('No se pudo cargar el perfil');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const message = err.response?.data?.message || 'No se pudo cargar el perfil';
          console.error('Error response:', err.response?.data);
          console.error('Status:', status);
          setError(`Error ${status}: ${message}`);
          if (status === 401) {
            navigate('/');
          }
        } else {
          setError('Error desconocido al cargar el perfil');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!profile && !error) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" style={{ width: 60, height: 60 }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="loading-message">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home_manager_container">
      <div className="container pt-0" style={{ paddingTop: 0, marginTop: 0 }}>
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 animate__animated animate__fadeIn" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {profile ? (
          <div className="animate__animated animate__fadeInUp">
            {/* Hero superior */}
            <section className="home-hero">
              <h1 className="hero-title">
                Le damos la bienvenida a <span className="brand-accent">NEXLOGIX</span>
              </h1>
              <p className="hero-subtitle">Tu solución integral para logística</p>
            </section>

            {/* Resumen de perfil */}
            <section className="profile-card glass-card">
              <div className="avatar" aria-hidden="true">{getInitials(profile?.nombreCompleto)}</div>
              <div className="profile-main">
                <h2 className="profile-name">{profile?.nombreCompleto}</h2>
                <p className="profile-email">{profile?.email}</p>
                <div className="kpi-chips">
                  <span className="chip">
                    <i className="bi bi-hash me-1"></i>ID {profile?.ID}
                  </span>
                  {profile?.Role?.nombreRole && (
                    <span className="chip">
                      <i className="bi bi-shield-lock me-1"></i>{profile.Role.nombreRole}
                    </span>
                  )}
                  {profile?.Puesto?.nombrePuesto && (
                    <span className="chip">
                      <i className="bi bi-briefcase me-1"></i>{profile.Puesto.nombrePuesto}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Información detallada */}
            <section className="section-block">
              <h3 className="section-title">Información del empleado</h3>
              <div className="info-grid">
                <div className="info-tile">
                  <div className="info-icon bg1"><i className="bi bi-person-badge"></i></div>
                  <div className="info-meta">
                    <span className="label">Documento</span>
                    <span className="value">{profile.documentoIdentidad}</span>
                  </div>
                </div>

                <div className="info-tile">
                  <div className="info-icon bg2"><i className="bi bi-telephone"></i></div>
                  <div className="info-meta">
                    <span className="label">Teléfono</span>
                    <span className="value">{profile.numContacto}</span>
                  </div>
                </div>

                <div className="info-tile">
                  <div className="info-icon bg3"><i className="bi bi-geo-alt"></i></div>
                  <div className="info-meta">
                    <span className="label">Dirección</span>
                    <span className="value">{profile.direccionResidencia}</span>
                  </div>
                </div>

                <div className="info-tile">
                  <div className="info-icon bg4"><i className="bi bi-calendar3"></i></div>
                  <div className="info-meta">
                    <span className="label">Creación de cuenta</span>
                    <span className="value">{new Date(profile.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section-block">
              <h3 className="section-title">Rol y puesto</h3>
              <div className="info-grid two-cols">
                <div className="info-panel glass-card">
                  <div className="panel-header"><i className="bi bi-shield-check me-2"></i>Rol asignado</div>
                  <div className="panel-body">
                    <div className="row-item"><span>Rol</span><strong>{profile.Role?.nombreRole || '—'}</strong></div>
                    <div className="row-item"><span>Descripción</span><span className="muted">{profile.Role?.descripcionRole || '—'}</span></div>
                    <div className="row-item"><span>Fecha asignación</span><span>{profile.Role?.fechaAsignacionDelRole || '—'}</span></div>
                  </div>
                </div>
                <div className="info-panel glass-card">
                  <div className="panel-header"><i className="bi bi-briefcase me-2"></i>Puesto</div>
                  <div className="panel-body">
                    <div className="row-item"><span>Puesto</span><strong>{profile.Puesto?.nombrePuesto || '—'}</strong></div>
                    <div className="row-item"><span>Descripción</span><span className="muted">{profile.Puesto?.descripcionPuesto || '—'}</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Nota de pie retirada por solicitud */}
          </div>
        ) : (
          !error && (
            <div className="welcome-text">
              <h1 className="display-5 fw-bold text-primary">Bienvenido a <span className="text-warning">NexLogix Manager</span></h1>
              <p className="lead text-muted">Gestiona tu logística con eficiencia y precisión</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomeManager;