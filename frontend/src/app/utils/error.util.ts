import { HttpErrorResponse } from '@angular/common/http';

export function extraerError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor (http://localhost:8080).';
    }
    if (error.status === 403) {
      return 'No tiene permisos para realizar esta acción.';
    }
    if (typeof error.error === 'string' && error.error.trim() !== '') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Error ' + error.status + ': ' + error.statusText;
  }
  return 'Ocurrió un error inesperado.';
}
