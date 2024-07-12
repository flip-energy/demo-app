import { Input } from "@/components/ui/input";
import { usePlacesWidget } from "react-google-autocomplete";

export type PlaceField =
  | "administrative_area_level_1"
  | "country"
  | "locality"
  | "postal_code"
  | "route"
  | "street_number";

export type PlaceFields = Record<PlaceField, string>;

export type PlaceComponent = {
  long_name: string;
  short_name: string;
  types: PlaceField[];
};

export type PlaceResult = {
  address_components: PlaceComponent[];
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
};

type AutocompleteProps = {
  onPlaceSelected: (place: PlaceResult) => void;
};

const Autocomplete = ({ onPlaceSelected }: AutocompleteProps) => {
  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
    onPlaceSelected,
    options: {
      types: ["address"],
      fields: ["address_components", "geometry"],
    },
  });

  return (
    <Input
      type="text"
      name="address"
      placeholder="Start typing your address..."
      ref={ref}
      autoComplete="off"
    />
  );
};

export default Autocomplete;
