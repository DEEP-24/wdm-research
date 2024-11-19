export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "investor" | "organizer";
  password: string;
  researchInterests: string;
  expertise: string;
  phoneNo: string;
  address: string;
  dob: string;
  linkedInURL?: string;
  twitterURL?: string;
  githubURL?: string;
  papers?: string[];
}
