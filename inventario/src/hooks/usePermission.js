import { useOutletContext } from 'react-router-dom';
import { hasPermission } from '../config/permissions';

/**
 * Hook para validar permisos basado en el rol del usuario
 * Uso: const { can, hasPermission } = usePermission();
 *      if (can('canApproveSolicitud')) { ... }
 */
export function usePermission() {
  const { profile } = useOutletContext();

  /**
   * Verifica si el usuario actual tiene un permiso
   * @param {string} permission - Nombre del permiso a validar
   * @returns {boolean} True si tiene el permiso
   */
  const can = (permission) => {
    return hasPermission(profile?.rol, permission);
  };

  /**
   * Verifica múltiples permisos (AND lógico)
   * @param {...string} permissions - Permisos a validar
   * @returns {boolean} True si tiene todos los permisos
   */
  const canAll = (...permissions) => {
    return permissions.every(permission => can(permission));
  };

  /**
   * Verifica si tiene al menos un permiso (OR lógico)
   * @param {...string} permissions - Permisos a validar
   * @returns {boolean} True si tiene al menos uno
   */
  const canAny = (...permissions) => {
    return permissions.some(permission => can(permission));
  };

  return {
    role: profile?.rol,
    can,
    canAll,
    canAny,
  };
}
