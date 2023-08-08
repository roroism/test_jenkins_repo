export type Translation = {
  en: string;
  jp: string;
  ko: string;
  vi: string;
  zh: string;
};

type Owner = {
  id: string;
  _id: string;
  displayName: string;
};

export type WidgetAsset = {
  id: string;
  md5: string;
  name: string;
  /** .js */
  fileType: string;
  mimeType: string;
};

type PropertyPattern = {
  code: string;
  defVal?: string;
  desc?: Translation;
  isHidden: boolean;
  min: number;
  max: number;
  name: Translation;
  options: {
    key: string;
    value: Translation;
  }[];
} & (
  | { ctrType: 'INPUT'; dataType: 'STRING' | 'IMAGE' | 'VIDEO' }
  | { ctrType: 'SELECT'; dataType: 'STRING' }
  | { ctrType: 'COLOR'; dataType: 'STRING' }
  | { ctrType: 'SWITCH'; dataType: 'BOOLEAN' }
  | { ctrType: 'NUMBER'; dataType: 'STRING' }
);

export type WidgetDataItem = WidgetDataImageItem | WidgetDataVideoItem;

type WidgetDataImageItem = {
  code: 'PHOTO';
  dataType: 'IMAGE';
  value: string;
  dataSrc: 'SDSS';
  dataName: string;
  srcLink: string;
  srcType: string;
  mimeType: string;
};

type WidgetDataVideoItem = {
  code: 'VIDEO';
  dataType: 'VIDEO';
  value: string;
  dataSrc: 'SDSS';
  dataName: string;
  srcLink: string;
  srcType: string;
  mimeType: string;
};

export type WidgetDataElement = {
  zOrder: number;
  item: WidgetDataItem[];
};

type WidgetDataPattern = {
  code: string;
  dataName: string;
  dataSrc: string;
  dataType: string;
  mimeType: string;
  srcLink: string;
  value: string;
};

export type Property = {
  code: string;
  dataType: PropertyPattern['dataType'];
  value: string;
  _id?: string;
};

export interface WidgetBase {
  app: string;
  assets: WidgetAsset[];
  code: string;
  createdDate: string;
  desc: Translation;
  id: string;
  isPrivate: boolean;
  isSystem: boolean;
  name: Translation;
  owner: Owner;
  players: string[];
  status: 'ACTIVATED' | 'DEACTIVATED';
  type: 'WEB_COMPONENT';
  updatedDate: string;
  updater: string;
  usedCount: number;
  _id: string;
}

export interface WidgetBaseSingle {
  app: string;
  assets: WidgetAsset[];
  code: string;
  data: WidgetDataElement[];
  dataPattern: WidgetDataPattern[];
  desc: Translation;
  id: string;
  isPrivate: boolean;
  name: Translation;
  players: string[];
  properties: Property[];
  propertyPatterns: PropertyPattern[];
  status: 'ACTIVATED' | 'DEACTIVATED';
  type: 'WEB_COMPONENT';
}

export interface WidgetInstance {
  app: string;
  assets: WidgetAsset[];
  code: string;
  createdDate: string;
  data: WidgetDataElement[];
  dataPattern: WidgetDataPattern[];
  id: string;
  name: Translation;
  owner: Owner;
  players: string[];
  properties: Property[];
  propertyPatterns: PropertyPattern[];
  status: 'ACTIVATED' | 'DEACTIVATED';
  type: 'WEB_COMPONENT';
  updatedDate: string;
  widget: string;
}
