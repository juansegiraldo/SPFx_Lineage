import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IDataLineageRecord } from '../models/IDataLineage';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISharePointServiceConfig {
  listName: string;
  context: WebPartContext;
}

export class SharePointService {
  private listName: string;
  private isInitialized: boolean = false;
  private sp: ReturnType<typeof spfi>;

  constructor(private config: ISharePointServiceConfig) {
    this.listName = config.listName || 'DataLineage';
    this.initializeService();
  }

  private initializeService(): void {
    try {
      this.sp = spfi().using(SPFx(this.config.context));
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing SharePoint service:', error);
      this.isInitialized = false;
    }
  }

  public async getDataLineageRecords(): Promise<IDataLineageRecord[]> {
    if (!this.isInitialized) {
      throw new Error('SharePoint service not initialized');
    }

    try {
      const items = await this.sp.web.lists.getByTitle(this.listName).items
        .select('Title', 'UseCase', 'DataSources', 'Ingestion', 'Storage', 'ProcessingTransformation', 'ConsumptionReporting', 'Linaje')();

      return items.map(item => ({
        UseCase: item.UseCase || item.Title,
        DataSources: item.DataSources,
        Ingestion: item.Ingestion,
        Storage: item.Storage,
        ProcessingTransformation: item.ProcessingTransformation,
        ConsumptionReporting: item.ConsumptionReporting,
        Linaje: item.Linaje
      }));
    } catch (error) {
      console.error('Error fetching data from SharePoint:', error);
      throw new Error(`No se pudo obtener datos de la lista '${this.listName}': ${error.message}`);
    }
  }

  public async getUseCases(): Promise<string[]> {
    try {
      const records = await this.getDataLineageRecords();
      const useCaseSet = new Set(records.filter(item => item.Linaje).map(item => item.UseCase));
      const useCases: string[] = [];
      useCaseSet.forEach(useCase => useCases.push(useCase));
      return ['Todos', ...useCases];
    } catch (error) {
      console.error('Error getting use cases from SharePoint:', error);
      return ['Todos'];
    }
  }

  public async testConnection(): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    try {
      await this.sp.web.lists.getByTitle(this.listName)();
      return true;
    } catch (error) {
      console.error('SharePoint connection test failed:', error);
      return false;
    }
  }

  public getListName(): string {
    return this.listName;
  }

  public setListName(listName: string): void {
    this.listName = listName;
  }
}