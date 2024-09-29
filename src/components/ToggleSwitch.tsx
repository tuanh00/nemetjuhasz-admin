import React from "react";

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <div className="toggle">
      <label className="toggle-switch">
        <input type="checkbox" checked={isActive} onChange={onToggle} />
        <span className="slider" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
