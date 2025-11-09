# Visualizador de Linaje de Datos - SPFx

Una aplicación SharePoint Framework (SPFx) que permite visualizar el linaje de datos usando Cytoscape.js con datos desde listas de SharePoint.

## Características Principales

- **Visualización interactiva** del linaje de datos con Cytoscape.js
- **Integración con SharePoint**: Lee datos desde listas de SharePoint Online
- **Filtrado dinámico** por casos de uso
- **Diseño responsive** que funciona en desktop y móvil
- **Estadísticas en tiempo real** del linaje de datos
- **Exportación** de visualizaciones como imagen
- **Property Pane configurable** para personalización

## Arquitectura de 5 Capas

La aplicación visualiza el flujo de datos a través de 5 capas principales:

1. **Fuentes de Datos** (Sources) - Color: #024fad
2. **Ingesta** (Ingestion) - Color: #446ed1
3. **Almacenamiento** (Storage) - Color: #6d8ef6
4. **Procesamiento** (Processing) - Color: #94b1ff
5. **Consumo** (Consumption) - Color: #bad4ff

## Estructura del Proyecto

```
src/
└── webparts/
    └── dataLineageViewer/
        ├── components/
        │   ├── DataLineageViewer.tsx          # Componente principal
        │   ├── CytoscapeGraph.tsx             # Visualización con Cytoscape
        │   ├── DataLineageViewer.module.scss  # Estilos
        │   └── IDataLineageViewerProps.ts     # Props del componente
        ├── services/
        │   ├── SharePointService.ts           # Servicio para SharePoint
        │   ├── MockDataService.ts             # Datos de ejemplo
        │   └── DataProcessingService.ts       # Procesamiento de datos
        ├── models/
        │   └── IDataLineage.ts                # Interfaces y tipos
        ├── loc/
        │   ├── en-us.js                       # Strings localizados
        │   └── mystrings.d.ts                 # Definiciones TypeScript
        ├── DataLineageViewerWebPart.ts       # WebPart principal
        └── DataLineageViewerWebPart.manifest.json
```

## Requisitos del Sistema

### Desarrollo Local
- Node.js 18.x o 20.x (recomendado)
- NPM 8.x o superior
- SharePoint Framework 1.21.1

### Producción
- SharePoint Online o SharePoint Server 2019/2022
- Navegador web moderno (Edge, Chrome, Firefox)

## Instalación y Configuración

### 1. Instalación de Dependencias

```bash
cd data-lineage-spfx
npm install
```

### 2. Configuración de la Lista de SharePoint

Cree una lista llamada "DataLineage" con las siguientes columnas:

| Nombre de Columna | Tipo | Requerido | Descripción |
|-------------------|------|-----------|-------------|
| Title | Texto | Sí | Título del registro |
| Use Case | Texto | Sí | Caso de uso del flujo de datos |
| Data Sources | Texto | Sí | Fuentes de datos |
| Ingestion | Texto | Sí | Método de ingesta |
| Storage | Texto | Sí | Sistema de almacenamiento |
| Processing/Transformation | Texto | Sí | Herramientas de procesamiento |
| Consumption/Reporting | Texto | Sí | Sistemas de consumo |
| Linaje | Sí/No | Sí | Indica si debe mostrarse en el linaje |

## Testing Local (Sin SharePoint ni Aprobaciones!)

**Puedes probar cambios de UI inmediatamente sin involucrar al equipo de ciberseguridad o administradores de SharePoint!**

```bash
npm run serve
```

Luego abre: `http://localhost:5432/workbench`

La aplicación automáticamente usa datos de prueba (mock data) - perfecto para desarrollo! ✅

**📖 Lee la guía completa de testing:** [TESTING.md](./TESTING.md)

La guía incluye:
- Cómo probar cambios de UI localmente (sin SharePoint)
- Cómo funciona el sistema de mock data
- Diferentes escenarios de prueba
- Cuándo necesitas aprobaciones vs cuándo no
- Resolución de problemas comunes

## Comandos de Desarrollo

### Testing y Desarrollo Local (MÁS COMÚN)
```bash
# Iniciar servidor local con mock data
npm run serve

# Ejecutar tests unitarios
npm test

# Ejecutar tests en modo watch
npm test -- --watch
```

### Compilar el proyecto
```bash
npm run build
# O alternativamente:
gulp build
```

### Empaquetar para producción
```bash
npm run package-solution
# O manualmente:
gulp clean
gulp bundle --ship
gulp package-solution --ship
```

El archivo `.sppkg` se generará en `sharepoint/solution/`

## Configuración del WebPart

Una vez desplegado en SharePoint, puede configurar el WebPart a través del Property Pane:

### Configuración de Datos
- **Nombre de Lista SharePoint**: Nombre de la lista (por defecto: "DataLineage")

### Configuración de Apariencia
- **Color Primario**: Color principal de la interfaz
- **Color Secundario**: Color secundario para acentos

## Uso de la Aplicación

### 1. Visualización Básica
- Al cargar, la aplicación muestra automáticamente todos los flujos de datos
- Use el dropdown "Caso de Uso" para filtrar por casos específicos
- Interactúe con el gráfico usando zoom, pan y selección de nodos

### 2. Funciones Interactivas
- **Zoom**: Use la rueda del mouse para hacer zoom
- **Pan**: Arrastre para mover la vista
- **Centrar vista**: Botón para centrar automáticamente el gráfico
- **Exportar imagen**: Descarga el gráfico como PNG

### 4. Estadísticas
El panel de estadísticas muestra:
- Flujos totales procesados
- Número de nodos únicos
- Total de conexiones
- Flujos activos (con Linaje = Sí)

## Datos de Ejemplo

La aplicación incluye datos de ejemplo para desarrollo:

```typescript
{
  "Use Case": "Análisis de Ventas",
  "Data Sources": "SAP",
  "Ingestion": "Azure Data Factory",
  "Storage": "Azure SQL Database",
  "Processing/Transformation": "Azure Databricks",
  "Consumption/Reporting": "Power BI",
  "Linaje": true
}
```

## Solución de Problemas

### Error: "SharePoint service not initialized"
- Verifique que la aplicación esté ejecutándose en el contexto de SharePoint
- Confirme que la lista "DataLineage" existe y tiene las columnas correctas
- Revise los permisos de acceso a la lista

### Error: "No se encontraron datos para procesar"
- Verifique que la lista de SharePoint tenga datos
- Asegúrese de que al menos un registro tenga Linaje = "Sí"
- Confirme que la lista tiene las columnas correctas

### Problemas de Compilación con Node.js
- La aplicación fue desarrollada para Node.js 18.x pero es compatible con versiones más recientes
- Si usa Node.js 22+, puede ver warnings, pero la aplicación funcionará correctamente

### El gráfico no se muestra
- Verifique que Cytoscape.js se esté cargando correctamente
- Abra las herramientas de desarrollador y revise la consola para errores
- Confirme que los datos tienen la estructura correcta

## Desarrollo y Contribución

### Estructura de Capas de Datos
Los datos se procesan en las siguientes capas:

1. **Fuente**: SharePointService o MockDataService
2. **Procesamiento**: DataProcessingService convierte datos a grafo
3. **Visualización**: CytoscapeGraph renderiza el grafo interactivo

### Personalización
Para personalizar la aplicación:

1. **Colores**: Modifique `LayerColors` en `IDataLineage.ts`
2. **Estilos**: Edite `DataLineageViewer.module.scss`
3. **Layout**: Ajuste configuración de Cytoscape en `CytoscapeGraph.tsx`

### Testing
```bash
gulp test
```

## Despliegue en Producción

### 1. Preparar Package
```bash
gulp clean
gulp bundle --ship
gulp package-solution --ship
```

### 2. Desplegar en SharePoint
1. Suba el archivo `.sppkg` al App Catalog de SharePoint
2. Apruebe y sincronice la aplicación
3. Agregue el WebPart a páginas de SharePoint

### 3. Configuración Post-Despliegue
- Configure el Property Pane con el nombre correcto de la lista
- Verifique que los usuarios tengan permisos de lectura a la lista
- Pruebe la visualización del linaje de datos

## Licencia

Este proyecto es para uso interno y educativo. No se incluye licencia específica.

## Soporte y Contacto

Para soporte técnico o consultas:
- Revise la documentación de SharePoint Framework
- Consulte los logs de error en herramientas de desarrollador
- Verifique la configuración de la lista de SharePoint

---

**Versión**: 1.0.0
**Última actualización**: Septiembre 2024
**Compatible con**: SPFx 1.21.1, SharePoint Online