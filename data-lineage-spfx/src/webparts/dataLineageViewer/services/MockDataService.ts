import { IDataLineageRecord } from '../models/IDataLineage';

export class MockDataService {
  public static getMockData(): IDataLineageRecord[] {
    return [
      {
        UseCase: 'Análisis de Ventas',
        DataSources: 'SAP',
        Ingestion: 'Azure Data Factory',
        Storage: 'Azure SQL Database',
        ProcessingTransformation: 'Azure Databricks',
        ConsumptionReporting: 'Power BI',
        Linaje: true
      },
      {
        UseCase: 'Análisis de Ventas',
        DataSources: 'Salesforce',
        Ingestion: 'Azure Data Factory',
        Storage: 'Azure SQL Database',
        ProcessingTransformation: 'Azure Databricks',
        ConsumptionReporting: 'Power BI',
        Linaje: true
      },
      {
        UseCase: 'Customer Analytics',
        DataSources: 'CRM System',
        Ingestion: 'Apache Kafka',
        Storage: 'Data Lake Storage',
        ProcessingTransformation: 'Azure Synapse',
        ConsumptionReporting: 'Tableau',
        Linaje: true
      },
      {
        UseCase: 'Customer Analytics',
        DataSources: 'Web Analytics',
        Ingestion: 'API Gateway',
        Storage: 'Cosmos DB',
        ProcessingTransformation: 'Azure Functions',
        ConsumptionReporting: 'Excel',
        Linaje: true
      },
      {
        UseCase: 'Financial Reporting',
        DataSources: 'ERP System',
        Ingestion: 'SSIS',
        Storage: 'SQL Server',
        ProcessingTransformation: 'SQL Stored Procedures',
        ConsumptionReporting: 'SSRS Reports',
        Linaje: true
      },
      {
        UseCase: 'Supply Chain',
        DataSources: 'IoT Sensors',
        Ingestion: 'Azure IoT Hub',
        Storage: 'Time Series Database',
        ProcessingTransformation: 'Stream Analytics',
        ConsumptionReporting: 'Grafana Dashboard',
        Linaje: true
      },
      {
        UseCase: 'HR Analytics',
        DataSources: 'HRIS',
        Ingestion: 'ETL Process',
        Storage: 'Data Warehouse',
        ProcessingTransformation: 'OLAP Cubes',
        ConsumptionReporting: 'HR Dashboard',
        Linaje: false
      },
      {
        UseCase: 'Marketing Campaign',
        DataSources: 'Social Media APIs',
        Ingestion: 'REST API',
        Storage: 'MongoDB',
        ProcessingTransformation: 'Python Scripts',
        ConsumptionReporting: 'Marketing Dashboard',
        Linaje: true
      }
    ];
  }

  public static getUseCases(): string[] {
    const data = this.getMockData();
    const useCaseSet = new Set(data.filter(item => item.Linaje).map(item => item.UseCase));
    const useCases: string[] = [];
    useCaseSet.forEach(useCase => useCases.push(useCase));
    return ['Todos', ...useCases];
  }
}