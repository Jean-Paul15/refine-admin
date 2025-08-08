import { useState, useEffect } from 'react';
import { message } from 'antd';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiry?: number;
}

interface UseOfflineCacheOptions {
    keyPrefix?: string;
    defaultExpiry?: number; // en millisecondes
}

interface PendingChange {
    id: string;
    resource: string;
    action: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
}

export default function useOfflineCache<T = any>(options: UseOfflineCacheOptions = {}) {
    const { keyPrefix = 'refine_cache', defaultExpiry = 5 * 60 * 1000 } = options; // 5 minutes par défaut
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour obtenir les changements en attente
    const getPendingChanges = (): PendingChange[] => {
        try {
            const pendingKey = `${keyPrefix}_pending_changes`;
            const existing = localStorage.getItem(pendingKey);
            return existing ? JSON.parse(existing) : [];
        } catch (error) {
            console.error('Erreur lors de la lecture des changements en attente:', error);
            return [];
        }
    };

    // Fonction pour nettoyer les changements en attente
    const clearPendingChanges = (): void => {
        try {
            const pendingKey = `${keyPrefix}_pending_changes`;
            localStorage.removeItem(pendingKey);
        } catch (error) {
            console.error('Erreur lors du nettoyage des changements:', error);
        }
    };

    // Fonction pour synchroniser les données en attente
    const syncPendingData = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const pendingChanges = getPendingChanges();

            if (pendingChanges.length === 0) {
                return;
            }

            // Ici vous pouvez implémenter la logique de synchronisation
            // avec votre backend/Supabase
            for (const change of pendingChanges) {
                // Simuler la synchronisation
                console.log('Synchronisation en cours pour:', change);
                // await syncChangeToServer(change);
            }

            // Nettoyer les changements synchronisés
            clearPendingChanges();
            message.success(`${pendingChanges.length} modification(s) synchronisée(s)`);
        } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
            message.error('Erreur lors de la synchronisation des données');
        } finally {
            setIsLoading(false);
        }
    };

    // Nettoyer le cache expiré
    const cleanExpiredCache = (): void => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(keyPrefix)) {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const cacheItem: CacheItem<T> = JSON.parse(cached);
                        const isExpired = Date.now() - cacheItem.timestamp > (cacheItem.expiry || defaultExpiry);

                        if (isExpired) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    // Supprimer les entrées corrompues
                    localStorage.removeItem(key);
                }
            }
        });
        message.success('Cache nettoyé avec succès');
    };

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            message.success('Connexion rétablie ! Synchronisation des données...');
            syncPendingData();
        };

        const handleOffline = () => {
            setIsOnline(false);
            message.warning('Mode hors ligne activé. Les modifications seront synchronisées à la reconnexion.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Nettoyer le cache expiré au démarrage
        cleanExpiredCache();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sauvegarder dans le cache local
    const setCache = (key: string, data: T, expiry?: number): void => {
        try {
            const cacheItem: CacheItem<T> = {
                data,
                timestamp: Date.now(),
                expiry: expiry || defaultExpiry,
            };
            localStorage.setItem(`${keyPrefix}_${key}`, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde dans le cache:', error);
        }
    };

    // Récupérer depuis le cache local
    const getCache = (key: string): T | null => {
        try {
            const cached = localStorage.getItem(`${keyPrefix}_${key}`);
            if (!cached) return null;

            const cacheItem: CacheItem<T> = JSON.parse(cached);
            const isExpired = Date.now() - cacheItem.timestamp > (cacheItem.expiry || defaultExpiry);

            if (isExpired) {
                localStorage.removeItem(`${keyPrefix}_${key}`);
                return null;
            }

            return cacheItem.data;
        } catch (error) {
            console.error('Erreur lors de la lecture du cache:', error);
            return null;
        }
    };

    // Supprimer une entrée du cache
    const removeCache = (key: string): void => {
        localStorage.removeItem(`${keyPrefix}_${key}`);
    };

    // Sauvegarder les modifications en attente
    const savePendingChange = (resource: string, action: 'create' | 'update' | 'delete', data: any): void => {
        try {
            const pendingKey = `${keyPrefix}_pending_changes`;
            const existing = localStorage.getItem(pendingKey);
            const pendingChanges = existing ? JSON.parse(existing) : [];

            const newChange: PendingChange = {
                id: `${Date.now()}_${Math.random()}`,
                resource,
                action,
                data,
                timestamp: Date.now(),
            };

            pendingChanges.push(newChange);
            localStorage.setItem(pendingKey, JSON.stringify(pendingChanges));

            if (!isOnline) {
                message.info('Modification sauvegardée hors ligne');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des modifications:', error);
        }
    };

    // Obtenir les statistiques du cache
    const getCacheStats = () => {
        let totalCacheEntries = 0;
        let cacheSize = 0;
        const pendingChanges = getPendingChanges();

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(keyPrefix)) {
                totalCacheEntries++;
                const item = localStorage.getItem(key);
                if (item) {
                    cacheSize += item.length;
                }
            }
        });

        return {
            totalCacheEntries,
            pendingChangesCount: pendingChanges.length,
            cacheSize, // en bytes
        };
    };

    return {
        isOnline,
        isLoading,
        setCache,
        getCache,
        removeCache,
        cleanExpiredCache,
        savePendingChange,
        syncPendingData,
        getPendingChanges,
        clearPendingChanges,
        getCacheStats,
    };
}
