import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="error"
                    title="Une erreur s'est produite"
                    subTitle={this.state.error?.message || "Une erreur inattendue s'est produite"}
                    extra={[
                        <Button type="primary" key="reload" onClick={this.handleReload}>
                            Recharger la page
                        </Button>,
                        <Button key="retry" onClick={this.handleReset}>
                            Réessayer
                        </Button>,
                    ]}
                >
                    {/* Utiliser l'API Vite pour détecter le mode dev */}
                    {import.meta.env.DEV && (
                        <details style={{ textAlign: 'left', marginTop: '16px' }}>
                            <summary>Détails de l'erreur (mode développement)</summary>
                            <pre style={{
                                backgroundColor: '#f5f5f5',
                                padding: '8px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }}>
                                {this.state.error?.stack}
                            </pre>
                        </details>
                    )}
                </Result>
            );
        }

        return this.props.children;
    }
}
