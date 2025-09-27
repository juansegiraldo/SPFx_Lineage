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

  describe('processExcelData', () => {
    it('should process Excel data correctly', () => {
      // Arrange
      const excelData = [
        {
          'Use Case': 'Excel Test',
          'Data Sources': 'Excel Source',
          'Ingestion': 'Excel Ingestion',
          'Storage': 'Excel Storage',
          'Processing/Transformation': 'Excel Processing',
          'Consumption/Reporting': 'Excel Reporting',
          'Linaje': 'sí'
        }
      ];

      // Act
      const processed = DataProcessingService.processExcelData(excelData);

      // Assert
      expect(processed.length).toBe(1);
      expect(processed[0].UseCase).toBe('Excel Test');
      expect(processed[0].Linaje).toBe(true); // 'sí' should convert to true
    });

    it('should handle different boolean formats', () => {
      // Arrange
      const excelData = [
        { 'Use Case': 'Test1', 'Data Sources': 'S1', 'Ingestion': 'I1', 'Storage': 'St1', 'Processing/Transformation': 'P1', 'Consumption/Reporting': 'R1', 'Linaje': 'yes' },
        { 'Use Case': 'Test2', 'Data Sources': 'S2', 'Ingestion': 'I2', 'Storage': 'St2', 'Processing/Transformation': 'P2', 'Consumption/Reporting': 'R2', 'Linaje': 'true' },
        { 'Use Case': 'Test3', 'Data Sources': 'S3', 'Ingestion': 'I3', 'Storage': 'St3', 'Processing/Transformation': 'P3', 'Consumption/Reporting': 'R3', 'Linaje': 'no' },
        { 'Use Case': 'Test4', 'Data Sources': 'S4', 'Ingestion': 'I4', 'Storage': 'St4', 'Processing/Transformation': 'P4', 'Consumption/Reporting': 'R4', 'Linaje': true }
      ];

      // Act
      const processed = DataProcessingService.processExcelData(excelData);

      // Assert
      expect(processed[0].Linaje).toBe(true);  // 'yes'
      expect(processed[1].Linaje).toBe(true);  // 'true'
      expect(processed[2].Linaje).toBe(false); // 'no'
      expect(processed[3].Linaje).toBe(true);  // boolean true
    });
  });

  describe('validateDataStructure', () => {
    it('should validate correct data structure', () => {
      // Act
      const validation = DataProcessingService.validateDataStructure(mockData);

      // Assert
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should detect missing required columns', () => {
      // Arrange
      const invalidData = [
        {
          'Use Case': 'Test',
          // Missing other required columns
        }
      ];

      // Act
      const validation = DataProcessingService.validateDataStructure(invalidData);

      // Assert
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
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