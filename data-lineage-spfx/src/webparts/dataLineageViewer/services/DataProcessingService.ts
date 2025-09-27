import {
  IDataLineageRecord,
  IDataLineageGraph,
  IDataLineageNode,
  IDataLineageEdge,
  IDataLineageStats,
  DataLineageLayer,
  LayerColors
} from '../models/IDataLineage';

export class DataProcessingService {

  public static processDataToGraph(data: IDataLineageRecord[], selectedUseCase?: string): IDataLineageGraph {
    // Filtrar solo registros con Linaje = true
    let filteredData = data.filter(item => item.Linaje);

    // Aplicar filtro de Use Case si se especifica
    if (selectedUseCase && selectedUseCase !== 'Todos') {
      filteredData = filteredData.filter(item => item.UseCase === selectedUseCase);
    }

    const nodes: IDataLineageNode[] = [];
    const edges: IDataLineageEdge[] = [];
    const nodeIds = new Set<string>();

    filteredData.forEach((record, index) => {
      // Crear nodos para cada capa
      const layerData = [
        { layer: DataLineageLayer.Source, value: record.DataSources },
        { layer: DataLineageLayer.Ingestion, value: record.Ingestion },
        { layer: DataLineageLayer.Storage, value: record.Storage },
        { layer: DataLineageLayer.Processing, value: record.ProcessingTransformation },
        { layer: DataLineageLayer.Consumption, value: record.ConsumptionReporting }
      ];

      const recordNodes: string[] = [];

      layerData.forEach(({ layer, value }) => {
        if (value && value.trim()) {
          const nodeId = `${layer}-${value.trim()}`;

          // Solo agregar nodo si no existe
          if (!nodeIds.has(nodeId)) {
            nodeIds.add(nodeId);
            nodes.push({
              id: nodeId,
              label: value.trim(),
              layer: layer,
              color: LayerColors[layer],
              useCase: record.UseCase
            });
          }

          recordNodes.push(nodeId);
        }
      });

      // Crear aristas entre nodos consecutivos
      for (let i = 0; i < recordNodes.length - 1; i++) {
        const sourceId = recordNodes[i];
        const targetId = recordNodes[i + 1];
        const edgeId = `${sourceId}-${targetId}-${index}`;

        edges.push({
          id: edgeId,
          source: sourceId,
          target: targetId,
          useCase: record.UseCase
        });
      }
    });

    return { nodes, edges };
  }

  public static calculateStats(data: IDataLineageRecord[], graph: IDataLineageGraph): IDataLineageStats {
    const activeRecords = data.filter(item => item.Linaje);

    const nodesByLayer: Record<DataLineageLayer, number> = {
      [DataLineageLayer.Source]: 0,
      [DataLineageLayer.Ingestion]: 0,
      [DataLineageLayer.Storage]: 0,
      [DataLineageLayer.Processing]: 0,
      [DataLineageLayer.Consumption]: 0
    };

    graph.nodes.forEach(node => {
      nodesByLayer[node.layer]++;
    });

    return {
      totalFlows: activeRecords.length,
      totalNodes: graph.nodes.length,
      totalConnections: graph.edges.length,
      activeFlows: activeRecords.length,
      nodesByLayer
    };
  }

  public static getUseCases(data: IDataLineageRecord[]): string[] {
    const useCaseSet = new Set(data.filter(item => item.Linaje).map(item => item.UseCase));
    const useCases: string[] = [];
    useCaseSet.forEach(useCase => useCases.push(useCase));
    return ['Todos', ...useCases.sort()];
  }

  // Método para procesar datos de Excel
  public static processExcelData(jsonData: any[]): IDataLineageRecord[] {
    if (!jsonData || jsonData.length === 0) {
      return [];
    }

    // Asumir que la primera fila contiene headers
    const headers = Object.keys(jsonData[0]);

    return jsonData.map(row => {
      // Mapear columnas de Excel a nuestro modelo
      const record: IDataLineageRecord = {
        UseCase: row['Use Case'] || row.UseCase || '',
        DataSources: row['Data Sources'] || row.DataSources || '',
        Ingestion: row['Ingestion'] || row.Ingestion || '',
        Storage: row['Storage'] || row.Storage || '',
        ProcessingTransformation: row['Processing/Transformation'] || row.ProcessingTransformation || '',
        ConsumptionReporting: row['Consumption/Reporting'] || row.ConsumptionReporting || '',
        Linaje: this.parseBoolean(row['Linaje'] || row.Linaje)
      };

      return record;
    });
  }

  private static parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'sí' || value.toLowerCase() === 'si' ||
             value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
    }
    return false;
  }

  public static validateDataStructure(data: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || data.length === 0) {
      errors.push('No se encontraron datos para procesar');
      return { isValid: false, errors };
    }

    // Verificar que existan las columnas necesarias
    const requiredColumns = ['Use Case', 'Data Sources', 'Ingestion', 'Storage', 'Processing/Transformation', 'Consumption/Reporting', 'Linaje'];
    const firstRow = data[0];
    const availableColumns = Object.keys(firstRow);

    requiredColumns.forEach(column => {
      if (!availableColumns.some(col => col.includes(column.split('/')[0]) || col === column)) {
        errors.push(`Columna requerida no encontrada: ${column}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}