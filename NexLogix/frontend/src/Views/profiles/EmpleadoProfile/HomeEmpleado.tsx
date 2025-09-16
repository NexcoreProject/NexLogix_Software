// src/components/HomeManager.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileController } from '../../../Controllers/Users/UserController';
import { UserProfile } from '../../../models/Interfaces/UserProfile';
import axios from 'axios';
import './../../Styles/Home/HomeStyle.css';

const HomeEmpleado = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

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
            navigate('/login');
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {error && (
        <div className="alert alert-danger text-center fw-bold">{error}</div>
      )}
      {profile ? (
        <div className="card shadow-lg mx-auto border-0 rounded-4" style={{ maxWidth: '800px' }}>
          <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
            <h2 className="mb-0">
              Bienvenid@ a <strong>NEXLOGIX</strong>
            </h2>
          </div>
          <div className="card-body px-5 py-4 bg-light rounded-bottom-4">
            <h5 className="mb-4 text-primary">Información del EMPLEADO</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>ID usuario:</strong> {profile.ID}
              </li>
              <li className="list-group-item">
                <strong>Cédula de Ciudadanía:</strong> {profile.documentoIdentidad}
              </li>
              <li className="list-group-item">
                <strong>Nombre completo:</strong> {profile.nombreCompleto}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {profile.email}
              </li>
              <li className="list-group-item">
                <strong>Teléfono:</strong> {profile.numContacto}
              </li>
              <li className="list-group-item">
                <strong>Dirección:</strong> {profile.direccionResidencia}
              </li>
              <li className="list-group-item">
                <strong>Fecha de Creación:</strong>{' '}
                {new Date(profile.fechaCreacion).toLocaleDateString()}
              </li>
              <li className="list-group-item">
                <strong>Role:</strong> {profile.Role?.nombreRole}
                <div>
                  <strong>Descripción:</strong> {profile.Role?.descripcionRole}
                </div>
                <div>
                  <strong>Fecha Asignación:</strong>{' '}
                  {profile.Role?.fechaAsignacionDelRole}
                </div>
              </li>
              <li className="list-group-item">
                <strong>Puesto: </strong> {profile.Puesto?.nombrePuesto}
                <div>
                  <strong>Descripción:</strong> {profile.Puesto?.descripcionPuesto}
                </div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        !error && (
          <h1 className="text-center text-primary mt-5">Bienvenido a NexLogix Manager</h1>
        )
      )}
    </div>
  );
};

export default HomeEmpleado;