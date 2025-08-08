import { Card, Switch, Select, Typography, Divider } from "antd";
import { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Title, Text } = Typography;

export const ThemeSettings = () => {
    const { mode, setMode } = useContext(ColorModeContext);

    return (
        <Card title="Paramètres du thème" style={{ maxWidth: 400 }}>
            <div style={{ marginBottom: 16 }}>
                <Text strong>Mode sombre</Text>
                <br />
                <Text type="secondary">Basculer entre le mode clair et sombre</Text>
                <br />
                <Switch
                    checked={mode === "dark"}
                    onChange={(checked) => setMode(checked ? "dark" : "light")}
                    style={{ marginTop: 8 }}
                />
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
                <Text strong>Couleur primaire</Text>
                <br />
                <Text type="secondary">Personnaliser la couleur principale</Text>
                <br />
                <Select
                    defaultValue="#1890ff"
                    style={{ width: "100%", marginTop: 8 }}
                    options={[
                        { value: "#1890ff", label: "Bleu (défaut)" },
                        { value: "#52c41a", label: "Vert" },
                        { value: "#fa8c16", label: "Orange" },
                        { value: "#eb2f96", label: "Rose" },
                        { value: "#722ed1", label: "Violet" },
                        { value: "#13c2c2", label: "Cyan" },
                    ]}
                />
            </div>

            <div>
                <Text strong>Taille de la sidebar</Text>
                <br />
                <Text type="secondary">Ajuster la largeur de la barre latérale</Text>
                <br />
                <Select
                    defaultValue="normal"
                    style={{ width: "100%", marginTop: 8 }}
                    options={[
                        { value: "compact", label: "Compacte" },
                        { value: "normal", label: "Normale" },
                        { value: "large", label: "Large" },
                    ]}
                />
            </div>
        </Card>
    );
};
