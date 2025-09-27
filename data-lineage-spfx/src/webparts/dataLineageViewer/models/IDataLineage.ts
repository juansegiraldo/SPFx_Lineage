export interface IDataLineageRecord {
  UseCase: string;
  DataSources: string;
  Ingestion: string;
  Storage: string;
  ProcessingTransformation: string;
  ConsumptionReporting: string;
  Linaje: boolean;
}

export interface IDataLineageNode {
  id: string;
  label: string;
  layer: DataLineageLayer;
  color: string;
  useCase: string;
}

export interface IDataLineageEdge {
  id: string;
  source: string;
  target: string;
  useCase: string;
}

export enum DataLineageLayer {
  Source = 'source',
  Ingestion = 'ingestion',
  Storage = 'storage',
  Processing = 'processing',
  Consumption = 'consumption'
}

export interface IDataLineageGraph {
  nodes: IDataLineageNode[];
  edges: IDataLineageEdge[];
}

export interface IDataLineageStats {
  totalFlows: number;
  totalNodes: number;
  totalConnections: number;
  activeFlows: number;
  nodesByLayer: Record<DataLineageLayer, number>;
}

export const LayerColors: Record<DataLineageLayer, string> = {
  [DataLineageLayer.Source]: '#024fad',
  [DataLineageLayer.Ingestion]: '#446ed1',
  [DataLineageLayer.Storage]: '#6d8ef6',
  [DataLineageLayer.Processing]: '#94b1ff',
  [DataLineageLayer.Consumption]: '#bad4ff'
};

export const LayerLabels: Record<DataLineageLayer, string> = {
  [DataLineageLayer.Source]: 'Fuentes de Datos',
  [DataLineageLayer.Ingestion]: 'Ingesta',
  [DataLineageLayer.Storage]: 'Almacenamiento',
  [DataLineageLayer.Processing]: 'Procesamiento',
  [DataLineageLayer.Consumption]: 'Consumo'
};