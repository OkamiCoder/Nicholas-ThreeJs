import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ViewportErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ViewportErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#090d14] p-6">
          <div className="max-w-lg border border-[#ff7b29] bg-[#0b1018] p-4 text-xs font-mono text-[#d8cfc6]">
            <div className="text-[#ff7b29] font-bold uppercase mb-2">
              Ошибка инициализации 3D-вьюпорта
            </div>
            <pre className="whitespace-pre-wrap text-[#95a3b8]">
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
