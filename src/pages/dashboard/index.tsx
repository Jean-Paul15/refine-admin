import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Typography, Progress, Alert, Space, Button } from "antd";
import {
    UserOutlined,
    FileTextOutlined,
    MailOutlined,
    SettingOutlined,
    ThunderboltOutlined,
    HomeOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { supabaseClient } from "../../utility";

const { Title, Text, Paragraph } = Typography;

export const DashboardPage = () => {
    const [stats, setStats] = useState({
        profilesCount: 0,
        articlesCount: 0,
        publishedArticles: 0,
        subscribersCount: 0,
        actionsCount: 0,
        settingsCount: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Récupérer les statistiques depuis Supabase
                const [profiles, articles, published, subscribers, actions, settings] = await Promise.all([
                    supabaseClient.from("profiles").select("*", { count: "exact", head: true }),
                    supabaseClient.from("articles").select("*", { count: "exact", head: true }),
                    supabaseClient.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
                    supabaseClient.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("is_active", true),
                    supabaseClient.from("actions").select("*", { count: "exact", head: true }).eq("is_active", true),
                    supabaseClient.from("settings").select("*", { count: "exact", head: true }),
                ]);

                setStats({
                    profilesCount: profiles.count || 0,
                    articlesCount: articles.count || 0,
                    publishedArticles: published.count || 0,
                    subscribersCount: subscribers.count || 0,
                    actionsCount: actions.count || 0,
                    settingsCount: settings.count || 0,
                });
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* En-tête personnalisé pour la Maison de Charlotte */}
            <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "32px",
                color: "white"
            }}>
                <Row align="middle">
                    <Col span={18}>
                        <Title level={1} style={{ color: "white", margin: 0, marginBottom: "8px" }}>
                            Maison de Charlotte
                        </Title>
                        <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                            Interface d'administration - Gestion du contenu et des services
                        </Paragraph>
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <HomeOutlined style={{ fontSize: "64px", opacity: 0.7 }} />
                    </Col>
                </Row>
            </div>

            {/* Statistiques principales */}
            <Title level={2} style={{ marginBottom: "24px" }}>Vue d'ensemble</Title>

            <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable style={{ borderRadius: "12px", border: "1px solid #e8f4f8" }}>
                        <Statistic
                            title="Résidents et Familles"
                            value={stats.profilesCount}
                            prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
                            valueStyle={{ color: "#52c41a", fontSize: "28px" }}
                        />
                        <Text type="secondary">Profils enregistrés</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable style={{ borderRadius: "12px", border: "1px solid #fff7e6" }}>
                        <Statistic
                            title="Articles Publiés"
                            value={stats.publishedArticles}
                            prefix={<CheckCircleOutlined style={{ color: "#fa8c16" }} />}
                            valueStyle={{ color: "#fa8c16", fontSize: "28px" }}
                        />
                        <Text type="secondary">Contenu en ligne</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable style={{ borderRadius: "12px", border: "1px solid #f6ffed" }}>
                        <Statistic
                            title="Abonnés Newsletter"
                            value={stats.subscribersCount}
                            prefix={<MailOutlined style={{ color: "#722ed1" }} />}
                            valueStyle={{ color: "#722ed1", fontSize: "28px" }}
                        />
                        <Text type="secondary">Communication active</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable style={{ borderRadius: "12px", border: "1px solid #fff1f0" }}>
                        <Statistic
                            title="Activités en Cours"
                            value={stats.actionsCount}
                            prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
                            valueStyle={{ color: "#1890ff", fontSize: "28px" }}
                        />
                        <Text type="secondary">Événements planifiés</Text>
                    </Card>
                </Col>
            </Row>

            {/* Statistiques détaillées */}
            <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                <Col xs={24} lg={16}>
                    <Card title="Aperçu de l'activité" style={{ borderRadius: "12px" }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Total des articles"
                                    value={stats.articlesCount}
                                    prefix={<FileTextOutlined />}
                                    suffix={
                                        <Text type="secondary">
                                            ({Math.round((stats.publishedArticles / stats.articlesCount) * 100) || 0}% publiés)
                                        </Text>
                                    }
                                />
                                <Progress
                                    percent={Math.round((stats.publishedArticles / stats.articlesCount) * 100) || 0}
                                    strokeColor="#52c41a"
                                    style={{ marginTop: "8px" }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Configuration système"
                                    value={stats.settingsCount}
                                    prefix={<SettingOutlined />}
                                    suffix={<Text type="secondary">paramètres</Text>}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Actions rapides" style={{ borderRadius: "12px" }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                block
                                onClick={() => window.location.href = "/articles/create"}
                            >
                                Nouvel article
                            </Button>
                            <Button
                                icon={<CalendarOutlined />}
                                block
                                onClick={() => window.location.href = "/actions/create"}
                            >
                                Nouvelle activité
                            </Button>
                            <Button
                                icon={<MailOutlined />}
                                block
                                onClick={() => window.location.href = "/newsletter-subscribers"}
                            >
                                Gérer newsletter
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Section de gestion du contenu */}
            <Title level={3} style={{ marginBottom: "24px" }}>Gestion du contenu</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card
                        hoverable
                        style={{ borderRadius: "12px" }}
                        onClick={() => window.location.href = "/articles"}
                    >
                        <Card.Meta
                            avatar={<FileTextOutlined style={{ fontSize: "32px", color: "#1890ff" }} />}
                            title="Articles et Actualités"
                            description="Gérer le contenu éditorial, actualités et informations pour les résidents et familles"
                        />
                        <div style={{ marginTop: "16px", textAlign: "right" }}>
                            <Text type="secondary">{stats.articlesCount} articles • {stats.publishedArticles} publiés</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        hoverable
                        style={{ borderRadius: "12px" }}
                        onClick={() => window.location.href = "/actions"}
                    >
                        <Card.Meta
                            avatar={<ThunderboltOutlined style={{ fontSize: "32px", color: "#fa8c16" }} />}
                            title="Activités et Événements"
                            description="Planifier et organiser les activités, sorties et événements de la maison"
                        />
                        <div style={{ marginTop: "16px", textAlign: "right" }}>
                            <Text type="secondary">{stats.actionsCount} activités actives</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        hoverable
                        style={{ borderRadius: "12px" }}
                        onClick={() => window.location.href = "/profiles"}
                    >
                        <Card.Meta
                            avatar={<UserOutlined style={{ fontSize: "32px", color: "#52c41a" }} />}
                            title="Résidents et Familles"
                            description="Gérer les profils des résidents, contacts familiaux et informations personnelles"
                        />
                        <div style={{ marginTop: "16px", textAlign: "right" }}>
                            <Text type="secondary">{stats.profilesCount} profils enregistrés</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Message de bienvenue personnalisé */}
            <div style={{ marginTop: "32px" }}>
                <Alert
                    message="Bienvenue dans l'interface d'administration de la Maison de Charlotte"
                    description="Cette plateforme vous permet de gérer efficacement le contenu, les activités et la communication avec les résidents et leurs familles. Utilisez les outils ci-dessus pour maintenir un environnement chaleureux et bien organisé."
                    type="info"
                    showIcon
                    style={{ borderRadius: "12px" }}
                />
            </div>
        </div>
    );
};