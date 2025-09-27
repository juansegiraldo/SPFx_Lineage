declare interface IDataLineageViewerWebPartStrings {
  PropertyPaneDescription: string;
  DataGroupName: string;
  AppearanceGroupName: string;
  SharePointListNameFieldLabel: string;
  EnableExcelUploadFieldLabel: string;
  PrimaryColorFieldLabel: string;
  SecondaryColorFieldLabel: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
}

declare module 'DataLineageViewerWebPartStrings' {
  const strings: IDataLineageViewerWebPartStrings;
  export = strings;
}