import { BooleanField, DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const NewsletterSubscriberShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>ID</Title>
            <TextField value={record?.id} />
            <Title level={5}>Email</Title>
            <TextField value={record?.email} />
            <Title level={5}>Actif</Title>
            <BooleanField value={record?.is_active} />
            <Title level={5}>Inscrit le</Title>
            <DateField value={record?.subscribed_at} />
        </Show>
    );
};
