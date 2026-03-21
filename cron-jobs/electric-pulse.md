```bash
curl --location '{YOUR_ELECTRIC_URL}/v1/shape?secret={YOUR_ElECTRIC_SECRET}&table={YOUR_ELECTRIC_DUMMY_TABLE}&offset=-1' \
    --max-time 90
```

- YOUR_ELECTRIC_URL: The URL of your Electric server (In our case, we host this on Render)
- YOUR_ELECTRIC_SECRET: The secret key for authentication (Any secret you used to deploy your Electric server)
- YOUR_ELECTRIC_DUMMY_TABLE: The name of the dummy table you created in your PostgreSQL database for safe pulsing (In
  our case, we name it "replication_pulse")
