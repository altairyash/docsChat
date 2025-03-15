import Select from "react-select";

interface NamespaceSelectorProps {
  namespaces: { value: string; label: string }[];
  isLoading: boolean;
  onSelect: (value: string | null) => void;
}

export default function NamespaceSelector({ namespaces, isLoading, onSelect }: NamespaceSelectorProps) {
  return (
    <div>
      <label className="block text-gray-400 text-sm mb-2">Select a Namespace</label>
      <Select
        options={namespaces}
        isSearchable
        className="text-black"
        placeholder="Search namespace..."
        isLoading={isLoading}
        onChange={(e) => onSelect(e?.value || null)}
      />
    </div>
  );
}
