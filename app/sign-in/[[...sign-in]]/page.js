import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
  <>
  
  <div>
  <Image src='/uber-banner.jpeg' width={900} height={1000}
   className="object-contain h-full w-full"/>
 <div className="absolute top-24 right-20" >
 <SignIn path="/sign-in" />
 </div>
  
  </div>
  
  </>
  );
}