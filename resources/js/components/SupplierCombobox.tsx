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
import { useSupplierSearch } from '@/hooks/useSupplierSearch';

interface SupplierComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
}

/**
 * Shadcn-based searchable supplier combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * - Displays supplier name and code
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <SupplierCombobox
 *   value={supplierId}
 *   onValueChange={setSupplierId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option)
 * <SupplierCombobox
 *   value={supplierId}
 *   onValueChange={setSupplierId}
 *   placeholder="Select supplier..."
 *   showAllOption={false}
 *   error={!!errors.supplier_id}
 * />
 */
export function SupplierCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select supplier...',
  className,
  disabled = false,
  showAllOption = true,
  error = false,
}: SupplierComboboxProps) {
  const [open, setOpen] = useState(false);
  const { suppliers, loading, searchTerm, setSearchTerm, fetchSuppliers } = useSupplierSearch();

  // Load initial suppliers when dropdown opens
  useEffect(() => {
    if (open && suppliers.length === 0 && !searchTerm) {
      fetchSuppliers('');
    }
  }, [open]);

  // Find selected supplier for display
  const selectedSupplier = suppliers.find((sup) => sup.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && selectedSupplier) {
      return `${selectedSupplier.name} (${selectedSupplier.code})`;
    }
    if (showAllOption && !value) {
      return 'All Suppliers';
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
            placeholder="Search suppliers..." 
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
                <div className="py-6 text-center text-sm">No supplier found.</div>
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
                  All Suppliers
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && suppliers.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading suppliers...</span>
                </CommandItem>
              ) : (
                suppliers.map((supplier) => (
                  <CommandItem
                    key={supplier.id}
                    value={`${supplier.name} ${supplier.code}`}
                    onSelect={() => {
                      onValueChange(supplier.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{supplier.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Code: {supplier.code}
                        {supplier.email && ` | ${supplier.email}`}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === supplier.id.toString() ? "opacity-100" : "opacity-0"
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

