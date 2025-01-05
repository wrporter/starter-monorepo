test('health check returns ok status', async () => {
  const response = await fetch(
    // NOTE: BASE_URL is a reserved environment variable by Vite.
    `${process.env.BASE_TEST_URL ?? 'http://localhost:3000'}/contact-service/healthcheck`,
  );
  const body = await response.text();

  expect(response.status).toEqual(200);
  expect(body).toEqual('ok');
});
