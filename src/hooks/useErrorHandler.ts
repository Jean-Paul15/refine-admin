import { useEffect } from 'react';
import { message } from 'antd';

export const useErrorHandler = () => {
    useEffect(() => {
        // Capturer les erreurs JavaScript globales
        const handleError = (event: ErrorEvent) => {
            console.error('Erreur JavaScript globale:', event.error);

            // Erreurs spécifiques connues
            if (event.error?.message?.includes('isValid is not a function')) {
                message.error('Erreur de validation du formulaire. Veuillez vérifier vos données.');
                return;
            }

            if (event.error?.message?.includes('ERR_NAME_NOT_RESOLVED')) {
                message.error('Problème de connexion réseau. Vérifiez votre connexion internet.');
                return;
            }

            if (event.error?.message?.includes('Failed to fetch')) {
                message.warning('Connexion instable. Les données peuvent être chargées depuis le cache.');
                return;
            }

            // Erreur générique
            if (process.env.NODE_ENV === 'development') {
                message.error(`Erreur: ${event.error?.message}`);
            } else {
                message.error('Une erreur inattendue s\'est produite.');
            }
        };

        // Capturer les promesses rejetées non gérées
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            console.error('Promise rejetée non gérée:', event.reason);

            const reason = event.reason?.message || event.reason;

            if (typeof reason === 'string') {
                if (reason.includes('ERR_NAME_NOT_RESOLVED')) {
                    message.error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
                    event.preventDefault(); // Empêcher l'affichage dans la console
                    return;
                }

                if (reason.includes('ERR_NETWORK_CHANGED')) {
                    message.warning('Connexion réseau interrompue. Passage en mode hors ligne.');
                    event.preventDefault();
                    return;
                }
            }

            if (process.env.NODE_ENV === 'development') {
                message.error(`Erreur réseau: ${reason}`);
            }
        };

        // Écouter les événements d'erreur
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Cleanup
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    // Fonction utilitaire pour wrapper les opérations risquées
    const withErrorHandling = async <T,>(
        operation: () => Promise<T>,
        errorMessage?: string
    ): Promise<T | null> => {
        try {
            return await operation();
        } catch (error: any) {
            console.error('Erreur dans withErrorHandling:', error);

            if (errorMessage) {
                message.error(errorMessage);
            } else if (error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
                message.error('Problème de connexion réseau');
            } else {
                message.error('Une erreur s\'est produite');
            }

            return null;
        }
    };

    return { withErrorHandling };
};
