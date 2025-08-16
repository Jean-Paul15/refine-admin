import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table, Typography, Image } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

export const ActionList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        sorters: {
            initial: [{ field: "created_at", order: "desc" }],
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="title"
                    title="Titre"
                    render={(value: string) => (
                        <Text strong style={{ color: "#1890ff" }}>
                            {value}
                        </Text>
                    )}
                />

                <Table.Column
                    dataIndex="image_url"
                    title="Image"
                    render={(value: string) => {
                        if (!value) return <Text type="secondary">Aucune image</Text>;
                        return (
                            <Image
                                width={60}
                                height={40}
                                src={value}
                                alt="Aperçu"
                                style={{ objectFit: "cover", borderRadius: "4px" }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Pu3BUG8A2yBuYrOt8pEYs3nKAhNUUe1OkVqLJqLJq9JqK/J7c2SdI5T8/zSzec7KuMn3rr8f3N3ey9h3//m0/3Zt7/z/4v7n7Jk="
                            />
                        );
                    }}
                />

                <Table.Column
                    dataIndex="created_at"
                    title="Date de création"
                    render={(value: string) => (
                        <DateField value={value} format="DD/MM/YYYY à HH:mm" />
                    )}
                    sorter
                />

                <Table.Column
                    dataIndex="updated_at"
                    title="Dernière modification"
                    render={(value: string) => (
                        <Text type="secondary">
                            {dayjs(value).format("DD/MM/YYYY à HH:mm")}
                        </Text>
                    )}
                    sorter
                />

                <Table.Column
                    dataIndex="full_content"
                    title="Contenu"
                    render={(value: string) => {
                        if (!value) return <Text type="secondary">Aucun contenu</Text>;

                        // Extraire le texte du markdown et le tronquer
                        const textContent = value.replace(/[#*`\[\]]/g, '').trim();
                        const truncated = textContent.length > 100
                            ? textContent.substring(0, 100) + '...'
                            : textContent;

                        return (
                            <Text type="secondary" style={{ fontStyle: "italic" }}>
                                {truncated || "Aucun contenu"}
                            </Text>
                        );
                    }}
                />

                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
