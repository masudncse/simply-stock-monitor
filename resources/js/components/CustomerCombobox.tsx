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
import { useCustomerSearch } from '@/hooks/useCustomerSearch';

interface CustomerComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
}

/**
 * Shadcn-based searchable customer combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * - Displays customer name and code
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <CustomerCombobox
 *   value={customerId}
 *   onValueChange={setCustomerId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option)
 * <CustomerCombobox
 *   value={customerId}
 *   onValueChange={setCustomerId}
 *   placeholder="Select customer..."
 *   showAllOption={false}
 *   error={!!errors.customer_id}
 * />
 */
export function CustomerCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select customer...',
  className,
  disabled = false,
  showAllOption = true,
  error = false,
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const { customers, loading, searchTerm, setSearchTerm, fetchCustomers } = useCustomerSearch();

  // Load initial customers when dropdown opens
  useEffect(() => {
    if (open && customers.length === 0 && !searchTerm) {
      fetchCustomers('');
    }
  }, [open]);

  // Find selected customer for display
  const selectedCustomer = customers.find((cust) => cust.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && selectedCustomer) {
      return `${selectedCustomer.name} (${selectedCustomer.code})`;
    }
    if (showAllOption && !value) {
      return 'All Customers';
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
            placeholder="Search customers..." 
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
                <div className="py-6 text-center text-sm">No customer found.</div>
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
                  All Customers
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && customers.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading customers...</span>
                </CommandItem>
              ) : (
                customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.name} ${customer.code}`}
                    onSelect={() => {
                      onValueChange(customer.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{customer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Code: {customer.code}
                        {customer.email && ` | ${customer.email}`}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === customer.id.toString() ? "opacity-100" : "opacity-0"
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

