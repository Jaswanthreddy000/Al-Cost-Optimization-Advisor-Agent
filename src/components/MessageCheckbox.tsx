
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface MessageCheckboxProps {
  messageId: string;
  isSelected: boolean;
  onToggle: (messageId: string) => void;
  showCheckboxes: boolean;
}

const MessageCheckbox: React.FC<MessageCheckboxProps> = ({
  messageId,
  isSelected,
  onToggle,
  showCheckboxes
}) => {
  if (!showCheckboxes || messageId.startsWith('welcome-')) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-10">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(messageId)}
        className="bg-white border-2 border-gray-300 shadow-sm"
      />
    </div>
  );
};

export default MessageCheckbox;
