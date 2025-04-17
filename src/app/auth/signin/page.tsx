"use client";

export default function Page() {
  // Redirect immediately if in the browser
  if (typeof window !== 'undefined') {
    window.location.href = '/create-profile';
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{fontSize: '24px', marginBottom: '16px'}}>Redirecting to profile creation...</h1>
      <p>If you are not redirected automatically, <a href="/create-profile" style={{color: 'blue', textDecoration: 'underline'}}>click here</a></p>
      
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeftColor: '#3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      
      {/* Static HTML redirect that doesn't depend on JavaScript */}
      <meta httpEquiv="refresh" content="0;url=/create-profile?from=signin" />
    </div>
  );
} 