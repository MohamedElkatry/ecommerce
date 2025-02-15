// eslint-disable-next-line
import React from 'react'
import MoonLoader from "react-spinners/MoonLoader";
import { useState } from 'react';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#1E3A8A",
};

export default function Loading() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#1E3A8A");

  return <>
    <div className="sweet-loading py-10">
      <MoonLoader
        color={color}
        cssOverride={override}
        size={200}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  </>
}
