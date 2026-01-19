import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICON_MAP, ICON_LIST, getIconDisplayName } from "@/lib/icons";
import { X } from "lucide-react";

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (iconName: string) => void;
}

export const IconPicker = ({ selectedIcon, onIconSelect }: IconPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    return ICON_LIST.filter((icon) =>
      getIconDisplayName(icon)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const selectedIconComponent = selectedIcon ? ICON_MAP[selectedIcon] : null;
  const SelectedIcon = selectedIconComponent;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div
          className="flex-1 border border-input rounded-md px-3 py-2 cursor-pointer bg-background hover:bg-muted transition-colors flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="w-5 h-5 text-secondary" />
              <span className="text-sm">
                {getIconDisplayName(selectedIcon)}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Select an icon...
            </span>
          )}
        </div>
        {selectedIcon && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onIconSelect("");
              setIsOpen(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="border border-input rounded-md bg-background p-3 space-y-2">
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <ScrollArea className="h-64 pr-4">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = ICON_MAP[iconName];
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onIconSelect(iconName);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-secondary/20 border border-secondary"
                        : "hover:bg-muted border border-transparent"
                    }`}
                    title={getIconDisplayName(iconName)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs text-center line-clamp-2">
                      {getIconDisplayName(iconName)}
                    </span>
                  </button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">No icons found</p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
