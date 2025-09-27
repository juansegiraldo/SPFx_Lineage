import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDataLineageViewerProps {
  description: string;
  context: WebPartContext;
  sharePointListName: string;
  enableExcelUpload: boolean;
  primaryColor: string;
  secondaryColor: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}