import { Collapse, Switch, Tag } from "antd";
import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";

const PermissionCollapse = ({
  permissions = [],
  permissionOfRole = [],
  setSelectedPermissions,
}) => {
  const initialPermissions = permissionOfRole.map((p) => p.permissionId);
  const [rolePermissions, setRolePermissions] = useState(initialPermissions);

  useEffect(() => {
    setSelectedPermissions(rolePermissions);
  }, [rolePermissions, setSelectedPermissions]);

  const existingPermissions = useMemo(
    () => new Set(rolePermissions),
    [rolePermissions]
  );

  const modules = useMemo(
    () => [...new Set(permissions.map((p) => p.module))],
    [permissions]
  );

  const permissionByModule = useMemo(
    () =>
      permissions.reduce((acc, permission) => {
        acc[permission.module] = acc[permission.module] || [];
        acc[permission.module].push(permission);
        return acc;
      }, {}),
    [permissions]
  );

  const getColorByMethod = (method) => {
    switch (method) {
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "GET":
        return "blue";
      case "DELETE":
        return "red";
      default:
        return "gray";
    }
  };

  const handleSwitchChange = (checked, permissionId) => {
    setRolePermissions((prev) => {
      if (checked) {
        if (!prev.includes(permissionId)) {
          return [...prev, permissionId];
        }
        return prev;
      } else {
        return prev.filter((id) => id !== permissionId);
      }
    });
  };

  const items = modules.map((module) => ({
    key: module,
    label: module,
    children: permissionByModule[module].map((child) => (
      <div key={child.permissionId} className="mb-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <p>{child.permissionName}</p>
            <Tag color={getColorByMethod(child.method)}>{child.method}</Tag>
          </div>
          <Switch
            checked={existingPermissions.has(child.permissionId)}
            onChange={(checked) =>
              handleSwitchChange(checked, child.permissionId)
            }
          />
        </div>
        <div className="text-xs text-primary">{child.apiPath}</div>
      </div>
    )),
  }));

  return <Collapse items={items} />;
};

PermissionCollapse.propTypes = {
  permissions: PropTypes.array.isRequired,
  permissionOfRole: PropTypes.array.isRequired,
  setSelectedPermissions: PropTypes.func,
};

export default PermissionCollapse;
