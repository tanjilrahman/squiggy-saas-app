import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
        <h3 className="font-semibold text-gray-500 text-xl">
          User preferences...
        </h3>
        {/* <p>You will be redirected automatically.</p> */}
      </div>
    </div>
  );
}

export default loading;
