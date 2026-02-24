import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import type { OceanEvent } from '../types/simulation.types';

export function useSignalR(onEvent: (event: OceanEvent) => void) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL ?? ''}/hubs/simulation`)
      .withAutomaticReconnect()
      .build();

    connection.on('OceanEvent', (data: OceanEvent) => onEvent(data));

    connection.start().catch(err => console.error('SignalR connection error:', err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [onEvent]);

  return connectionRef;
}
