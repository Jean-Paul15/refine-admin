import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag } from "antd";

const { Title } = Typography;

export const ProfileShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>ID</Title>
            <TextField value={record?.id} />
            <Title level={5}>Email</Title>
            <TextField value={record?.email} />
            <Title level={5}>Prénom</Title>
            <TextField value={record?.first_name} />
            <Title level={5}>Nom</Title>
            <TextField value={record?.last_name} />
            <Title level={5}>Rôle</Title>
            <Tag color={record?.role === "admin" ? "red" : "blue"}>
                {record?.role}
            </Tag>
            <Title level={5}>Créé le</Title>
            <DateField value={record?.created_at} />
            <Title level={5}>Mis à jour le</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};
