import { AddEntryForm, EntryFormValues } from "./AddEntryForm";

interface Props {
  showForm: boolean;

  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntry = ({ showForm, onClose, onSubmit }: Props) => {
  if (!showForm) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "10px",
        border: "2px dotted black",
        padding: "10px",
      }}
    >
      <AddEntryForm onCancel={onClose} onSubmit={onSubmit} />
    </div>
  );
};

export default AddEntry;
