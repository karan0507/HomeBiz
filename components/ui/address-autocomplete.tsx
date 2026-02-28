"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { getCachedProvinces } from "@/lib/services/data.service";
import type { Province } from "@/types/database";

export interface Address {
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  place_id?: string;
}

interface AddressAutocompleteProps {
  value: Address;
  onChange: (address: Address) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  disabled = false,
  required = true,
}: AddressAutocompleteProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const hasFetched = useRef(false);

  // Fetch provinces on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    getCachedProvinces()
      .then(setProvinces)
      .catch(() => setProvinces([]))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // TODO: Re-enable Google Places Autocomplete later
  // Temporarily using manual input for flow completion

  const handleChange = (field: keyof Address, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="address_line1" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Street Address {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <Input
          id="address_line1"
          type="text"
          placeholder="123 Main Street"
          value={value.address_line1}
          onChange={(e) => handleChange("address_line1", e.target.value)}
          disabled={disabled}
          required={required}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line2">Unit / Apartment (Optional)</Label>
        <Input
          id="address_line2"
          type="text"
          placeholder="Unit 123, Apt 4B"
          value={value.address_line2}
          onChange={(e) => handleChange("address_line2", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city">City {required && "*"}</Label>
          <Input
            id="city"
            type="text"
            placeholder="Toronto"
            value={value.city}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={disabled}
            required={required}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Province {required && "*"}</Label>
          <select
            id="province"
            value={value.province}
            onChange={(e) => handleChange("province", e.target.value)}
            disabled={disabled || loadingProvinces}
            required={required}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Province</option>
            {provinces.map((p, idx) => {
              const code = String(p.code || "");
              const name = String(p.name || code || "Unknown");
              return (
                <option key={`${code}-${idx}`} value={code}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code {required && "*"}</Label>
          <Input
            id="postal_code"
            type="text"
            placeholder="M1A 1A1"
            value={value.postal_code}
            onChange={(e) => handleChange("postal_code", e.target.value)}
            disabled={disabled}
            required={required}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            value={value.country}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
