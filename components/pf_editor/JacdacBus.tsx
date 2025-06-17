import React, { useRef, useState } from "react";
import {
  useBus,
  useChange,
  useDevices,
  useRegister,
  useRegisterValue,
  useServices,
} from "react-jacdac";
export default function JacdacBus({ ...props }) {
  // fetch the bus from the jacdac context
  const bus = useBus();
  // fetch the connect state, useChange will trigger a re-render when connected changes
  const connected = useChange(bus, (_) => _.connected);
  // get devices
  const devices = useDevices({ ignoreInfrastructure: true });

  // console.log('devices: ', devices)

  return (
    <>
      {connected ? (
        <>
          <h4>Device Descriptions</h4>
          <ul>
            {devices.map((device) => (
              <li key={device.id}>{device.describe()}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Jacdac not connected </p>
      )}
    </>
  );
}
