import { fetchRoles, createRol, updateRol, deleteRol } from "../../services/Roles/RolesService";
import { IRol, IRol_ApiResponse } from "../../models/Interfaces/IRoles";

// UseCase de Roles: puente entre UI y servicio de Roles
export class RolesUseCase {
  async getAllRoles(): Promise<IRol_ApiResponse<IRol[]>> {
    return await fetchRoles();
  }

  async create(data: { nombreRole: string; descripcionRole: string }): Promise<IRol_ApiResponse<IRol>> {
    return await createRol(data);
  }

  async update(id: number, data: { nombreRole: string; descripcionRole: string }): Promise<IRol_ApiResponse<IRol>> {
    return await updateRol(id, data);
  }

  async delete(id: number): Promise<IRol_ApiResponse<null>> {
    return await deleteRol(id);
  }
}