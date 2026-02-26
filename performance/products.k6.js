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
    http_req_failed: ["rate<0.01"],     // < 1% erros
    http_req_duration: ["p(95)<1000"],  // p95 < 1s
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

  // lista produtos
  const listRes = http.get(`${BASE_URL}/api/products`, { headers });
  check(listRes, { "GET /api/products 200": (r) => r.status === 200 });

  const items = listRes.json();

  // detalhe do primeiro produto (se vier array)
  if (Array.isArray(items) && items.length > 0 && items[0]?.id) {
    const oneRes = http.get(`${BASE_URL}/api/products/${items[0].id}`, { headers });
    check(oneRes, { "GET /api/products/:id 200": (r) => r.status === 200 });
  }

  sleep(1);
}