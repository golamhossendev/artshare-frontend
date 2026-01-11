import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import type {
  IEventTelemetry,
  IExceptionTelemetry,
} from "@microsoft/applicationinsights-web";

let appInsights: ApplicationInsights | null = null;

// Initialize Application Insights
export function initTelemetry(connectionString?: string) {
  if (!connectionString) {
    console.warn("Application Insights connection string not provided");
    return;
  }

  try {
    appInsights = new ApplicationInsights({
      config: {
        connectionString: connectionString,
        enableAutoRouteTracking: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableCorsCorrelation: true,
        enableAjaxPerfTracking: true,
        enableUnhandledPromiseRejectionTracking: true,
      },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();

    console.log("Application Insights initialized");
  } catch (error) {
    console.error("Failed to initialize Application Insights:", error);
  }
}

// Track custom events
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (!appInsights) {
    console.warn("Application Insights not initialized");
    return;
  }

  try {
    const event: IEventTelemetry = {
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    };
    appInsights.trackEvent(event);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

// Track exceptions
export function trackException(error: Error, properties?: Record<string, any>) {
  if (!appInsights) {
    console.warn("Application Insights not initialized");
    return;
  }

  try {
    const exception: IExceptionTelemetry = {
      exception: error,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    };
    appInsights.trackException(exception);
  } catch (err) {
    console.error("Failed to track exception:", err);
  }
}

// Track page views
export function trackPageView(name?: string, uri?: string) {
  if (!appInsights) {
    return;
  }

  try {
    appInsights.trackPageView({
      name,
      uri,
    });
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
}

// Track custom metrics
export function trackMetric(
  name: string,
  value: number,
  properties?: Record<string, any>
) {
  if (!appInsights) {
    return;
  }

  try {
    appInsights.trackMetric({
      name,
      average: value,
      properties,
    });
  } catch (error) {
    console.error("Failed to track metric:", error);
  }
}

// Track dependencies (API calls)
export function trackDependency(
  name: string,
  commandName: string,
  duration: number,
  success: boolean,
  properties?: Record<string, any>
) {
  if (!appInsights) {
    return;
  }

  try {
    appInsights.trackDependencyData({
      name,
      target: commandName,
      duration,
      success,
      responseCode: success ? 200 : 500,
      id: crypto.randomUUID(),
      properties,
    });
  } catch (error) {
    console.error("Failed to track dependency:", error);
  }
}

export { appInsights };
