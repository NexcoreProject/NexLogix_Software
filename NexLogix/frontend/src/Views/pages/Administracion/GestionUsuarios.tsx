import React, { useState } from 'react';
import { useUsuariosController } from '../../../Controllers/Users/GestionUsuariosController';
import {
    IUsuario,
    ICreateUsuarioDTO,
    IUpdateUsuarioDTO
} from '../../../models/Interfaces/IGestionUsuarios';
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css';
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';

const GestionUsuarios: React.FC = () => {
    // Estados del controlador
    const {
        usuarios,
        roles,
        puestos,
        estados,
        isLoading,
        errorMessage,
        setErrorMessage,  // Añadir esto
        cargarUsuarios,
        buscarUsuario,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario
    } = useUsuariosController();

    // Estados locales para la UI
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUsuario | null>(null);
    
    // Estados del formulario
    const [formData, setFormData] = useState<ICreateUsuarioDTO>({
        documentoIdentidad: '',
        nombreCompleto: '',
        email: '',
        numContacto: '',
        direccionResidencia: '',
        contrasena: '',
        idestado: 0,
        idRole: 0,
        idPuestos: 0
    });

    // Manejar cambios en el formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Buscar usuario
    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            await cargarUsuarios();
        } else {
            await buscarUsuario(searchTerm.trim());
        }
    };

    // Resetear búsqueda
    const resetSearch = async () => {
        setSearchTerm('');
        await cargarUsuarios();
    };

    // Crear usuario
    const handleCreate = async () => {
        if (!formData.documentoIdentidad || !formData.nombreCompleto || !formData.email || 
            !formData.contrasena || !formData.idestado || !formData.idRole || !formData.idPuestos) {
            return;
        }
        const success = await crearUsuario(formData);
        if (success) {
            setShowCreateModal(false);
            setFormData({
                documentoIdentidad: '',
                nombreCompleto: '',
                email: '',
                numContacto: '',
                direccionResidencia: '',
                contrasena: '',
                idestado: 0,
                idRole: 0,
                idPuestos: 0
            });
        }
    };

    // Editar usuario
    const handleEdit = (usuario: IUsuario) => {
        setSelectedUser(usuario);
        setFormData({
            documentoIdentidad: usuario.documentoIdentidad,
            nombreCompleto: usuario.nombreCompleto,
            email: usuario.email,
            numContacto: usuario.numContacto || '',
            direccionResidencia: usuario.direccionResidencia || '',
            contrasena: '',
            idestado: usuario.estado.idestado,
            idRole: usuario.roles.idRole,
            idPuestos: usuario.puestos.idPuestos
        });
        setShowEditModal(true);
    };

    // Actualizar usuario
    const handleUpdate = async () => {
        if (!selectedUser || !formData.idestado || !formData.idRole || !formData.idPuestos) {
            return;
        }

        const updateData: IUpdateUsuarioDTO = {
            documentoIdentidad: formData.documentoIdentidad,
            nombreCompleto: formData.nombreCompleto,
            email: formData.email,
            numContacto: formData.numContacto,
            direccionResidencia: formData.direccionResidencia,
            idestado: formData.idestado,
            idRole: formData.idRole,
            idPuestos: formData.idPuestos
        };

        const success = await actualizarUsuario(selectedUser.idusuarios, updateData);
        if (success) {
            setShowEditModal(false);
            setSelectedUser(null);
        }
    };

    // Eliminar usuario
    const handleDelete = async () => {
        if (!selectedUser) return;
        const success = await eliminarUsuario(selectedUser.idusuarios);
        if (success) {
            setShowDeleteModal(false);
            setSelectedUser(null);
        }
    };

    // Preparar datos para la creación de un nuevo usuario
    const prepararCrearUsuario = async () => {
        setFormData({
            documentoIdentidad: '',
            nombreCompleto: '',
            email: '',
            numContacto: '',
            direccionResidencia: '',
            contrasena: '',
            idestado: 0,
            idRole: 0,
            idPuestos: 0
        });
    };

    return (
        <div className="areas_container">
            <div className="container mt-4">
                {/* Header */}
                <div className="header-azul mb-3">
                    <div className="d-flex align-items-center p-3">
                        <i className="bi bi-people-fill me-2" style={{ fontSize: 24 }} />
                        <h2 className="mb-0 text-white">Gestión de Usuarios</h2>
                    </div>
                </div>

                {/* Barra de búsqueda y botones */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-4 align-items-center">
                            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por ID, documento o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ minWidth: 0, borderRadius: '0.5rem' }}
                                    />
                                <div className="d-flex gap-2 ms-2">
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ minWidth: 140 }} 
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                    >
                                        Buscar
                                    </button>
                                    <button 
                                        className="btn btn-success" 
                                        style={{ minWidth: 140 }} 
                                        onClick={resetSearch}
                                        disabled={isLoading}
                                    >
                                        Mostrar todos
                                    </button>
                                    <button 
                                        className="btn btn-warning" 
                                        style={{ minWidth: 140, width: "100%" }} 
                                        onClick={async () => {
                                            await prepararCrearUsuario();
                                            setShowCreateModal(true);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Crear usuario
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Después de la barra de búsqueda */}
                        {errorMessage && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {errorMessage}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setErrorMessage('')} 
                                    aria-label="Close"
                                />
                            </div>
                        )}

                        {/* Loading state */}
                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            /* Tabla de usuarios */
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            
                                            <th>Documento</th>
                                            <th>Nombre Completo</th>
                                            <th>Email</th>
                                            <th>Contacto</th>
                                            <th>Direccion residencia</th>
                                            <th>Rol</th>
                                            <th>Estado Usuario</th>
                                            <th>Puesto</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.length > 0 ? (
                                            usuarios.map(usuario => (
                                                <tr key={usuario.idusuarios}>
                                                    <td>{usuario.documentoIdentidad}</td>
                                                    <td>{usuario.nombreCompleto}</td>
                                                    <td>{usuario.email}</td>
                                                    <td>{usuario.numContacto}</td>
                                                    <td>{usuario.direccionResidencia}</td>
                                                    <td>{usuario.roles.nombreRole}</td>
                                                    <td>
                                                        <span className={`badge bg-${
                                                            usuario.estado.estado === 'ACTIVO' ? 'success' :
                                                            usuario.estado.estado === 'INACTIVO' ? 'warning' :
                                                            'danger'
                                                        }`}>
                                                            {usuario.estado.estado}
                                                        </span>
                                                    </td>
                                                    <td>{usuario.puestos.nombrePuesto}</td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleEdit(usuario)}
                                                            >
                                                                <i className="bi bi-pencil" />
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => {
                                                                    setSelectedUser(usuario);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                            >
                                                                <i className="bi bi-trash" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="text-center">
                                                    No se encontraron usuarios
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Crear/Editar Usuario */}
                {(showCreateModal || showEditModal) && (
                    <div className="crear-conductor-modal-bg">
                        <div className="crear-conductor-modal" style={{ maxWidth: 800 }}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {showCreateModal ? 'Crear Usuario' : 'Editar Usuario'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setShowEditModal(false);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Documento de Identidad</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="documentoIdentidad"
                                            value={formData.documentoIdentidad}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombreCompleto"
                                            value={formData.nombreCompleto}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="numContacto"
                                            value={formData.numContacto}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Dirección</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="direccionResidencia"
                                            value={formData.direccionResidencia}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {showCreateModal && (
                                        <div className="col-md-6">
                                            <label className="form-label">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="contrasena"
                                                value={formData.contrasena}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <label className="form-label">Rol</label>
                                        <select
                                            className="form-select"
                                            name="idRole"
                                            value={formData.idRole}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {roles.map(rol => (
                                                <option key={rol.idRole} value={rol.idRole}>
                                                    {rol.nombreRole}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Puesto</label>
                                        <select
                                            className="form-select"
                                            name="idPuestos"
                                            value={formData.idPuestos}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {puestos.map(puesto => (
                                                <option key={puesto.idPuestos} value={puesto.idPuestos}>
                                                    {puesto.nombrePuesto}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Estado</label>
                                        <select
                                            className="form-select"
                                            name="idestado"
                                            value={formData.idestado}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {estados.map(estado => (
                                                <option key={estado.idestado} value={estado.idestado}>
                                                    {estado.estado}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setShowEditModal(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={showCreateModal ? handleCreate : handleUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Eliminar Usuario */}
                {showDeleteModal && selectedUser && (
                    <div className="crear-conductor-modal-bg">
                        <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro que desea eliminar al usuario {selectedUser.nombreCompleto}?</p>
                                <p className="text-danger">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionUsuarios;