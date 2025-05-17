import { Request } from 'express';

const DESTINATION_HEADERS = {
  host: 'X-Forwarded-Host',
  uri: 'X-Forwarded-Uri',
  method: 'X-Forwarded-Method',
};

export function parseDestination(req: Request) {
  return Object.entries(DESTINATION_HEADERS)
    .map(([key, headerName]): [string, URL | undefined] => {
      const headerValue = req.header(headerName);
      return [key, headerValue ? new URL(headerValue) : undefined];
    })
    .reduce<{ [key in keyof typeof DESTINATION_HEADERS]: URL | undefined }>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {
        host: undefined,
        uri: undefined,
        method: undefined,
      }
    );
}
