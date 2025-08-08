import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";

export const NewsletterSubscriberCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Email"
                    name={["email"]}
                    rules={[
                        {
                            required: true,
                            type: "email",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Actif"
                    name={["is_active"]}
                    valuePropName="checked"
                >
                    <Switch defaultChecked />
                </Form.Item>
            </Form>
        </Create>
    );
};
