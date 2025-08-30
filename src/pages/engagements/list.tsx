import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Tag, Typography, Switch } from "antd";
import { useUpdate } from "@refinedev/core";

const { Text } = Typography;

export const EngagementList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        sorters: {
            initial: [
                {
                    field: "ordre",
                    order: "asc",
                },
            ],
        },
    });

    const { mutate: updateEngagement } = useUpdate();

    const handleActiveToggle = (id: string, currentValue: boolean) => {
        updateEngagement({
            resource: "engagements",
            id,
            values: {
                is_active: !currentValue,
            },
            successNotification: {
                message: "Statut mis à jour avec succès",
                type: "success",
            },
        });
    };

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Ordre"
                    dataIndex="ordre"
                    key="ordre"
                    width={80}
                    sorter
                    render={(ordre) => (
                        <Tag color="blue">#{ordre}</Tag>
                    )}
                />
                <Table.Column
                    title="Image"
                    dataIndex="image_url"
                    key="image_url"
                    width={100}
                    render={(imageUrl) => (
                        <Image
                            src={imageUrl}
                            alt="Engagement"
                            width={60}
                            height={40}
                            style={{ objectFit: "cover", borderRadius: 4 }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                    )}
                />
                <Table.Column
                    title="Titre"
                    dataIndex="title"
                    key="title"
                    render={(title) => (
                        <Text strong style={{ fontSize: 14 }}>
                            {title}
                        </Text>
                    )}
                />
                <Table.Column
                    title="Description"
                    dataIndex="description"
                    key="description"
                    render={(description) => (
                        <Text
                            style={{
                                maxWidth: 300,
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            title={description}
                        >
                            {description}
                        </Text>
                    )}
                />
                <Table.Column
                    title="Statut"
                    dataIndex="is_active"
                    key="is_active"
                    width={120}
                    render={(isActive, record: { id: string }) => (
                        <Switch
                            checked={isActive}
                            onChange={() => handleActiveToggle(record.id, isActive)}
                            checkedChildren="Actif"
                            unCheckedChildren="Inactif"
                            style={{
                                backgroundColor: isActive ? "#52c41a" : "#f5222d",
                            }}
                        />
                    )}
                />
                <Table.Column
                    title="Date de création"
                    dataIndex="created_at"
                    key="created_at"
                    width={140}
                    sorter
                    render={(date) => (
                        <Text>
                            {new Date(date).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </Text>
                    )}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    width={180}
                    render={(_, record) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
