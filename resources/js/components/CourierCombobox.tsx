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
import { Check, ChevronsUpDown, Loader2, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourierSearch } from '@/hooks/useCourierSearch';

interface CourierComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
  showRates?: boolean;
}

/**
 * Shadcn-based searchable courier combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * - Displays courier name, code, and optional pricing
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <CourierCombobox
 *   value={courierId}
 *   onValueChange={setCourierId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option, show rates)
 * <CourierCombobox
 *   value={courierId}
 *   onValueChange={setCourierId}
 *   placeholder="Select courier..."
 *   showAllOption={false}
 *   showRates={true}
 *   error={!!errors.courier_id}
 * />
 */
export function CourierCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select courier...',
  className,
  disabled = false,
  showAllOption = false,
  error = false,
  showRates = false,
}: CourierComboboxProps) {
  const [open, setOpen] = useState(false);
  const { couriers, loading, searchTerm, setSearchTerm, fetchCouriers } = useCourierSearch();

  // Load initial couriers when dropdown opens
  useEffect(() => {
    if (open && couriers.length === 0 && !searchTerm) {
      fetchCouriers('');
    }
  }, [open]);

  // Find selected courier for display
  const selectedCourier = couriers.find((courier) => courier.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && selectedCourier) {
      return selectedCourier.code 
        ? `${selectedCourier.name} (${selectedCourier.code})`
        : selectedCourier.name;
    }
    if (showAllOption && !value) {
      return 'All Couriers';
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
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {getDisplayValue()}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search couriers..." 
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
                <div className="py-6 text-center text-sm">No courier found.</div>
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
                  All Couriers
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && couriers.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading couriers...</span>
                </CommandItem>
              ) : (
                couriers.map((courier) => (
                  <CommandItem
                    key={courier.id}
                    value={`${courier.name} ${courier.code || ''}`}
                    onSelect={() => {
                      onValueChange(courier.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <span>{courier.name}</span>
                        {courier.code && (
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                            {courier.code}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {showRates && (
                          <>Base: ৳{courier.base_rate.toFixed(2)} + ৳{courier.per_kg_rate.toFixed(2)}/kg</>
                        )}
                        {!showRates && courier.phone && `Phone: ${courier.phone}`}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === courier.id.toString() ? "opacity-100" : "opacity-0"
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

