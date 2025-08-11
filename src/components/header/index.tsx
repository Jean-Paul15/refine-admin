import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text, Title } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    borderBottom: "1px solid #f0f0f0",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: "#1890ff",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}
        >
          Maison de Charlotte
        </Title>
        <Text
          type="secondary"
          style={{
            marginLeft: "16px",
            fontSize: "14px",
            fontStyle: "italic"
          }}
        >
          Administration
        </Text>
      </div>
      <Space>
        <Switch
          checkedChildren="Sombre"
          unCheckedChildren="Clair"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Space style={{ marginLeft: "16px" }} size="middle">
          {user?.name && <Text strong style={{ color: "#1890ff" }}>{user.name}</Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
