import {
    BooleanField,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";

export const ActionList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="title" title="Titre" />
                <Table.Column dataIndex="slug" title="Slug" />
                <Table.Column
                    dataIndex="type"
                    title="Type"
                    render={(value: string) => {
                        const color =
                            value === "principale" ? "red" :
                                value === "carrousel" ? "blue" :
                                    value === "passée" ? "gray" : "default";
                        return <Tag color={color}>{value}</Tag>;
                    }}
                />
                <Table.Column
                    dataIndex="is_active"
                    title="Active"
                    render={(value: boolean) => <BooleanField value={value} />}
                />
                <Table.Column dataIndex="description" title="Description" />
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
