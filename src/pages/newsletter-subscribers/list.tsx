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
import { Space, Table, Button } from "antd";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useExport } from "../../hooks/useExport";
import dayjs from "dayjs";

export const NewsletterSubscriberList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const { exportToExcel, exportToCSV, loading } = useExport();

    // Fonction pour préparer les données d'export
    const prepareExportData = (records: readonly BaseRecord[]) => {
        return records.map(record => ({
            'ID': String(record.id || ''),
            'Email': String(record.email || ''),
            'Statut': record.is_active ? 'Actif' : 'Inactif',
            'Date d\'inscription': record.subscribed_at ? dayjs(record.subscribed_at).format('DD/MM/YYYY HH:mm') : '',
            'Nom': String(record.name || ''),
            'Prénom': String(record.first_name || ''),
            'Téléphone': String(record.phone || ''),
            'Adresse': String(record.address || ''),
            'Ville': String(record.city || ''),
            'Code postal': String(record.postal_code || ''),
            'Dernière modification': record.updated_at ? dayjs(record.updated_at).format('DD/MM/YYYY HH:mm') : ''
        }));
    };

    const handleExportExcel = async () => {
        const allData = tableProps.dataSource || [];
        const exportData = prepareExportData(allData);
        await exportToExcel(exportData, {
            filename: `abonnes_newsletter_${dayjs().format('YYYY-MM-DD')}`,
            sheetName: 'Abonnés Newsletter'
        });
    };

    const handleExportCSV = async () => {
        const allData = tableProps.dataSource || [];
        const exportData = prepareExportData(allData);
        await exportToCSV(exportData, {
            filename: `abonnes_newsletter_${dayjs().format('YYYY-MM-DD')}`
        });
    };

    return (
        <List
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <Space>
                        <Button
                            type="default"
                            icon={<FileExcelOutlined />}
                            onClick={handleExportExcel}
                            loading={loading}
                        >
                            Export Excel
                        </Button>
                        <Button
                            type="default"
                            icon={<DownloadOutlined />}
                            onClick={handleExportCSV}
                            loading={loading}
                        >
                            Export CSV
                        </Button>
                    </Space>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column
                    dataIndex="is_active"
                    title="Actif"
                    render={(value: boolean) => <BooleanField value={value} />}
                />
                <Table.Column
                    dataIndex={["subscribed_at"]}
                    title="Inscrit le"
                    render={(value: string | Date) => <DateField value={value} />}
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
