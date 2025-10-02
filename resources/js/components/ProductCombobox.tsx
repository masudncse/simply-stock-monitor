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
import { useProductSearch } from '@/hooks/useProductSearch';

interface ProductComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  error?: boolean;
  selectedProduct?: { id: number; name: string; sku: string } | null;
}

/**
 * Shadcn-based searchable product combobox with server-side search
 * 
 * Built following shadcn/ui combobox pattern with:
 * - Popover for dropdown positioning
 * - Command for searchable list
 * - Server-side API search with debouncing
 * - Loading states and error handling
 * - Displays product name and SKU
 * 
 * @example
 * // Basic usage (with "All" option for filters)
 * <ProductCombobox
 *   value={productId}
 *   onValueChange={setProductId}
 *   showAllOption={true}
 * />
 * 
 * @example
 * // Required field (no "All" option)
 * <ProductCombobox
 *   value={productId}
 *   onValueChange={setProductId}
 *   placeholder="Select product..."
 *   showAllOption={false}
 *   error={!!errors.product_id}
 * />
 */
export function ProductCombobox({
  value = '',
  onValueChange,
  placeholder = 'Select product...',
  className,
  disabled = false,
  showAllOption = true,
  error = false,
  selectedProduct: selectedProductProp,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const { products, loading, searchTerm, setSearchTerm, fetchProducts } = useProductSearch();

  // Load initial products when dropdown opens
  useEffect(() => {
    if (open && products.length === 0 && !searchTerm) {
      fetchProducts('');
    }
  }, [open]);

  // Use the selected product from props, or find it in the current products list
  const displayProduct = selectedProductProp || products.find((prod) => prod.id.toString() === value);
  
  const getDisplayValue = () => {
    if (value && displayProduct) {
      return `${displayProduct.name} (${displayProduct.sku})`;
    }
    if (showAllOption && !value) {
      return 'All Products';
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
            placeholder="Search products..." 
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
                <div className="py-6 text-center text-sm">No product found.</div>
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
                  All Products
                  <Check
                    className={cn(
                      "ml-auto",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {loading && products.length === 0 ? (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading products...</span>
                </CommandItem>
              ) : (
                products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.sku}`}
                    onSelect={() => {
                      onValueChange(product.id.toString());
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SKU: {product.sku} | {product.unit} | ${product.price}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === product.id.toString() ? "opacity-100" : "opacity-0"
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

