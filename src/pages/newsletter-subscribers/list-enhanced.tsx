import {
    BooleanField,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord, useNotification } from "@refinedev/core";
import { Space, Table, Button, Upload, Modal } from "antd";
import { DownloadOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { supabaseClient } from "../../utility";
import { useState } from "react";
import { useExport } from "../../hooks/useExport";
import dayjs from "dayjs";

const { confirm } = Modal;

export const NewsletterSubscriberListEnhanced = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const { open } = useNotification();
    const [importing, setImporting] = useState(false);
    const { exportToExcel, exportToCSV } = useExport();

    // Fonction d'export Excel détaillé
    const handleExportExcel = async () => {
        const data = tableProps.dataSource || [];

        const exportData = data.map((item: BaseRecord) => ({
            'ID': String(item.id || ''),
            'Email': String(item.email || ''),
            'Date d\'inscription': item.subscribed_at ? dayjs(item.subscribed_at).format('DD/MM/YYYY HH:mm') : '',
            'Statut': item.is_active ? 'Actif' : 'Inactif',
            'Nom': String(item.name || ''),
            'Prénom': String(item.first_name || ''),
            'Téléphone': String(item.phone || ''),
            'Dernière modification': item.updated_at ? dayjs(item.updated_at).format('DD/MM/YYYY HH:mm') : ''
        }));

        await exportToExcel(exportData, {
            filename: `newsletter_abonnes_detaille_${dayjs().format('YYYY-MM-DD')}`,
            sheetName: 'Abonnés Newsletter'
        });
    };

    // Fonction d'import CSV
    const handleImport = (file: File) => {
        setImporting(true);

        Papa.parse(file, {
            header: true,
            delimiter: ';',
            complete: async (results) => {
                try {
                    const validEmails: string[] = [];
                    const errors: string[] = [];

                    // Valider les emails
                    (results.data as Record<string, unknown>[]).forEach((row, index: number) => {
                        const email = row.Email || row.email || row.EMAIL;
                        if (email && typeof email === 'string' && /\S+@\S+\.\S+/.test(email)) {
                            validEmails.push(email);
                        } else {
                            errors.push(`Ligne ${index + 1}: Email invalide "${email}"`);
                        }
                    });

                    if (errors.length > 0) {
                        Modal.warning({
                            title: 'Erreurs détectées',
                            content: (
                                <div>
                                    <p>Les erreurs suivantes ont été détectées :</p>
                                    <ul>
                                        {errors.slice(0, 5).map((error, i) => (
                                            <li key={i}>{error}</li>
                                        ))}
                                        {errors.length > 5 && <li>... et {errors.length - 5} autres erreurs</li>}
                                    </ul>
                                    <p>Emails valides détectés : {validEmails.length}</p>
                                </div>
                            ),
                        });
                    }

                    if (validEmails.length > 0) {
                        confirm({
                            title: 'Confirmer l\'import',
                            icon: <ExclamationCircleOutlined />,
                            content: `Voulez-vous importer ${validEmails.length} email(s) ?`,
                            onOk: async () => {
                                // Préparer les données pour Supabase
                                const subscribersData = validEmails.map(email => ({
                                    email,
                                    subscribed_at: new Date().toISOString(),
                                    is_active: true,
                                }));

                                // Insérer dans Supabase
                                const { data, error } = await supabaseClient
                                    .from('newsletter_subscribers')
                                    .upsert(subscribersData, {
                                        onConflict: 'email',
                                        ignoreDuplicates: true
                                    });

                                if (error) {
                                    throw error;
                                }

                                open?.({
                                    type: "success",
                                    message: "Import réussi",
                                    description: `${validEmails.length} abonnés ont été importés avec succès.`,
                                });

                                // Rafraîchir la table
                                window.location.reload();
                            },
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
                    open?.({
                        type: "error",
                        message: "Erreur d'import",
                        description: errorMessage,
                    });
                } finally {
                    setImporting(false);
                }
            },
            error: (error) => {
                open?.({
                    type: "error",
                    message: "Erreur de lecture du fichier",
                    description: error.message,
                });
                setImporting(false);
            }
        });

        return false; // Empêcher l'upload automatique
    };

    const uploadProps = {
        accept: '.csv,.xlsx,.xls',
        showUploadList: false,
        beforeUpload: handleImport,
    };

    // Wrapper function for CSV export onClick handler
    const handleExportCSV = async () => {
        const data = tableProps.dataSource || [];
        const preparedData = data.map((subscriber: BaseRecord) => ({
            ID: String(subscriber.id || ''),
            Email: String(subscriber.email || ''),
            'Date d\'inscription': subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString('fr-FR') : '',
            'Dernière mise à jour': subscriber.updated_at ? new Date(subscriber.updated_at).toLocaleDateString('fr-FR') : ''
        }));

        await exportToCSV(preparedData, {
            filename: 'newsletter-subscribers',
            sheetName: 'Abonnés Newsletter'
        });
    };

    return (
        <List
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
                        <Upload {...uploadProps}>
                            <Button
                                icon={<UploadOutlined />}
                                loading={importing}
                            >
                                {importing ? 'Import...' : 'Import CSV'}
                            </Button>
                        </Upload>
                    </Space>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" width={80} />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column
                    dataIndex="is_active"
                    title="Actif"
                    render={(value: boolean) => <BooleanField value={value} />}
                    width={100}
                />
                <Table.Column
                    dataIndex={["subscribed_at"]}
                    title="Inscrit le"
                    render={(value: string | number | Date) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
                    width={150}
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
