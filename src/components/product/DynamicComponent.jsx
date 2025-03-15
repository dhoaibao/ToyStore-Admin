import { InputNumber, Select, AutoComplete, Input } from "antd";
import propTypes from "prop-types";

const COMPONENT_MAP = {
  INPUT_NUMBER: InputNumber,
  SELECT: Select,
  AUTOCOMPLETE: AutoComplete,
  INPUT: Input,
};

const DynamicComponent = ({ type, options, ...restProps }) => {
  const Component = COMPONENT_MAP[type];
  if (!Component) return null;

  return (
    <Component
      {...restProps}
      options={
        type === "SELECT" || type === "AUTOCOMPLETE" ? options : undefined
      }
      min={type === "INPUT_NUMBER" ? 0 : undefined}
    />
  );
};

DynamicComponent.propTypes = {
  type: propTypes.string.isRequired,
  options: propTypes.array,
};

export default DynamicComponent;
