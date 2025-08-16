import { Show, TextField, DateField } from "@refinedev/antd";
import { Typography, Space, Image, Card, Divider } from "antd";
import { useShow } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

export const ActionShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* En-tête */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                            <TextField value={record?.title} />
                        </Title>

                        <Space size="large">
                            <div>
                                <Text strong>Date de création : </Text>
                                <DateField
                                    value={record?.created_at}
                                    format="DD/MM/YYYY à HH:mm"
                                />
                            </div>
                            <div>
                                <Text strong>Dernière modification : </Text>
                                <DateField
                                    value={record?.updated_at}
                                    format="DD/MM/YYYY à HH:mm"
                                />
                            </div>
                        </Space>
                    </Space>
                </Card>

                {/* Image */}
                {record?.image_url && (
                    <Card title="Image de l'activité">
                        <div style={{ textAlign: "center" }}>
                            <Image
                                src={record.image_url}
                                alt={record?.title}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "400px",
                                    borderRadius: "8px"
                                }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Pu3BUG8A2yBuYrOt8pEYs3nKAhNUUe1OkVqLJqLJq9JqK/J7c2SdI5T8/zSzec7KuMn3rr8f3N3ey9h3//m0/3Zt7/z/4v7n7Jk="
                            />
                        </div>
                    </Card>
                )}

                {/* Contenu */}
                {record?.full_content && (
                    <Card title="Contenu de l'activité">
                        <div data-color-mode="light">
                            <MDEditor.Markdown
                                source={record.full_content}
                                style={{ backgroundColor: "transparent" }}
                            />
                        </div>
                    </Card>
                )}

                {/* Informations système */}
                <Card title="Informations système" size="small">
                    <Space direction="vertical" size="small">
                        <div>
                            <Text strong>ID : </Text>
                            <Text type="secondary" copyable>{record?.id}</Text>
                        </div>
                        <div>
                            <Text strong>Créé le : </Text>
                            <DateField
                                value={record?.created_at}
                                format="DD/MM/YYYY à HH:mm:ss"
                            />
                        </div>
                        <div>
                            <Text strong>Modifié le : </Text>
                            <DateField
                                value={record?.updated_at}
                                format="DD/MM/YYYY à HH:mm:ss"
                            />
                        </div>
                    </Space>
                </Card>
            </Space>
        </Show>
    );
};
