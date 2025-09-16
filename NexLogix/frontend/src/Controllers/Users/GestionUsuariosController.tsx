import { useState, useEffect } from 'react';
import {
    IUsuario,
    IRol,
    IEstado,
    IPuesto,
    ICreateUsuarioDTO,
    IUpdateUsuarioDTO
} from '../../models/Interfaces/IGestionUsuarios';
import { gestionUsuariosUseCase } from '../../UseCases/Users/GestionUsuariosUseCase';

// Hook controlador de Gestión de Usuarios
// Centraliza estado/efectos para que la UI sólo consuma datos y acciones.
export const useUsuariosController = () => {
    // Estados principales de la lista y carga/errores
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Estados para catálogos
    const [roles, setRoles] = useState<IRol[]>([]);
    const [puestos, setPuestos] = useState<IPuesto[]>([]);
    const [estados, setEstados] = useState<IEstado[]>([]);

    // Cargar usuarios (lista completa)
    const cargarUsuarios = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await gestionUsuariosUseCase.getAllUsuarios();
            if (response.success) {
                setUsuarios(response.data);
            } else {
                setUsuarios([]);
                setErrorMessage(response.message || 'No se pudieron cargar los usuarios');
            }
        } catch {
            setUsuarios([]);
            setErrorMessage('Error inesperado al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    // Nota: Carga de catálogos se realiza en el init del useEffect inicial

    // Buscar usuario por identificador
    const buscarUsuario = async (value: string) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await gestionUsuariosUseCase.getUsuarioById(value);
            if (response.success) {
                setUsuarios([response.data]);
            } else {
                setErrorMessage(response.message || 'Usuario no encontrado');
                setUsuarios([]);
            }
        } catch {
            setErrorMessage('Error inesperado al buscar usuario');
            setUsuarios([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear usuario (devuelve true si todo ok)
    const crearUsuario = async (usuario: ICreateUsuarioDTO) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await gestionUsuariosUseCase.createUsuario(usuario);
            if (response.success) {
                await cargarUsuarios();
                return true;
            } else {
                setErrorMessage(response.message || 'No se pudo crear el usuario');
                return false;
            }
        } catch {
            setErrorMessage('Error inesperado al crear usuario');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar usuario por id
    const actualizarUsuario = async (id: number, usuario: IUpdateUsuarioDTO) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await gestionUsuariosUseCase.updateUsuario(id, usuario);
            if (response.success) {
                await cargarUsuarios();
                return true;
            } else {
                setErrorMessage(response.message || 'No se pudo actualizar el usuario');
                return false;
            }
        } catch {
            setErrorMessage('Error inesperado al actualizar usuario');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar usuario por id
    const eliminarUsuario = async (id: number) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await gestionUsuariosUseCase.deleteUsuario(id);
            if (response.success) {
                await cargarUsuarios();
                return true;
            } else {
                setErrorMessage(response.message || 'No se pudo eliminar el usuario');
                return false;
            }
        } catch {
            setErrorMessage('Error inesperado al eliminar usuario');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Init: carga paralela de datos para evitar parpadeos
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const [usuariosResp, rolesResp, puestosResp, estadosResp] = await Promise.all([
                    gestionUsuariosUseCase.getAllUsuarios(),
                    gestionUsuariosUseCase.getRoles(),
                    gestionUsuariosUseCase.getPuestos(),
                    gestionUsuariosUseCase.getEstados()
                ]);

                if (usuariosResp.success) setUsuarios(usuariosResp.data); else setUsuarios([]);
                if (rolesResp.success) setRoles(rolesResp.data); else setRoles([]);
                if (puestosResp.success) setPuestos(puestosResp.data); else setPuestos([]);
                if (estadosResp.success) setEstados(estadosResp.data); else setEstados([]);

                if (!usuariosResp.success) setErrorMessage(prev => prev || (usuariosResp.message || 'No se pudieron cargar los usuarios'));
            } catch {
                setErrorMessage('Error al cargar datos iniciales');
            } finally {
                setIsLoading(false);
            }
        };
        void init();
    }, []);

    return {
        // Estados
        usuarios,
        roles,
        puestos,
        estados,
        isLoading,
        errorMessage,
        setErrorMessage, // <-- AGREGA ESTA LÍNEA

        // Métodos
        cargarUsuarios,
        buscarUsuario,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario
    };
};