const DATALASTIC_API_KEY = import.meta.env.VITE_DATALASTIC_API_KEY;

if (!DATALASTIC_API_KEY) {
  console.error('DATALASTIC API KEY IS MISSING');
}

const url = `https://api.datalastic.com/api/v0/vessel_history` +
  `?api-key=${DATALASTIC_API_KEY}` +
  `&imo=${imo}` +
  `&from=${fromDate}` +
  `&to=${toDate}`;

const res = await fetch(url);

if (!res.ok) {
  throw new Error(`Datalastic API failed (${res.status})`);
}

const data = await res.json();
