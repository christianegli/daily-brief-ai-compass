
import { useState } from "react";
import { Check, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategorySelectorProps {
  onChange: (categories: string[]) => void;
}

const CategorySelector = ({ onChange }: CategorySelectorProps) => {
  const [categories] = useState<Category[]>([
    { id: "urgent", name: "Urgent", color: "text-red-500" },
    { id: "work", name: "Work", color: "text-blue-500" },
    { id: "personal", name: "Personal", color: "text-green-500" },
    { id: "follow-up", name: "Follow Up", color: "text-purple-500" },
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleValueChange = (value: string[]) => {
    setSelectedCategories(value);
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <List className="h-4 w-4" />
        <h3 className="text-sm font-medium">Filter by Category</h3>
      </div>
      <ToggleGroup type="multiple" variant="outline" onValueChange={handleValueChange}>
        {categories.map((category) => (
          <ToggleGroupItem 
            key={category.id} 
            value={category.id} 
            aria-label={`Toggle ${category.name}`}
            className="gap-1.5"
          >
            <span className={category.color}>•</span>
            <span>{category.name}</span>
            {selectedCategories.includes(category.id) && <Check className="h-3.5 w-3.5 ml-1" />}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default CategorySelector;
