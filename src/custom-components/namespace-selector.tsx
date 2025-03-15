import Select, { StylesConfig, GroupBase, SingleValue } from "react-select";

interface NamespaceOption {
  value: string;
  label: string;
}

interface NamespaceSelectorProps {
  namespaces: NamespaceOption[];
  isLoading: boolean;
  onSelect: (value: string | null) => void;
}

const customStyles: StylesConfig<NamespaceOption, false, GroupBase<NamespaceOption>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#161b22", // GitHub dark background
    borderColor: state.isFocused ? "#58a6ff" : "#30363d", // Border GitHub-like
    color: "#c9d1d9",
    fontFamily: "Menlo, Consolas, monospace",
    fontSize: "14px",
    boxShadow: state.isFocused ? "0 0 5px rgba(88, 166, 255, 0.5)" : "none",
    "&:hover": { borderColor: "#58a6ff" },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#161b22",
    border: "1px solid #30363d",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#238636" : state.isFocused ? "#1f6feb" : "#161b22",
    color: state.isSelected ? "#ffffff" : "#c9d1d9",
    fontFamily: "Menlo, Consolas, monospace",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": { backgroundColor: "#1f6feb" },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#c9d1d9",
    fontFamily: "Menlo, Consolas, monospace",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#8b949e",
    fontFamily: "Menlo, Consolas, monospace",
  }),
};

export default function NamespaceSelector({ namespaces, isLoading, onSelect }: NamespaceSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-gray-400 text-sm mb-2 font-mono">Select a Namespace</label>
      <Select
        options={namespaces}
        isSearchable
        styles={customStyles}
        placeholder="Search namespace..."
        isLoading={isLoading}
        onChange={(e) => onSelect((e as SingleValue<NamespaceOption>)?.value || null)}
      />
    </div>
  );
}
