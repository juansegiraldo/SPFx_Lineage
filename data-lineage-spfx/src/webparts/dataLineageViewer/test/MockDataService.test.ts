import { MockDataService } from '../services/MockDataService';
import { IDataLineageRecord } from '../models/IDataLineage';

describe('MockDataService', () => {

  describe('getMockData', () => {
    it('should return an array of data lineage records', () => {
      // Act
      const data = MockDataService.getMockData();

      // Assert
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should return records with all required properties', () => {
      // Act
      const data = MockDataService.getMockData();

      // Assert
      data.forEach((record: IDataLineageRecord) => {
        expect(record).toHaveProperty('UseCase');
        expect(record).toHaveProperty('DataSources');
        expect(record).toHaveProperty('Ingestion');
        expect(record).toHaveProperty('Storage');
        expect(record).toHaveProperty('ProcessingTransformation');
        expect(record).toHaveProperty('ConsumptionReporting');
        expect(record).toHaveProperty('Linaje');

        // Ensure properties are strings (not null/undefined)
        expect(typeof record.UseCase).toBe('string');
        expect(typeof record.DataSources).toBe('string');
        expect(typeof record.Ingestion).toBe('string');
        expect(typeof record.Storage).toBe('string');
        expect(typeof record.ProcessingTransformation).toBe('string');
        expect(typeof record.ConsumptionReporting).toBe('string');
        expect(typeof record.Linaje).toBe('boolean');
      });
    });

    it('should have at least one record with Linaje = true', () => {
      // Act
      const data = MockDataService.getMockData();

      // Assert
      const activeRecords = data.filter(record => record.Linaje === true);
      expect(activeRecords.length).toBeGreaterThan(0);
    });

    it('should have valid use cases', () => {
      // Act
      const data = MockDataService.getMockData();

      // Assert
      const useCases = data.map(record => record.UseCase);
      const uniqueUseCases = [...new Set(useCases)];

      expect(uniqueUseCases.length).toBeGreaterThan(0);
      uniqueUseCases.forEach(useCase => {
        expect(useCase).toBeTruthy();
        expect(useCase.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getUseCases', () => {
    it('should return an array starting with "Todos"', () => {
      // Act
      const useCases = MockDataService.getUseCases();

      // Assert
      expect(Array.isArray(useCases)).toBe(true);
      expect(useCases[0]).toBe('Todos');
    });

    it('should return unique use cases from active records only', () => {
      // Arrange
      const data = MockDataService.getMockData();
      const activeRecords = data.filter(record => record.Linaje === true);
      const expectedUseCases = [...new Set(activeRecords.map(record => record.UseCase))];

      // Act
      const useCases = MockDataService.getUseCases();

      // Assert
      expect(useCases.length).toBe(expectedUseCases.length + 1); // +1 for "Todos"

      // Check that all expected use cases are present (excluding "Todos")
      expectedUseCases.forEach(expectedUseCase => {
        expect(useCases).toContain(expectedUseCase);
      });
    });

    it('should not include use cases from inactive records', () => {
      // Arrange
      const data = MockDataService.getMockData();
      const inactiveRecords = data.filter(record => record.Linaje === false);

      // Act
      const useCases = MockDataService.getUseCases();

      // Assert
      inactiveRecords.forEach(inactiveRecord => {
        // If there's an active record with the same use case, it should be included
        const hasActiveWithSameUseCase = data.some(
          record => record.Linaje === true && record.UseCase === inactiveRecord.UseCase
        );

        if (!hasActiveWithSameUseCase) {
          expect(useCases).not.toContain(inactiveRecord.UseCase);
        }
      });
    });
  });
});