import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'DataLineageViewerWebPartStrings';
import { DataLineageViewer } from './components/DataLineageViewer';
import { IDataLineageViewerProps } from './components/IDataLineageViewerProps';

export interface IDataLineageViewerWebPartProps {
  description: string;
  sharePointListName: string;
  enableExcelUpload: boolean;
  primaryColor: string;
  secondaryColor: string;
}

export default class DataLineageViewerWebPart extends BaseClientSideWebPart<IDataLineageViewerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IDataLineageViewerProps> = React.createElement(
      DataLineageViewer,
      {
        description: this.properties.description,
        context: this.context,
        sharePointListName: this.properties.sharePointListName,
        enableExcelUpload: this.properties.enableExcelUpload,
        primaryColor: this.properties.primaryColor,
        secondaryColor: this.properties.secondaryColor,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.pageContext.web.isAppWeb ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true,
                  rows: 3
                }),
                PropertyPaneTextField('sharePointListName', {
                  label: strings.SharePointListNameFieldLabel,
                  description: 'Nombre de la lista de SharePoint que contiene los datos del linaje. Por defecto: DataLineage'
                }),
                PropertyPaneToggle('enableExcelUpload', {
                  label: strings.EnableExcelUploadFieldLabel,
                  onText: 'Habilitado',
                  offText: 'Deshabilitado'
                })
              ]
            },
            {
              groupName: strings.AppearanceGroupName,
              groupFields: [
                PropertyPaneTextField('primaryColor', {
                  label: strings.PrimaryColorFieldLabel,
                  description: 'Color primario en formato hex (ej: #0078d4)'
                }),
                PropertyPaneTextField('secondaryColor', {
                  label: strings.SecondaryColorFieldLabel,
                  description: 'Color secundario en formato hex (ej: #106ebe)'
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'sharePointListName' ||
        propertyPath === 'enableExcelUpload' ||
        propertyPath === 'primaryColor' ||
        propertyPath === 'secondaryColor') {
      this.render();
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }
}