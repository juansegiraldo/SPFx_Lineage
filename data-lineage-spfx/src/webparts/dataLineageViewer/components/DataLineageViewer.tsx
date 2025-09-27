import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Text,
  Dropdown,
  IDropdownOption,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  DefaultButton,
  PrimaryButton
} from '@fluentui/react';
import { IDataLineageViewerProps } from './IDataLineageViewerProps';
import {
  IDataLineageRecord,
  IDataLineageGraph,
  IDataLineageStats,
  DataLineageLayer
} from '../models/IDataLineage';
import { MockDataService } from '../services/MockDataService';
import { SharePointService, ISharePointServiceConfig } from '../services/SharePointService';
import { DataProcessingService } from '../services/DataProcessingService';
import { CytoscapeGraph } from './CytoscapeGraph';
import { FileUploader } from './FileUploader';
import styles from './DataLineageViewer.module.scss';

export interface IDataLineageViewerState {
  data: IDataLineageRecord[];
  filteredGraph: IDataLineageGraph;
  stats: IDataLineageStats;
  useCases: string[];
  selectedUseCase: string;
  isLoading: boolean;
  error: string | null;
  isSharePointMode: boolean;
  sharePointConnected: boolean;
}

export const DataLineageViewer: React.FC<IDataLineageViewerProps> = (props) => {
  const [state, setState] = useState<IDataLineageViewerState>({
    data: [],
    filteredGraph: { nodes: [], edges: [] },
    stats: {
      totalFlows: 0,
      totalNodes: 0,
      totalConnections: 0,
      activeFlows: 0,
      nodesByLayer: {
        [DataLineageLayer.Source]: 0,
        [DataLineageLayer.Ingestion]: 0,
        [DataLineageLayer.Storage]: 0,
        [DataLineageLayer.Processing]: 0,
        [DataLineageLayer.Consumption]: 0
      }
    },
    useCases: ['Todos'],
    selectedUseCase: 'Todos',
    isLoading: true,
    error: null,
    isSharePointMode: false,
    sharePointConnected: false
  });

  const [sharePointService, setSharePointService] = useState<SharePointService | null>(null);

  // Inicializar servicios
  useEffect(() => {
    const initializeServices = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Intentar conexión a SharePoint primero
        const spConfig: ISharePointServiceConfig = {
          listName: props.sharePointListName || 'DataLineage',
          context: props.context
        };

        const spService = new SharePointService(spConfig);
        const isConnected = await spService.testConnection();

        if (isConnected) {
          // Modo SharePoint
          setSharePointService(spService);
          const spData = await spService.getDataLineageRecords();
          const spUseCases = await spService.getUseCases();

          setState(prev => ({
            ...prev,
            data: spData,
            useCases: spUseCases,
            isSharePointMode: true,
            sharePointConnected: true,
            isLoading: false
          }));
        } else {
          // Modo local con datos mock
          throw new Error('No se pudo conectar a SharePoint');
        }
      } catch (error) {
        console.warn('Falling back to mock data:', error);

        // Usar datos mock
        const mockData = MockDataService.getMockData();
        const mockUseCases = MockDataService.getUseCases();

        setState(prev => ({
          ...prev,
          data: mockData,
          useCases: mockUseCases,
          isSharePointMode: false,
          sharePointConnected: false,
          isLoading: false,
          error: `Modo local: ${error.message}`
        }));
      }
    };

    initializeServices();
  }, [props.context, props.sharePointListName]);

  // Procesar datos cuando cambian los datos o el filtro
  useEffect(() => {
    if (state.data.length > 0) {
      const graph = DataProcessingService.processDataToGraph(
        state.data,
        state.selectedUseCase === 'Todos' ? undefined : state.selectedUseCase
      );
      const stats = DataProcessingService.calculateStats(state.data, graph);

      setState(prev => ({
        ...prev,
        filteredGraph: graph,
        stats: stats
      }));
    }
  }, [state.data, state.selectedUseCase]);

  // Manejar cambio de caso de uso
  const handleUseCaseChange = useCallback((event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      setState(prev => ({
        ...prev,
        selectedUseCase: option.key as string
      }));
    }
  }, []);

  // Manejar datos cargados desde Excel
  const handleExcelDataLoaded = useCallback((data: IDataLineageRecord[]) => {
    if (data.length === 0) {
      // Volver a datos originales
      const originalData = state.isSharePointMode ? [] : MockDataService.getMockData();
      const originalUseCases = state.isSharePointMode ? ['Todos'] : MockDataService.getUseCases();

      setState(prev => ({
        ...prev,
        data: originalData,
        useCases: originalUseCases,
        selectedUseCase: 'Todos'
      }));
    } else {
      // Usar datos de Excel
      const excelUseCases = DataProcessingService.getUseCases(data);
      setState(prev => ({
        ...prev,
        data: data,
        useCases: excelUseCases,
        selectedUseCase: 'Todos'
      }));
    }
  }, [state.isSharePointMode]);

  // Refrescar datos de SharePoint
  const handleRefreshData = useCallback(async () => {
    if (!sharePointService) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const spData = await sharePointService.getDataLineageRecords();
      const spUseCases = await sharePointService.getUseCases();

      setState(prev => ({
        ...prev,
        data: spData,
        useCases: spUseCases,
        selectedUseCase: 'Todos',
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Error actualizando datos: ${error.message}`,
        isLoading: false
      }));
    }
  }, [sharePointService]);

  // Manejar click en nodo
  const handleNodeClick = useCallback((nodeId: string) => {
    console.log('Node clicked:', nodeId);
    // Aquí se puede agregar lógica adicional como mostrar detalles del nodo
  }, []);

  // Preparar opciones del dropdown
  const useCaseOptions: IDropdownOption[] = state.useCases.map(useCase => ({
    key: useCase,
    text: useCase
  }));

  if (state.isLoading) {
    return (
      <div className={styles.dataLineageViewer}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <Spinner size={SpinnerSize.large} />
            <Text className={styles.loadingText}>Cargando datos del linaje...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dataLineageViewer}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Text className={styles.title}>Visualizador de Linaje de Datos</Text>
          <Text className={styles.subtitle}>
            Explora y visualiza el flujo de datos a través de las diferentes capas de tu arquitectura
          </Text>
        </div>

        {/* Error Message */}
        {state.error && (
          <MessageBar
            messageBarType={state.isSharePointMode ? MessageBarType.error : MessageBarType.warning}
            dismissButtonAriaLabel="Cerrar"
          >
            {state.error}
          </MessageBar>
        )}

        {/* Connection Status */}
        <MessageBar
          messageBarType={state.sharePointConnected ? MessageBarType.success : MessageBarType.info}
          dismissButtonAriaLabel="Cerrar"
        >
          {state.sharePointConnected
            ? `Conectado a SharePoint - Lista: ${props.sharePointListName || 'DataLineage'}`
            : 'Usando datos de ejemplo - Para datos reales, configure la conexión a SharePoint'
          }
        </MessageBar>

        {/* Controls Section */}
        <div className={styles.controlsSection}>
          <Text className={styles.sectionTitle}>Controles y Filtros</Text>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            {/* Use Case Filter */}
            <Stack className={styles.filterSection}>
              <Text className={styles.filterLabel}>Caso de Uso:</Text>
              <Dropdown
                options={useCaseOptions}
                selectedKey={state.selectedUseCase}
                onChange={handleUseCaseChange}
                placeholder="Seleccionar caso de uso"
                className={styles.dropdown}
              />
            </Stack>

            {/* Refresh Button (only for SharePoint mode) */}
            {state.sharePointConnected && (
              <Stack verticalAlign="end">
                <DefaultButton
                  text="Actualizar datos"
                  iconProps={{ iconName: 'Refresh' }}
                  onClick={handleRefreshData}
                />
              </Stack>
            )}
          </Stack>
        </div>

        {/* File Uploader */}
        {props.enableExcelUpload && (
          <FileUploader
            onDataLoaded={handleExcelDataLoaded}
            isVisible={!state.sharePointConnected || props.enableExcelUpload}
            disabled={state.isLoading}
          />
        )}

        {/* Statistics Section */}
        <div className={styles.statsSection}>
          <Text className={styles.sectionTitle}>Estadísticas del Linaje</Text>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <Text className={styles.statValue}>{state.stats.totalFlows}</Text>
              <Text className={styles.statLabel}>Flujos Totales</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statValue}>{state.stats.totalNodes}</Text>
              <Text className={styles.statLabel}>Nodos</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statValue}>{state.stats.totalConnections}</Text>
              <Text className={styles.statLabel}>Conexiones</Text>
            </div>
            <div className={styles.statCard}>
              <Text className={styles.statValue}>{state.stats.activeFlows}</Text>
              <Text className={styles.statLabel}>Flujos Activos</Text>
            </div>
          </div>
        </div>

        {/* Graph Visualization */}
        <CytoscapeGraph
          graphData={state.filteredGraph}
          height="600px"
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};