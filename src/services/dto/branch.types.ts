export interface Office {
  id: string;
  type: "office" | "warehouse";
  city: string;
  address: string;
}

export interface Branch {
  id: string;
  iso: string;
  country: string;
  subtitle: string;
  status: "ACTIVE" | "PLANNED";
  offices: Office[];
}
