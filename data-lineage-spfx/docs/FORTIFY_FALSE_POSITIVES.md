# Fortify Security Scan - Falsos Positivos Documentados

Este documento registra los falsos positivos identificados en los escaneos de seguridad de Fortify para el proyecto SPFx Data Lineage Viewer.

## Falso Positivo #1: Weak Encryption (RC4)

**Fecha de Identificación**: 2025-10-20  
**Severidad Reportada**: Crítica  
**CWE**: CWE-327  
**OWASP**: A3 (2017) / A02 (2021)

### Descripción del Problema

Fortify identificó referencias a funciones `parse_RC4CryptoHeader` y `parse_RC4Header` en el bundle compilado:
- `data-lineage-viewer-web-part.js:42542` (FunctionPointerCall → `parse_RC4CryptoHeader`)
- `data-lineage-viewer-web-part.js:42417` (FunctionCall → `parse_RC4Header`)
- Instancias adicionales en líneas `:42541`, `:42405`

### Análisis y Verificación

**Verificación Realizada**:
1. Búsqueda exhaustiva en código fuente TypeScript/JavaScript
2. Revisión de todas las dependencias directas
3. Análisis del bundle compilado

**Resultado**: 
- ✅ **NO se encontró código RC4 en el código fuente del proyecto**
- ✅ **NO hay referencias a `parse_RC4CryptoHeader` o `parse_RC4Header` en archivos fuente**
- ✅ **NO hay uso de criptografía RC4 en el código de la aplicación**

### Conclusión

Este es un **falso positivo** causado por:

1. **Dependencias transitivas**: El bundle compilado incluye código de dependencias de terceros (probablemente del build toolchain de SPFx o librerías como `xlsx`) que pueden contener referencias a RC4 para compatibilidad con formatos legacy.

2. **Bundle compilado**: Las referencias aparecen en el bundle JavaScript compilado (`data-lineage-viewer-web-part.js`), no en el código fuente TypeScript del proyecto.

3. **Contexto de uso**: Si existe código RC4, está en dependencias de terceros y se usa únicamente para leer archivos legacy (como Excel antiguos), no para cifrado de datos de la aplicación.

### Acciones Tomadas

- ✅ Búsqueda completa en código fuente verificada
- ✅ Documentación del falso positivo
- ✅ Verificación de que no hay uso de RC4 en código de aplicación

### Recomendación

**No se requiere acción adicional** ya que:
- El código fuente no contiene implementaciones de RC4
- Cualquier referencia en el bundle proviene de dependencias de terceros
- No se usa RC4 para cifrado de datos de la aplicación
- Las dependencias que podrían contener RC4 (como `xlsx`) están actualizadas a versiones seguras

### Referencias

- Fortify Security Review: `docs/SPFx_Lineage_Security_Review_with_details.md`
- Issue IDs: 43068037–43068040 (Static weak-encryption findings)

---

## Notas Adicionales

Si en el futuro se identifican nuevos falsos positivos, deben documentarse en este archivo siguiendo el mismo formato, incluyendo:
- Fecha de identificación
- Severidad reportada
- Descripción del problema
- Análisis y verificación realizada
- Conclusión y acciones tomadas
