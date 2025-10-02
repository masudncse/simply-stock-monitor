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
import { useAccountSearch } from '@/hooks/useAccountSearch';

interface AccountComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
  filterByType?: string; // Optional filter by account type (asset, liability, etc.)
}

/**
 * Shadcn-based searchable account combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * - Displays account name and code
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <AccountCombobox
 *   value={accountId}
 *   onValueChange={setAccountId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option)
 * <AccountCombobox
 *   value={accountId}
 *   onValueChange={setAccountId}
 *   placeholder="Select account..."
 *   showAllOption={false}
 *   error={!!errors.account_id}
 * />
 * 
 * @example
 * // Filter by account type
 * <AccountCombobox
 *   value={accountId}
 *   onValueChange={setAccountId}
 *   filterByType="asset"
 *   showAllOption={false}
 * />
 */
export function AccountCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select account...',
  className,
  disabled = false,
  showAllOption = true,
  error = false,
  filterByType,
}: AccountComboboxProps) {
  const [open, setOpen] = useState(false);
  const { accounts, loading, searchTerm, setSearchTerm, fetchAccounts } = useAccountSearch();

  // Load initial accounts when dropdown opens
  useEffect(() => {
    if (open && accounts.length === 0 && !searchTerm) {
      fetchAccounts('');
    }
  }, [open]);

  // Filter accounts by type if specified
  const filteredAccounts = filterByType 
    ? accounts.filter(acc => acc.type === filterByType)
    : accounts;

  // Find selected account for display
  const selectedAccount = accounts.find((acc) => acc.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && selectedAccount) {
      return `${selectedAccount.name} (${selectedAccount.code})`;
    }
    if (showAllOption && !value) {
      return 'All Accounts';
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
            placeholder="Search accounts..." 
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
                <div className="py-6 text-center text-sm">No account found.</div>
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
                  All Accounts
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && filteredAccounts.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading accounts...</span>
                </CommandItem>
              ) : (
                filteredAccounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    value={`${account.name} ${account.code}`}
                    onSelect={() => {
                      onValueChange(account.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Code: {account.code}
                        {account.type && ` | ${account.type.charAt(0).toUpperCase() + account.type.slice(1)}`}
                        {account.sub_type && ` - ${account.sub_type.replace('_', ' ')}`}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === account.id.toString() ? "opacity-100" : "opacity-0"
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

