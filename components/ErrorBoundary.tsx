import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload(); // Hard reset to clear bad state
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            Something went wrong
                        </h2>

                        <p className="text-slate-500 mb-6">
                            We encountered an issue displaying the results. The data format might be unexpected.
                        </p>

                        <button
                            onClick={this.handleRetry}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Application
                        </button>

                        {this.state.error && (
                            <details className="mt-6 text-left p-4 bg-white border border-slate-200 rounded text-xs text-slate-400 overflow-auto max-h-32">
                                <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                                {this.state.error.toString()}
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
