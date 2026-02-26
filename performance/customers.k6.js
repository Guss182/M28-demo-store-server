import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "20s", target: 5 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ username: "admin", password: "admin" }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, { "login ok": (r) => r.status === 200 || r.status === 201 });

  const token = loginRes.json()?.accessToken;
  return { token };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
  };

  // lista clientes
  const listRes = http.get(`${BASE_URL}/api/customers`, { headers });
  check(listRes, { "GET /api/customers 200": (r) => r.status === 200 });

  const items = listRes.json();

  // detalhe do primeiro cliente (se vier array)
  if (Array.isArray(items) && items.length > 0 && items[0]?.id) {
    const oneRes = http.get(`${BASE_URL}/api/customers/${items[0].id}`, { headers });
    check(oneRes, { "GET /api/customers/:id 200": (r) => r.status === 200 });
  }

  sleep(1);
}