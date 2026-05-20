/**
 * Define los permisos para cada rol en el sistema
 */
export const ROLE_PERMISSIONS = {
  bodeguero: {
    canViewMateriales: true,
    canCreateMaterial: true,
    canEditMaterial: true,
    canDeleteMaterial: true,
    canViewSolicitudes: true,
    canApproveSolicitud: true,
    canRejectSolicitud: true,
    canConfirmEntrega: true,
    canViewConfirmaciones: true,
    canManageInventory: true,
  },
  padrino: {
    canViewMateriales: true,
    canCreateSolicitud: true,
    canViewOwnSolicitudes: true,
    canViewConfirmaciones: true,
  },
  admin: {
    canViewMateriales: true,
    canCreateMaterial: true,
    canEditMaterial: true,
    canDeleteMaterial: true,
    canViewSolicitudes: true,
    canApproveSolicitud: true,
    canRejectSolicitud: true,
    canConfirmEntrega: true,
    canViewConfirmaciones: true,
    canManageInventory: true,
    canManageUsers: true,
  },
};

/**
 * Obtiene los permisos para un rol específico
 * @param {string} role - El rol del usuario
 * @returns {Object} Objeto con los permisos disponibles
 */
export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || {};
}

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - El rol del usuario
 * @param {string} permission - El permiso a validar
 * @returns {boolean} True si tiene el permiso
 */
export function hasPermission(role, permission) {
  return getPermissionsForRole(role)[permission] ?? false;
}
