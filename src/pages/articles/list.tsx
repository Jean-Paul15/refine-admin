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
import { Space, Table } from "antd";

export const ArticleList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="title" title="Titre" />
                <Table.Column dataIndex="slug" title="Slug" />
                <Table.Column
                    dataIndex="published_date"
                    title="Date de publication"
                    render={(value: any) => value && <DateField value={value} />}
                />
                <Table.Column
                    dataIndex="is_published"
                    title="Publié"
                    render={(value: boolean) => <BooleanField value={value} />}
                />
                <Table.Column dataIndex="short_description" title="Description courte" />
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
