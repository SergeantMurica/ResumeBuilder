// components/SectionList.tsx
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResumeSection } from "../../types";

interface SectionListProps {
  sections: ResumeSection[];
  removeSection: (id: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
}

const SectionList = ({
  sections,
  removeSection,
  reorderSections,
}: SectionListProps) => {
  return (
    <ul className="space-y-2">
      {sections.map((section, index) => (
        <DraggableItem
          key={section.id}
          id={section.id}
          title={section.title}
          index={index}
          removeSection={removeSection}
          reorderSections={reorderSections}
        />
      ))}
    </ul>
  );
};

interface DraggableItemProps {
  id: string;
  title: string;
  index: number;
  removeSection: (id: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
}

const DraggableItem = ({
  id,
  title,
  index,
  removeSection,
  reorderSections,
}: DraggableItemProps) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      reorderSections(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between p-2 rounded-md border ${
        isDragging
          ? "opacity-50 border-dashed border-gray-400"
          : "border-gray-200"
      }`}
      style={{ cursor: "move" }}>
      <span className="truncate">{title}</span>
      <button
        onClick={() => removeSection(id)}
        className="p-1 text-red-500 hover:text-red-700"
        title="Remove section">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
};

export default SectionList;
