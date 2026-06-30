import React, { useState } from 'react';


const DEFAULT_RULES = [
  { id: 'rule-1', keyName: 'username', expectedType: 'string', minLength: 4, required: true },
  { id: 'rule-2', keyName: 'account_id', expectedType: 'number', minLength: 1, required: true },
  { id: 'rule-3', keyName: 'is_active', expectedType: 'boolean', minLength: 0, required: false }
];

function App() {
  
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [rawJsonInput, setRawJsonInput] = useState('{\n  "username": "adhieeeh",\n  "account_id": 1024,\n  "is_active": true\n}');
  
  
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState('string');
  const [newMin, setNewMin] = useState(1);
  const [newRequired, setNewRequired] = useState(true);

  
  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    const freshRule = {
      id: `rule-${Date.now()}`,
      keyName: newKey.trim(),
      expectedType: newType,
      minLength: Number(newMin),
      required: newRequired
    };

    setRules([...rules, freshRule]);
    setNewKey('');
  };

 
  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  
  let validationLogs = [];
  let compileError = null;

  try {
   
    const parsedPayload = JSON.parse(rawJsonInput);

    
    rules.forEach(rule => {
      const targetValue = parsedPayload[rule.keyName];
      
    
      if (rule.required && (targetValue === undefined || targetValue === null)) {
        validationLogs.push({ ruleId: rule.id, status: 'CRITICAL', log: `Missing required property parameter key: "${rule.keyName}"` });
        return;
      }

      if (targetValue !== undefined && targetValue !== null) {
        
        const actualType = typeof targetValue;
        if (actualType !== rule.expectedType) {
          validationLogs.push({ ruleId: rule.id, status: 'CRITICAL', log: `Type mismatch for key "${rule.keyName}". Expected [${rule.expectedType}], found [${actualType}]` });
          return;
        }

        
        if (rule.expectedType === 'string' && targetValue.length < rule.minLength) {
          validationLogs.push({ ruleId: rule.id, status: 'WARNING', log: `String key "${rule.keyName}" fails constraint limits. Minimum length must be >= ${rule.minLength}` });
        } else if (rule.expectedType === 'number' && targetValue < rule.minLength) {
          validationLogs.push({ ruleId: rule.id, status: 'WARNING', log: `Numeric value key "${rule.keyName}" sits below threshold range bounds. Value must be >= ${rule.minLength}` });
        } else {
          validationLogs.push({ ruleId: rule.id, status: 'SUCCESS', log: `Parameter property key "${rule.keyName}" successfully verified against operational parameters.` });
        }
      }
    });

  } catch (err) {
    compileError = `Syntactic JSON Parse Malfunction: ${err.message}`;
  }

 
  const criticalErrorsCount = validationLogs.filter(log => log.status === 'CRITICAL').length;
  const systemStatus = compileError ? 'MALFORMED' : criticalErrorsCount > 0 ? 'FAILING' : 'VALIDATED';

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '90vh' }}>
      
      {/* */}
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '35px', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#e11d48', letterSpacing: '-0.5px' }}> DevSchema Compiler & Validation Lab</h1>
          <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '12px' }}>An interactive playground to model rigid data structures and audit real-time JSON input bodies.</p>
        </div>

        {/*  */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 20px', borderRadius: '10px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>Payload Integrity</span>
            <h3 style={{ margin: '0', fontSize: '18px', color: systemStatus === 'VALIDATED' ? '#10b981' : systemStatus === 'FAILING' ? '#f59e0b' : '#ef4444' }}>{systemStatus}</h3>
          </div>
        </div>
      </header>

      {/* */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/**/}
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '13px', color: '#475569', uppercase: 'true', margin: '0 0 20px 0', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>Active Schema Rules Dynamic Blueprint</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
            {rules.map(rule => (
              <div key={rule.id} style={{ backgroundColor: '#070a13', border: '1px solid #1e293b', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>{rule.keyName}</span>
                  <span style={{ color: '#475569', marginLeft: '8px' }}>({rule.expectedType})</span>
                  {rule.required && <span style={{ color: '#ef4444', fontSize: '11px', marginLeft: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>REQUIRED</span>}
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>Constraint: Minimum limit {"&gt;="} {rule.minLength}</div>
                </div>
                <button onClick={() => handleDeleteRule(rule.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
              </div>
            ))}
          </div>

          {/* */}
          <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px dashed #1e293b', paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Property Key</label>
                <input type="text" placeholder="e.g., email" value={newKey} onChange={(e) => setNewKey(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Data Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }}>
                  <option value="string">String Text</option>
                  <option value="number">Numeric Integer</option>
                  <option value="boolean">Boolean Flag</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Min Length / Range Value</label>
                <input type="number" min="0" value={newMin} onChange={(e) => setNewMin(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
                <input type="checkbox" id="reqCheck" checked={newRequired} onChange={(e) => setNewRequired(e.target.checked)} style={{ accentColor: '#e11d48', cursor: 'pointer' }} />
                <label htmlFor="reqCheck" style={{ fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>Enforce Requirement</label>
              </div>
            </div>

            <button type="submit" style={{ padding: '10px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Inject Blueprint Param rule ➕</button>
          </form>
        </section>

        {/* */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/*  */}
          <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '13px', color: '#475569', uppercase: 'true', margin: '0 0 12px 0' }}>Target JSON Object Input Payload Terminal</h3>
            <textarea
              value={rawJsonInput}
              onChange={(e) => setRawJsonInput(e.target.value)}
              style={{ width: '100%', flexGrow: '1', minHeight: '180px', padding: '16px', backgroundColor: '#0f172a', border: '1px dashed #334155', borderRadius: '14px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/*  */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '12px', color: '#475569', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Validation Trace Output Metrics</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {/* */}
              {compileError && (
                <div style={{ color: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.08)', padding: '10px 14px', borderRadius: '6px', borderLeft: '4px solid #f43f5e', fontSize: '13px' }}>
                  {compileError}
                </div>
              )}

              {/* */}
              {!compileError && validationLogs.map((log, index) => (
                <div 
                  key={index} 
                  style={{ 
                    fontSize: '12px', padding: '10px 14px', borderRadius: '6px', display: 'flex', gap: '10px',
                    backgroundColor: log.status === 'CRITICAL' ? 'rgba(244, 63, 94, 0.05)' : log.status === 'WARNING' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    borderLeft: log.status === 'CRITICAL' ? '4px solid #f43f5e' : log.status === 'WARNING' ? '4px solid #f59e0b' : '4px solid #10b981'
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: log.status === 'CRITICAL' ? '#f43f5e' : log.status === 'WARNING' ? '#f59e0b' : '#10b981' }}>[{log.status}]</span>
                  <span style={{ color: '#cbd5e1' }}>{log.log}</span>
                </div>
              ))}

              {!compileError && validationLogs.length === 0 && (
                <p style={{ color: '#475569', margin: '0', fontSize: '12px' }}>System standby. Add object validation properties parameters inside left engine dashboard panels.</p>
              )}
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}

export default App;