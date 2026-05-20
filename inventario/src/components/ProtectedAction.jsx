import { usePermission } from '../hooks/usePermission';

/**
 * Componente para mostrar/ocultar contenido basado en permisos
 * 
 * Uso:
 * <ProtectedAction permission="canApproveSolicitud">
 *   <button>Aprobar</button>
 * </ProtectedAction>
 * 
 * O con múltiples permisos:
 * <ProtectedAction permissions={['canApproveSolicitud', 'canConfirmEntrega']}>
 *   <button>Aprobar y Confirmar</button>
 * </ProtectedAction>
 */
export default function ProtectedAction({ 
  permission, 
  permissions,
  children, 
  fallback = null,
  requireAll = true 
}) {
  const { can, canAll, canAny } = usePermission();

  // Si tiene un solo permiso
  if (permission && can(permission)) {
    return children;
  }

  // Si tiene múltiples permisos
  if (permissions) {
    const hasAccess = requireAll 
      ? canAll(...permissions)
      : canAny(...permissions);
    
    if (hasAccess) {
      return children;
    }
  }

  return fallback;
}
