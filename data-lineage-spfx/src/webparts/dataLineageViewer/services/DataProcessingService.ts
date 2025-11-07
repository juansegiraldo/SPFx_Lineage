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
}