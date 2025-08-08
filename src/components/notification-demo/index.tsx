import { useNotification } from "@refinedev/core";
import { Button, Card, Space } from "antd";
import {
    CheckCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

export const NotificationDemo = () => {
    const { open } = useNotification();

    const showSuccessNotification = () => {
        open?.({
            type: "success",
            message: "Succès !",
            description: "L'opération a été effectuée avec succès.",
        });
    };

    const showInfoNotification = () => {
        open?.({
            type: "success",
            message: "Information",
            description: "Voici une information importante.",
        });
    };

    const showWarningNotification = () => {
        open?.({
            type: "error",
            message: "Attention",
            description: "Cette action nécessite votre attention.",
        });
    };

    const showErrorNotification = () => {
        open?.({
            type: "error",
            message: "Erreur",
            description: "Une erreur s'est produite lors de l'opération.",
        });
    };

    return (
        <Card title="Système de notifications">
            <Space>
                <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={showSuccessNotification}
                >
                    Succès
                </Button>
                <Button
                    icon={<InfoCircleOutlined />}
                    onClick={showInfoNotification}
                >
                    Info
                </Button>
                <Button
                    icon={<WarningOutlined />}
                    onClick={showWarningNotification}
                >
                    Attention
                </Button>
                <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={showErrorNotification}
                >
                    Erreur
                </Button>
            </Space>
        </Card>
    );
};
