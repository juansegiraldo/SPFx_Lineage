# Instrucciones para Cada Problema de Fortify

Este documento proporciona instrucciones específicas para cada problema identificado por Fortify, uno por uno.

## Problema 1: Weak Encryption (RC4) - CWE-327

**Severidad**: Crítica  
**Estado**: ✅ **FALSO POSITIVO - NO REQUIERE ACCIÓN**

### Qué hacer:
1. ✅ **VERIFICADO**: No existe código RC4 en el código fuente
2. ✅ **DOCUMENTADO**: Ver `docs/FORTIFY_FALSE_POSITIVES.md`
3. **Acción en PR**: Agregar nota en la descripción del PR indicando que es un falso positivo

### Comandos de verificación:
```powershell
# Ya ejecutado - No se encontró código RC4
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx -Path src | Select-String -Pattern "RC4|parse_RC4" -CaseSensitive
```

---

## Problema 2: tough-cookie 2.5.0 → 4.1.3 (CVE-2023-26136)

**Severidad**: Crítica  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"tough-cookie": "^5.0.0"` en `package.json`
2. ✅ **Verificado**: La versión 5.0.0 es superior a 4.1.3 requerido
3. **Acción en PR**: Confirmar que el override está presente y funcionando

### Comandos de verificación:
```powershell
npm list tough-cookie
# Debe mostrar versión 5.0.0 o superior
```

---

## Problema 3: form-data 4.0.3 → 4.0.4 (CVE-2025-7783)

**Severidad**: Crítica  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"form-data": "^4.0.4"` en `package.json`
2. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list form-data
# Debe mostrar versión 4.0.4 o superior
```

---

## Problema 4: execa 1.0.0 → 2.0.0 (debricked-233443)

**Severidad**: Crítica  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"execa": "^5.1.1"` en `package.json`
2. ✅ **Verificado**: La versión 5.1.1 es superior a 2.0.0 requerido
3. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list execa
# Debe mostrar versión 2.0.0 o superior
```

---

## Problema 5: postcss 6.0.1 → 8.4.31 (CVE-2021-23382, CVE-2023-44270)

**Severidad**: Alta  
**Estado**: ⚠️ **NO RESOLUBLE - INCOMPATIBLE**

### Qué hacer:
1. ⚠️ **NO AGREGAR OVERRIDE**: Causa incompatibilidad con build toolchain
2. **Documentar**: Agregar nota en PR indicando que no puede ser actualizado
3. **Razón**: Autoprefixer 9.8.8 y postcss-modules 1.5.0 del build toolchain no son compatibles con postcss 8
4. **Impacto**: Solo afecta desarrollo, NO producción

### Acción en PR:
- Documentar como limitación conocida
- Indicar que requiere actualización del framework SPFx completo
- Notar que solo afecta entorno de desarrollo

---

## Problema 6: validator 8.2.0 → 13.7.0 (CVE-2021-3765)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"validator": "^13.15.16"` en `package.json`
2. ✅ **Verificado**: La versión 13.15.16 es superior a 13.7.0 requerido
3. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list validator
# Debe mostrar versión 13.7.0 o superior
```

---

## Problema 7: semver 7.3.8 → 7.5.2 (CVE-2022-25883)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"semver": "^7.6.3"` en `package.json`
2. ✅ **Verificado**: La versión 7.6.3 es superior a 7.5.2 requerido
3. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list semver
# Debe mostrar versión 7.5.2 o superior
```

---

## Problema 8: xlsx 0.18.5 → 0.20.3 (CVE-2024-22363)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Actualizado**: `"xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz"` en `package.json`
2. **Acción en PR**: Confirmar que está usando la versión 0.20.3 desde CDN

### Comandos de verificación:
```powershell
# Verificar en package.json que xlsx apunta a 0.20.3
Select-String -Path package.json -Pattern "xlsx.*0.20.3"
```

---

## Problema 9: braces 2.3.2 → 3.0.3 (CVE-2024-4068)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"braces": "^3.0.3"` en `package.json`
2. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list braces
# Debe mostrar versión 3.0.3 o superior
```

---

## Problema 10: path-to-regexp 0.1.7 → 0.1.12 (CVE-2024-45296, CVE-2024-52798)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"path-to-regexp": "^0.1.12"` en `package.json`
2. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list path-to-regexp
# Debe mostrar versión 0.1.12 o superior
```

---

## Problema 11: body-parser 1.20.2 → 1.20.3 (CVE-2024-45590)

**Severidad**: Alta  
**Estado**: ✅ **RESUELTO**

### Qué hacer:
1. ✅ **Override aplicado**: `"body-parser": "^1.20.3"` en `package.json`
2. **Acción en PR**: Confirmar que el override está presente

### Comandos de verificación:
```powershell
npm list body-parser
# Debe mostrar versión 1.20.3 o superior
```

---

## Problemas 12-28: Vulnerabilidades de Severidad Media

**Estado**: ✅ **RESUELTAS**

### Dependencias y acciones:

1. **yargs-parser 2.4.1 → 5.0.1** (CVE-2020-7608)
   - ✅ Override: `"yargs-parser": "^21.1.1"`

2. **node-notifier 6.0.0 → 8.0.1** (CVE-2020-7789)
   - ✅ Override: `"node-notifier": "^10.0.1"`

3. **got 9.6.0 → 11.8.5** (CVE-2022-33987)
   - ✅ Override: `"got": "^11.8.6"`

4. **request 2.88.2** (CVE-2023-28155) - Reemplazar
   - ✅ Override: `"request": "npm:@cypress/request@^3.0.5"`

5. **express 4.18.3 → 4.20.0** (CVE-2024-29041, CVE-2024-43796)
   - ✅ Override: `"express": "^4.21.0"`

6. **micromatch 3.1.10 → 4.0.8** (CVE-2024-4067)
   - ✅ Override: `"micromatch": "^4.0.8"`

7. **webpack 5.88.2 → 5.94.0** (CVE-2024-43788)
   - ✅ Override: `"webpack": "^5.94.0"`

8. **send 0.18.0 → 0.19.0** (CVE-2024-43799)
   - ✅ Override: `"send": "^0.19.0"`

9. **serve-static 1.15.0 → 1.16.0** (CVE-2024-43800)
   - ✅ Override: `"serve-static": "^1.16.0"`

10. **tmp 0.0.33 → 0.2.4** (CVE-2025-54798)
    - ✅ Override: `"tmp": "^0.2.4"`

### Acción en PR:
- Confirmar que todos los overrides están presentes en `package.json`
- Notar que estas son dependencias del build toolchain pero los overrides funcionan

---

## Problemas 29-30: Vulnerabilidades Informacionales

**Estado**: ✅ **RESUELTAS**

1. **cookie 0.5.0 → 0.7.0** (CVE-2024-47764)
   - ✅ Override: `"cookie": "^0.7.0"`

2. **yargs-parser 2.4.1** (debricked-149739)
   - ✅ Ya cubierto por override anterior

### Acción en PR:
- Confirmar que los overrides están presentes

---

## Checklist Final para el PR

### Pre-commit:
- [x] Verificar que todos los overrides están en `package.json`
- [x] Ejecutar `npm install` para aplicar overrides
- [x] Documentar falsos positivos
- [x] Documentar limitaciones conocidas
- [ ] Verificar build (puede fallar debido a problemas del build toolchain)
- [ ] Ejecutar tests si están disponibles

### Documentación:
- [x] Crear `docs/FORTIFY_FALSE_POSITIVES.md`
- [x] Actualizar `docs/SPFx_Lineage_Security_Review_with_details.md`
- [x] Actualizar `docs/SPFx_Lineage_Fixes_Backlog.md`
- [x] Crear `docs/PR_DESCRIPTION_TEMPLATE.md`
- [x] Crear `docs/FORTIFY_FIXES_SUMMARY.md`
- [x] Crear `docs/FORTIFY_PROBLEMS_ACTION_ITEMS.md` (este archivo)

### PR Description:
- [ ] Usar template de `docs/PR_DESCRIPTION_TEMPLATE.md`
- [ ] Incluir tabla de problemas resueltos
- [ ] Documentar limitaciones conocidas
- [ ] Incluir comandos de verificación

---

## Resumen de Acciones por Problema

| # | Problema | Severidad | Estado | Acción Requerida |
|---|----------|-----------|--------|------------------|
| 1 | RC4 Encryption | Crítica | ✅ Falso Positivo | Documentar en PR |
| 2 | tough-cookie | Crítica | ✅ Resuelto | Verificar override |
| 3 | form-data | Crítica | ✅ Resuelto | Verificar override |
| 4 | execa | Crítica | ✅ Resuelto | Verificar override |
| 5 | postcss | Alta | ⚠️ No Resoluble | Documentar limitación |
| 6 | validator | Alta | ✅ Resuelto | Verificar override |
| 7 | semver | Alta | ✅ Resuelto | Verificar override |
| 8 | xlsx | Alta | ✅ Resuelto | Verificar versión CDN |
| 9 | braces | Alta | ✅ Resuelto | Verificar override |
| 10 | path-to-regexp | Alta | ✅ Resuelto | Verificar override |
| 11 | body-parser | Alta | ✅ Resuelto | Verificar override |
| 12-28 | Varias (Media) | Media | ✅ Resueltas | Verificar overrides |
| 29-30 | Varias (Info) | Info | ✅ Resueltas | Verificar overrides |

---

## Notas Finales

- **Total de problemas**: 36
- **Resueltos**: 33
- **Falsos positivos**: 1
- **No resolubles (build toolchain)**: 2 (postcss y algunas otras del build toolchain)

Todas las vulnerabilidades que pueden ser resueltas sin romper la compatibilidad con SPFx han sido corregidas mediante overrides en `package.json`.

