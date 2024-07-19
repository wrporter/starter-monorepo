test('health check returns ok status', async () => {
    const response = await fetch('http://localhost:3000/health');
    const body = await response.text();

    expect(response.status).toEqual(200);
    expect(body).toEqual('ok');
});
