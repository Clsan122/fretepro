
// Definições de tipos para o sistema de widgets

interface WidgetDefinition {
  name: string;
  tag: string;
  description: string;
  screenshots?: WidgetScreenshot[];
  updateInterval?: number;
  defaults?: Record<string, any>;
}

interface WidgetScreenshot {
  src: string;
  sizes: string;
  label?: string;
}

interface WidgetContent {
  id: string;
  name: string;
  content: {
    title: string;
    data: any;
    html: string;
  };
  lastUpdated: string;
  error?: string;
}

interface WidgetManager {
  init(): Promise<boolean>;
  renderWidget(widgetId: string, data: any): Promise<WidgetContent>;
  updateWidgetData(widgetId: string): Promise<any>;
  registerWidgets(): Promise<boolean>;
  WIDGET_DEFINITIONS: Record<string, WidgetDefinition>;
}

// Estender o objeto window
interface Window {
  widgetManager?: WidgetManager;
}
