import React from 'react';
import { Badge, Button, Popover, List, Typography, Space, Tag } from 'antd';
import { BellOutlined, HeartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useFormulaireNotifications } from '../../hooks/useFormulaireNotifications';
import { useGo } from '@refinedev/core';

const { Text } = Typography;

export const NotificationBell: React.FC = () => {
    const {
        nouveauxCount,
        rappelsCount,
        markAsRead,
        rappels
    } = useFormulaireNotifications();

    const go = useGo();

    const totalNotifications = nouveauxCount + rappelsCount;

    const notificationContent = (
        <div style={{ width: 320 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Notifications Dons/Engagements</Text>
                </div>

                {nouveauxCount > 0 && (
                    <div>
                        <Space>
                            <HeartOutlined style={{ color: '#ff4d4f' }} />
                            <Text>
                                <Text strong>{nouveauxCount}</Text> nouveau(x) formulaire(s)
                            </Text>
                            <Tag color="red">Nouveau</Tag>
                        </Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                go({
                                    to: '/dons-engagements',
                                    query: {
                                        filters: [{ field: 'statut', operator: 'eq', value: 'nouveau' }]
                                    }
                                });
                                markAsRead();
                            }}
                        >
                            Voir tous
                        </Button>
                    </div>
                )}

                {rappelsCount > 0 && (
                    <div>
                        <Space>
                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                            <Text>
                                <Text strong>{rappelsCount}</Text> rappel(s) de suivi
                            </Text>
                            <Tag color="orange">Suivi</Tag>
                        </Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                go({
                                    to: '/dons-engagements',
                                    query: {
                                        filters: [{ field: 'statut', operator: 'eq', value: 'contacte' }]
                                    }
                                });
                            }}
                        >
                            Voir tous
                        </Button>
                    </div>
                )}

                {rappels.length > 0 && (
                    <div>
                        <Text strong style={{ fontSize: '12px', color: '#666' }}>
                            Formulaires nécessitant un suivi:
                        </Text>
                        <List
                            size="small"
                            dataSource={rappels.slice(0, 3)} // Afficher seulement les 3 premiers
                            renderItem={(item) => (
                                <List.Item
                                    style={{ padding: '4px 0', cursor: 'pointer' }}
                                    onClick={() => go({
                                        to: { resource: 'formulaire_contact', action: 'show', id: item.id }
                                    })}
                                >
                                    <Space direction="vertical" size={0}>
                                        <Text style={{ fontSize: '12px' }}>
                                            {item.nom_complet}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            {item.montant && `${item.montant.toLocaleString('fr-FR')} XAF - `}
                                            {new Date(item.date_creation).toLocaleDateString('fr-FR')}
                                        </Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                        {rappels.length > 3 && (
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                ... et {rappels.length - 3} autre(s)
                            </Text>
                        )}
                    </div>
                )}

                {totalNotifications === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <BellOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
                        <br />
                        <Text type="secondary">Aucune notification</Text>
                    </div>
                )}
            </Space>
        </div>
    );

    return (
        <Popover
            content={notificationContent}
            title={null}
            trigger="click"
            placement="bottomRight"
            overlayStyle={{ zIndex: 1050 }}
        >
            <Badge count={totalNotifications} size="small">
                <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{
                        color: totalNotifications > 0 ? '#ff4d4f' : undefined,
                        animation: totalNotifications > 0 ? 'pulse 2s infinite' : undefined,
                    }}
                />
            </Badge>
        </Popover>
    );
};
