import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table, Button, Tag, Typography } from "antd";
import { DownloadOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { useExport } from "../../hooks/useExport";
import dayjs from "dayjs";

const { Text } = Typography;

export default function DonsEngagementsList() {
    const { tableProps } = useTable({
        resource: "formulaire_contact",
        syncWithLocation: true,
        sorters: {
            initial: [{ field: "date_creation", order: "desc" }],
        },
    });

    const { exportToExcel, exportToCSV } = useExport();

    // Fonction pour exporter en Excel
    const handleExportExcel = async () => {
        const data = tableProps.dataSource || [];
        const preparedData = data.map((item: BaseRecord) => ({
            'Nom Complet': String(item.nom_complet || ''),
            'Email': String(item.email || ''),
            'Téléphone': String(item.telephone || ''),
            'Pays': String(item.pays || ''),
            'Montant (XAF)': item.montant ? Number(item.montant) : 0,
            'Type': item.est_engagement ? 'Engagement' : 'Don ponctuel',
            'Message': String(item.message || ''),
            'Statut': String(item.statut || ''),
            'Date de création': item.date_creation ? dayjs(item.date_creation).format('DD/MM/YYYY HH:mm') : '',
        }));

        await exportToExcel(preparedData, {
            filename: `dons_engagements_${dayjs().format('YYYY-MM-DD')}`,
            sheetName: 'Dons et Engagements'
        });
    };

    // Fonction pour exporter en CSV
    const handleExportCSV = async () => {
        const data = tableProps.dataSource || [];
        const preparedData = data.map((item: BaseRecord) => ({
            'Nom Complet': String(item.nom_complet || ''),
            'Email': String(item.email || ''),
            'Téléphone': String(item.telephone || ''),
            'Pays': String(item.pays || ''),
            'Montant (XAF)': item.montant ? Number(item.montant) : 0,
            'Type': item.est_engagement ? 'Engagement' : 'Don ponctuel',
            'Message': String(item.message || ''),
            'Statut': String(item.statut || ''),
            'Date de création': item.date_creation ? dayjs(item.date_creation).format('DD/MM/YYYY HH:mm') : '',
        }));

        await exportToCSV(preparedData, {
            filename: `dons_engagements_${dayjs().format('YYYY-MM-DD')}`,
            sheetName: 'Dons et Engagements'
        });
    };

    return (
        <List
            title="Dons/Engagements"
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <Space>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleExportCSV}
                        >
                            Export CSV
                        </Button>
                        <Button
                            type="default"
                            icon={<DownloadOutlined />}
                            onClick={handleExportExcel}
                        >
                            Export Excel
                        </Button>
                    </Space>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
                <Table.Column
                    dataIndex="nom_complet"
                    title="Nom Complet"
                    width={150}
                    render={(value: string) => (
                        <Text strong>{value}</Text>
                    )}
                />
                <Table.Column
                    dataIndex="email"
                    title="Email"
                    width={200}
                />
                <Table.Column
                    dataIndex="telephone"
                    title="Téléphone"
                    width={130}
                />
                <Table.Column
                    dataIndex="pays"
                    title="Pays"
                    width={100}
                />
                <Table.Column
                    dataIndex="montant"
                    title="Montant"
                    width={100}
                    render={(value: number) => (
                        value ? (
                            <Text strong style={{ color: '#52c41a' }}>
                                {value.toLocaleString('fr-FR')} XAF
                            </Text>
                        ) : (
                            <Text type="secondary">-</Text>
                        )
                    )}
                />
                <Table.Column
                    dataIndex="est_engagement"
                    title="Type"
                    width={120}
                    render={(value: boolean) => (
                        <Tag
                            icon={value ? <DollarOutlined /> : <UserOutlined />}
                            color={value ? "processing" : "default"}
                        >
                            {value ? "Engagement" : "Don ponctuel"}
                        </Tag>
                    )}
                />
                <Table.Column
                    dataIndex="statut"
                    title="Statut"
                    width={100}
                    render={(value: string) => {
                        let color = 'default';
                        if (value === 'nouveau') color = 'red';
                        else if (value === 'contacte') color = 'orange';
                        else if (value === 'traite') color = 'green';

                        return (
                            <Tag color={color}>
                                {value?.toUpperCase()}
                            </Tag>
                        );
                    }}
                />
                <Table.Column
                    dataIndex="date_creation"
                    title="Date"
                    width={120}
                    render={(value: string | number | Date) => (
                        <DateField value={value} format="DD/MM/YYYY HH:mm" />
                    )}
                />
                <Table.Column
                    dataIndex="message"
                    title="Message"
                    width={200}
                    render={(value: string) => (
                        value ? (
                            <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 200 }}>
                                {value}
                            </Text>
                        ) : (
                            <Text type="secondary">-</Text>
                        )
                    )}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    width={120}
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
}
