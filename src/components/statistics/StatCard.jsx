import PropTypes from "prop-types";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="rounded-xl p-4 bg-secondary text-white shadow-md">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-2">
          <p className="text-gray-100 text-sm">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
};

export default StatCard;