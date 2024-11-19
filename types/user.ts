export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "INVESTOR" | "USER";
  researchInterests: string;
  expertise: string;
  phone: string;
  city: string;
  state: string;
  linkedInURL?: string;
  twitterURL?: string;
  githubURL?: string;
  papers?: string;
};
