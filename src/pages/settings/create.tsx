import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const SettingCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Clé"
                    name={["key"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="ex: phone, address, facebook_url" />
                </Form.Item>
                <Form.Item
                    label="Valeur"
                    name={["value"]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name={["description"]}
                >
                    <Input.TextArea rows={2} placeholder="Description optionnelle pour documenter ce paramètre" />
                </Form.Item>
            </Form>
        </Create>
    );
};
