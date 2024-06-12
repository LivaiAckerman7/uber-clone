'use client'
import GoogleMapSection from "../../../../components/Home/GoogleMapSection";
import DriverInterface from "./DriverInterface";
import { DestinationContext } from "../../../../context/DestinationContext";
import { SourceContext } from "../../../../context/SourceContext";
import { LoadScript } from "@react-google-maps/api";
import { useState } from "react";
import Header from "../../../../components/Header";

export default function DriverHome() {
  const [source, setSource] = useState({ lat: null, lng: null, label: '' });
  const [destination, setDestination] = useState({ lat: null, lng: null, label: '' });

  return (
    <>
      <Header />
      <SourceContext.Provider value={{ source, setSource }}>
        <DestinationContext.Provider value={{ destination, setDestination }}>
          <LoadScript
            libraries={['places']}
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <DriverInterface />
              </div>
              <div className="col-span-2">
                <GoogleMapSection />
              </div>
            </div>
          </LoadScript>
          
        </DestinationContext.Provider>
      </SourceContext.Provider>
    </>
  );
}
