export interface Pet {
  id?: string;
  img_urls: string[];
  name: string;
  age: number;
  age_type: string;
  type: string;
  status: boolean;
  title: string; 
  content: string; 
}
export interface AdoptablePet {
  id?: string; 
  petId: string; 
  img_urls: string[]; 
  title: string; 
  content: string; 
}

