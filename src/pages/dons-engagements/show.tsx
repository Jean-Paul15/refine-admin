import {
    DateField,
    EmailField,
    Show,
    TextField,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Row, Col, Tag, Divider, Space } from "antd";
import { DollarOutlined, UserOutlined, PhoneOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DonsEngagementsShow() {
    const { queryResult } = useShow({
        resource: "formulaire_contact",
    });
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading} title="Détails du Formulaire">
            <Card>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Title level={5}>Informations Personnelles</Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Nom Complet: </Text>
                                <TextField value={record?.nom_complet} />
                            </div>
                            <div>
                                <Text strong>Email: </Text>
                                <EmailField value={record?.email} />
                            </div>
                            <div>
                                <Text strong>Téléphone: </Text>
                                <Space>
                                    <PhoneOutlined />
                                    <TextField value={record?.telephone} />
                                </Space>
                            </div>
                            <div>
                                <Text strong>Pays: </Text>
                                <Space>
                                    <GlobalOutlined />
                                    <TextField value={record?.pays} />
                                </Space>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Title level={5}>Informations de Don</Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Montant: </Text>
                                {record?.montant ? (
                                    <Text style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                                        {Number(record.montant).toLocaleString('fr-FR')} XAF
                                    </Text>
                                ) : (
                                    <Text type="secondary">Non spécifié</Text>
                                )}
                            </div>
                            <div>
                                <Text strong>Type: </Text>
                                <Tag
                                    icon={record?.est_engagement ? <DollarOutlined /> : <UserOutlined />}
                                    color={record?.est_engagement ? "processing" : "default"}
                                    style={{ marginLeft: 8 }}
                                >
                                    {record?.est_engagement ? "Engagement régulier" : "Don ponctuel"}
                                </Tag>
                            </div>
                            <div>
                                <Text strong>Statut: </Text>
                                <Tag
                                    color={
                                        record?.statut === 'nouveau' ? 'red' :
                                            record?.statut === 'contacte' ? 'orange' :
                                                record?.statut === 'traite' ? 'green' : 'default'
                                    }
                                    style={{ marginLeft: 8 }}
                                >
                                    {record?.statut?.toUpperCase()}
                                </Tag>
                            </div>
                            <div>
                                <Text strong>Date de création: </Text>
                                <DateField value={record?.date_creation} format="DD/MM/YYYY à HH:mm" />
                            </div>
                        </Space>
                    </Col>
                </Row>

                {record?.message && (
                    <>
                        <Divider />
                        <div>
                            <Title level={5}>Message</Title>
                            <Card type="inner" size="small">
                                <Text style={{ whiteSpace: 'pre-wrap' }}>
                                    {record.message}
                                </Text>
                            </Card>
                        </div>
                    </>
                )}
            </Card>
        </Show>
    );
}
