import {
    BooleanField,
    DateField,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord, getDefaultFilter } from "@refinedev/core";
import { Space, Table, Input, Select, Button, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const ArticleListEnhanced = () => {
    const { tableProps, sorters, filters } = useTable({
        syncWithLocation: true,
        filters: {
            initial: [
                {
                    field: "title",
                    operator: "contains",
                    value: "",
                },
            ],
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="title"
                    title="Titre"
                    filterIcon={<SearchOutlined />}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input placeholder="Rechercher par titre" />
                        </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter("title", filters)}
                />

                <Table.Column
                    dataIndex="slug"
                    title="Slug"
                    ellipsis
                />

                <Table.Column
                    dataIndex="published_date"
                    title="Date de publication"
                    render={(value: any) => value && <DateField value={value} format="DD/MM/YYYY" />}
                    sorter
                />

                <Table.Column
                    dataIndex="is_published"
                    title="Statut"
                    render={(value: boolean) => (
                        <Tag color={value ? "green" : "orange"}>
                            {value ? "Publié" : "Brouillon"}
                        </Tag>
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ width: 200 }}
                                placeholder="Filtrer par statut"
                                allowClear
                            >
                                <Select.Option value={true}>Publié</Select.Option>
                                <Select.Option value={false}>Brouillon</Select.Option>
                            </Select>
                        </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter("is_published", filters)}
                />

                <Table.Column
                    dataIndex="short_description"
                    title="Description"
                    ellipsis
                    width={300}
                />

                <Table.Column
                    dataIndex={["created_at"]}
                    title="Créé le"
                    render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
                    sorter
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
                    width={120}
                />
            </Table>
        </List>
    );
};
