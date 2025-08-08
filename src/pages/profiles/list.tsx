import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";

export const ProfileList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column dataIndex="first_name" title="Prénom" />
                <Table.Column dataIndex="last_name" title="Nom" />
                <Table.Column
                    dataIndex="role"
                    title="Rôle"
                    render={(value: string) => (
                        <Tag color={value === "admin" ? "red" : "blue"}>{value}</Tag>
                    )}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title="Créé le"
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
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
