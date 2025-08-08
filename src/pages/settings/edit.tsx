import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const SettingEdit = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Edit saveButtonProps={saveButtonProps}>
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
                    <Input />
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
                    <Input.TextArea rows={2} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
