import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const SettingShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>ID</Title>
            <TextField value={record?.id} />
            <Title level={5}>Clé</Title>
            <TextField value={record?.key} />
            <Title level={5}>Valeur</Title>
            <TextField value={record?.value} />
            <Title level={5}>Description</Title>
            <TextField value={record?.description} />
            <Title level={5}>Mis à jour le</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};
