import { useState, useEffect } from 'react';
import { useSubscription, useList } from '@refinedev/core';
import { notification } from 'antd';
import { HeartOutlined, BellOutlined } from '@ant-design/icons';
import React from 'react';

interface FormulaireContact {
    id: string;
    nom_complet: string;
    email: string;
    montant?: number;
    est_engagement: boolean;
    statut: string;
    date_creation: string;
}

export const useFormulaireNotifications = () => {
    const [notificationCount, setNotificationCount] = useState(0);

    // Récupérer les nouveaux formulaires
    const { data: nouveauxFormulaires } = useList<FormulaireContact>({
        resource: 'formulaire_contact',
        filters: [
            {
                field: 'statut',
                operator: 'eq',
                value: 'nouveau',
            },
        ],
        sorters: [
            {
                field: 'date_creation',
                order: 'desc',
            },
        ],
        queryOptions: {
            refetchInterval: 30000, // Vérifier toutes les 30 secondes
        },
    });

    // Surveiller les nouveaux formulaires via subscription
    useSubscription({
        channel: 'formulaire_contact',
        types: ['INSERT', 'UPDATE'],
        onLiveEvent: (event) => {
            if (event.type === 'INSERT') {
                const nouveau = event.payload as FormulaireContact;

                const montantText = nouveau.montant
                    ? `Montant: ${nouveau.montant.toLocaleString('fr-FR')} XAF`
                    : '';

                const typeText = `Type: ${nouveau.est_engagement ? 'Engagement régulier' : 'Don ponctuel'}`;

                const description = `${nouveau.nom_complet} vient de soumettre un formulaire. ${montantText} ${typeText}`;

                // Notification pour nouveau formulaire
                notification.open({
                    message: '🎉 Nouveau formulaire reçu !',
                    description,
                    icon: React.createElement(HeartOutlined, { style: { color: '#ff4d4f' } }),
                    duration: 10, // 10 secondes
                    placement: 'topRight',
                    onClick: () => {
                        // Rediriger vers le formulaire
                        window.location.href = `/dons-engagements/show/${nouveau.id}`;
                    },
                });

                setNotificationCount(prev => prev + 1);
            }

            if (event.type === 'UPDATE') {
                const updated = event.payload as FormulaireContact;

                // Notification si statut change de "nouveau" vers autre chose
                if (updated.statut !== 'nouveau') {
                    notification.info({
                        message: '📝 Formulaire mis à jour',
                        description: `Statut de ${updated.nom_complet} changé vers "${updated.statut}"`,
                        icon: React.createElement(BellOutlined, { style: { color: '#1890ff' } }),
                        duration: 5,
                        placement: 'topRight',
                    });
                }
            }
        },
    });

    // Fonction pour marquer les notifications comme lues
    const markAsRead = () => {
        setNotificationCount(0);
    };

    // Fonction pour obtenir le nombre de formulaires non traités
    const getNonTraitesCount = () => {
        return nouveauxFormulaires?.data?.length || 0;
    };

    // Fonction pour obtenir les rappels (formulaires "contacte" depuis plus de 3 jours)
    const { data: rappelsData } = useList<FormulaireContact>({
        resource: 'formulaire_contact',
        filters: [
            {
                field: 'statut',
                operator: 'eq',
                value: 'contacte',
            },
        ],
        queryOptions: {
            refetchInterval: 60000, // Vérifier toutes les minutes
        },
    });

    const getRappels = () => {
        if (!rappelsData?.data) return [];

        const maintenant = new Date();
        const troiJoursEnMs = 3 * 24 * 60 * 60 * 1000;

        return rappelsData.data.filter(formulaire => {
            const dateCreation = new Date(formulaire.date_creation);
            return (maintenant.getTime() - dateCreation.getTime()) > troiJoursEnMs;
        });
    };

    // Notifications de rappel (une fois par jour)
    useEffect(() => {
        if (!rappelsData?.data) return;

        const maintenant = new Date();
        const troiJoursEnMs = 3 * 24 * 60 * 60 * 1000;

        const rappels = rappelsData.data.filter(formulaire => {
            const dateCreation = new Date(formulaire.date_creation);
            return (maintenant.getTime() - dateCreation.getTime()) > troiJoursEnMs;
        });

        if (rappels.length > 0) {
            const aujourdhui = new Date().toDateString();
            const dernierRappel = localStorage.getItem('dernierRappelFormulaires');

            if (dernierRappel !== aujourdhui) {
                notification.warning({
                    message: '⏰ Rappels de suivi',
                    description: `${rappels.length} formulaire(s) contacté(s) nécessitent un suivi`,
                    icon: React.createElement(BellOutlined, { style: { color: '#faad14' } }),
                    duration: 15,
                    placement: 'topRight',
                    onClick: () => {
                        window.location.href = '/dons-engagements?filters[0][field]=statut&filters[0][operator]=eq&filters[0][value]=contacte';
                    },
                });

                localStorage.setItem('dernierRappelFormulaires', aujourdhui);
            }
        }
    }, [rappelsData]);

    return {
        notificationCount,
        nouveauxCount: getNonTraitesCount(),
        rappelsCount: getRappels().length,
        markAsRead,
        rappels: getRappels(),
    };
};
