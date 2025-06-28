import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { RefreshCw, Database, Eye, EyeOff } from 'lucide-react';

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
      connection: {},
      tableInfo: {},
      rawData: null,
      errors: []
    };

    try {
      // 1. Check environment variables
      console.log('🔍 Step 1: Checking environment variables...');
      results.environment = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'NOT_SET',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
        nodeEnv: import.meta.env.NODE_ENV,
        mode: import.meta.env.MODE
      };

      // 2. Test basic connection
      console.log('🔍 Step 2: Testing basic connection...');
      const connectionTest = await testSupabaseConnection();
      results.connection = connectionTest;

      // 3. Get table schema info
      console.log('🔍 Step 3: Getting table information...');
      try {
        const { data: tableData, error: tableError } = await supabase
          .from('Curatit')
          .select('*')
          .limit(0); // Just get schema, no data

        if (tableError) {
          results.errors.push(`Table schema error: ${tableError.message}`);
        } else {
          results.tableInfo.schemaAccessible = true;
        }
      } catch (err) {
        results.errors.push(`Table access error: ${err}`);
      }

      // 4. Try to count rows
      console.log('🔍 Step 4: Counting rows...');
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

      // 5. Try different query approaches
      console.log('🔍 Step 5: Trying different query approaches...');
      
      // Approach 1: Simple select all
      try {
        const { data: data1, error: error1 } = await supabase
          .from('Curatit')
          .select('*');
        
        results.queries = results.queries || {};
        results.queries.selectAll = {
          success: !error1,
          error: error1?.message,
          dataLength: data1?.length || 0,
          data: data1
        };

        if (data1 && data1.length > 0) {
          results.rawData = data1;
          onDataFetched?.(data1);
        }
      } catch (err) {
        results.queries.selectAll = {
          success: false,
          error: `Exception: ${err}`,
          dataLength: 0
        };
      }

      // Approach 2: Select with specific columns
      try {
        const { data: data2, error: error2 } = await supabase
          .from('Curatit')
          .select('id, brand_name, brand_post, brand_logo, brand_category, created_at');
        
        results.queries.selectSpecific = {
          success: !error2,
          error: error2?.message,
          dataLength: data2?.length || 0,
          data: data2
        };
      } catch (err) {
        results.queries.selectSpecific = {
          success: false,
          error: `Exception: ${err}`,
          dataLength: 0
        };
      }

      // Approach 3: Select with limit
      try {
        const { data: data3, error: error3 } = await supabase
          .from('Curatit')
          .select('*')
          .limit(10);
        
        results.queries.selectWithLimit = {
          success: !error3,
          error: error3?.message,
          dataLength: data3?.length || 0,
          data: data3
        };
      } catch (err) {
        results.queries.selectWithLimit = {
          success: false,
          error: `Exception: ${err}`,
          dataLength: 0
        };
      }

      // 6. Check RLS policies
      console.log('🔍 Step 6: Checking RLS status...');
      try {
        const { data: rlsData, error: rlsError } = await supabase
          .rpc('check_table_rls', { table_name: 'Curatit' })
          .single();
        
        results.tableInfo.rls = {
          success: !rlsError,
          error: rlsError?.message,
          data: rlsData
        };
      } catch (err) {
        // RLS check might not be available, that's okay
        results.tableInfo.rls = {
          success: false,
          error: 'RLS check function not available',
          note: 'This is normal - RLS check requires custom function'
        };
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
            {/* Environment Check */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Environment Variables</h4>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div>URL: {debugInfo.environment?.supabaseUrl?.substring(0, 30)}...</div>
                <div>Key: {debugInfo.environment?.supabaseKey} ({debugInfo.environment?.keyLength} chars)</div>
                <div>Mode: {debugInfo.environment?.mode}</div>
              </div>
            </div>

            {/* Connection Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Connection Status</h4>
              <div className={`p-2 rounded text-xs ${debugInfo.connection?.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {debugInfo.connection?.success ? '✅ Connected' : '❌ Failed'}
                {debugInfo.connection?.error && <div>Error: {debugInfo.connection.error}</div>}
                {debugInfo.connection?.count !== undefined && <div>Rows found: {debugInfo.connection.count}</div>}
              </div>
            </div>

            {/* Table Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Table Information</h4>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div>Total Rows: {debugInfo.tableInfo?.totalRows ?? 'Unknown'}</div>
                <div>Schema Access: {debugInfo.tableInfo?.schemaAccessible ? '✅' : '❌'}</div>
              </div>
            </div>

            {/* Query Results */}
            {debugInfo.queries && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Query Results</h4>
                <div className="space-y-2">
                  {Object.entries(debugInfo.queries).map(([queryName, result]: [string, any]) => (
                    <div key={queryName} className={`p-2 rounded text-xs ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="font-medium">{queryName}</div>
                      <div>Success: {result.success ? '✅' : '❌'}</div>
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
                  <pre>{JSON.stringify(debugInfo.rawData, null, 2)}</pre>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};