import { useApiUrl, useCustom } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
    UserOutlined,
    FileTextOutlined,
    MailOutlined,
    SettingOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { ThemeSettings, NotificationDemo } from "../../components";

const { Title } = Typography;

export const DashboardPage = () => {
    const apiUrl = useApiUrl();

    // Récupérer les statistiques depuis Supabase
    const { data: profilesCount } = useCustom({
        url: `${apiUrl}/profiles`,
        method: "get",
        config: {
            query: {
                select: "count",
            },
        },
    });

    const { data: articlesCount } = useCustom({
        url: `${apiUrl}/articles`,
        method: "get",
        config: {
            query: {
                select: "count",
            },
        },
    });

    const { data: subscribersCount } = useCustom({
        url: `${apiUrl}/newsletter_subscribers`,
        method: "get",
        config: {
            query: {
                select: "count",
                is_active: "eq.true",
            },
        },
    });

    const { data: actionsCount } = useCustom({
        url: `${apiUrl}/actions`,
        method: "get",
        config: {
            query: {
                select: "count",
                is_active: "eq.true",
            },
        },
    });

    const { data: publishedArticles } = useCustom({
        url: `${apiUrl}/articles`,
        method: "get",
        config: {
            query: {
                select: "count",
                is_published: "eq.true",
            },
        },
    });

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>Tableau de bord</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Utilisateurs"
                            value={profilesCount?.data?.[0]?.count || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Articles"
                            value={articlesCount?.data?.[0]?.count || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Articles publiés"
                            value={publishedArticles?.data?.[0]?.count || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Abonnés newsletter"
                            value={subscribersCount?.data?.[0]?.count || 0}
                            prefix={<MailOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Actions actives"
                            value={actionsCount?.data?.[0]?.count || 0}
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: "#fa8c16" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Paramètres configurés"
                            value="8"
                            prefix={<SettingOutlined />}
                            valueStyle={{ color: "#13c2c2" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Section des actions rapides */}
            <div style={{ marginTop: "32px" }}>
                <Title level={3}>Actions rapides</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            onClick={() => window.location.href = "/articles/create"}
                            style={{ cursor: "pointer" }}
                        >
                            <Card.Meta
                                avatar={<FileTextOutlined style={{ fontSize: "24px" }} />}
                                title="Créer un article"
                                description="Rédiger un nouvel article de blog"
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            onClick={() => window.location.href = "/actions/create"}
                            style={{ cursor: "pointer" }}
                        >
                            <Card.Meta
                                avatar={<ThunderboltOutlined style={{ fontSize: "24px" }} />}
                                title="Créer une action"
                                description="Ajouter une nouvelle action/événement"
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            onClick={() => window.location.href = "/newsletter-subscribers"}
                            style={{ cursor: "pointer" }}
                        >
                            <Card.Meta
                                avatar={<MailOutlined style={{ fontSize: "24px" }} />}
                                title="Gérer la newsletter"
                                description="Voir les abonnés et envoyer des emails"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Section des outils et paramètres */}
            <div style={{ marginTop: "32px" }}>
                <Title level={3}>Outils et paramètres</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <ThemeSettings />
                    </Col>
                    <Col xs={24} md={12}>
                        <NotificationDemo />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
