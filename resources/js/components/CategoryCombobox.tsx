import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategorySearch } from '@/hooks/useCategorySearch';

interface CategoryComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
}

/**
 * Shadcn-based searchable category combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <CategoryCombobox
 *   value={categoryId}
 *   onValueChange={setCategoryId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option)
 * <CategoryCombobox
 *   value={categoryId}
 *   onValueChange={setCategoryId}
 *   placeholder="Select category..."
 *   showAllOption={false}
 *   error={!!errors.category_id}
 * />
 */
export function CategoryCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select category...',
  className,
  disabled = false,
  showAllOption = true,
  error = false,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const { categories, loading, searchTerm, setSearchTerm, fetchCategories } = useCategorySearch();

  // Load initial categories when dropdown opens
  useEffect(() => {
    if (open && categories.length === 0 && !searchTerm) {
      fetchCategories('');
    }
  }, [open]);

  // Find selected category name for display
  const selectedCategory = categories.find((cat) => cat.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && selectedCategory) {
      return selectedCategory.name;
    }
    if (showAllOption && !value) {
      return 'All Categories';
    }
    return placeholder;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          {getDisplayValue()}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search categories..." 
            className="h-9 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : (
                <div className="py-6 text-center text-sm">No category found.</div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onValueChange("");
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  All Categories
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && categories.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading categories...</span>
                </CommandItem>
              ) : (
                categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onValueChange(category.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    {category.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === category.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

