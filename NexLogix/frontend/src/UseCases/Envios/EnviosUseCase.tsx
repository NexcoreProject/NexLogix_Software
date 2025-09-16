import { createRecogida, createEntrega, createEnvio } from '../../services/Envios/EnvioService';
import {  RecogidaData, EntregaData, EnvioData} from '../../models/Interfaces/IEnvios';

  
  export interface EnvioFormData {
    nombreRemitente: string;
    num_ContactoRemitente: string;
    nombreDestinatario: string;
    num_ContactoDestinatario: string;
    metodoPago: string;
    idCategoria: number;
    recogida: {
      fechaRecogidaSeleccionada: string;
      direccionRecogida: string;
      idCiudad: number;
    };
    entrega: {
      fechaEntregaSeleccionada: string;
      direccionEntrega: string;
      idCiudad: number;
    };
  }
  
  // Caso de uso: crear un envío orquestando recogida -> entrega -> envío
  export class CrearEnvioUseCase {
    async execute(data: EnvioFormData): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
      const errors: Record<string, string> = {};
  
  // Validaciones mínimas (lado cliente) para evitar llamadas inválidas
      if (!data.nombreRemitente) errors.nombreRemitente = 'El nombre del remitente es requerido';
      if (!data.num_ContactoRemitente.match(/^[0-9+]+$/)) errors.num_ContactoRemitente = 'El teléfono debe contener solo números';
      if (!data.nombreDestinatario) errors.nombreDestinatario = 'El nombre del destinatario es requerido';
      if (!data.num_ContactoDestinatario.match(/^[0-9+]+$/)) errors.num_ContactoDestinatario = 'El teléfono debe contener solo números';
      if (!data.metodoPago) errors.metodoPago = 'Seleccione un método de pago';
      if (data.idCategoria === 0) errors.idCategoria = 'Seleccione una categoría';
      if (!data.recogida.fechaRecogidaSeleccionada) errors['recogida.fechaRecogidaSeleccionada'] = 'Seleccione una fecha de recogida';
      if (!data.recogida.direccionRecogida) errors['recogida.direccionRecogida'] = 'La dirección de recogida es requerida';
      if (data.recogida.idCiudad === 0) errors['recogida.idCiudad'] = 'Seleccione una ciudad de recogida';
      if (!data.entrega.fechaEntregaSeleccionada) errors['entrega.fechaEntregaSeleccionada'] = 'Seleccione una fecha de entrega';
      if (!data.entrega.direccionEntrega) errors['entrega.direccionEntrega'] = 'La dirección de entrega es requerida';
      if (data.entrega.idCiudad === 0) errors['entrega.idCiudad'] = 'Seleccione una ciudad de entrega';
  
      if (Object.keys(errors).length > 0) {
        return { success: false, message: 'Por favor, corrija los errores en el formulario', errors };
      }
  
      try {
  // 1) Crear recogida
        const recogidaData: RecogidaData = {
          fechaRecogidaSeleccionada: data.recogida.fechaRecogidaSeleccionada,
          direccionRecogida: data.recogida.direccionRecogida,
          idCiudad: data.recogida.idCiudad,
        };
        const recogidaResponse = await createRecogida(recogidaData);
        if (!recogidaResponse.success) {
          return { success: false, message: recogidaResponse.message };
        }
        const idRecogida = recogidaResponse.data.idRecogida;
  
  // 2) Crear entrega
        const entregaData: EntregaData = {
          fechaEntregaSeleccionada: data.entrega.fechaEntregaSeleccionada,
          direccionEntrega: data.entrega.direccionEntrega,
          idCiudad: data.entrega.idCiudad,
        };
        const entregaResponse = await createEntrega(entregaData);
        if (!entregaResponse.success) {
          return { success: false, message: entregaResponse.message };
        }
        const idEntrega = entregaResponse.data.idEntrega;
  
  // 3) Crear envío (relaciona ids de recogida y entrega)
        const envioData: EnvioData = {
          nombreRemitente: data.nombreRemitente,
          num_ContactoRemitente: data.num_ContactoRemitente,
          nombreDestinatario: data.nombreDestinatario,
          num_ContactoDestinatario: data.num_ContactoDestinatario,
          metodoPago: data.metodoPago,
          idRecogida,
          idEntrega,
          idCategoria: data.idCategoria,
        };
        const envioResponse = await createEnvio(envioData);
        if (!envioResponse.success) {
          return { success: false, message: envioResponse.message };
        }
  
        return { success: true, message: 'Envío creado exitosamente' };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        return { success: false, message };
      }
    }
  }