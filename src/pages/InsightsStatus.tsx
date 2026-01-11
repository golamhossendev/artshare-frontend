import { useGetInsightsStatusQuery } from "../store/api";
import { trackPageView } from "../utils/telemetry";
import { useEffect } from "react";

export const InsightsStatus = () => {
  const { data, isLoading, error } = useGetInsightsStatusQuery();

  useEffect(() => {
    trackPageView('InsightsStatus');
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="text-center py-12 text-gray-500">Loading insights status...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="text-center py-12 text-red-500">
            Failed to load insights status: {error && 'data' in error ? (error.data as { error?: string })?.error : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { applicationInsights } = data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Application Insights Status</h1>
        
        <div className="space-y-6">
          {/* Overall Status */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Configuration Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  applicationInsights.configured && applicationInsights.initialized
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {applicationInsights.configured && applicationInsights.initialized
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm text-gray-600">Connection String:</span>
                <span
                  className={`ml-2 font-medium ${
                    applicationInsights.configured ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {applicationInsights.configured ? "Configured" : "Not Configured"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Initialized:</span>
                <span
                  className={`ml-2 font-medium ${
                    applicationInsights.initialized ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {applicationInsights.initialized ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Enabled Features */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Enabled Features</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(applicationInsights.enabledFeatures).map(([feature, enabled]) => (
                <div
                  key={feature}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-700 capitalize">
                    {feature.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Role Info */}
          {(applicationInsights.cloudRole || applicationInsights.cloudRoleInstance) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cloud Role Information</h2>
              <div className="space-y-2">
                {applicationInsights.cloudRole && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-600">Cloud Role:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {applicationInsights.cloudRole}
                    </span>
                  </div>
                )}
                {applicationInsights.cloudRoleInstance && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-600">Cloud Role Instance:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {applicationInsights.cloudRoleInstance}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Last checked: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

