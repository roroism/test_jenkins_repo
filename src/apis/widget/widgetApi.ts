import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import {
  Property,
  Translation,
  WidgetBaseSingle,
  WidgetDataElement,
  WidgetInstance,
} from './widgetApi.model';

export async function getWidgetBase(widgetId: string) {
  const url = `${config.EXTERNAL.CUBLICK.WIDGET.BASE}/${widgetId}`;
  const axiosConfig = createAuthConfig({ params: { isJsonParsed: true } });
  const res = await axios.get<WidgetBaseSingle>(url, axiosConfig);
  return res.data;
}

export async function getWidgetInstance(widgetId: string) {
  const url = `${config.EXTERNAL.CUBLICK.WIDGET.WID}/${widgetId}`;
  const axiosConfig = createAuthConfig({ params: { isJsonParsed: true } });
  const res = await axios.get<WidgetInstance>(url, axiosConfig);
  return res.data;
}

export async function deleteWidgets(widgetIds: string[]) {
  const url = `${config.EXTERNAL.CUBLICK.WIDGET.WID}/deletes`;
  const axiosConfig = createAuthConfig();
  const body = { ids: JSON.stringify(widgetIds) };
  const res = await axios.put(url, body, axiosConfig);
  return res.data;
}

type PostParam = {
  widget: string;
  name: Translation;
  properties: Property[];
  data: WidgetDataElement[];
};

export async function postWidgetInstance(param: PostParam) {
  const url = `${config.EXTERNAL.CUBLICK.WIDGET.WID}`;
  const body = {
    widget: param.widget,
    name: param.name,
    properties: JSON.stringify(param.properties),
    data: JSON.stringify(param.data),
  };
  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, body, axiosConfig);
  return res.data;
}

type PutParam = {
  id: string;
  name: Translation;
  properties: Property[];
  data: WidgetDataElement[];
};

export async function putWidgetInstance(widget: PutParam) {
  const url = `${config.EXTERNAL.CUBLICK.WIDGET.WID}/${widget.id}`;
  delete widget.id;
  const axiosConfig = createAuthConfig();
  const res = await axios.put(url, widget, axiosConfig);
  return res.data;
}
