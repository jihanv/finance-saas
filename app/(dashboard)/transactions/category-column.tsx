import { useOpenCategory } from "@/stores/useOpenCategory";

type Props = {
  category: string;
  categoryId: string | null;
};

export const CategoryColumn = ({ category, categoryId }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory();

  const onClick = () => {
    onOpenCategory(categoryId!);
  };
  return (
    <>
      <div
        onClick={onClick}
        className="flex  items-center cursor-pointer hover:underline"
      >
        {category}
      </div>
    </>
  );
};
