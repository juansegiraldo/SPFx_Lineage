import { DataProcessingService } from '../services/DataProcessingService';
import { MockDataService } from '../services/MockDataService';
import { IDataLineageRecord, DataLineageLayer } from '../models/IDataLineage';

describe('DataProcessingService', () => {

  const mockData: IDataLineageRecord[] = [
    {
      UseCase: 'Test Use Case 1',
      DataSources: 'Source A',
      Ingestion: 'Ingestion A',
      Storage: 'Storage A',
      ProcessingTransformation: 'Processing A',
      ConsumptionReporting: 'Reporting A',
      Linaje: true
    },
    {
      UseCase: 'Test Use Case 1',
      DataSources: 'Source B',
      Ingestion: 'Ingestion A',
      Storage: 'Storage A',
      ProcessingTransformation: 'Processing A',
      ConsumptionReporting: 'Reporting A',
      Linaje: true
    },
    {
      UseCase: 'Test Use Case 2',
      DataSources: 'Source C',
      Ingestion: 'Ingestion B',
      Storage: 'Storage B',
      ProcessingTransformation: 'Processing B',
      ConsumptionReporting: 'Reporting B',
      Linaje: true
    },
    {
      UseCase: 'Inactive Use Case',
      DataSources: 'Source D',
      Ingestion: 'Ingestion D',
      Storage: 'Storage D',
      ProcessingTransformation: 'Processing D',
      ConsumptionReporting: 'Reporting D',
      Linaje: false
    }
  ];

  describe('processDataToGraph', () => {
    it('should filter out records with Linaje = false', () => {
      // Act
      const graph = DataProcessingService.processDataToGraph(mockData);

      // Assert
      expect(graph).toBeDefined();
      expect(graph.nodes).toBeDefined();
      expect(graph.edges).toBeDefined();

      // Should not contain nodes from inactive records
      const nodeLabels = graph.nodes.map(node => node.label);
      expect(nodeLabels).not.toContain('Source D');
      expect(nodeLabels).not.toContain('Ingestion D');
    });

    it('should create nodes for each layer', () => {
      // Act
      const graph = DataProcessingService.processDataToGraph(mockData);

      // Assert
      const layers = graph.nodes.map(node => node.layer);
      const uniqueLayers = [...new Set(layers)];

      expect(uniqueLayers).toContain(DataLineageLayer.Source);
      expect(uniqueLayers).toContain(DataLineageLayer.Ingestion);
      expect(uniqueLayers).toContain(DataLineageLayer.Storage);
      expect(uniqueLayers).toContain(DataLineageLayer.Processing);
      expect(uniqueLayers).toContain(DataLineageLayer.Consumption);
    });

    it('should create unique nodes (no duplicates)', () => {
      // Act
      const graph = DataProcessingService.processDataToGraph(mockData);

      // Assert
      const nodeIds = graph.nodes.map(node => node.id);
      const uniqueNodeIds = [...new Set(nodeIds)];

      expect(nodeIds.length).toBe(uniqueNodeIds.length);
    });

    it('should create edges between consecutive layers', () => {
      // Act
      const graph = DataProcessingService.processDataToGraph(mockData);

      // Assert
      expect(graph.edges.length).toBeGreaterThan(0);

      // Each edge should connect nodes from different layers
      graph.edges.forEach(edge => {
        const sourceNode = graph.nodes.find(node => node.id === edge.source);
        const targetNode = graph.nodes.find(node => node.id === edge.target);

        expect(sourceNode).toBeDefined();
        expect(targetNode).toBeDefined();
        expect(sourceNode!.layer).not.toBe(targetNode!.layer);
      });
    });

    it('should filter by selected use case', () => {
      // Act
      const allGraph = DataProcessingService.processDataToGraph(mockData);
      const filteredGraph = DataProcessingService.processDataToGraph(mockData, 'Test Use Case 1');

      // Assert
      expect(filteredGraph.nodes.length).toBeLessThanOrEqual(allGraph.nodes.length);
      expect(filteredGraph.edges.length).toBeLessThanOrEqual(allGraph.edges.length);

      // All nodes in filtered graph should be related to the selected use case
      const useCase1Nodes = ['Source A', 'Source B', 'Ingestion A', 'Storage A', 'Processing A', 'Reporting A'];
      filteredGraph.nodes.forEach(node => {
        expect(useCase1Nodes).toContain(node.label);
      });
    });

    it('should handle "Todos" filter (show all)', () => {
      // Act
      const allGraph = DataProcessingService.processDataToGraph(mockData);
      const todosGraph = DataProcessingService.processDataToGraph(mockData, 'Todos');

      // Assert
      expect(todosGraph.nodes.length).toBe(allGraph.nodes.length);
      expect(todosGraph.edges.length).toBe(allGraph.edges.length);
    });
  });

  describe('calculateStats', () => {
    it('should calculate correct statistics', () => {
      // Arrange
      const graph = DataProcessingService.processDataToGraph(mockData);

      // Act
      const stats = DataProcessingService.calculateStats(mockData, graph);

      // Assert
      expect(stats.totalFlows).toBe(3); // Only active records
      expect(stats.activeFlows).toBe(3); // Only active records
      expect(stats.totalNodes).toBe(graph.nodes.length);
      expect(stats.totalConnections).toBe(graph.edges.length);
      expect(stats.nodesByLayer).toBeDefined();

      // Check nodes by layer
      Object.values(DataLineageLayer).forEach(layer => {
        const layerNodes = graph.nodes.filter(node => node.layer === layer);
        expect(stats.nodesByLayer[layer]).toBe(layerNodes.length);
      });
    });

    it('should handle empty data', () => {
      // Act
      const emptyGraph = DataProcessingService.processDataToGraph([]);
      const stats = DataProcessingService.calculateStats([], emptyGraph);

      // Assert
      expect(stats.totalFlows).toBe(0);
      expect(stats.activeFlows).toBe(0);
      expect(stats.totalNodes).toBe(0);
      expect(stats.totalConnections).toBe(0);
    });
  });

  describe('getUseCases', () => {
    it('should extract use cases from data', () => {
      // Act
      const useCases = DataProcessingService.getUseCases(mockData);

      // Assert
      expect(useCases).toContain('Todos');
      expect(useCases).toContain('Test Use Case 1');
      expect(useCases).toContain('Test Use Case 2');
      expect(useCases).not.toContain('Inactive Use Case'); // Linaje = false
    });

    it('should sort use cases alphabetically (after Todos)', () => {
      // Act
      const useCases = DataProcessingService.getUseCases(mockData);

      // Assert
      expect(useCases[0]).toBe('Todos');
      const sortedUseCases = useCases.slice(1); // Exclude "Todos"
      const expectedSorted = [...sortedUseCases].sort();
      expect(sortedUseCases).toEqual(expectedSorted);
    });
  });


  describe('Integration with MockDataService', () => {
    it('should work correctly with real mock data', () => {
      // Arrange
      const realMockData = MockDataService.getMockData();

      // Act
      const graph = DataProcessingService.processDataToGraph(realMockData);
      const stats = DataProcessingService.calculateStats(realMockData, graph);
      const useCases = DataProcessingService.getUseCases(realMockData);

      // Assert
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.edges.length).toBeGreaterThan(0);
      expect(stats.totalFlows).toBeGreaterThan(0);
      expect(useCases.length).toBeGreaterThan(1); // At least "Todos" + 1 real use case

      // Validate graph integrity
      graph.edges.forEach(edge => {
        const sourceExists = graph.nodes.some(node => node.id === edge.source);
        const targetExists = graph.nodes.some(node => node.id === edge.target);
        expect(sourceExists).toBe(true);
        expect(targetExists).toBe(true);
      });
    });
  });
});