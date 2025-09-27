import * as React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { DefaultButton, Stack, Text } from '@fluentui/react';
import { IDataLineageGraph, DataLineageLayer, LayerColors, LayerLabels } from '../models/IDataLineage';
import styles from './DataLineageViewer.module.scss';

// Importar Cytoscape y el plugin de manera global
declare const cytoscape: any;
declare const cytoscapeDagre: any;

export interface ICytoscapeGraphProps {
  graphData: IDataLineageGraph;
  height?: string;
  onNodeClick?: (nodeId: string) => void;
}

export const CytoscapeGraph: React.FC<ICytoscapeGraphProps> = ({
  graphData,
  height = '600px',
  onNodeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

  // Función para inicializar el gráfico de Cytoscape
  const initializeCytoscape = useCallback(() => {
    if (!containerRef.current || typeof cytoscape === 'undefined') {
      return;
    }

    // Limpiar instancia anterior si existe
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Registrar plugin dagre si está disponible (idempotente)
    try {
      if (typeof cytoscapeDagre !== 'undefined') {
        cytoscape.use(cytoscapeDagre);
      }
    } catch (e) {
      // Ignorar errores de registro repetido
    }

    // Preparar datos para Cytoscape
    const elements = [
      // Agregar nodos
      ...graphData.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          layer: node.layer,
          useCase: node.useCase
        },
        style: {
          'background-color': node.color,
          'label': node.label,
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'font-weight': 'bold',
          'color': '#ffffff',
          'text-outline-width': 1,
          'text-outline-color': '#000000',
          'width': Math.max(node.label.length * 8, 80),
          'height': 40,
          'shape': 'roundrectangle'
        }
      })),
      // Agregar aristas
      ...graphData.edges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          useCase: edge.useCase
        },
        style: {
          'width': 3,
          'line-color': '#666',
          'target-arrow-color': '#666',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'opacity': 0.8
        }
      }))
    ];

    // Crear instancia de Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'font-weight': 'bold',
            'color': '#ffffff',
            'text-outline-width': 1,
            'text-outline-color': '#000000',
            'width': 'mapData(label.length, 5, 20, 80, 200)',
            'height': 40,
            'shape': 'roundrectangle',
            'cursor': 'pointer'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#666',
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.8
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#ff6b35',
            'border-opacity': 1
          }
        },
        {
          selector: 'node:hover',
          style: {
            'border-width': 2,
            'border-color': '#ffffff',
            'border-opacity': 1
          }
        }
      ],
      layout: {
        name: 'dagre',
        directed: true,
        spacingFactor: 1.5,
        nodeDimensionsIncludeLabels: true,
        rankSep: 200,
        nodeSep: 100,
        edgeSep: 50,
        rankDir: 'LR' // Left to Right para flujo horizontal
      },
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.1,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single',
      autoungrabify: false
    });

    // Agregar event listeners
    if (onNodeClick) {
      cyRef.current.on('tap', 'node', (event: any) => {
        const node = event.target;
        onNodeClick(node.id());
      });
    }

    // Tooltip al hover
    cyRef.current.on('mouseover', 'node', (event: any) => {
      const node = event.target;
      const tooltip = `Capa: ${LayerLabels[node.data('layer')]}\nNombre: ${node.data('label')}\nUso: ${node.data('useCase')}`;
      node.style('tooltip', tooltip);
    });

    // Ajustar vista inicial
    setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.fit();
        cyRef.current.center();
      }
    }, 100);

  }, [graphData, onNodeClick]);

  // Función para exportar como imagen
  const exportAsImage = useCallback(() => {
    if (cyRef.current) {
      const png64 = cyRef.current.png({
        output: 'base64uri',
        bg: '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = 'data-lineage-graph.png';
      link.href = png64;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // Función para centrar la vista
  const centerGraph = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  }, []);

  // Inicializar Cytoscape cuando se monta el componente o cambian los datos
  useEffect(() => {
    // Verificar si Cytoscape está cargado
    const checkCytoscape = () => {
      if (typeof cytoscape !== 'undefined') {
        initializeCytoscape();
      } else {
        // Intentar cargar Cytoscape si no está disponible
        console.warn('Cytoscape not loaded, attempting to load...');
        setTimeout(checkCytoscape, 100);
      }
    };

    checkCytoscape();

    // Cleanup al desmontar
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [initializeCytoscape]);

  // Manejar redimensionado de ventana
  useEffect(() => {
    const handleResize = () => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!graphData.nodes.length) {
    return (
      <div className={styles.emptyGraphContainer} style={{ height }}>
        <Stack horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 20 }}>
          <Text variant="large" className={styles.emptyGraphText}>
            No hay datos para mostrar
          </Text>
          <Text variant="medium" className={styles.emptyGraphSubtext}>
            Seleccione un caso de uso o cargue datos para visualizar el linaje
          </Text>
        </Stack>
      </div>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} className={styles.graphContainer}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="mediumPlus" className={styles.sectionTitle}>
          Visualización del Linaje de Datos
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            text="Centrar vista"
            iconProps={{ iconName: 'ZoomToFit' }}
            onClick={centerGraph}
          />
          <DefaultButton
            text="Exportar imagen"
            iconProps={{ iconName: 'Download' }}
            onClick={exportAsImage}
          />
        </Stack>
      </Stack>

      <div
        ref={containerRef}
        className={styles.cytoscapeContainer}
        style={{ height, border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* Leyenda de colores */}
      <Stack horizontal wrap tokens={{ childrenGap: 15 }} className={styles.legendContainer}>
        {Object.keys(LayerLabels).map((layer) => (
          <Stack key={layer} horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
            <div
              className={styles.legendColor}
              style={{ backgroundColor: LayerColors[layer as DataLineageLayer] }}
            />
            <Text variant="small">{LayerLabels[layer as DataLineageLayer]}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};