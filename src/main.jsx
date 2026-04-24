import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null, info: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { this.setState({ err, info }); console.error("ErrorBoundary:", err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 24, color: "#e8e4dc", background: "#0a0a0f", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e63c2f", marginBottom: 12 }}>Something broke</div>
          <div style={{ fontSize: 14, marginBottom: 16, color: "#bbb" }}>{String(this.state.err?.message || this.state.err)}</div>
          <pre style={{ fontSize: 11, color: "#888", whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#111", padding: 12, borderRadius: 8, border: "1px solid #1a1a24", maxHeight: 300, overflow: "auto" }}>
            {this.state.err?.stack || ""}
            {this.state.info?.componentStack || ""}
          </pre>
          <button onClick={() => this.setState({ err: null, info: null })} style={{ marginTop: 14, background: "#e63c2f", border: "none", borderRadius: 10, padding: "10px 16px", color: "#fff", fontWeight: 700, fontSize: 14 }}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
