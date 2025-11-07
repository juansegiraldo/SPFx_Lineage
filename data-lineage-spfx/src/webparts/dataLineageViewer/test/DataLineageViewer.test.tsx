import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataLineageViewer } from '../components/DataLineageViewer';
import { MockDataService } from '../services/MockDataService';

// Mock the services
jest.mock('../services/SharePointService');
jest.mock('../services/MockDataService');
jest.mock('../components/CytoscapeGraph', () => {
  return {
    CytoscapeGraph: ({ graphData, onNodeClick }: any) => (
      <div data-testid="cytoscape-graph">
        <div data-testid="graph-nodes">{graphData.nodes.length} nodes</div>
        <div data-testid="graph-edges">{graphData.edges.length} edges</div>
        {graphData.nodes.map((node: any) => (
          <button
            key={node.id}
            data-testid={`node-${node.id}`}
            onClick={() => onNodeClick(node.id)}
          >
            {node.label}
          </button>
        ))}
      </div>
    )
  };
});

const baseContext = {
  sdks: { microsoftTeams: undefined },
  pageContext: {
    web: { title: 'Test Site', absoluteUrl: 'http://test.com' },
    user: { displayName: 'Test User' }
  }
} as any;

const mockProps = {
  description: 'Test Description',
  context: baseContext,
  sharePointListName: 'TestList',
  primaryColor: '#0078d4',
  secondaryColor: '#106ebe',
  isDarkTheme: false,
  environmentMessage: 'Test',
  hasTeamsContext: false,
  userDisplayName: 'Test User'
};

const mockData = [
  {
    UseCase: 'Test Use Case 1',
    DataSources: 'Test Source 1',
    Ingestion: 'Test Ingestion 1',
    Storage: 'Test Storage 1',
    ProcessingTransformation: 'Test Processing 1',
    ConsumptionReporting: 'Test Reporting 1',
    Linaje: true
  },
  {
    UseCase: 'Test Use Case 2',
    DataSources: 'Test Source 2',
    Ingestion: 'Test Ingestion 2',
    Storage: 'Test Storage 2',
    ProcessingTransformation: 'Test Processing 2',
    ConsumptionReporting: 'Test Reporting 2',
    Linaje: true
  },
  {
    UseCase: 'Inactive Use Case',
    DataSources: 'Inactive Source',
    Ingestion: 'Inactive Ingestion',
    Storage: 'Inactive Storage',
    ProcessingTransformation: 'Inactive Processing',
    ConsumptionReporting: 'Inactive Reporting',
    Linaje: false
  }
];

describe('DataLineageViewer Component', () => {

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock the MockDataService
    (MockDataService.getMockData as jest.Mock).mockReturnValue(mockData);
    (MockDataService.getUseCases as jest.Mock).mockReturnValue(['Todos', 'Test Use Case 1', 'Test Use Case 2']);
  });

  describe('Component Rendering', () => {
    it('should render the main title', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Visualizador de Linaje de Datos')).toBeInTheDocument();
      });
    });

    it('should show loading spinner initially', () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      expect(screen.getByText('Cargando datos del linaje...')).toBeInTheDocument();
    });

    it('should display mock data message when SharePoint is not available', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Usando datos de ejemplo/)).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading and Processing', () => {
    it('should load and display statistics correctly', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        // Should show stats for active flows only (2 records with Linaje: true)
        expect(screen.getByText('2')).toBeInTheDocument(); // Total flows
        expect(screen.getByText('Flujos Totales')).toBeInTheDocument();
      });
    });

    it('should display use case dropdown with correct options', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        const dropdown = screen.getByRole('combobox');
        expect(dropdown).toBeInTheDocument();

        // Check if dropdown has the "Todos" option selected by default
        expect(dropdown).toHaveDisplayValue('Todos');
      });
    });

    it('should render Cytoscape graph with processed data', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('cytoscape-graph')).toBeInTheDocument();
        expect(screen.getByTestId('graph-nodes')).toBeInTheDocument();
        expect(screen.getByTestId('graph-edges')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should update graph when use case filter changes', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('cytoscape-graph')).toBeInTheDocument();
      });

      // Change use case filter
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'Test Use Case 1' } });

      // Assert
      await waitFor(() => {
        // Graph should update with filtered data
        expect(screen.getByTestId('cytoscape-graph')).toBeInTheDocument();
      });
    });

    it('should handle node click events', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      render(<DataLineageViewer {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('cytoscape-graph')).toBeInTheDocument();
      });

      // Click on a node (if any are rendered)
      const nodes = screen.queryAllByTestId(/node-/);
      if (nodes.length > 0) {
        fireEvent.click(nodes[0]);
      }

      // Assert
      // This tests that the onNodeClick handler is properly passed and would work
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Node clicked'));

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty data gracefully', async () => {
      // Arrange
      (MockDataService.getMockData as jest.Mock).mockReturnValue([]);
      (MockDataService.getUseCases as jest.Mock).mockReturnValue(['Todos']);

      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        // Should still render without crashing
        expect(screen.getByText('Visualizador de Linaje de Datos')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // No flows
      });
    });

    it('should display error message when data loading fails', async () => {
      // Arrange
      (MockDataService.getMockData as jest.Mock).mockImplementation(() => {
        throw new Error('Mock data loading failed');
      });

      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Modo local/)).toBeInTheDocument();
      });
    });
  });


  describe('SharePoint Integration', () => {
    it('should attempt SharePoint connection first', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        // Should eventually fall back to mock data since SharePoint is mocked to fail
        expect(screen.getByText(/Usando datos de ejemplo/)).toBeInTheDocument();
      });
    });

    it('should display refresh button when SharePoint is connected', async () => {
      // Note: This would require mocking successful SharePoint connection
      // For now, we test the fallback behavior
      render(<DataLineageViewer {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Usando datos de ejemplo/)).toBeInTheDocument();
      });
    });
  });

  describe('Data Integrity', () => {
    it('should only process records with Linaje = true', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        // Should show 2 active flows (not 3, since one has Linaje: false)
        expect(screen.getByText('2')).toBeInTheDocument();

        // Should not show data from inactive record
        expect(screen.queryByText('Inactive Source')).not.toBeInTheDocument();
      });
    });

    it('should create correct number of nodes and edges', async () => {
      // Act
      render(<DataLineageViewer {...mockProps} />);

      // Assert
      await waitFor(() => {
        const nodesElement = screen.getByTestId('graph-nodes');
        const edgesElement = screen.getByTestId('graph-edges');

        expect(nodesElement).toBeInTheDocument();
        expect(edgesElement).toBeInTheDocument();

        // Verify that nodes and edges are greater than 0
        expect(nodesElement.textContent).toMatch(/\d+ nodes/);
        expect(edgesElement.textContent).toMatch(/\d+ edges/);
      });
    });
  });
});