import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection, checkSupabaseConfig } from '@/lib/supabase';
import { RefreshCw, Database, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface DebugPanelProps {
  onDataFetched?: (data: any[]) => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ onDataFetched }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const runFullDiagnostic = async () => {
    setIsLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      configCheck: {},
      connection: {},
      tableInfo: {},
      rawData: null,
      errors: []
    };

    try {
      // 1. Check configuration
      console.log('🔍 Step 1: Checking Supabase configuration...');
      const configCheck = checkSupabaseConfig();
      results.configCheck = configCheck;

      if (!configCheck.isValid) {
        results.errors.push(...configCheck.issues);
      }

      // 2. Check environment variables
      console.log('🔍 Step 2: Checking environment variables...');
      results.environment = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'NOT_SET',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
        nodeEnv: import.meta.env.NODE_ENV,
        mode: import.meta.env.MODE,
        urlValid: import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co') || false
      };

      // 3. Test basic connection
      console.log('🔍 Step 3: Testing basic connection...');
      const connectionTest = await testSupabaseConnection();
      results.connection = connectionTest;

      // 4. Try different query approaches if connection works
      if (connectionTest.success) {
        console.log('🔍 Step 4: Trying different query approaches...');
        
        const approaches = [
          {
            name: 'selectAll',
            query: () => supabase.from('Curatit').select('*')
          },
          {
            name: 'selectWithOrder',
            query: () => supabase.from('Curatit').select('*').order('created_at', { ascending: false })
          },
          {
            name: 'selectSpecific',
            query: () => supabase.from('Curatit').select('id, brand_name, brand_post, brand_logo, brand_category, created_at')
          },
          {
            name: 'selectWithLimit',
            query: () => supabase.from('Curatit').select('*').limit(10)
          }
        ];

        results.queries = {};

        for (const approach of approaches) {
          try {
            console.log(`📡 Trying ${approach.name}...`);
            const { data, error } = await approach.query();
            
            results.queries[approach.name] = {
              success: !error,
              error: error?.message,
              dataLength: data?.length || 0,
              data: approach.name === 'selectWithLimit' ? data : undefined // Only store data for limited query
            };

            if (data && data.length > 0 && !results.rawData) {
              results.rawData = data;
              onDataFetched?.(data);
            }
          } catch (err) {
            results.queries[approach.name] = {
              success: false,
              error: `Exception: ${err}`,
              dataLength: 0
            };
          }
        }

        // 5. Get table info
        console.log('🔍 Step 5: Getting table information...');
        try {
          const { count, error: countError } = await supabase
            .from('Curatit')
            .select('*', { count: 'exact', head: true });

          if (countError) {
            results.errors.push(`Count error: ${countError.message}`);
          } else {
            results.tableInfo.totalRows = count;
          }
        } catch (err) {
          results.errors.push(`Count operation error: ${err}`);
        }
      }

    } catch (globalError) {
      results.errors.push(`Global error: ${globalError}`);
    }

    setDebugInfo(results);
    setIsLoading(false);
    
    // Log everything to console for easy copying
    console.log('🐛 FULL DIAGNOSTIC RESULTS:', results);
  };

  useEffect(() => {
    // Run diagnostic on mount
    runFullDiagnostic();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Database className="w-5 h-5" />
        {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Supabase Debug Panel</h3>
            <button
              onClick={runFullDiagnostic}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="p-4 space-y-4 text-sm">
            {/* Configuration Check */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {debugInfo.configCheck && getStatusIcon(debugInfo.configCheck.isValid)}
                Configuration Check
              </h4>
              <div className={`p-2 rounded text-xs ${debugInfo.configCheck?.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {debugInfo.configCheck?.isValid ? (
                  <div>✅ Configuration is valid</div>
                ) : (
                  <div>
                    <div>❌ Configuration issues found:</div>
                    {debugInfo.configCheck?.issues?.map((issue: string, index: number) => (
                      <div key={index} className="ml-2">• {issue}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Environment Variables */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Environment Variables</h4>
              <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                <div>URL: {debugInfo.environment?.supabaseUrl?.substring(0, 30)}...</div>
                <div>Key: {debugInfo.environment?.supabaseKey} ({debugInfo.environment?.keyLength} chars)</div>
                <div>URL Valid: {debugInfo.environment?.urlValid ? '✅' : '❌'}</div>
                <div>Mode: {debugInfo.environment?.mode}</div>
              </div>
            </div>

            {/* Connection Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {debugInfo.connection && getStatusIcon(debugInfo.connection.success)}
                Connection Status
              </h4>
              <div className={`p-2 rounded text-xs ${debugInfo.connection?.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {debugInfo.connection?.success ? (
                  <div>
                    <div>✅ Connected successfully</div>
                    <div>Records found: {debugInfo.connection.count}</div>
                    {debugInfo.connection.message && <div>{debugInfo.connection.message}</div>}
                  </div>
                ) : (
                  <div>
                    <div>❌ Connection failed</div>
                    {debugInfo.connection?.error && <div>Error: {debugInfo.connection.error}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Query Results */}
            {debugInfo.queries && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Query Results</h4>
                <div className="space-y-2">
                  {Object.entries(debugInfo.queries).map(([queryName, result]: [string, any]) => (
                    <div key={queryName} className={`p-2 rounded text-xs ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="font-medium flex items-center gap-1">
                        {getStatusIcon(result.success)}
                        {queryName}
                      </div>
                      <div>Rows: {result.dataLength}</div>
                      {result.error && <div className="text-red-600">Error: {result.error}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Data Preview */}
            {debugInfo.rawData && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Raw Data Preview</h4>
                <div className="bg-gray-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                  <pre>{JSON.stringify(debugInfo.rawData.slice(0, 2), null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Errors */}
            {debugInfo.errors && debugInfo.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-900 mb-2">Errors</h4>
                <div className="bg-red-50 p-2 rounded text-xs space-y-1">
                  {debugInfo.errors.map((error: string, index: number) => (
                    <div key={index} className="text-red-800">{error}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Troubleshooting Steps */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Steps</h4>
              <div className="bg-blue-50 p-2 rounded text-xs space-y-1">
                <div>1. Check your .env file exists and has correct values</div>
                <div>2. Restart your dev server after .env changes</div>
                <div>3. Verify table name is exactly "Curatit" (case-sensitive)</div>
                <div>4. Check RLS policies in Supabase dashboard</div>
                <div>5. Verify your anon key has read permissions</div>
                <div>6. Make sure your Supabase project is not paused</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};