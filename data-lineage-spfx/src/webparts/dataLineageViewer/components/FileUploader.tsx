import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  ProgressIndicator,
  Icon
} from '@fluentui/react';
import * as XLSX from 'xlsx';
import { IDataLineageRecord } from '../models/IDataLineage';
import { DataProcessingService } from '../services/DataProcessingService';
import styles from './DataLineageViewer.module.scss';

export interface IFileUploaderProps {
  onDataLoaded: (data: IDataLineageRecord[]) => void;
  isVisible: boolean;
  disabled?: boolean;
}

export const FileUploader: React.FC<IFileUploaderProps> = ({
  onDataLoaded,
  isVisible,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: MessageBarType; text: string } | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Tomar la primera hoja de trabajo
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('No se encontraron hojas de trabajo en el archivo Excel');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          throw new Error('El archivo debe contener al menos una fila de encabezados y una fila de datos');
        }

        // Convertir array de arrays a array de objetos
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as any[][];

        const processedData = dataRows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        // Validar estructura de datos
        const validation = DataProcessingService.validateDataStructure(processedData);
        if (!validation.isValid) {
          throw new Error(`Estructura de datos inválida: ${validation.errors.join(', ')}`);
        }

        // Procesar datos a nuestro formato
        const lineageData = DataProcessingService.processExcelData(processedData);

        if (lineageData.length === 0) {
          throw new Error('No se encontraron datos válidos en el archivo');
        }

        // Notificar datos cargados
        onDataLoaded(lineageData);

        setMessage({
          type: MessageBarType.success,
          text: `Archivo cargado exitosamente: ${lineageData.length} registros procesados`
        });

      } catch (error) {
        console.error('Error processing Excel file:', error);
        setMessage({
          type: MessageBarType.error,
          text: `Error procesando archivo: ${error.message}`
        });
      } finally {
        setIsLoading(false);
        // Limpiar el input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      setMessage({
        type: MessageBarType.error,
        text: 'Error leyendo el archivo. Por favor, intente nuevamente.'
      });
      setIsLoading(false);
      event.target.value = '';
    };

    reader.readAsArrayBuffer(file);
  }, [onDataLoaded]);

  const handleClearData = useCallback(() => {
    onDataLoaded([]);
    setFileName('');
    setMessage({
      type: MessageBarType.info,
      text: 'Datos eliminados. Mostrando datos de ejemplo.'
    });
  }, [onDataLoaded]);

  if (!isVisible) {
    return null;
  }

  return (
    <Stack tokens={{ childrenGap: 15 }} className={styles.fileUploaderSection}>
      <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
        <Icon iconName="ExcelDocument" className={styles.excelIcon} />
        <Text variant="mediumPlus" className={styles.sectionTitle}>
          Cargar archivo Excel
        </Text>
      </Stack>

      <Text variant="small" className={styles.instructionText}>
        Seleccione un archivo Excel (.xlsx) con las columnas: Use Case, Data Sources, Ingestion, Storage, Processing/Transformation, Consumption/Reporting, Linaje
      </Text>

      {isLoading && (
        <ProgressIndicator
          label="Procesando archivo..."
          description="Por favor espere mientras se procesa el archivo Excel"
        />
      )}

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <PrimaryButton
          text="Seleccionar archivo Excel"
          iconProps={{ iconName: 'FolderOpen' }}
          disabled={isLoading || disabled}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx,.xls';
            input.onchange = handleFileUpload as any;
            input.click();
          }}
        />

        {fileName && (
          <DefaultButton
            text="Limpiar datos"
            iconProps={{ iconName: 'Clear' }}
            disabled={isLoading || disabled}
            onClick={handleClearData}
          />
        )}
      </Stack>

      {fileName && (
        <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
          <Icon iconName="CheckMark" className={styles.successIcon} />
          <Text variant="small">Archivo cargado: {fileName}</Text>
        </Stack>
      )}

      {message && (
        <MessageBar
          messageBarType={message.type}
          onDismiss={() => setMessage(null)}
          dismissButtonAriaLabel="Cerrar"
        >
          {message.text}
        </MessageBar>
      )}
    </Stack>
  );
};