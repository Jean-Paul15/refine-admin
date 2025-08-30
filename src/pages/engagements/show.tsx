import { Show } from "@refinedev/antd";
import { Typography, Space, Image, Tag, Card, Descriptions, Switch } from "antd";
import { useShow } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

export const EngagementShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* En-tête avec titre et statut */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>
                                    {record?.title}
                                </Title>
                                <Space style={{ marginTop: 8 }}>
                                    <Tag color="blue">
                                        Ordre #{record?.ordre}
                                    </Tag>
                                    <Tag color={record?.is_active ? "green" : "red"}>
                                        {record?.is_active ? "Actif" : "Inactif"}
                                    </Tag>
                                </Space>
                            </div>

                            <Switch
                                checked={record?.is_active}
                                disabled
                                checkedChildren="Actif"
                                unCheckedChildren="Inactif"
                            />
                        </Space>
                    </Space>
                </Card>

                {/* Image */}
                {record?.image_url && (
                    <Card title="Image de l'engagement">
                        <div style={{ textAlign: "center" }}>
                            <Image
                                src={record.image_url}
                                alt={record.title}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: 400,
                                    objectFit: "cover",
                                    borderRadius: 8
                                }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                            />
                        </div>
                    </Card>
                )}

                {/* Description */}
                <Card title="Description">
                    <div data-color-mode="light">
                        <MDEditor.Markdown
                            source={record?.description}
                            style={{ backgroundColor: "transparent" }}
                        />
                    </div>
                </Card>

                {/* Informations techniques */}
                <Card title="Informations">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Ordre d'affichage">
                            <Tag color="blue">#{record?.ordre}</Tag>
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                (Calculé automatiquement selon la date de création)
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Statut">
                            <Switch
                                checked={record?.is_active}
                                disabled
                                checkedChildren="Actif"
                                unCheckedChildren="Inactif"
                                size="small"
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Date de création">
                            <Text>
                                {record?.created_at &&
                                    new Date(record.created_at).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Dernière modification">
                            <Text>
                                {record?.updated_at &&
                                    new Date(record.updated_at).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="ID">
                            <Text code>{record?.id}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
        </Show>
    );
};
